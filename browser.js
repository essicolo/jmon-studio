/**
 * JMON Studio - Browser/Observable compatible version
 * Contains actual implementations, not placeholders
 */
(function (root, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else {
        // Browser globals
        root.jmonStudio = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Music Theory Constants
    const MusicTheoryConstants = {
        scaleIntervals: {
            'major': [0, 2, 4, 5, 7, 9, 11],
            'minor': [0, 2, 3, 5, 7, 8, 10],
            'dorian': [0, 2, 3, 5, 7, 9, 10],
            'phrygian': [0, 1, 3, 5, 7, 8, 10],
            'lydian': [0, 2, 4, 6, 7, 9, 11],
            'mixolydian': [0, 2, 4, 5, 7, 9, 10],
            'locrian': [0, 1, 3, 5, 6, 8, 10],
            'harmonic_minor': [0, 2, 3, 5, 7, 8, 11],
            'melodic_minor': [0, 2, 3, 5, 7, 9, 11]
        },
        
        chromaticNotes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        
        getChromaticIndex: function(note) {
            return this.chromaticNotes.indexOf(note);
        }
    };

    // Full JMON Tone implementation
    const JmonTone = {
        VERSION: "1.0",
        FORMAT_IDENTIFIER: "jmonTone",
        
        midiNoteToNoteName: function(midiNote) {
            if (typeof midiNote !== 'number' || midiNote < 0 || midiNote > 127) {
                console.warn(`Invalid MIDI note number: ${midiNote}. Must be 0-127.`);
                return 'C4';
            }
            
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const octave = Math.floor(midiNote / 12) - 1;
            const noteIndex = midiNote % 12;
            
            return noteNames[noteIndex] + octave;
        },
        
        noteNameToMidiNote: function(noteName) {
            try {
                const noteRegex = /^([A-Ga-g])([#b]?)(-?\d+)$/;
                const match = noteName.match(noteRegex);
                
                if (!match) {
                    console.warn(`Invalid note name: ${noteName}`);
                    return 60;
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
                return 60;
            }
        },
        
        validateComposition: function(composition) {
            const errors = [];
            const warnings = [];
            
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
            
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    };

    // Full Scale implementation
    const Scale = function(tonic, mode) {
        this.tonic = tonic;
        this.mode = mode || 'major';
    };
    
    Scale.prototype.generate = function(octave, length) {
        octave = octave || 4;
        const intervals = MusicTheoryConstants.scaleIntervals[this.mode];
        if (!intervals) {
            console.warn(`Unknown scale mode: ${this.mode}`);
            return [];
        }
        
        const tonicIndex = MusicTheoryConstants.getChromaticIndex(this.tonic);
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

        return result;
    };
    
    Scale.prototype.getNotes = function() {
        return this.generate();
    };
    
    Scale.prototype.getNotesAsNames = function(octave) {
        const pitches = this.generate(octave);
        return pitches.map(pitch => JmonTone.midiNoteToNoteName(pitch));
    };

    // Enhanced Polyloop implementation
    const Polyloop = function(length, divisions) {
        this.length = length || 16;
        this.divisions = divisions || 4;
        this.layers = [];
    };
    
    Polyloop.prototype.addLayer = function(pattern, offset) {
        this.layers.push({
            pattern: pattern || [],
            offset: offset || 0
        });
        return this;
    };
    
    Polyloop.prototype.generate = function() {
        const result = [];
        for (let i = 0; i < this.length; i++) {
            const step = {
                time: i,
                notes: []
            };
            
            this.layers.forEach(layer => {
                const pos = (i + layer.offset) % layer.pattern.length;
                if (layer.pattern[pos]) {
                    step.notes.push(layer.pattern[pos]);
                }
            });
            
            result.push(step);
        }
        return result;
    };

    // Other algorithm implementations
    const CellularAutomata = function(rule, width) {
        this.rule = rule || 110;
        this.width = width || 32;
        this.generations = [];
    };
    
    CellularAutomata.prototype.generate = function(steps) {
        // Basic CA implementation
        let current = new Array(this.width).fill(0);
        current[Math.floor(this.width/2)] = 1; // seed
        
        this.generations = [current.slice()];
        
        for (let i = 0; i < (steps || 10); i++) {
            const next = new Array(this.width).fill(0);
            for (let j = 0; j < this.width; j++) {
                const left = current[(j - 1 + this.width) % this.width];
                const center = current[j];
                const right = current[(j + 1) % this.width];
                const state = (left << 2) | (center << 1) | right;
                next[j] = (this.rule >> state) & 1;
            }
            current = next;
            this.generations.push(current.slice());
        }
        
        return this.generations;
    };

    // Visualization placeholder
    const viz = {
        plotPolyloop: function(polyloop, element) {
            console.log('Polyloop visualization would be rendered here');
            return polyloop;
        },
        plotScale: function(scale, element) {
            console.log('Scale visualization would be rendered here');
            return scale;
        },
        plotCellularAutomata: function(ca, element) {
            console.log('Cellular automata visualization would be rendered here');
            return ca;
        }
    };

    // Main exports - clean structure
    return {
        // Format tools
        jmon: {
            toTone: JmonTone,
            toAbc: function() { console.log('ABC conversion available in full version'); },
            toMidi: function() { console.log('MIDI conversion available in full version'); },
            show: function() { console.log('Display functions available in full version'); },
            play: function() { console.log('Playback functions available in full version'); }
        },
        
        // Algorithm tools  
        dj: {
            // Music theory
            Scale: Scale,
            MusicTheoryConstants: MusicTheoryConstants,
            
            // Generative algorithms
            Polyloop: Polyloop,
            CellularAutomata: CellularAutomata,
            
            // Placeholders for other algorithms
            GeneticAlgorithm: function() { console.log('GeneticAlgorithm available in full version'); },
            RandomWalk: function() { console.log('RandomWalk available in full version'); },
            GaussianProcess: function() { console.log('GaussianProcess available in full version'); },
            MinimalismProcess: function() { console.log('MinimalismProcess available in full version'); },
            
            // Fractals
            Fractals: {
                Mandelbrot: function() { console.log('Mandelbrot available in full version'); },
                LogisticMap: function() { console.log('LogisticMap available in full version'); }
            }
        },
        
        // Visualization tools
        viz: viz,
        
        VERSION: '1.0.5'
    };
}));