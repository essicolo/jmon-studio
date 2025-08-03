// Music Theory and Harmony
export { MusicTheoryConstants } from './music/theory/MusicTheoryConstants';
export { Scale } from './music/theory/Scale';
export { Progression } from './music/theory/Progression';
export { Voice, Ornament } from './music/harmony';
export { Rhythm, AdvancedRhythm, GeneticRhythm } from './music/rhythm';
export { MotifBank } from './music/motifs';

// Generative Algorithms
export { GaussianProcessRegressor, KernelGenerator } from './generative/gaussian-processes';
export { RBF, RationalQuadratic, Periodic } from './generative/gaussian-processes/kernels';
export { CellularAutomata } from './generative/cellular-automata';
export { Polyloop } from './generative/polyloops';
export { GeneticAlgorithm } from './generative/genetic';
export { RandomWalk } from './generative/walks';
export { Mandelbrot, LogisticMap } from './generative/fractals';
export { MinimalismProcess, Tintinnabuli } from './generative/minimalism';

// Analysis
export { MusicalAnalysis } from './analysis';

// I/O and Conversion
export { JMonConverter } from './io/jmon/conversion';

// Utilities
export { MusicUtils } from './utils/music';

// Import for grouped exports
import { Scale } from './music/theory/Scale';
import { Progression } from './music/theory/Progression';
import { Voice } from './music/harmony';
import { Rhythm } from './music/rhythm';
import { MotifBank } from './music/motifs';
import { GaussianProcessRegressor } from './generative/gaussian-processes';
import { CellularAutomata } from './generative/cellular-automata';
import { Polyloop } from './generative/polyloops';
import { GeneticAlgorithm } from './generative/genetic';
import { RandomWalk } from './generative/walks';
import { Mandelbrot, LogisticMap } from './generative/fractals';
import { MinimalismProcess } from './generative/minimalism';

// Create grouped exports for convenience
export const dj = {
    Scale,
    Progression,
    Voice,
    Rhythm,
    MotifBank,
    GaussianProcess: GaussianProcessRegressor,
    CellularAutomata,
    Polyloop,
    GeneticAlgorithm,
    RandomWalk,
    Fractals: { Mandelbrot, LogisticMap },
    MinimalismProcess
} as const;

export const viz = null; // Visualization disabled in Node.js build