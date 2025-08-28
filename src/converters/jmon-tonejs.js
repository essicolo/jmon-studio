/**
 * JMON to Tone.js Converter
 * Handles conversion from JMON format to Tone.js-compatible structures
 * Includes multivoice splitting for overlapping notes
 */

export class JmonTonejsConverter {
    constructor(options = {}) {
        this.options = {
            autoMultivoice: options.autoMultivoice ?? true,
            maxVoices: options.maxVoices || 4,
            showDebug: options.showDebug || false,
            ...options
        };
    }

    /**
     * Convert JMON composition to Tone.js tracks with multivoice support
     */
    convert(composition) {
        const tracks = composition.tracks || composition.sequences || [];
        const convertedTracks = [];

        tracks.forEach((track, trackIndex) => {
            const notes = track.sequence || track.notes || [];
            
            // Analyze track for features requiring special handling
            const analysis = this.analyzeTrack(notes);
            
            // Split notes into voices for overlapping playback
            const voices = this.splitIntoVoices(notes);
            
            // Create track config for each voice
            voices.forEach((voice, voiceIndex) => {
                const trackConfig = {
                    originalTrackIndex: trackIndex,
                    voiceIndex: voiceIndex,
                    totalVoices: voices.length,
                    trackInfo: {
                        label: track.label || track.name || `Track ${trackIndex + 1}`,
                        originalTrack: track
                    },
                    notes: voice,
                    analysis: analysis,
                    synthConfig: this.getSynthConfig(track, analysis, voiceIndex),
                    partEvents: this.createPartEvents(voice)
                };
                
                convertedTracks.push(trackConfig);
            });
        });

        return {
            tracks: convertedTracks,
            metadata: {
                tempo: composition.bpm || 120,
                totalDuration: this.calculateTotalDuration(composition),
                originalComposition: composition
            }
        };
    }

    /**
     * Analyze track for special requirements
     */
    analyzeTrack(notes) {
        return {
            hasGlissando: notes.some(note => note.articulation === 'glissando'),
            hasChords: notes.some(note => Array.isArray(note.pitch)),
            hasOverlaps: this.detectOverlaps(notes),
            noteCount: notes.length,
            timeRange: this.getTimeRange(notes)
        };
    }

    /**
     * Detect overlapping notes in a sequence
     */
    detectOverlaps(notes) {
        if (notes.length < 2) return false;
        
        const sortedNotes = [...notes].sort((a, b) => (parseFloat(a.time) || 0) - (parseFloat(b.time) || 0));
        
        for (let i = 1; i < sortedNotes.length; i++) {
            const prevNote = sortedNotes[i - 1];
            const currentNote = sortedNotes[i];
            
            const prevStart = parseFloat(prevNote.time) || 0;
            const prevEnd = prevStart + (parseFloat(prevNote.duration) || 0.5);
            const currentStart = parseFloat(currentNote.time) || 0;
            
            if (currentStart < prevEnd) {
                return true; // Overlap detected
            }
        }
        
        return false;
    }

    /**
     * Split notes into voices for overlapping playback
     */
    splitIntoVoices(notes) {
        if (!this.options.autoMultivoice || notes.length === 0) {
            return [notes];
        }

        const maxVoices = this.options.maxVoices;
        const voices = Array(maxVoices).fill(null).map(() => []);
        const voiceEndTimes = Array(maxVoices).fill(0);

        // Sort notes by start time
        const sortedNotes = [...notes].sort((a, b) => (parseFloat(a.time) || 0) - (parseFloat(b.time) || 0));

        for (const note of sortedNotes) {
            const startTime = parseFloat(note.time) || 0;
            const duration = parseFloat(note.duration) || 0.5;
            const endTime = startTime + duration;

            // Find first available voice (one that has finished playing)
            let assignedVoice = 0;
            for (let i = 0; i < maxVoices; i++) {
                if (voiceEndTimes[i] <= startTime) {
                    assignedVoice = i;
                    break;
                }
            }

            // If no voice is available, use the one that ends soonest
            if (voiceEndTimes[assignedVoice] > startTime) {
                assignedVoice = voiceEndTimes.indexOf(Math.min(...voiceEndTimes));
                if (this.options.showDebug) {
                    console.warn(`[MULTIVOICE] Note overlap detected at time ${startTime}, assigning to voice ${assignedVoice}`);
                }
            }

            voices[assignedVoice].push(note);
            voiceEndTimes[assignedVoice] = endTime;
        }

        // Filter out empty voices
        const activeVoices = voices.filter(voice => voice.length > 0);
        
        if (activeVoices.length > 1 && this.options.showDebug) {
            console.log(`[MULTIVOICE] Split track into ${activeVoices.length} voices to handle overlapping notes`);
        }

        return activeVoices.length > 0 ? activeVoices : [notes];
    }

    /**
     * Get synth configuration for a voice
     */
    getSynthConfig(originalTrack, analysis, voiceIndex) {
        const defaultSynth = originalTrack.instrument?.type || 'PolySynth';
        
        // Force mono synths for glissando
        if (analysis.hasGlissando && (defaultSynth === 'PolySynth' || defaultSynth === 'DuoSynth')) {
            if (voiceIndex === 0 && this.options.showDebug) {
                console.warn(`[MULTIVOICE] Using Synth instead of ${defaultSynth} for glissando in ${originalTrack.label || 'track'}`);
            }
            return {
                type: 'Synth',
                reason: 'glissando_compatibility',
                original: defaultSynth
            };
        }

        return {
            type: defaultSynth,
            reason: 'user_selected',
            original: defaultSynth
        };
    }

    /**
     * Create Tone.js Part events from notes
     */
    createPartEvents(notes) {
        return notes.map(note => {
            const timeInBeats = parseFloat(note.time) || 0;
            const durationInBeats = parseFloat(note.duration) || 0.5;
            
            return [timeInBeats, {
                pitch: note.pitch,
                duration: durationInBeats,
                articulation: note.articulation,
                velocity: note.velocity || 0.8,
                glissTarget: note.glissTarget,
                modulations: note.modulations,
                microtuning: note.microtuning
            }];
        });
    }

    /**
     * Calculate total duration of composition
     */
    calculateTotalDuration(composition) {
        const tracks = composition.tracks || composition.sequences || [];
        const allNotes = tracks.flatMap(track => track.sequence || track.notes || []);
        
        if (allNotes.length === 0) return 0;
        
        const totalBeats = Math.max(...allNotes.map(note => {
            const timeInBeats = parseFloat(note.time) || 0;
            const durationInBeats = parseFloat(note.duration) || 0.5;
            return timeInBeats + durationInBeats;
        }));
        
        const tempo = composition.bpm || 120;
        const beatDuration = 60 / tempo;
        
        return totalBeats * beatDuration;
    }

    /**
     * Get time range of notes
     */
    getTimeRange(notes) {
        if (notes.length === 0) return { start: 0, end: 0 };
        
        const times = notes.map(note => parseFloat(note.time) || 0);
        const endTimes = notes.map(note => (parseFloat(note.time) || 0) + (parseFloat(note.duration) || 0.5));
        
        return {
            start: Math.min(...times),
            end: Math.max(...endTimes)
        };
    }
}

// Convenience export
export function convertJmonToTonejs(composition, options = {}) {
    const converter = new JmonTonejsConverter(options);
    return converter.convert(composition);
}