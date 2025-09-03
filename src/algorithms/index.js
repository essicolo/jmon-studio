// Constants
import { MusicTheoryConstants } from './constants/MusicTheoryConstants.js';

// Theory imports
import { harmony } from './theory/harmony/index.js';
import { rhythm } from './theory/rhythm/index.js';
import { MotifBank } from './theory/motifs/index.js';

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

// Theory namespace
export const theory = {
    harmony,
    rhythm,
    motifs: {
        MotifBank
    }
};

// Constants namespace
export const constants = {
    theory: MusicTheoryConstants
};

// Generative namespace
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

// Analysis namespace
export const analysis = {
    ...analysisModule
};

// Utils namespace
export const utils = {
    ...Utils
};
