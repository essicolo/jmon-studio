import { JmonValidator } from './utils/jmon-validator.js';
import { JmonTone } from './format/JmonTone.js';
import * as algorithms from './algorithms/index.js';
import { createPlayer } from './browser/music-player.js';

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
		jmonObj = {
			format: 'jmonTone',
			version: '1.0',
			bpm: jmonObj.bpm || 120,
			sequences: jmonObj.sequences || jmonObj.tracks || []
		};
	}
	
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
}// Export structured API
export const jm = {
    // Core functionality
    render,
    play,
    score,
    validate: validateJmon,

    // Core formats and players
    Tone: JmonTone,
    createPlayer,

    // Music theory and algorithms
    theory: algorithms.theory,
    generative: algorithms.generative,
    analysis: algorithms.analysis,

    // Constants and utilities
    constants: algorithms.constants,
    utils: {
        ...algorithms.utils,
        JmonValidator
    },

    VERSION: '1.0.0'
};

export default jm;
