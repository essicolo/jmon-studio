import { JmonValidator } from './utils/jmon-validator.js';
/**
 * Validation utilitaire simple
 * @param {Object} obj - Objet JMON à valider
 * @returns {Object} { valid, errors, normalized }
 */
export function validateJmon(obj) {
	const validator = new JmonValidator();
	return validator.validateAndNormalize(obj);
}
// Validation API
export { JmonValidator } from './utils/jmon-validator.js';
/**
 * JMON Studio - Complete music composition and algorithmic generation library
 * 
 * Combines JMON format conversion with powerful algorithmic composition tools
 */

// Format exports
export { JmonTone } from './format/JmonTone.js';

// Algorithm exports (re-export from djalgojs)
export * from './algorithms/index.js';

// Browser components
export { createPlayer } from './browser/music-player.js';

// Type exports (converted to JSDoc comments)
// Types are now documented in JSDoc format within the corresponding .js files

// Optionally, export dj and VERSION if needed elsewhere
export { dj } from './algorithms/index.js';
export const VERSION = '1.0.0';