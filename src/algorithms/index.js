// Constants
import { MusicTheoryConstants } from './constants/MusicTheoryConstants.js';

// Theory imports
import * as harmonyModule from './theory/harmony/index.js';
import * as rhythmModule from './theory/rhythm/index.js';
import * as motifsModule from './theory/motifs/index.js';

// Generative algorithm imports
import { GaussianProcessRegressor } from './generative/gaussian-processes/index.js';
import { CellularAutomata } from './generative/cellular-automata/index.js';
import { Polyloop } from './generative/polyloops/index.js';
import { GeneticAlgorithm } from './generative/genetic/index.js';
import { RandomWalk } from './generative/walks/index.js';
import { Mandelbrot, LogisticMap } from './generative/fractals/index.js';
import { MinimalismProcess, Tintinnabuli } from './generative/minimalism/index.js';

// Analysis imports
import * as analysisModule from './analysis/index.js';

// Utils imports
import * as Utils from './utils.js';

// Organized exports
export const constants = {
    theory: MusicTheoryConstants
};

export const theory = {
    harmony: {
        Scale: harmonyModule.Scale,
        Progression: harmonyModule.Progression,
        Voice: harmonyModule.Voice,
        Ornament: harmonyModule.Ornament,
        Articulation: harmonyModule.Articulation,
        addArticulation: harmonyModule.addArticulation,
        removeArticulation: harmonyModule.removeArticulation,
        validateArticulations: harmonyModule.validateArticulations
    },
    rhythm: {
        Rhythm: rhythmModule.Rhythm,
        isorhythm: rhythmModule.isorhythm,
        beatcycle: rhythmModule.beatcycle
    },
    motifs: {
        MotifBank: motifsModule.MotifBank
    }
};

export const generative = {
    gaussian: {
        Regressor: GaussianProcessRegressor
    },
    automata: {
        Cellular: CellularAutomata
    },
    loops: {
        Poly: Polyloop
    },
    genetic: {
        Algorithm: GeneticAlgorithm
    },
    walks: {
        Random: RandomWalk
    },
    fractals: {
        Mandelbrot,
        LogisticMap
    },
    minimalism: {
        Process: MinimalismProcess,
        Tintinnabuli
    }
};

export const analysis = {
    ...analysisModule
};

export const utils = {
    ...Utils
};
