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
    }

    /**
     * Generate the full range of the scale
     * @returns {Array} Array of MIDI note numbers representing the scale
     */
    generate() {
        const tonicNote = this.chromatic_scale.indexOf(this.tonic);
        const scale = this.scale_intervals[this.mode] || this.scale_intervals['major'];
        
        const fullRangeScale = [];
        const addedNotes = new Set();
        
        for (let octave = 0; octave < 11; octave++) {
            for (const interval of scale) {
                const note = (tonicNote + interval) % 12 + octave * 12;
                if (note <= 127 && !addedNotes.has(note)) {
                    fullRangeScale.push(note);
                    addedNotes.add(note);
                }
            }
        }
        
        fullRangeScale.sort((a, b) => a - b);
        return fullRangeScale;
    }
}