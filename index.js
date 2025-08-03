/**
 * JMON Studio - UMD module for universal compatibility
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

    // Create a minimal implementation that works everywhere
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

    // Create basic algorithm classes
    const Scale = function(root, mode) {
        this.root = root;
        this.mode = mode;
        this.notes = this.generateNotes();
    };
    
    Scale.prototype.generateNotes = function() {
        // Basic major scale for now
        const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
        const rootIndex = chromatic.indexOf(this.root);
        
        return majorIntervals.map(interval => 
            chromatic[(rootIndex + interval) % 12]
        );
    };
    
    Scale.prototype.getNotes = function() {
        return this.notes;
    };

    // Minimal implementations for other classes
    const Polyloop = function(length, divisions) {
        this.length = length;
        this.divisions = divisions;
    };
    
    const CellularAutomata = function() {};
    const GeneticAlgorithm = function() {};
    const RandomWalk = function() {};
    const Mandelbrot = function() {};
    const LogisticMap = function() {};

    // Simple viz placeholder (for future implementation)
    const viz = {
        plotPolyloop: function() { console.log('Visualization not implemented in browser version'); },
        plotFractal: function() { console.log('Visualization not implemented in browser version'); }
    };

    // Main exports - clean structure
    return {
        // Format tools
        jmon: {
            JmonTone: JmonTone,
            toAbc: function() { console.log('ABC conversion available in full version'); },
            toMidi: function() { console.log('MIDI conversion available in full version'); },
            show: function() { console.log('Display functions available in full version'); },
            play: function() { console.log('Playback functions available in full version'); }
        },
        
        // Algorithm tools  
        dj: {
            // Music theory
            Scale: Scale,
            Progression: function() { console.log('Progression class available in full version'); },
            Voice: function() { console.log('Voice class available in full version'); },
            Rhythm: function() { console.log('Rhythm class available in full version'); },
            MotifBank: function() { console.log('MotifBank class available in full version'); },
            
            // Generative algorithms
            Polyloop: Polyloop,
            CellularAutomata: CellularAutomata,
            GeneticAlgorithm: GeneticAlgorithm,
            RandomWalk: RandomWalk,
            GaussianProcess: function() { console.log('GaussianProcess class available in full version'); },
            MinimalismProcess: function() { console.log('MinimalismProcess class available in full version'); },
            
            // Fractals
            Fractals: {
                Mandelbrot: Mandelbrot,
                LogisticMap: LogisticMap
            }
        },
        
        // Visualization tools
        viz: viz,
        
        // Direct access to main classes (for convenience)
        JmonTone: JmonTone,
        Scale: Scale,
        
        VERSION: '1.0.3'
    };
}));