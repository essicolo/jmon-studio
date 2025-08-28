/**
 * Unified JMON (JSON Music Object Notation) JavaScript type definitions
 * Comprehensive JSDoc types combining legacy and modern JMON specifications
 * 
 * These types are converted from TypeScript interfaces to JSDoc comments
 * for use in JavaScript code.
 */

// === Core Time and Duration Types (now documented as JSDoc) ===
/**
 * @typedef {string} MusicalTime - "bars:beats:ticks" format (e.g., "2:1:240")
 */

/**
 * @typedef {string} NoteDuration - "4n", "8n", "2t", etc. or "bars:beats:ticks"
 */

/**
 * @typedef {number} LegacyTime - Deprecated numeric time
 */

/**
 * @typedef {MusicalTime|NoteDuration|LegacyTime} FlexibleTime - Flexible time representation
 */

/**
 * @typedef {string|number|Array<string|number>} NoteValue - Note value representation
 */

/**
 * @typedef {string} KeySignature - Key signature (e.g., "C", "Am", "F#")
 */

/**
 * @typedef {string} TimeSignature - Time signature (e.g., "4/4", "3/4")
 */

/**
 * @typedef {Object} ModulationEvent
 * @property {'cc'|'pitchBend'|'aftertouch'} type - Modulation type
 * @property {number} [controller] - MIDI controller number (required for CC)
 * @property {number} value - Modulation value
 * @property {FlexibleTime} time - Time relative to note start
 */

/**
 * @typedef {Object} JmonModulation
 * @property {string} target - Modulation target
 * @property {string} type - Modulation type
 * @property {number} [frequency] - Modulation frequency
 * @property {number} [depth] - Modulation depth
 */

/**
 * @typedef {Object} JmonNote
 * @property {FlexibleTime} [time] - Note timing
 * @property {NoteValue} [note] - Note value(s)
 * @property {number} [pitch] - MIDI pitch (legacy)
 * @property {NoteDuration|MusicalTime|number} duration - Note duration
 * @property {number} [velocity] - Velocity (0-1 modern, 0-127 legacy)
 * @property {string} [articulation] - Articulation style
 * @property {number} [glissTarget] - Glissando target
 * @property {number} [microtuning] - Microtuning adjustment
 * @property {number} [channel] - MIDI channel (0-15)
 * @property {number} [pan] - Pan position
 * @property {JmonEffect[]} [effects] - Effects array
 * @property {JmonModulation[]} [modulation] - Modulation array
 * @property {ModulationEvent[]} [modulations] - Modulation events
 */

/**
 * @typedef {Object} JmonEffect
 * @property {string} type - Effect type
 */

/**
 * @typedef {Object} Effect
 * @property {string} type - Effect type
 */

/**
 * @typedef {Object} JmonInstrument
 * @property {string} type - Instrument type
 * @property {*} [oscillator] - Oscillator configuration
 * @property {*} [envelope] - Envelope configuration
 */

/**
 * @typedef {Object} SynthConfig
 * @property {'Synth'|'PolySynth'|'MonoSynth'|'AMSynth'|'FMSynth'|'DuoSynth'|'PluckSynth'|'NoiseSynth'|'Sampler'} type - Synth type
 * @property {Object} [options] - Synth options
 * @property {string} [presetRef] - Preset reference
 * @property {'vibrato'|'tremolo'|'glissando'|'filter'} [modulationTarget] - Modulation target
 */

// === Audio Graph ===
/**
 * @typedef {Object} AudioNode
 * @property {string} id - Node ID
 * @property {'Synth'|'PolySynth'|'MonoSynth'|'AMSynth'|'FMSynth'|'DuoSynth'|'PluckSynth'|'NoiseSynth'|'Sampler'|'Filter'|'AutoFilter'|'Reverb'|'FeedbackDelay'|'PingPongDelay'|'Delay'|'Chorus'|'Phaser'|'Tremolo'|'Vibrato'|'AutoWah'|'Distortion'|'Chebyshev'|'BitCrusher'|'Compressor'|'Limiter'|'Gate'|'FrequencyShifter'|'PitchShift'|'JCReverb'|'Freeverb'|'StereoWidener'|'MidSideCompressor'|'Destination'} type - Audio node type
 * @property {Object.<string, *>} options - Node options
 * @property {string} [target] - Target node
 * @property {string} [presetRef] - Preset reference
 */

// === Tracks and Sequences ===
/**
 * @typedef {Object} JmonTrack
 * @property {string} [name] - Track name
 * @property {JmonInstrument} [instrument] - Track instrument
 * @property {JmonEffect[]} [effects] - Track effects
 * @property {JmonModulation[]} [modulation] - Track modulation
 * @property {JmonNote[]} [sequence] - Legacy sequence property
 * @property {string|number} [loop] - Loop configuration
 * @property {JmonNote[]} [notes] - Modern notes property
 */

/**
 * @typedef {Object} JMonSequence
 * @property {string} label - Sequence label
 * @property {number} [midiChannel] - MIDI channel (0-15)
 * @property {SynthConfig} [synth] - Synth configuration
 * @property {string} [synthRef] - Synth reference
 * @property {JmonNote[]} notes - Sequence notes
 * @property {boolean|string} [loop] - Loop configuration
 * @property {MusicalTime} [loopEnd] - Loop end time
 * @property {Effect[]} [effects] - Sequence effects
 */

// === Tempo and Time Signature Changes ===
/**
 * @typedef {Object} TempoChange
 * @property {FlexibleTime} time - Change time
 * @property {number} bpm - BPM value (20-400)
 */

/**
 * @typedef {Object} KeySignatureChange
 * @property {FlexibleTime} time - Change time
 * @property {KeySignature} keySignature - Key signature
 */

/**
 * @typedef {Object} TimeSignatureChange
 * @property {FlexibleTime} time - Change time
 * @property {TimeSignature} timeSignature - Time signature
 */

// === Transport and Timing ===
/**
 * @typedef {Object} Transport
 * @property {FlexibleTime} [startOffset] - Start offset
 * @property {boolean} [globalLoop] - Global loop enabled
 * @property {MusicalTime} [globalLoopEnd] - Global loop end
 * @property {number} [swing] - Swing amount (0-1)
 */

// === Metadata ===
/**
 * @typedef {Object} Metadata
 * @property {string} [name] - Composition name
 * @property {string} [title] - Legacy title
 * @property {string} [author] - Author name
 * @property {string} [composer] - Legacy composer
 * @property {string} [description] - Description
 */

// === Automation and Annotations ===
/**
 * @typedef {Object} AutomationEvent
 * @property {string} target - Target parameter
 * @property {FlexibleTime} time - Event time
 * @property {number} value - Target value
 */

/**
 * @typedef {Object} Annotation
 * @property {string} text - Annotation text
 * @property {FlexibleTime} time - Annotation time
 * @property {string} [type] - Annotation type
 * @property {NoteDuration|MusicalTime|number} [duration] - Duration
 */

// === Presets and Configuration ===
/**
 * @typedef {Object} CustomPreset
 * @property {string} id - Preset ID
 * @property {string} type - Preset type
 * @property {Object.<string, *>} options - Preset options
 */

/**
 * @typedef {Object} ConverterHints
 * @property {Object.<string, Object>} [tone] - Tone.js hints
 * @property {Object} [midi] - MIDI hints
 * @property {number} [midi.channel] - MIDI channel (0-15)
 * @property {string} [midi.port] - MIDI port
 */

// === Main Composition Interface ===
/**
 * @typedef {Object} JmonComposition
 * @property {string} format - Composition format
 * @property {string} version - Format version
 * @property {number} [bpm] - Beats per minute (20-400)
 * @property {KeySignature} [keySignature] - Key signature
 * @property {KeySignatureChange[]} [keySignatureMap] - Key changes
 * @property {TimeSignature} [timeSignature] - Time signature
 * @property {TimeSignatureChange[]} [timeSignatureMap] - Time changes
 * @property {TempoChange[]} [tempoMap] - Tempo changes
 * @property {string} [title] - Legacy title
 * @property {string} [composer] - Legacy composer
 * @property {JmonTrack[]|Object.<string, JmonNote[]>} [tracks] - Legacy tracks
 * @property {JmonEffect[]} [masterEffects] - Master effects
 * @property {Transport} [transport] - Transport settings
 * @property {Metadata} [metadata] - Composition metadata
 * @property {CustomPreset[]} [customPresets] - Custom presets
 * @property {AudioNode[]} [audioGraph] - Audio graph nodes
 * @property {Array.<[string, string]>} [connections] - Node connections
 * @property {JMonSequence[]} [sequences] - Modern sequences
 * @property {AutomationEvent[]} [automation] - Automation events
 * @property {Annotation[]} [annotations] - Annotations
 * @property {SynthConfig} [synthConfig] - Global synth config
 * @property {ConverterHints} [converterHints] - Converter hints
 */

// === Validation ===
/**
 * @typedef {Object} JmonValidationError
 * @property {string} field - Error field
 * @property {string} message - Error message
 * @property {*} [value] - Error value
 */

/**
 * @typedef {Object} JmonValidationResult
 * @property {boolean} valid - Validation result
 * @property {boolean} [isValid] - Legacy compatibility
 * @property {JmonValidationError[]} errors - Validation errors
 * @property {string[]} warnings - Validation warnings
 */

// === Tone.js Integration ===
/**
 * @typedef {Object} ToneInstrument
 * @property {function(string|number, string|number, string|number=, number=): void} triggerAttackRelease - Trigger note
 * @property {function(): void} dispose - Dispose instrument
 */

/**
 * @typedef {Object} ToneEffect
 * @property {*} wet - Wet signal amount
 * @property {function(): void} dispose - Dispose effect
 */

// === Utility Types ===
/**
 * @typedef {Object} BasicJMonComposition
 * @property {'jmonTone'} format - Composition format
 * @property {string} version - Format version
 * @property {number} bpm - Beats per minute
 * @property {AudioNode[]} audioGraph - Audio graph
 * @property {Array.<[string, string]>} connections - Node connections
 * @property {JMonSequence[]} sequences - Sequences
 */

/**
 * @typedef {Object} JMonSequenceBuilder
 * @property {string} label - Sequence label
 * @property {JmonNote[]} notes - Sequence notes
 * @property {SynthConfig} [synth] - Synth configuration
 * @property {Effect[]} [effects] - Effects
 */

// === Simple Helper Types ===
/**
 * @typedef {Object} SimpleNote
 * @property {string|number} note - Note value
 * @property {string} time - Note time
 * @property {string} duration - Note duration
 * @property {number} [velocity] - Note velocity
 */

/**
 * @typedef {Object} ChordNote
 * @property {Array.<string|number>} note - Chord notes
 * @property {string} time - Chord time
 * @property {string} duration - Chord duration
 * @property {number} [velocity] - Chord velocity
 */

/**
 * @typedef {Object} ModulatedNote
 * @property {string|number} note - Note value
 * @property {string} time - Note time
 * @property {string} duration - Note duration
 * @property {number} [velocity] - Note velocity
 * @property {ModulationEvent[]} modulations - Modulation events
 */

// === Legacy Compatibility Aliases ===
// JSDoc types don't need explicit exports - they are available globally when imported