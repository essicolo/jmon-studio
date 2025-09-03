import { MusicTheoryConstants } from './MusicTheoryConstants.js';

/**
 * Represents a musical scale
 */
export class Scale {
    /**
     * Create a Scale
     * @param {string} tonic - The tonic note of the scale
     * @param {string} mode - The type of scale
     */
    constructor(tonic, mode = 'major') {
        const convertedTonic = MusicTheoryConstants.convertFlatToSharp(tonic);
        if (!MusicTheoryConstants.chromatic_scale.includes(convertedTonic)) {
            throw new Error(`'${tonic}' is not a valid tonic note. Select one among '${MusicTheoryConstants.chromatic_scale.join(', ')}'.`);
        }
        this.tonic = convertedTonic;

        if (!Object.keys(MusicTheoryConstants.scale_intervals).includes(mode)) {
            throw new Error(`'${mode}' is not a valid scale. Select one among '${Object.keys(MusicTheoryConstants.scale_intervals).join(', ')}'.`);
        }
        this.mode = mode;
    }

    /**
     * Generate a scale starting from a specific octave with n notes
     * @param {number} octave - The starting octave (0-10)
     * @param {number} length - Number of notes to generate
     * @returns {Array} Array of MIDI note numbers representing the scale
     */
    generate(octave = 4, length) {
        const intervals = MusicTheoryConstants.scale_intervals[this.mode];
        if (!intervals) {
            console.warn(`Unknown scale mode: ${this.mode}`);
            return [];
        }

        const tonicIndex = MusicTheoryConstants.chromatic_scale.indexOf(this.tonic);
        if (tonicIndex === -1) {
            console.warn(`Unknown tonic: ${this.tonic}`);
            return [];
        }

        const basePitches = intervals.map(interval => {
            const noteIndex = (tonicIndex + interval) % 12;
            return 60 + (octave - 4) * 12 + noteIndex; // MIDI note number
        });

        if (length === undefined) {
            return basePitches;
        }

        const result = [];
        let currentOctave = octave;
        for (let i = 0; i < length; i++) {
            const scaleIndex = i % intervals.length;
            if (scaleIndex === 0 && i > 0) {
                currentOctave++;
            }
            const interval = intervals[scaleIndex];
            const noteIndex = (tonicIndex + interval) % 12;
            const pitch = 60 + (currentOctave - 4) * 12 + noteIndex;
            result.push(pitch);
        }
        return result;}

    /**
     * Get the note names of the scale
     * @returns {Array} Array of note names in the scale
     */
    getNoteNames() {
        const intervals = MusicTheoryConstants.scale_intervals[this.mode];
        if (!intervals) return [];
        
        const tonicIndex = MusicTheoryConstants.chromatic_scale.indexOf(this.tonic);
        if (tonicIndex === -1) return [];
        
        return intervals.map(interval => {
            const noteIndex = (tonicIndex + interval) % 12;
            return MusicTheoryConstants.chromatic_scale[noteIndex];
        });
    }

    /**
     * Check if a given pitch is in the scale
     * @param {number} pitch - MIDI note number
     * @returns {boolean} True if the pitch class is in the scale
     */
    isInScale(pitch) {
        const pitchClass = pitch % 12;
        const scalePitches = this.generate().map(p => p % 12);
        return scalePitches.includes(pitchClass);
    }
}