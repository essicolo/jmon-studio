/**
 * Core algorithm implementations for Observable compatibility
 */

// MusicTheoryConstants
export const MusicTheoryConstants = {
    chromaticScale: [
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
    ],
    
    intervals: {
        unison: 0,
        minor2nd: 1,
        major2nd: 2,
        minor3rd: 3,
        major3rd: 4,
        perfect4th: 5,
        tritone: 6,
        perfect5th: 7,
        minor6th: 8,
        major6th: 9,
        minor7th: 10,
        major7th: 11,
        octave: 12,
    },
    
    scaleIntervals: {
        major: [0, 2, 4, 5, 7, 9, 11],
        minor: [0, 2, 3, 5, 7, 8, 10],
        dorian: [0, 2, 3, 5, 7, 9, 10],
        phrygian: [0, 1, 3, 5, 7, 8, 10],
        lydian: [0, 2, 4, 6, 7, 9, 11],
        mixolydian: [0, 2, 4, 5, 7, 9, 10],
        locrian: [0, 1, 3, 5, 6, 8, 10],
    },
    
    getChromaticIndex: function(note) {
        return this.chromaticScale.indexOf(note);
    },
    
    getNoteFromIndex: function(index) {
        const normalizedIndex = ((index % 12) + 12) % 12;
        return this.chromaticScale[normalizedIndex];
    },
    
    transposeNote: function(note, semitones) {
        const currentIndex = this.getChromaticIndex(note);
        const newIndex = currentIndex + semitones;
        return this.getNoteFromIndex(newIndex);
    }
};

// Scale class
export class Scale {
    constructor(tonic, mode) {
        this.tonic = tonic;
        this.mode = mode;
    }
    
    generate(octave = 4, length) {
        const intervals = MusicTheoryConstants.scaleIntervals[this.mode];
        const tonicIndex = MusicTheoryConstants.getChromaticIndex(this.tonic);
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
        return result;
    }
    
    getNoteNames() {
        const intervals = MusicTheoryConstants.scaleIntervals[this.mode];
        const tonicIndex = MusicTheoryConstants.getChromaticIndex(this.tonic);
        return intervals.map(interval => {
            const noteIndex = (tonicIndex + interval) % 12;
            return MusicTheoryConstants.chromaticScale[noteIndex];
        });
    }
    
    getDegree(degree, octave = 4) {
        const intervals = MusicTheoryConstants.scaleIntervals[this.mode];
        const normalizedDegree = ((degree - 1) % intervals.length);
        const octaveOffset = Math.floor((degree - 1) / intervals.length);
        const interval = intervals[normalizedDegree];
        const tonicIndex = MusicTheoryConstants.getChromaticIndex(this.tonic);
        const noteIndex = (tonicIndex + interval) % 12;
        return 60 + (octave + octaveOffset - 4) * 12 + noteIndex;
    }
}

// Rhythm class
export class Rhythm {
    constructor(measureLength = 4.0, durations = []) {
        this.measureLength = measureLength;
        this.durations = durations.length > 0 ? [...durations] : this.generateBasicPattern();
    }
    
    generateBasicPattern() {
        return [1.0, 1.0, 1.0, 1.0]; // Four quarter notes
    }
    
    random(options = {}) {
        const { measureLength = this.measureLength, complexity = 0.5 } = options;
        const possibleDurations = [0.25, 0.5, 1.0, 1.5, 2.0];
        const durations = [];
        let currentLength = 0;
        
        while (currentLength < measureLength) {
            const remaining = measureLength - currentLength;
            const validDurations = possibleDurations.filter(d => d <= remaining);
            if (validDurations.length === 0) {
                if (remaining > 0) {
                    durations.push(remaining);
                }
                break;
            }
            
            let chosenDuration;
            if (Math.random() < complexity) {
                chosenDuration = validDurations[0];
            } else {
                chosenDuration = validDurations[validDurations.length - 1];
            }
            durations.push(chosenDuration);
            currentLength += chosenDuration;
        }
        
        return {
            durations,
            measureLength,
            accents: this.generateAccents(durations),
        };
    }
    
    generateAccents(durations) {
        return durations.map((_, i) => i === 0 || (i % 4 === 0));
    }
}

// Progression class
export class Progression {
    constructor(tonic, mode = 'major') {
        this.scale = new Scale(tonic, mode);
    }
    
    generate(options = {}) {
        const { length = 4, voicing = 'triad' } = options;
        const progressionPatterns = {
            major: [[1, 4, 5, 1], [1, 6, 4, 5], [1, 5, 6, 4], [2, 5, 1, 1]],
            minor: [[1, 4, 5, 1], [1, 6, 4, 5], [1, 7, 6, 7], [1, 3, 7, 1]]
        };
        
        const patterns = progressionPatterns[this.scale.mode] || progressionPatterns.major;
        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        const chords = [];
        for (let i = 0; i < length; i++) {
            const degree = selectedPattern[i % selectedPattern.length];
            const chord = this.generateChord(degree, voicing);
            chords.push(chord);
        }
        
        return {
            chords,
            key: this.scale.tonic,
            mode: this.scale.mode,
        };
    }
    
    generateChord(degree, voicing = 'triad') {
        const scaleNotes = this.scale.getNoteNames();
        const rootNote = scaleNotes[(degree - 1) % scaleNotes.length];
        const chordQuality = this.getChordQuality(degree);
        return rootNote + chordQuality;
    }
    
    getChordQuality(degree) {
        const qualityMap = {
            major: { 1: '', 2: 'm', 3: 'm', 4: '', 5: '', 6: 'm', 7: 'dim' },
            minor: { 1: 'm', 2: 'dim', 3: '', 4: 'm', 5: 'm', 6: '', 7: '' }
        };
        return qualityMap[this.scale.mode]?.[degree] || '';
    }
}

// Voice class
export class Voice {
    constructor(scale, options = {}) {
        this.scale = scale;
        this.options = {
            voiceCount: options.voiceCount || 4,
            voiceRange: options.voiceRange || [48, 84],
            intervalLimits: options.intervalLimits || [3, 12]
        };
    }
    
    harmonizeMelody(melody, chordProgression) {
        const harmonizedChords = [];
        for (let i = 0; i < melody.length; i++) {
            const melodyNote = melody[i];
            const chordRoot = chordProgression ? 
                chordProgression[i % chordProgression.length] : 
                this.findBestChordRoot(melodyNote);
            const chord = this.buildChord(chordRoot, melodyNote);
            harmonizedChords.push(chord);
        }
        return harmonizedChords;
    }
    
    findBestChordRoot(melodyNote) {
        const scaleDegrees = this.scale.generate();
        return scaleDegrees[0]; // Simplified: return tonic
    }
    
    buildChord(root, melodyNote) {
        const triad = [root, root + 4, root + 7]; // Major triad
        return {
            notes: triad,
            root: root,
            quality: 'major'
        };
    }
}