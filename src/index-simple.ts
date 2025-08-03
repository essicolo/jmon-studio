/**
 * JMON Studio - Simple build without visualization dependencies
 */

// Format exports
export { JmonTone as default } from './format/JmonTone';
export { JmonTone } from './format/JmonTone';
export * from './format';

// Core algorithm exports (without visualization)
export { MusicTheoryConstants } from './algorithms/music/theory/MusicTheoryConstants';
export { Scale } from './algorithms/music/theory/Scale';
export { Progression } from './algorithms/music/theory/Progression';
export { Voice, Ornament } from './algorithms/music/harmony';
export { Rhythm, AdvancedRhythm, GeneticRhythm } from './algorithms/music/rhythm';
export { MotifBank } from './algorithms/music/motifs';

export { GaussianProcessRegressor, KernelGenerator } from './algorithms/generative/gaussian-processes';
export { RBF, RationalQuadratic, Periodic } from './algorithms/generative/gaussian-processes/kernels';
export { CellularAutomata } from './algorithms/generative/cellular-automata';
export { Polyloop } from './algorithms/generative/polyloops';
export { GeneticAlgorithm } from './algorithms/generative/genetic';
export { RandomWalk } from './algorithms/generative/walks';
export { Mandelbrot, LogisticMap } from './algorithms/generative/fractals';
export { MinimalismProcess, Tintinnabuli } from './algorithms/generative/minimalism';

export { MusicalAnalysis } from './algorithms/analysis';

// Type exports
export * from './types/jmon';

// Convenience grouped exports
import { JmonTone } from './format/JmonTone';
import { Scale } from './algorithms/music/theory/Scale';
import { Progression } from './algorithms/music/theory/Progression';
import { Voice } from './algorithms/music/harmony';
import { Rhythm } from './algorithms/music/rhythm';
import { MotifBank } from './algorithms/music/motifs';
import { GaussianProcessRegressor } from './algorithms/generative/gaussian-processes';
import { CellularAutomata } from './algorithms/generative/cellular-automata';
import { Polyloop } from './algorithms/generative/polyloops';
import { GeneticAlgorithm } from './algorithms/generative/genetic';
import { RandomWalk } from './algorithms/generative/walks';
import { Mandelbrot, LogisticMap } from './algorithms/generative/fractals';
import { MinimalismProcess } from './algorithms/generative/minimalism';

export const jmon = {
    JmonTone,
};

export const dj = {
    // Music theory
    Scale,
    Progression,
    Voice,
    Rhythm,
    MotifBank,
    
    // Algorithms
    GaussianProcess: GaussianProcessRegressor,
    CellularAutomata,
    Polyloop,
    GeneticAlgorithm,
    RandomWalk,
    Fractals: {
        Mandelbrot,
        LogisticMap
    },
    MinimalismProcess
};

export const VERSION = '1.0.0';