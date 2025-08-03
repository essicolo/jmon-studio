/**
 * JMON Studio - Complete music composition and algorithmic generation library
 * 
 * Combines JMON format conversion with powerful algorithmic composition tools
 */

// Format exports
export { JmonTone as default } from './format/JmonTone';
export { JmonTone } from './format/JmonTone';

// Algorithm exports (re-export from djalgojs)
export * from './algorithms';

// Type exports
export * from './types/jmon';

// Convenience grouped exports
import { JmonTone } from './format/JmonTone';
import { dj as algorithmsDj } from './algorithms';

export const jmon = {
    JmonTone,
    // Add other format exports when converted
};

export const dj = algorithmsDj;

export const VERSION = '1.0.0';