/**
 * Articulation System for JMON
 * Handles articulation application with automatic validation and synchronization
 */

export class Articulation {
    /**
     * Available articulation types and their requirements
     */
    static ARTICULATION_TYPES = {
        // Simple articulations (direct property assignment)
        'staccato': { 
            complex: false, 
            description: 'Shortens note duration to ~50%' 
        },
        'accent': { 
            complex: false, 
            description: 'Increases note velocity/emphasis' 
        },
        'tenuto': { 
            complex: false, 
            description: 'Holds note for full duration with emphasis' 
        },
        'legato': { 
            complex: false, 
            description: 'Smooth connection between notes' 
        },
        'marcato': { 
            complex: false, 
            description: 'Strong accent with slight separation' 
        },
        
        // Complex articulations (require API with parameters)
        'glissando': { 
            complex: true, 
            requiredParams: ['target'], 
            description: 'Smooth slide from note to target pitch' 
        },
        'portamento': { 
            complex: true, 
            requiredParams: ['target'], 
            optionalParams: ['curve', 'speed'],
            description: 'Expressive slide between pitches' 
        },
        'bend': { 
            complex: true, 
            requiredParams: ['amount'], 
            optionalParams: ['curve', 'returnToOriginal'],
            description: 'Pitch bend up or down in cents' 
        },
        'vibrato': { 
            complex: true, 
            optionalParams: ['rate', 'depth', 'delay'],
            description: 'Periodic pitch variation' 
        },
        'tremolo': { 
            complex: true, 
            optionalParams: ['rate', 'depth'],
            description: 'Rapid volume variation' 
        },
        'crescendo': { 
            complex: true, 
            requiredParams: ['endVelocity'], 
            optionalParams: ['curve'],
            description: 'Gradual volume increase' 
        },
        'diminuendo': { 
            complex: true, 
            requiredParams: ['endVelocity'], 
            optionalParams: ['curve'],
            description: 'Gradual volume decrease' 
        }
    };

    /**
     * Add articulation to a note in a sequence
     * @param {Array} sequence - The note sequence
     * @param {string} articulationType - Type of articulation
     * @param {number} noteIndex - Index of note to articulate
     * @param {Object} params - Parameters for complex articulations
     * @returns {Object} Result with success status and any warnings
     */
    static addArticulation(sequence, articulationType, noteIndex, params = {}) {
        const result = {
            success: false,
            warnings: [],
            errors: []
        };

        // Validate inputs
        if (!Array.isArray(sequence)) {
            result.errors.push('Sequence must be an array');
            return result;
        }

        if (noteIndex < 0 || noteIndex >= sequence.length) {
            result.errors.push(`Note index ${noteIndex} out of bounds (sequence length: ${sequence.length})`);
            return result;
        }

        const articulationDef = this.ARTICULATION_TYPES[articulationType];
        if (!articulationDef) {
            result.errors.push(`Unknown articulation type: ${articulationType}`);
            return result;
        }

        const note = sequence[noteIndex];
        if (!note || typeof note !== 'object') {
            result.errors.push(`Invalid note at index ${noteIndex}`);
            return result;
        }

        // Handle simple articulations
        if (!articulationDef.complex) {
            note.articulation = articulationType;
            result.success = true;
            return result;
        }

        // Handle complex articulations
        return this._addComplexArticulation(note, articulationType, articulationDef, params, result);
    }

    /**
     * Add complex articulation with parameter validation and synchronization
     */
    static _addComplexArticulation(note, articulationType, articulationDef, params, result) {
        // Validate required parameters
        if (articulationDef.requiredParams) {
            for (const param of articulationDef.requiredParams) {
                if (!(param in params)) {
                    result.errors.push(`Missing required parameter '${param}' for ${articulationType}`);
                    return result;
                }
            }
        }

        // Apply articulation based on type
        switch (articulationType) {
            case 'glissando':
            case 'portamento':
                return this._applyGlissando(note, articulationType, params, result);
                
            case 'bend':
                return this._applyBend(note, params, result);
                
            case 'vibrato':
                return this._applyVibrato(note, params, result);
                
            case 'tremolo':
                return this._applyTremolo(note, params, result);
                
            case 'crescendo':
            case 'diminuendo':
                return this._applyDynamicChange(note, articulationType, params, result);
                
            default:
                result.errors.push(`Complex articulation ${articulationType} not implemented`);
                return result;
        }
    }

    /**
     * Apply glissando/portamento articulation
     */
    static _applyGlissando(note, type, params, result) {
        note.articulation = type;
        note.glissTarget = params.target;
        
        // Add to modulations for synchronization
        if (!note.modulations) note.modulations = [];
        
        const modulation = {
            type: 'pitch',
            subtype: type,
            target: params.target,
            curve: params.curve || 'linear',
            timing: 'note_duration'
        };
        
        if (params.speed !== undefined) {
            modulation.speed = params.speed;
        }
        
        // Remove existing pitch modulations of same type to avoid conflicts
        note.modulations = note.modulations.filter(mod => 
            !(mod.type === 'pitch' && mod.subtype === type)
        );
        
        note.modulations.push(modulation);
        
        result.success = true;
        result.warnings.push(`Added ${type} modulation synchronized with articulation`);
        return result;
    }

    /**
     * Apply pitch bend articulation
     */
    static _applyBend(note, params, result) {
        note.articulation = 'bend';
        
        if (!note.modulations) note.modulations = [];
        
        const modulation = {
            type: 'pitch',
            subtype: 'bend',
            amount: params.amount, // in cents
            curve: params.curve || 'linear',
            timing: params.returnToOriginal ? 'note_duration' : 'sustain',
            returnToOriginal: params.returnToOriginal ?? true
        };
        
        // Remove existing pitch bends
        note.modulations = note.modulations.filter(mod => 
            !(mod.type === 'pitch' && mod.subtype === 'bend')
        );
        
        note.modulations.push(modulation);
        
        result.success = true;
        result.warnings.push('Added pitch bend modulation synchronized with articulation');
        return result;
    }

    /**
     * Apply vibrato articulation
     */
    static _applyVibrato(note, params, result) {
        note.articulation = 'vibrato';
        
        if (!note.modulations) note.modulations = [];
        
        const modulation = {
            type: 'pitch',
            subtype: 'vibrato',
            rate: params.rate || 5, // Hz
            depth: params.depth || 50, // cents
            delay: params.delay || 0, // seconds
            timing: 'note_duration'
        };
        
        // Remove existing vibrato
        note.modulations = note.modulations.filter(mod => 
            !(mod.type === 'pitch' && mod.subtype === 'vibrato')
        );
        
        note.modulations.push(modulation);
        
        result.success = true;
        result.warnings.push('Added vibrato modulation synchronized with articulation');
        return result;
    }

    /**
     * Apply tremolo articulation
     */
    static _applyTremolo(note, params, result) {
        note.articulation = 'tremolo';
        
        if (!note.modulations) note.modulations = [];
        
        const modulation = {
            type: 'amplitude',
            subtype: 'tremolo',
            rate: params.rate || 8, // Hz
            depth: params.depth || 0.3, // 0-1
            timing: 'note_duration'
        };
        
        // Remove existing tremolo
        note.modulations = note.modulations.filter(mod => 
            !(mod.type === 'amplitude' && mod.subtype === 'tremolo')
        );
        
        note.modulations.push(modulation);
        
        result.success = true;
        result.warnings.push('Added tremolo modulation synchronized with articulation');
        return result;
    }

    /**
     * Apply dynamic change (crescendo/diminuendo)
     */
    static _applyDynamicChange(note, type, params, result) {
        note.articulation = type;
        
        if (!note.modulations) note.modulations = [];
        
        const modulation = {
            type: 'amplitude',
            subtype: type,
            startVelocity: note.velocity || 0.8,
            endVelocity: params.endVelocity,
            curve: params.curve || 'linear',
            timing: 'note_duration'
        };
        
        // Remove existing dynamic changes
        note.modulations = note.modulations.filter(mod => 
            !(mod.type === 'amplitude' && (mod.subtype === 'crescendo' || mod.subtype === 'diminuendo'))
        );
        
        note.modulations.push(modulation);
        
        result.success = true;
        result.warnings.push(`Added ${type} modulation synchronized with articulation`);
        return result;
    }

    /**
     * Remove articulation from a note
     */
    static removeArticulation(sequence, noteIndex) {
        if (!Array.isArray(sequence) || noteIndex < 0 || noteIndex >= sequence.length) {
            return { success: false, error: 'Invalid sequence or note index' };
        }

        const note = sequence[noteIndex];
        if (!note || typeof note !== 'object') {
            return { success: false, error: 'Invalid note' };
        }

        const articulationType = note.articulation;
        
        // Remove articulation property
        delete note.articulation;
        delete note.glissTarget;
        
        // Remove related modulations
        if (note.modulations && articulationType) {
            const articulationDef = this.ARTICULATION_TYPES[articulationType];
            if (articulationDef && articulationDef.complex) {
                note.modulations = note.modulations.filter(mod => mod.subtype !== articulationType);
                if (note.modulations.length === 0) {
                    delete note.modulations;
                }
            }
        }

        return { 
            success: true, 
            removed: articulationType,
            message: `Removed ${articulationType} articulation and related modulations`
        };
    }

    /**
     * Validate articulation consistency in a sequence
     */
    static validateSequence(sequence) {
        const issues = [];
        
        sequence.forEach((note, index) => {
            if (note.articulation) {
                const articulationDef = this.ARTICULATION_TYPES[note.articulation];
                
                if (!articulationDef) {
                    issues.push({
                        type: 'unknown_articulation',
                        noteIndex: index,
                        articulation: note.articulation,
                        message: `Unknown articulation type: ${note.articulation}`
                    });
                    return;
                }

                // Check for missing required properties
                if (note.articulation === 'glissando' && !note.glissTarget) {
                    issues.push({
                        type: 'missing_parameter',
                        noteIndex: index,
                        articulation: note.articulation,
                        message: 'Glissando missing glissTarget parameter'
                    });
                }

                // Check modulation synchronization
                if (articulationDef.complex && note.modulations) {
                    const hasRelatedModulation = note.modulations.some(mod => 
                        mod.subtype === note.articulation
                    );
                    
                    if (!hasRelatedModulation) {
                        issues.push({
                            type: 'modulation_sync',
                            noteIndex: index,
                            articulation: note.articulation,
                            message: `Complex articulation ${note.articulation} should have corresponding modulation`
                        });
                    }
                }
            }
        });

        return {
            valid: issues.length === 0,
            issues: issues
        };
    }

    /**
     * Get available articulation types with descriptions
     */
    static getAvailableTypes() {
        return Object.entries(this.ARTICULATION_TYPES).map(([type, def]) => ({
            type,
            complex: def.complex,
            description: def.description,
            requiredParams: def.requiredParams || [],
            optionalParams: def.optionalParams || []
        }));
    }
}

// Export for use in sequences
export function addArticulation(sequence, articulationType, noteIndex, params) {
    return Articulation.addArticulation(sequence, articulationType, noteIndex, params);
}

export function removeArticulation(sequence, noteIndex) {
    return Articulation.removeArticulation(sequence, noteIndex);
}

export function validateArticulations(sequence) {
    return Articulation.validateSequence(sequence);
}