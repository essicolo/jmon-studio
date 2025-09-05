import { JmonValidator } from './utils/jmon-validator.js';
import algorithms from './algorithms/index.js';
import { createPlayer } from './browser/music-player.js';
import { abc, midi, tonejs, wav, supercollider } from './converters/index.js';
/**
 * Validation utilitaire simple
 * @param {Object} obj - Objet JMON à valider
 * @returns {Object} { valid, errors, normalized }
 */
function validateJmon(obj) {
	const validator = new JmonValidator();
	return validator.validateAndNormalize(obj);
}

/**
 * Main render function for JMON objects
 * @param {Object} jmonObj - JMON object to render
 * @returns {HTMLElement} Player element
 */
function render(jmonObj) {
	// Basic validation and normalization
	if (!jmonObj || typeof jmonObj !== 'object') {
		console.error('[RENDER] Invalid JMON object:', jmonObj);
		throw new Error('render() requires a valid JMON object');
	}
	
	// If it's not already a JMON object, try to normalize it
	if (!jmonObj.sequences && !jmonObj.tracks && !jmonObj.format) {
		console.warn('[RENDER] Object does not appear to be JMON format, attempting normalization');
		// Try to create a minimal JMON structure
	}

	// Harmonized convert namespace
	const jm = {
		// ...existing code...
	};
	jm.converters = {
		abc,
		midi,
		tonejs,
		wav,
		supercollider
	};
	
	return createPlayer(jmonObj);
}

/**
 * Main play function for JMON objects  
 * @param {Object} jmonObj - JMON object to play
 * @returns {HTMLElement} Player element (auto-plays)
 */
function play(jmonObj) {
	// Use render logic for consistency
	const player = render(jmonObj);
	// Auto-start playback if possible
	setTimeout(() => {
		const playButton = player.querySelector('button[aria-label="Play"]') || player.querySelector('button');
		if (playButton) playButton.click();
	}, 100);
	return player;
}

/**
 * Score function - alias for render for compatibility
 * @param {Object} jmonObj - JMON object to render as score
 * @returns {HTMLElement} Player element
 */
function score(jmonObj) {
	return render(jmonObj);
}// Create the main jm object
const jm = {
    // Core functionality
    render,
    play,
    score,
    validate: validateJmon,

    // Core formats and players
    createPlayer,

    // Theory and algorithms
    theory: algorithms.theory,
    generative: algorithms.generative,
    analysis: algorithms.analysis,
    constants: algorithms.constants,

    // Utils
    utils: {
        ...algorithms.utils,
        JmonValidator
    },

    VERSION: '1.0.0'
};

// Export both default and named
export { jm };
export default jm;
