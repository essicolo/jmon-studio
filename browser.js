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

    // Full JMON Tone implementation with Ajv schema validation
    // Observable compatibility: This UMD build can be loaded in Observable notebooks using require or as a browser global.
    // For full schema validation, Ajv is used (see https://ajv.js.org/). Ajv must be available in the environment.
    let Ajv;
    let jmonSchema;
    try {
        // Try to require Ajv and the schema (works in Node/Observable with require)
        Ajv = (typeof require !== 'undefined') ? require('ajv') : root.Ajv;
        jmonSchema = (typeof require !== 'undefined') ? require('./schemas/jmon-schema.json') : root.jmonSchema;
    } catch (e) {
        // Fallback for browser global (Ajv and schema must be loaded separately)
        Ajv = root.Ajv;
        jmonSchema = root.jmonSchema;
    }

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
                const noteMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
                let noteValue = noteMap[noteLetter.toUpperCase()];
                if (accidental === '#') noteValue += 1;
                else if (accidental === 'b') noteValue -= 1;
                return Math.max(0, Math.min(127, (octave + 1) * 12 + noteValue));
            } catch (error) {
                console.error(`Error converting note name ${noteName}:`, error);
                return 60;
            }
        },

        validateComposition: function(composition) {
            // Full JSON schema validation using Ajv
            if (!Ajv || !jmonSchema) {
                return {
                    valid: false,
                    errors: [{ message: 'Ajv or jmonSchema not available. Full validation not possible.' }],
                    warnings: []
                };
            }
            const ajv = new Ajv({ allErrors: true, strict: false });
            const validate = ajv.compile(jmonSchema);
            const valid = validate(composition);
            return {
                valid,
                errors: validate.errors || [],
                warnings: []
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

    // Visualization stubs: Not implemented in browser.js. See full version or use your own visualization code.
    const viz = {
        plotPolyloop: function(polyloop, element) {
            throw new Error('Polyloop visualization is not implemented in this build.');
        },
        plotScale: function(scale, element) {
            throw new Error('Scale visualization is not implemented in this build.');
        },
        plotCellularAutomata: function(ca, element) {
            throw new Error('Cellular automata visualization is not implemented in this build.');
        }
    };

    // Main exports - clean structure
    return {
        // Format tools
        jmon: {
            toTone: JmonTone,
            toAbc: function() { throw new Error('ABC conversion is not available in this build.'); },
            toMidi: function() { throw new Error('MIDI conversion is not available in this build.'); },
            show: function() { throw new Error('Display functions are not available in this build.'); },
            play: function() { throw new Error('Playback functions are not available in this build.'); }
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
            GeneticAlgorithm: function() { throw new Error('GeneticAlgorithm is not available in this build.'); },
            RandomWalk: function() { throw new Error('RandomWalk is not available in this build.'); },
            GaussianProcess: function() { throw new Error('GaussianProcess is not available in this build.'); },
            MinimalismProcess: function() { throw new Error('MinimalismProcess is not available in this build.'); },
            // Fractals
            Fractals: {
                Mandelbrot: function() { throw new Error('Mandelbrot is not available in this build.'); },
                LogisticMap: function() { throw new Error('LogisticMap is not available in this build.'); }
            }
        },
        
        // Visualization tools
        viz: viz,
        
        VERSION: '1.0.5'
    };
}));