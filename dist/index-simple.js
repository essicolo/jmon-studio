"use strict";
/**
 * JMON Studio - Simple build without visualization dependencies
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.dj = exports.jmon = exports.MusicalAnalysis = exports.Tintinnabuli = exports.MinimalismProcess = exports.LogisticMap = exports.Mandelbrot = exports.RandomWalk = exports.GeneticAlgorithm = exports.Polyloop = exports.CellularAutomata = exports.Periodic = exports.RationalQuadratic = exports.RBF = exports.KernelGenerator = exports.GaussianProcessRegressor = exports.MotifBank = exports.GeneticRhythm = exports.AdvancedRhythm = exports.Rhythm = exports.Ornament = exports.Voice = exports.Progression = exports.Scale = exports.MusicTheoryConstants = exports.JmonTone = exports.default = void 0;
// Format exports
var JmonTone_1 = require("./format/JmonTone");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return JmonTone_1.JmonTone; } });
var JmonTone_2 = require("./format/JmonTone");
Object.defineProperty(exports, "JmonTone", { enumerable: true, get: function () { return JmonTone_2.JmonTone; } });
__exportStar(require("./format"), exports);
// Core algorithm exports (without visualization)
var MusicTheoryConstants_1 = require("./algorithms/music/theory/MusicTheoryConstants");
Object.defineProperty(exports, "MusicTheoryConstants", { enumerable: true, get: function () { return MusicTheoryConstants_1.MusicTheoryConstants; } });
var Scale_1 = require("./algorithms/music/theory/Scale");
Object.defineProperty(exports, "Scale", { enumerable: true, get: function () { return Scale_1.Scale; } });
var Progression_1 = require("./algorithms/music/theory/Progression");
Object.defineProperty(exports, "Progression", { enumerable: true, get: function () { return Progression_1.Progression; } });
var harmony_1 = require("./algorithms/music/harmony");
Object.defineProperty(exports, "Voice", { enumerable: true, get: function () { return harmony_1.Voice; } });
Object.defineProperty(exports, "Ornament", { enumerable: true, get: function () { return harmony_1.Ornament; } });
var rhythm_1 = require("./algorithms/music/rhythm");
Object.defineProperty(exports, "Rhythm", { enumerable: true, get: function () { return rhythm_1.Rhythm; } });
Object.defineProperty(exports, "AdvancedRhythm", { enumerable: true, get: function () { return rhythm_1.AdvancedRhythm; } });
Object.defineProperty(exports, "GeneticRhythm", { enumerable: true, get: function () { return rhythm_1.GeneticRhythm; } });
var motifs_1 = require("./algorithms/music/motifs");
Object.defineProperty(exports, "MotifBank", { enumerable: true, get: function () { return motifs_1.MotifBank; } });
var gaussian_processes_1 = require("./algorithms/generative/gaussian-processes");
Object.defineProperty(exports, "GaussianProcessRegressor", { enumerable: true, get: function () { return gaussian_processes_1.GaussianProcessRegressor; } });
Object.defineProperty(exports, "KernelGenerator", { enumerable: true, get: function () { return gaussian_processes_1.KernelGenerator; } });
var kernels_1 = require("./algorithms/generative/gaussian-processes/kernels");
Object.defineProperty(exports, "RBF", { enumerable: true, get: function () { return kernels_1.RBF; } });
Object.defineProperty(exports, "RationalQuadratic", { enumerable: true, get: function () { return kernels_1.RationalQuadratic; } });
Object.defineProperty(exports, "Periodic", { enumerable: true, get: function () { return kernels_1.Periodic; } });
var cellular_automata_1 = require("./algorithms/generative/cellular-automata");
Object.defineProperty(exports, "CellularAutomata", { enumerable: true, get: function () { return cellular_automata_1.CellularAutomata; } });
var polyloops_1 = require("./algorithms/generative/polyloops");
Object.defineProperty(exports, "Polyloop", { enumerable: true, get: function () { return polyloops_1.Polyloop; } });
var genetic_1 = require("./algorithms/generative/genetic");
Object.defineProperty(exports, "GeneticAlgorithm", { enumerable: true, get: function () { return genetic_1.GeneticAlgorithm; } });
var walks_1 = require("./algorithms/generative/walks");
Object.defineProperty(exports, "RandomWalk", { enumerable: true, get: function () { return walks_1.RandomWalk; } });
var fractals_1 = require("./algorithms/generative/fractals");
Object.defineProperty(exports, "Mandelbrot", { enumerable: true, get: function () { return fractals_1.Mandelbrot; } });
Object.defineProperty(exports, "LogisticMap", { enumerable: true, get: function () { return fractals_1.LogisticMap; } });
var minimalism_1 = require("./algorithms/generative/minimalism");
Object.defineProperty(exports, "MinimalismProcess", { enumerable: true, get: function () { return minimalism_1.MinimalismProcess; } });
Object.defineProperty(exports, "Tintinnabuli", { enumerable: true, get: function () { return minimalism_1.Tintinnabuli; } });
var analysis_1 = require("./algorithms/analysis");
Object.defineProperty(exports, "MusicalAnalysis", { enumerable: true, get: function () { return analysis_1.MusicalAnalysis; } });
// Type exports
__exportStar(require("./types/jmon"), exports);
// Convenience grouped exports
const JmonTone_3 = require("./format/JmonTone");
const Scale_2 = require("./algorithms/music/theory/Scale");
const Progression_2 = require("./algorithms/music/theory/Progression");
const harmony_2 = require("./algorithms/music/harmony");
const rhythm_2 = require("./algorithms/music/rhythm");
const motifs_2 = require("./algorithms/music/motifs");
const gaussian_processes_2 = require("./algorithms/generative/gaussian-processes");
const cellular_automata_2 = require("./algorithms/generative/cellular-automata");
const polyloops_2 = require("./algorithms/generative/polyloops");
const genetic_2 = require("./algorithms/generative/genetic");
const walks_2 = require("./algorithms/generative/walks");
const fractals_2 = require("./algorithms/generative/fractals");
const minimalism_2 = require("./algorithms/generative/minimalism");
exports.jmon = {
    JmonTone: JmonTone_3.JmonTone,
};
exports.dj = {
    // Music theory
    Scale: Scale_2.Scale,
    Progression: Progression_2.Progression,
    Voice: harmony_2.Voice,
    Rhythm: rhythm_2.Rhythm,
    MotifBank: motifs_2.MotifBank,
    // Algorithms
    GaussianProcess: gaussian_processes_2.GaussianProcessRegressor,
    CellularAutomata: cellular_automata_2.CellularAutomata,
    Polyloop: polyloops_2.Polyloop,
    GeneticAlgorithm: genetic_2.GeneticAlgorithm,
    RandomWalk: walks_2.RandomWalk,
    Fractals: {
        Mandelbrot: fractals_2.Mandelbrot,
        LogisticMap: fractals_2.LogisticMap
    },
    MinimalismProcess: minimalism_2.MinimalismProcess
};
exports.VERSION = '1.0.0';
//# sourceMappingURL=index-simple.js.map