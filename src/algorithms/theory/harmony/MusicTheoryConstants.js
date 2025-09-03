/**
 * The Base class defines a set of musical scales, intervals, and notes.
 */
export class MusicTheoryConstants {
    static chromatic_scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    static scale_intervals = {
        'major': [0, 2, 4, 5, 7, 9, 11],  // Ionian
        'minor': [0, 2, 3, 5, 7, 8, 10],  // Aeolian
        'diminished': [0, 2, 3, 5, 6, 8, 9, 11],
        'major pentatonic': [0, 2, 4, 7, 9],
        'minor pentatonic': [0, 3, 5, 7, 10],
        'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        'lydian': [0, 2, 4, 6, 7, 9, 11],
        'mixolydian': [0, 2, 4, 5, 7, 9, 10],
        'dorian': [0, 2, 3, 5, 7, 9, 10],
        'phrygian': [0, 1, 3, 5, 7, 8, 10],
        'locrian': [0, 1, 3, 5, 6, 8, 10],
        'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
        'melodic minor ascending': [0, 2, 3, 5, 7, 9, 11],
        'melodic minor descending': [0, 2, 3, 5, 7, 8, 10],  // same as natural minor
    };

    static intervals = {
        'P1': 0, 'm2': 1, 'M2': 2, 'm3': 3, 'M3': 4, 'P4': 5, 
        'P5': 7, 'm6': 8, 'M6': 9, 'm7': 10, 'M7': 11, 'P8': 12
    };

    constructor() {
        // Instance access to static properties
        this.chromatic_scale = MusicTheoryConstants.chromatic_scale;
        this.scale_intervals = MusicTheoryConstants.scale_intervals;
        this.intervals = MusicTheoryConstants.intervals;
    }

    /**
     * Convert flat notes to their equivalent sharp notes
     * @param {string} note - The note to convert
     * @returns {string} The converted note or original if no conversion needed
     */
    static convertFlatToSharp(note) {
        const flatToSharp = {
            'Bb': 'A#', 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#',
            'B-': 'A#', 'D-': 'C#', 'E-': 'D#', 'G-': 'F#', 'A-': 'G#'
        };
        return flatToSharp[note] || note;
    }

    convertFlatToSharp(note) {
        return MusicTheoryConstants.convertFlatToSharp(note);
    }

    /**
     * Returns the intervals for a triad based on the given scale intervals
     * @param {Array} scale - Scale intervals
     * @returns {Array} Triad intervals [root, third, fifth]
     */
    static scaleToTriad(scale) {
        return [scale[0], scale[2], scale[4]]; // root, third, fifth
    }

    scaleToTriad(scale) {
        return MusicTheoryConstants.scaleToTriad(scale);
    }
}