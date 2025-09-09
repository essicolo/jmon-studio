import { JmonValidator } from './utils/jmon-validator.js';
import algorithms from './algorithms/index.js';
import { createPlayer } from './browser/music-player.js';
import { abc, midi, tonejs, wav, supercollider } from './converters/index.js';
import * as jmonUtils from './utils/jmon-utils.js';
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
 * @param {Object} options - Player options
 * @returns {HTMLElement} Player element
 */
function render(jmonObj, options = {}) {
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

	return createPlayer(jmonObj, options);
}

/**
 * Main play function for JMON objects  
 * @param {Object} jmonObj - JMON object to play
 * @param {Object} options - Player options
 * @returns {HTMLElement} Player element (auto-plays)
 */
function play(jmonObj, options = {}) {
	// Enable autoplay by default for play function
	const playOptions = { autoplay: true, ...options };
	return createPlayer(jmonObj, playOptions);
}

/**
 * Score function - renders ABC notation as visual musical score
 * @param {Object} jmonObj - JMON object to render as score
 * @param {Object} options - Score rendering options
 * @returns {HTMLElement} Score container element
 */
function score(jmonObj, options = {}) {
	const {
		scale = 0.9,
		staffwidth,
		showAbc = true,
		responsive = 'resize',
		abcOptions = {}
	} = options;

	// Generate ABC notation with options
	const abcNotation = abc(jmonObj, abcOptions);
	
	// Create container
	const scoreContainer = document.createElement('div');
	scoreContainer.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;

	// Create div for rendered notation
	const notationDiv = document.createElement('div');
	notationDiv.id = `rendered-score-${Date.now()}`;
	notationDiv.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`;
	scoreContainer.appendChild(notationDiv);

	// Add ABC text as collapsible if requested
	if (showAbc) {
		const details = document.createElement('details');
		details.style.marginTop = '15px';
		
		const summary = document.createElement('summary');
		summary.textContent = 'ABC Notation (click to expand)';
		summary.style.cursor = 'pointer';
		details.appendChild(summary);
		
		const pre = document.createElement('pre');
		pre.textContent = abcNotation;
		pre.style.cssText = `
			background: #f5f5f5;
			padding: 10px;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 12px;
		`;
		details.appendChild(pre);
		scoreContainer.appendChild(details);
	}

	// Render the musical notation using ABCJS
	if (typeof ABCJS !== 'undefined') {
		try {
			// Determine staff width from container if not provided
			const width = staffwidth || null;
			const params = { responsive, scale };
			if (width) params.staffwidth = width;
			ABCJS.renderAbc(notationDiv, abcNotation, params);
			
			// Check if anything was actually rendered
			setTimeout(() => {
				if (notationDiv.children.length === 0 || notationDiv.innerHTML.trim() === '') {
					// Try alternative rendering method
					try {
						ABCJS.renderAbc(notationDiv, abcNotation);
						
						if (notationDiv.children.length === 0) {
							notationDiv.innerHTML = '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' + abcNotation + '</pre>';
						}
					} catch (e) {
						notationDiv.innerHTML = '<p>Error with alternative rendering</p><pre>' + abcNotation + '</pre>';
					}
				}
			}, 200);
		} catch (error) {
			console.error('Error rendering with ABCJS:', error);
			notationDiv.innerHTML = '<p>Error rendering notation</p><pre>' + abcNotation + '</pre>';
		}
	} else {
		notationDiv.innerHTML = '<p>ABCJS not available - showing text notation only</p><pre>' + abcNotation + '</pre>';
	}

	return scoreContainer;
}// Create the main jm object
const jm = {
    // Core functionality
    render,
    play,
    score,
    validate: validateJmon,

    // Core formats and players
    createPlayer,

    // Converters
    converters: {
        abc,
        midi,
        tonejs,
        wav,
        supercollider
    },

    // Theory and algorithms
    theory: algorithms.theory,
    generative: algorithms.generative,
    analysis: algorithms.analysis,
    constants: algorithms.constants,

    // Utils
    utils: {
        ...algorithms.utils,
        JmonValidator,
        // Expose utility helpers
        quantize: (val, grid, mode) => import('./utils/quantize.js').then(m => m.quantize(val, grid, mode)),
        quantizeEvents: async (events, opts) => (await import('./utils/quantize.js')).quantizeEvents(events, opts),
        quantizeTrack: async (track, opts) => (await import('./utils/quantize.js')).quantizeTrack(track, opts),
        quantizeComposition: async (comp, opts) => (await import('./utils/quantize.js')).quantizeComposition(comp, opts),
        // JMON utilities - official format helpers
        jmon: jmonUtils
    },

    VERSION: '1.0.0'
};

// Add visualization namespace with lazy-loaded loop visualizer
const visualization = {
    loops: {
        async plotLoops(loops, measureLength = 4, pulse = 1/4, colors = null, options = {}) {
            const { LoopVisualizer } = await import('./algorithms/visualization/loops/LoopVisualizer.js');
            return LoopVisualizer.plotLoops(loops, measureLength, pulse, colors, options);
        }
    }
};

// Extend jm with visualization namespace
jm.visualization = visualization;

// Export both default and named
export { jm };
export default jm;
