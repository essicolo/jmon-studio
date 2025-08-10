/**
 * JmonTone (Tone Object Notation Extended) - Core Library
 * 
 * A TypeScript library for parsing, validating, and manipulating
 * musical compositions in the JMON specification.
 * 
 * Originally designed for Tone.js but extensible to other audio frameworks.
 */

import { 
    JmonComposition, 
    JmonNote, 
    JmonTrack, 
    JmonValidationResult, 
    JmonValidationError,
    ToneInstrument,
    ToneEffect 
} from '../types/jmon';

export class JmonTone {
    static readonly VERSION = "1.0";
    static readonly FORMAT_IDENTIFIER = "jmonTone";

    /**
     * Convert MIDI note number to note name (e.g., 60 -> "C4")
     */
    static midiNoteToNoteName(midiNote: number): string {
        if (typeof midiNote !== 'number' || midiNote < 0 || midiNote > 127) {
            console.warn(`Invalid MIDI note number: ${midiNote}. Must be 0-127.`);
            return 'C4'; // Default fallback
        }
        
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midiNote / 12) - 1;
        const noteIndex = midiNote % 12;
        
        return noteNames[noteIndex] + octave;
    }

    /**
     * Convert note name to MIDI note number (e.g., "C4" -> 60)
     */
    static noteNameToMidiNote(noteName: string): number {
        try {
            const noteRegex = /^([A-Ga-g])([#b]?)(-?\d+)$/;
            const match = noteName.match(noteRegex);
            
            if (!match) {
                console.warn(`Invalid note name: ${noteName}`);
                return 60; // Default to middle C
            }
            
            const [, noteLetter, accidental, octaveStr] = match;
            const octave = parseInt(octaveStr, 10);
            
            const noteMap: { [key: string]: number } = {
                'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
            };
            
            let noteValue = noteMap[noteLetter.toUpperCase()];
            
            if (accidental === '#') {
                noteValue += 1;
            } else if (accidental === 'b') {
                noteValue -= 1;
            }
            
            return Math.max(0, Math.min(127, (octave + 1) * 12 + noteValue));
        } catch (error) {
            console.error(`Error converting note name ${noteName}:`, error);
            return 60; // Default to middle C
        }
    }

    /**
     * Process note input (can be string, number, or array)
     */
    static processNoteInput(note: string | number | (string | number)[]): string | string[] {
        if (Array.isArray(note)) {
            return note.map(n => this.processNoteInput(n) as string);
        } else if (typeof note === 'number') {
            return this.midiNoteToNoteName(note);
        } else {
            return note;
        }
    }

    /**
     * Parse time string to seconds
     */
    static parseTimeString(timeString: string | number, bpm: number = 120): number {
        if (typeof timeString === 'number') {
            return timeString;
        }

        try {
            // Handle note durations (4n, 8n, 16n, etc.)
            if (timeString.endsWith('n')) {
                const noteValue = parseInt(timeString.slice(0, -1));
                const beatDuration = 60 / bpm; // Duration of one beat in seconds
                return (4 / noteValue) * beatDuration;
            }

            // Handle dotted notes (4n., 8n., etc.)
            if (timeString.endsWith('n.')) {
                const noteValue = parseInt(timeString.slice(0, -2));
                const beatDuration = 60 / bpm;
                const baseDuration = (4 / noteValue) * beatDuration;
                return baseDuration * 1.5; // Dotted note is 1.5x the duration
            }

            // Handle measures (1m, 2m, etc.)
            if (timeString.endsWith('m')) {
                const measures = parseFloat(timeString.slice(0, -1));
                const measureDuration = (60 / bpm) * 4; // Assuming 4/4 time
                return measures * measureDuration;
            }

            // Handle seconds directly
            if (timeString.endsWith('s')) {
                return parseFloat(timeString.slice(0, -1));
            }

            // Try to parse as a number
            const parsed = parseFloat(timeString);
            if (!isNaN(parsed)) {
                return parsed;
            }

            console.warn(`Cannot parse time string: ${timeString}`);
            return 0;
        } catch (error) {
            console.error(`Error parsing time string ${timeString}:`, error);
            return 0;
        }
    }

    /**
     * Validate JMON composition format
     */
    static validateComposition(composition: any): JmonValidationResult {
        const errors: JmonValidationError[] = [];
        const warnings: string[] = [];

        // Check required fields
        if (!composition) {
            errors.push({ field: 'composition', message: 'Composition object is required' });
            return { valid: false, errors, warnings };
        }

        if (!composition.format) {
            errors.push({ field: 'format', message: 'Format field is required' });
        } else if (composition.format !== this.FORMAT_IDENTIFIER) {
            errors.push({ 
                field: 'format', 
                message: `Invalid format: expected "${this.FORMAT_IDENTIFIER}", got "${composition.format}"`,
                value: composition.format 
            });
        }

        if (!composition.version) {
            warnings.push('Version field is recommended');
        }

        if (!composition.tracks || !Array.isArray(composition.tracks)) {
            errors.push({ field: 'tracks', message: 'Tracks array is required' });
        } else if (composition.tracks.length === 0) {
            warnings.push('Composition has no tracks');
        } else {
            // Validate each track
            composition.tracks.forEach((track: any, index: number) => {
                if (!track.sequence || !Array.isArray(track.sequence)) {
                    errors.push({ 
                        field: `tracks[${index}].sequence`, 
                        message: 'Track sequence array is required' 
                    });
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Create a Tone.js synth instance
     */
    static createSynth(type: string, options: any = {}): any {
        // Note: This requires Tone.js to be available globally or imported
        if (typeof window !== 'undefined' && (window as any).Tone) {
            const Tone = (window as any).Tone;
            try {
                switch (type) {
                    case 'Synth': return new Tone.Synth(options);
                    case 'PolySynth': return new Tone.PolySynth(options);
                    case 'MonoSynth': return new Tone.MonoSynth(options);
                    case 'AMSynth': return new Tone.AMSynth(options);
                    case 'FMSynth': return new Tone.FMSynth(options);
                    case 'DuoSynth': return new Tone.DuoSynth(options);
                    case 'PluckSynth': return new Tone.PluckSynth(options);
                    case 'NoiseSynth': return new Tone.NoiseSynth(options);
                    default:
                        console.warn(`Unknown synth type: ${type}, using Synth`);
                        return new Tone.Synth(options);
                }
            } catch (error) {
                console.error(`Error creating ${type}:`, error);
                return new Tone.Synth(); // Fallback
            }
        } else {
            console.warn('Tone.js not available. Cannot create synth.');
            return null;
        }
    }

    /**
     * Basic composition playback (requires Tone.js)
     */
    static async playComposition(composition: JmonComposition, options: any = {}): Promise<void> {
        const validation = this.validateComposition(composition);
        if (!validation.valid) {
            console.error('Invalid composition:', validation.errors);
            return;
        }

        if (typeof window !== 'undefined' && (window as any).Tone) {
            const Tone = (window as any).Tone;
            
            // Ensure audio context is running
            if (Tone.context.state !== 'running') {
                await Tone.start();
            }

            // Simple playback implementation
            if (composition.tracks && Array.isArray(composition.tracks)) {
                composition.tracks.forEach((track: JmonTrack, trackIndex: number) => {
                const synth = this.createSynth(track.instrument?.type || 'Synth', track.instrument);
                if (!synth) return;

                synth.toDestination();

                track.sequence?.forEach((note: JmonNote) => {
                    const noteNames = this.processNoteInput(note.note || 'C4');
                    const time = this.parseTimeString(note.time, composition.bpm || 120);
                    const duration = this.parseTimeString(note.duration, composition.bpm || 120);

                    if (Array.isArray(noteNames)) {
                        // Chord
                        noteNames.forEach(noteName => {
                            synth.triggerAttackRelease(noteName, duration, `+${time}`);
                        });
                    } else {
                        // Single note
                        synth.triggerAttackRelease(noteNames, duration, `+${time}`);
                    }
                });
                });
            }
        } else {
            console.warn('Tone.js not available. Cannot play composition.');
        }
    }
}

export default JmonTone;