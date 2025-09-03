/**
 * Definitions of available ornament types and their requirements
 */
export const ORNAMENT_TYPES = {
    'grace_note': {
        description: 'Single note before the main note',
        parameters: {
            graceNoteType: {
                type: 'string',
                enum: ['acciaccatura', 'appoggiatura'],
                default: 'acciaccatura',
                description: 'Type of grace note'
            },
            gracePitches: {
                type: 'array',
                optional: true,
                description: 'List of specific pitches for the grace note'
            }
        }
    },
    'trill': {
        description: 'Rapid alternation between main note and auxiliary note',
        parameters: {
            by: {
                type: 'number',
                default: 1.0,
                description: 'Pitch step for the trill'
            },
            trillRate: {
                type: 'number',
                default: 0.125,
                description: 'Duration of each individual note in the trill'
            }
        }
    },
    'mordent': {
        description: 'Quick alternation with note above or below',
        parameters: {
            by: {
                type: 'number',
                default: 1.0,
                description: 'Pitch step for the mordent'
            }
        }
    },
    'arpeggio': {
        description: 'Notes played in sequence',
        parameters: {
            arpeggioDegrees: {
                type: 'array',
                optional: true,
                description: 'Degrees in the scale for the arpeggio'
            }
        }
    },
    'slide': {
        description: 'Continuous slide between notes',
        parameters: {
            slideLength: {
                type: 'number',
                default: 4.0,
                description: 'Length of the slide'
            }
        }
    }
};