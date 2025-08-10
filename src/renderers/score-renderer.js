/**
 * Score Renderer
 * Handles visual score rendering using ABC.js
 */

// Use the comprehensive ABC converter
const JmonToAbc = require('../converters/jmon-abc');

function createScoreRenderer() {
    return {
        score: function(composition, options) {
            const { width = 400, height = 120 } = options || {};
            
            const container = document.createElement('div');
            container.style.padding = '16px';
            container.style.border = '1px solid #ddd';
            container.style.borderRadius = '8px';
            container.style.background = 'white';
            container.style.fontFamily = 'sans-serif';
            container.style.margin = '8px 0';
            container.style.width = '100%';
            
            try {
                // Create score container for ABC.js - give it more space
                const scoreDiv = document.createElement('div');
                scoreDiv.id = 'jmon-score-display';
                scoreDiv.style.width = '100%';
                scoreDiv.style.minHeight = `${height}px`;
                scoreDiv.style.overflow = 'visible';
                scoreDiv.style.border = '1px solid #eee';
                scoreDiv.style.padding = '10px';
                
                // Convert to ABC notation using comprehensive converter
                const abcNotation = JmonToAbc.convertToAbc(composition);
                
                // Use the Observable-compatible ABC.js approach
                try {
                    // Use the Observable pattern: require('https://bundle.run/abcjs@5.1.2/midi.js')
                    let abcjsPromise;
                    if (typeof require !== 'undefined') {
                        try {
                            abcjsPromise = Promise.resolve(require('https://bundle.run/abcjs@5.1.2/midi.js'));
                        } catch (e) {
                            abcjsPromise = import("https://cdn.jsdelivr.net/npm/abcjs@6.2.2/+esm");
                        }
                    } else {
                        abcjsPromise = import("https://cdn.jsdelivr.net/npm/abcjs@6.2.2/+esm");
                    }
                    
                    abcjsPromise
                        .then(abcjs => {
                            // Create notation div
                            const notation = document.createElement('div');
                            
                            // Render the ABC notation much smaller for Observable
                            abcjs.renderAbc(notation, abcNotation, {
                                responsive: 'resize',
                                staffwidth: width || 350,
                                scale: 0.6,
                                paddingtop: 5,
                                paddingbottom: 5,
                                paddingleft: 5,
                                paddingright: 5
                            });
                            
                            scoreDiv.appendChild(notation);
                        })
                        .catch(error => {
                            // Fallback to ABC notation text
                            scoreDiv.innerHTML = `
                                <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
                                    <h4>Musical Score - ABC Notation</h4>
                                    <pre style="background: white; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;">${abcNotation}</pre>
                                </div>
                            `;
                        });
                    
                } catch (renderError) {
                    // Fallback to ABC text display
                    const pre = document.createElement('pre');
                    pre.textContent = abcNotation;
                    pre.style.background = '#f8f9fa';
                    pre.style.border = '1px solid #e9ecef';
                    pre.style.borderRadius = '4px';
                    pre.style.padding = '12px';
                    pre.style.fontSize = '11px';
                    pre.style.fontFamily = 'monospace';
                    pre.style.whiteSpace = 'pre-wrap';
                    pre.style.overflowX = 'auto';
                    scoreDiv.appendChild(pre);
                }
                
                container.appendChild(scoreDiv);
                
            } catch (error) {
                container.innerHTML = `<strong>Error:</strong> ${error.message}`;
                container.style.color = '#dc2626';
            }
            
            return container;
        }
    };
}

module.exports = { createScoreRenderer };