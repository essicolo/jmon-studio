/**
 * JMON Studio - Complete music composition and algorithmic generation library
 *
 * Combines JMON format conversion with powerful algorithmic composition tools
 */
export { JmonTone as default } from './format/JmonTone';
export { JmonTone } from './format/JmonTone';
export * from './algorithms';
export * from './types/jmon';
import { JmonTone } from './format/JmonTone';
export declare const jmon: {
    JmonTone: typeof JmonTone;
};
export declare const dj: {
    readonly Scale: typeof import("./algorithms").Scale;
    readonly Progression: typeof import("./algorithms").Progression;
    readonly Voice: typeof import("./algorithms").Voice;
    readonly Rhythm: typeof import("./algorithms").Rhythm;
    readonly MotifBank: typeof import("./algorithms").MotifBank;
    readonly GaussianProcess: typeof import("./algorithms").GaussianProcessRegressor;
    readonly CellularAutomata: typeof import("./algorithms").CellularAutomata;
    readonly Polyloop: typeof import("./algorithms").Polyloop;
    readonly GeneticAlgorithm: typeof import("./algorithms").GeneticAlgorithm;
    readonly RandomWalk: typeof import("./algorithms").RandomWalk;
    readonly Fractals: {
        readonly Mandelbrot: typeof import("./algorithms").Mandelbrot;
        readonly LogisticMap: typeof import("./algorithms").LogisticMap;
    };
    readonly MinimalismProcess: typeof import("./algorithms").MinimalismProcess;
};
export declare const VERSION = "1.0.0";
//# sourceMappingURL=index.d.ts.map