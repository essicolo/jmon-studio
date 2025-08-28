/**
 * JmonTone (Tone Object Notation Extended) - Core Library
 * 
 * A JavaScript library for parsing, validating, and manipulating
 * musical compositions in the JMON specification.
 * 
 * Originally designed for Tone.js but extensible to other audio frameworks.
 */

/**
 * @typedef {Object} JmonNote
 * @property {string|number} [time] - Time value
 * @property {string|number|Array<string|number>} [note] - Note value(s)
 * @property {string|number} duration - Note duration
 * @property {number} [velocity] - Note velocity
 * @property {string} [articulation] - Articulation style
 * @property {number} [glissTarget] - Glissando target
 * @property {number} [microtuning] - Microtuning adjustment
 * @property {number} [channel] - MIDI channel
 * @property {number} [pan] - Panning value
 * @property {Array<Object>} [effects] - Effects array
 * @property {Array<Object>} [modulation] - Modulation array
 */

/**
 * @typedef {Object} JmonTrack
 * @property {string} [name] - Track name
 * @property {Object} [instrument] - Instrument configuration
 * @property {Array<Object>} [effects] - Effects array
 * @property {Array<Object>} [modulation] - Modulation array
 * @property {Array<JmonNote>} [sequence] - Note sequence
 * @property {string|number} [loop] - Loop configuration
 * @property {Array<JmonNote>} [notes] - Modern format notes
 */

/**
 * @typedef {Object} JmonComposition
 * @property {string} format - Format identifier
 * @property {string} version - Version string
 * @property {number} [bpm] - Beats per minute
 * @property {string} [keySignature] - Key signature
 * @property {string} [timeSignature] - Time signature
 * @property {string} [title] - Composition title
 * @property {string} [composer] - Composer name
 * @property {Array<JmonTrack>} [tracks] - Track array
 * @property {Array<Object>} [masterEffects] - Master effects
 */

/**
 * @typedef {Object} JmonValidationError
 * @property {string} field - Field name with error
 * @property {string} message - Error message
 * @property {*} [value] - Invalid value
 */

/**
 * @typedef {Object} JmonValidationResult
 * @property {boolean} valid - Whether the composition is valid
 * @property {Array<JmonValidationError>} errors - Array of errors
 * @property {Array<string>} warnings - Array of warnings
 */

import * as JmonAbc from '../converters/jmon-abc.js';

class JmonTone {
    static VERSION = "1.0";
    static FORMAT_IDENTIFIER = "jmonTone";

    /**
     * Convert a jmon composition to ABC notation (static import for browser ESM)
     * @param {Object} composition - JMON composition object
     * @returns {Promise<string>} ABC notation string
     */
    static async convertToAbc(composition) {
        // Use static import for browser compatibility
        return JmonAbc.convertToAbc(composition);
    }

    /**
     * Create a player UI for a jmon composition
     * Note: Use the main export `createPlayer` from jmon-studio instead
     * @param {Object} composition - JMON composition object
     * @param {Object} [options={}] - Player options
     * @returns {Object} Player instance
     * @deprecated Use createPlayer from main jmon-studio export instead
     */
    static createPlayer(composition, options = {}) {
        console.warn('JmonTone.createPlayer is deprecated. Use createPlayer from main jmon-studio export instead.');
        // For backwards compatibility, try to find the createPlayer in global scope
        if (typeof createPlayer !== 'undefined') {
            return createPlayer(composition, options);
        }
        throw new Error('createPlayer not available. Import createPlayer directly from jmon-studio.');
    }

    /**
     * Convert MIDI note number to note name (e.g., 60 -> "C4")
     * @param {number} midiNote - MIDI note number (0-127)
     * @returns {string} Note name
     */
    static midiNoteToNoteName(midiNote) {
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
     * @param {string} noteName - Note name (e.g., "C4", "F#3")
     * @returns {number} MIDI note number
     */
    static noteNameToMidiNote(noteName) {
        try {
            const noteRegex = /^([A-Ga-g])([#b]?)(-?\d+)$/;
            const match = noteName.match(noteRegex);
            
            if (!match) {
                console.warn(`Invalid note name: ${noteName}`);
                return 60; // Default to middle C
            }
            
            const [, noteLetter, accidental, octaveStr] = match;
            const octave = parseInt(octaveStr, 10);
            
            const noteMap = {
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
     * Process pitch input (can be string, number, or array)
     * @param {string|number|Array<string|number>} pitch - Pitch input
     * @returns {string|Array<string>} Processed pitch(es)
     */
    static processPitchInput(pitch) {
        if (Array.isArray(pitch)) {
            return pitch.map(n => this.processPitchInput(n));
        } else if (typeof pitch === 'number') {
            return this.midiNoteToNoteName(pitch);
        } else {
            return pitch;
        }
    }

    /**
     * Parse time string to seconds
     * @param {string|number} timeString - Time string or number
     * @param {number} [bpm=120] - Beats per minute
     * @returns {number} Time in seconds
     */
    static parseTimeString(timeString, bpm = 120) {
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
     * @param {Object} composition - Composition to validate
     * @returns {JmonValidationResult} Validation result
     */
    static validateComposition(composition) {
        const errors = [];
        const warnings = [];

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
            composition.tracks.forEach((track, index) => {
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
     * @param {string} type - Synth type
     * @param {Object} [options={}] - Synth options
     * @returns {Object|null} Tone.js synth instance or null
     */
    static createSynth(type, options = {}) {
        // Note: This requires Tone.js to be available globally or imported
        if (typeof window !== 'undefined' && window.Tone) {
            const Tone = window.Tone;
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
     * @param {JmonComposition} composition - JMON composition
     * @param {Object} [options={}] - Playback options
     * @returns {Promise<void>}
     */
    static async playComposition(composition, options = {}) {
        const validation = this.validateComposition(composition);
        if (!validation.valid) {
            console.error('Invalid composition:', validation.errors);
            return;
        }

        if (typeof window !== 'undefined' && window.Tone) {
            const Tone = window.Tone;
            
            // Ensure audio context is running
            if (Tone.context.state !== 'running') {
                await Tone.start();
            }

            // Simple playback implementation
            if (composition.tracks && Array.isArray(composition.tracks)) {
                composition.tracks.forEach((track, trackIndex) => {
                const synth = this.createSynth(track.instrument?.type || 'Synth', track.instrument);
                if (!synth) return;

                synth.toDestination();

                track.sequence?.forEach((note) => {
                    const pitchNames = this.processPitchInput(note.pitch || 'C4');
                    const time = this.parseTimeString(note.time ?? 0, composition.bpm || 120);
                    const duration = this.parseTimeString(note.duration, composition.bpm || 120);

                    if (Array.isArray(pitchNames)) {
                        // Chord
                        pitchNames.forEach(pitchName => {
                            synth.triggerAttackRelease(pitchName, duration, `+${time}`);
                        });
                    } else {
                        // Single note
                        synth.triggerAttackRelease(pitchNames, duration, `+${time}`);
                    }
                });
                });
            }
        } else {
            console.warn('Tone.js not available. Cannot play composition.');
        }
    }
}

export { JmonTone };
export default JmonTone;