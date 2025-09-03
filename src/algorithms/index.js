// Constants
import { MusicTheoryConstants } from './constants/MusicTheoryConstants.js'

// Music Theory and Harmony - Updated imports
import { Scale, Progression, Voice, Ornament, Articulation, addArticulation, removeArticulation, validateArticulations } from './theory/harmony/index.js';
import { Rhythm, isorhythm, beatcycle } from './theory/rhythm/index.js';
import * as Utils from './utils.js';

// Export existing classes that are working
import { MotifBank } from './theory/motifs/index.js';
import { GaussianProcessRegressor } from './generative/gaussian-processes/index.js';
import { CellularAutomata } from './generative/cellular-automata/index.js';
import { Polyloop } from './generative/polyloops/index.js';
import { GeneticAlgorithm } from './generative/genetic/index.js';
import { RandomWalk } from './generative/walks/index.js';
import { Mandelbrot, LogisticMap } from './generative/fractals/index.js';
import { MinimalismProcess } from './generative/minimalism/index.js';

// Re-exports
export { MusicTheoryConstants, Scale, Progression, Voice, Ornament };
export { Rhythm, isorhythm, beatcycle };
export { Articulation, addArticulation, removeArticulation, validateArticulations };
export * from './utils.js';
export { Mandelbrot, LogisticMap } from './generative/fractals/index.js';
export { MinimalismProcess, Tintinnabuli } from './generative/minimalism/index.js';

// Analysis
export { MusicalAnalysis } from './analysis/index.js';

// Main dj object with namespaced functionality for Observable compatibility
export const dj = {
    // Harmony namespace
    harmony: {
        // Core Theory Classes
        MusicTheoryConstants,
        Scale,
        Progression,
        Voice,
        Ornament,
        
        // Articulation System
        Articulation,
        addArticulation,
        addOrnament: addArticulation,  // Alias for compatibility
        removeArticulation,
        removeOrnament: removeArticulation,  // Alias for compatibility
        validateArticulations
    },
    
    // Rhythm namespace
    rhythm: {
        Rhythm,
        isorhythm,
        beatcycle
    },
    
    // Utility functions
    utils: {
        ...Utils
    },
    
    // Generative algorithms
    generative: {
        MotifBank,
        GaussianProcess: GaussianProcessRegressor,
        CellularAutomata,
        Polyloop,
        GeneticAlgorithm,
        RandomWalk,
        Fractals: { Mandelbrot, LogisticMap },
        MinimalismProcess
    },
    
    // Backward compatibility - expose some functions at root level too
    Scale,
    Rhythm,
    addArticulation,
    removeArticulation,
    ...Utils
};