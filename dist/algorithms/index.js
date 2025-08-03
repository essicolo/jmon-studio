"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viz = exports.dj = exports.MusicUtils = exports.JMonConverter = exports.MusicalAnalysis = exports.Tintinnabuli = exports.MinimalismProcess = exports.LogisticMap = exports.Mandelbrot = exports.RandomWalk = exports.GeneticAlgorithm = exports.Polyloop = exports.CellularAutomata = exports.Periodic = exports.RationalQuadratic = exports.RBF = exports.KernelGenerator = exports.GaussianProcessRegressor = exports.MotifBank = exports.GeneticRhythm = exports.AdvancedRhythm = exports.Rhythm = exports.Ornament = exports.Voice = exports.Progression = exports.Scale = exports.MusicTheoryConstants = void 0;
// Music Theory and Harmony
var MusicTheoryConstants_1 = require("./music/theory/MusicTheoryConstants");
Object.defineProperty(exports, "MusicTheoryConstants", { enumerable: true, get: function () { return MusicTheoryConstants_1.MusicTheoryConstants; } });
var Scale_1 = require("./music/theory/Scale");
Object.defineProperty(exports, "Scale", { enumerable: true, get: function () { return Scale_1.Scale; } });
var Progression_1 = require("./music/theory/Progression");
Object.defineProperty(exports, "Progression", { enumerable: true, get: function () { return Progression_1.Progression; } });
var harmony_1 = require("./music/harmony");
Object.defineProperty(exports, "Voice", { enumerable: true, get: function () { return harmony_1.Voice; } });
Object.defineProperty(exports, "Ornament", { enumerable: true, get: function () { return harmony_1.Ornament; } });
var rhythm_1 = require("./music/rhythm");
Object.defineProperty(exports, "Rhythm", { enumerable: true, get: function () { return rhythm_1.Rhythm; } });
Object.defineProperty(exports, "AdvancedRhythm", { enumerable: true, get: function () { return rhythm_1.AdvancedRhythm; } });
Object.defineProperty(exports, "GeneticRhythm", { enumerable: true, get: function () { return rhythm_1.GeneticRhythm; } });
var motifs_1 = require("./music/motifs");
Object.defineProperty(exports, "MotifBank", { enumerable: true, get: function () { return motifs_1.MotifBank; } });
// Generative Algorithms
var gaussian_processes_1 = require("./generative/gaussian-processes");
Object.defineProperty(exports, "GaussianProcessRegressor", { enumerable: true, get: function () { return gaussian_processes_1.GaussianProcessRegressor; } });
Object.defineProperty(exports, "KernelGenerator", { enumerable: true, get: function () { return gaussian_processes_1.KernelGenerator; } });
var kernels_1 = require("./generative/gaussian-processes/kernels");
Object.defineProperty(exports, "RBF", { enumerable: true, get: function () { return kernels_1.RBF; } });
Object.defineProperty(exports, "RationalQuadratic", { enumerable: true, get: function () { return kernels_1.RationalQuadratic; } });
Object.defineProperty(exports, "Periodic", { enumerable: true, get: function () { return kernels_1.Periodic; } });
var cellular_automata_1 = require("./generative/cellular-automata");
Object.defineProperty(exports, "CellularAutomata", { enumerable: true, get: function () { return cellular_automata_1.CellularAutomata; } });
var polyloops_1 = require("./generative/polyloops");
Object.defineProperty(exports, "Polyloop", { enumerable: true, get: function () { return polyloops_1.Polyloop; } });
var genetic_1 = require("./generative/genetic");
Object.defineProperty(exports, "GeneticAlgorithm", { enumerable: true, get: function () { return genetic_1.GeneticAlgorithm; } });
var walks_1 = require("./generative/walks");
Object.defineProperty(exports, "RandomWalk", { enumerable: true, get: function () { return walks_1.RandomWalk; } });
var fractals_1 = require("./generative/fractals");
Object.defineProperty(exports, "Mandelbrot", { enumerable: true, get: function () { return fractals_1.Mandelbrot; } });
Object.defineProperty(exports, "LogisticMap", { enumerable: true, get: function () { return fractals_1.LogisticMap; } });
var minimalism_1 = require("./generative/minimalism");
Object.defineProperty(exports, "MinimalismProcess", { enumerable: true, get: function () { return minimalism_1.MinimalismProcess; } });
Object.defineProperty(exports, "Tintinnabuli", { enumerable: true, get: function () { return minimalism_1.Tintinnabuli; } });
// Analysis
var analysis_1 = require("./analysis");
Object.defineProperty(exports, "MusicalAnalysis", { enumerable: true, get: function () { return analysis_1.MusicalAnalysis; } });
// I/O and Conversion
var conversion_1 = require("./io/jmon/conversion");
Object.defineProperty(exports, "JMonConverter", { enumerable: true, get: function () { return conversion_1.JMonConverter; } });
// Utilities
var music_1 = require("./utils/music");
Object.defineProperty(exports, "MusicUtils", { enumerable: true, get: function () { return music_1.MusicUtils; } });
// Import for grouped exports
const Scale_2 = require("./music/theory/Scale");
const Progression_2 = require("./music/theory/Progression");
const harmony_2 = require("./music/harmony");
const rhythm_2 = require("./music/rhythm");
const motifs_2 = require("./music/motifs");
const gaussian_processes_2 = require("./generative/gaussian-processes");
const cellular_automata_2 = require("./generative/cellular-automata");
const polyloops_2 = require("./generative/polyloops");
const genetic_2 = require("./generative/genetic");
const walks_2 = require("./generative/walks");
const fractals_2 = require("./generative/fractals");
const minimalism_2 = require("./generative/minimalism");
// Create grouped exports for convenience
exports.dj = {
    Scale: Scale_2.Scale,
    Progression: Progression_2.Progression,
    Voice: harmony_2.Voice,
    Rhythm: rhythm_2.Rhythm,
    MotifBank: motifs_2.MotifBank,
    GaussianProcess: gaussian_processes_2.GaussianProcessRegressor,
    CellularAutomata: cellular_automata_2.CellularAutomata,
    Polyloop: polyloops_2.Polyloop,
    GeneticAlgorithm: genetic_2.GeneticAlgorithm,
    RandomWalk: walks_2.RandomWalk,
    Fractals: { Mandelbrot: fractals_2.Mandelbrot, LogisticMap: fractals_2.LogisticMap },
    MinimalismProcess: minimalism_2.MinimalismProcess
};
exports.viz = null; // Visualization disabled in Node.js build
//# sourceMappingURL=index.js.map