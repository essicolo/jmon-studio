// Import all components
import { Scale } from './Scale.js';
import { Progression } from './Progression.js';
import { Voice } from './Voice.js';
import { Ornament } from './Ornament.js';
import { Articulation, addArticulation, removeArticulation, validateArticulations } from './Articulation.js';

// Export as a namespace object
export const harmony = {
    Scale,
    Progression,
    Voice,
    Ornament,
    Articulation,
    addArticulation,
    removeArticulation,
    validateArticulations
};

// Also export individual components for internal use
export {
    Scale,
    Progression,
    Voice,
    Ornament,
    Articulation,
    addArticulation,
    removeArticulation,
    validateArticulations
};
