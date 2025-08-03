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

// Type exports
export type { JMonComposition, JMonNote, JMonSequence } from './types/jmon';
export type { VoicingOptions, ChordVoicing, OrnamentOptions, OrnamentedNote } from './music/harmony';
export type { GeneticOptions, Individual } from './generative/genetic';
export type { WalkOptions, WalkState } from './generative/walks';
export type { MandelbrotOptions, LogisticMapOptions } from './generative/fractals';
export type { MinimalismOptions, MinimalismOperation, MinimalismDirection } from './generative/minimalism';
export type { Motif, MotifSearchOptions } from './music/motifs';
export type { AnalysisOptions, AnalysisResult } from './analysis';