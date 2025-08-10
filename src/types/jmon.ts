/**
 * Unified JMON (JSON Music Object Notation) TypeScript definitions
 * Comprehensive types combining legacy and modern JMON specifications
 */

// === Core Time and Duration Types ===
export type MusicalTime = string; // "bars:beats:ticks" format (e.g., "2:1:240")
export type NoteDuration = string; // "4n", "8n", "2t", etc. or "bars:beats:ticks"
export type LegacyTime = number; // Deprecated numeric time
export type FlexibleTime = MusicalTime | NoteDuration | LegacyTime;

// === Note and Music Types ===
export type NoteValue = string | number | Array<string | number>;
export type KeySignature = string; // "C", "Am", "F#", etc.
export type TimeSignature = string; // "4/4", "3/4", etc.

// === Modulation and Events ===
export interface ModulationEvent {
  type: 'cc' | 'pitchBend' | 'aftertouch';
  controller?: number; // Required for CC
  value: number; // 0-127 for CC/aftertouch, -8192 to +8192 for pitchBend
  time: FlexibleTime; // Relative to note start
}

export interface JmonModulation {
    target: string;
    type: string;
    frequency?: number;
    depth?: number;
    [key: string]: any;
}

// === Effects ===
export interface JmonEffect {
    type: string;
    wet?: number;
    options?: Record<string, any>;
    presetRef?: string;
    [key: string]: any;
}

export interface Effect {
  type: string;
  options?: Record<string, any>;
  presetRef?: string;
}

// === Notes ===
export interface JmonNote {
    // Legacy format support
    time: FlexibleTime;
    note?: NoteValue;
    pitch?: number; // MIDI pitch (legacy)
    duration: NoteDuration | MusicalTime | number;
    velocity?: number; // 0-1 (modern) or 0-127 (legacy)
    
    // Extended properties
    articulation?: string;
    microtuning?: number;
    channel?: number; // 0-15
    pan?: number;
    effects?: JmonEffect[];
    modulation?: JmonModulation[];
    modulations?: ModulationEvent[];
}

// === Instruments and Synthesis ===
export interface JmonInstrument {
    type: string;
    oscillator?: any;
    envelope?: any;
    [key: string]: any;
}

export interface SynthConfig {
  type: 'Synth' | 'PolySynth' | 'MonoSynth' | 'AMSynth' | 'FMSynth' | 'DuoSynth' | 'PluckSynth' | 'NoiseSynth' | 'Sampler';
  options?: Record<string, any>;
  presetRef?: string;
  modulationTarget?: 'vibrato' | 'tremolo' | 'glissando' | 'filter';
}

// === Audio Graph ===
export interface AudioNode {
  id: string;
  type: 'Synth' | 'PolySynth' | 'MonoSynth' | 'AMSynth' | 'FMSynth' | 'DuoSynth' | 'PluckSynth' | 'NoiseSynth' | 'Sampler' | 
        'Filter' | 'AutoFilter' | 'Reverb' | 'FeedbackDelay' | 'PingPongDelay' | 'Delay' | 'Chorus' | 'Phaser' | 'Tremolo' | 
        'Vibrato' | 'AutoWah' | 'Distortion' | 'Chebyshev' | 'BitCrusher' | 'Compressor' | 'Limiter' | 'Gate' | 
        'FrequencyShifter' | 'PitchShift' | 'JCReverb' | 'Freeverb' | 'StereoWidener' | 'MidSideCompressor' | 'Destination';
  options: Record<string, any>;
  target?: string;
  presetRef?: string;
}

// === Tracks and Sequences ===
export interface JmonTrack {
    // Legacy format
    name?: string;
    instrument?: JmonInstrument;
    effects?: JmonEffect[];
    modulation?: JmonModulation[];
    sequence?: JmonNote[]; // Legacy property
    loop?: string | number;
    
    // Modern format compatibility
    notes?: JmonNote[];
}

export interface JMonSequence {
  label: string;
  midiChannel?: number; // 0-15
  synth?: SynthConfig;
  synthRef?: string;
  notes: JmonNote[];
  loop?: boolean | string;
  loopEnd?: MusicalTime;
  effects?: Effect[];
}

// === Tempo and Time Signature Changes ===
export interface TempoChange {
  time: FlexibleTime;
  bpm: number; // 20-400
}

export interface KeySignatureChange {
  time: FlexibleTime;
  keySignature: KeySignature;
}

export interface TimeSignatureChange {
  time: FlexibleTime;
  timeSignature: TimeSignature;
}

// === Transport and Timing ===
export interface Transport {
  startOffset?: FlexibleTime;
  globalLoop?: boolean;
  globalLoopEnd?: MusicalTime;
  swing?: number; // 0-1
}

// === Metadata ===
export interface Metadata {
  name?: string;
  title?: string; // Legacy compatibility
  author?: string;
  composer?: string; // Legacy compatibility
  description?: string;
  [key: string]: any; // Allow arbitrary fields
}

// === Automation and Annotations ===
export interface AutomationEvent {
  target: string; // e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'
  time: FlexibleTime;
  value: number;
}

export interface Annotation {
  text: string;
  time: FlexibleTime;
  type?: string; // 'lyric', 'marker', 'comment', 'rehearsal'
  duration?: NoteDuration | MusicalTime | number;
}

// === Presets and Configuration ===
export interface CustomPreset {
  id: string;
  type: string;
  options: Record<string, any>;
}

export interface ConverterHints {
  tone?: {
    [ccController: string]: {
      target: string;
      parameter?: string;
      frequency?: number;
      depthRange?: [number, number];
    };
  };
  midi?: {
    channel?: number; // 0-15
    port?: string;
  };
}

// === Main Composition Interface ===
export interface JmonComposition {
  // Core properties
  format: string; // 'jmonTone' for modern, flexible for legacy
  version: string;
  
  // Timing and musical properties
  bpm?: number; // 20-400
  keySignature?: KeySignature;
  keySignatureMap?: KeySignatureChange[];
  timeSignature?: TimeSignature;
  timeSignatureMap?: TimeSignatureChange[];
  tempoMap?: TempoChange[];
  
  // Legacy properties
  title?: string;
  composer?: string;
  tracks?: JmonTrack[] | Record<string, JmonNote[]>; // Support both formats
  masterEffects?: JmonEffect[];
  
  // Modern properties
  transport?: Transport;
  metadata?: Metadata;
  customPresets?: CustomPreset[];
  audioGraph?: AudioNode[];
  connections?: [string, string][]; // [source, target] pairs
  sequences?: JMonSequence[];
  automation?: AutomationEvent[];
  annotations?: Annotation[];
  synthConfig?: SynthConfig; // Global default synth config
  converterHints?: ConverterHints;
}

// === Validation ===
export interface JmonValidationError {
    field: string;
    message: string;
    value?: any;
}

export interface JmonValidationResult {
    valid: boolean;
    isValid?: boolean; // Legacy compatibility
    errors: JmonValidationError[];
    warnings: string[];
}

// === Tone.js Integration ===
export interface ToneInstrument {
    triggerAttackRelease(note: string | number, duration: string | number, time?: string | number, velocity?: number): void;
    dispose(): void;
}

export interface ToneEffect {
    wet: any;
    dispose(): void;
}

// === Utility Types ===
export interface BasicJMonComposition {
  format: 'jmonTone';
  version: string;
  bpm: number;
  audioGraph: AudioNode[];
  connections: [string, string][];
  sequences: JMonSequence[];
}

export interface JMonSequenceBuilder {
  label: string;
  notes: JmonNote[];
  synth?: SynthConfig;
  effects?: Effect[];
}

// === Simple Helper Types ===
export interface SimpleNote {
  note: string | number;
  time: string;
  duration: string;
  velocity?: number;
}

export interface ChordNote {
  note: Array<string | number>;
  time: string;
  duration: string;
  velocity?: number;
}

export interface ModulatedNote extends SimpleNote {
  modulations: ModulationEvent[];
}

// === Legacy Compatibility Aliases ===
export { JmonComposition as JMonComposition };
export { JmonNote as JMonNote };
export { JmonTrack as JMonTrack };