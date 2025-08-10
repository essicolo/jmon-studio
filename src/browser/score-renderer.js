/**
 * Score Renderer
 * Handles visual score rendering using ABC.js
 */

import { toAbc } from './abc-converter.js';

export function score(composition, options = {}) {
    const { width = 800, scale = 1.0 } = options;
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.overflow = 'hidden';
    
    const abc = toAbc(composition);
    
    // Only work in Observable environment with require()
    if (typeof require !== 'undefined') {
        require('https://bundle.run/abcjs@5.1.2/midi.js')
            .then(abcjs => {
                abcjs.renderAbc(container, abc, {
                    responsive: 'resize',
                    scale: scale,
                    staffwidth: width,
                });
            })
            .catch(error => {
                container.innerHTML = `<p>Error rendering score: ${error.message}</p>`;
            });
    } else {
        container.innerHTML = '<pre>' + abc + '</pre>';
    }
    
    return container;
}