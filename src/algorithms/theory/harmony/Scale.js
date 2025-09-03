import { MusicTheoryConstants } from './MusicTheoryConstants.js';

/**
 * Represents a musical scale
 */
export class Scale extends MusicTheoryConstants {
    /**
     * Create a Scale
     * @param {string} tonic - The tonic note of the scale
     * @param {string|Array} mode - The type of scale or custom intervals
     */
    constructor(tonic, mode = 'major') {
        super();
        
        if (!this.chromatic_scale.includes(tonic)) {
            const convertedTonic = this.convertFlatToSharp(tonic);
            if (!this.chromatic_scale.includes(convertedTonic)) {
                throw new Error(`'${tonic}' is not a valid tonic note. Select one among '${this.chromatic_scale.join(', ')}'.`);
            }
            this.tonic = convertedTonic;
        } else {
            this.tonic = tonic;
        }

        if (Array.isArray(mode)) {
            this.scale_intervals = { ...this.scale_intervals, custom: mode };
            this.mode = 'custom';
        } else if (!Object.keys(this.scale_intervals).includes(mode)) {
            throw new Error(`'${mode}' is not a valid scale. Select one among '${Object.keys(this.scale_intervals).join(', ')}' or provide an array of intervals.`);
        } else {
            this.mode = mode;
        }
    }/**
     * Generate a scale starting from a specific octave with n notes
     * @param {number} octave - The starting octave (0-10)
     * @param {number} n - Number of notes to generate
     * @returns {Array} Array of MIDI note numbers representing the scale
     */
    generate(octave, n) {
        const baseNote = octave * 12 + this.chromatic_scale.indexOf(this.tonic);
        const intervals = this.scale_intervals[this.mode];
        const scale = [];
        
        for (let i = 0; scale.length < n; i++) {
            for (const interval of intervals) {
                scale.push(baseNote + interval + (i * 12));
                if (scale.length >= n) break;
            }
        }
        
        return scale;
    }
}