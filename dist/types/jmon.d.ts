/**
 * Unified JMON (JSON Music Object Notation) TypeScript definitions
 * Comprehensive types combining legacy and modern JMON specifications
 */
export type MusicalTime = string;
export type NoteDuration = string;
export type LegacyTime = number;
export type FlexibleTime = MusicalTime | NoteDuration | LegacyTime;
export type NoteValue = string | number | Array<string | number>;
export type KeySignature = string;
export type TimeSignature = string;
export interface ModulationEvent {
    type: 'cc' | 'pitchBend' | 'aftertouch';
    controller?: number;
    value: number;
    time: FlexibleTime;
}
export interface JmonModulation {
    target: string;
    type: string;
    frequency?: number;
    depth?: number;
    [key: string]: any;
}
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
export interface JmonNote {
    time: FlexibleTime;
    note?: NoteValue;
    pitch?: number;
    duration: NoteDuration | MusicalTime | number;
    velocity?: number;
    articulation?: string;
    microtuning?: number;
    channel?: number;
    pan?: number;
    effects?: JmonEffect[];
    modulation?: JmonModulation[];
    modulations?: ModulationEvent[];
}
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
export interface AudioNode {
    id: string;
    type: 'Synth' | 'PolySynth' | 'MonoSynth' | 'AMSynth' | 'FMSynth' | 'DuoSynth' | 'PluckSynth' | 'NoiseSynth' | 'Sampler' | 'Filter' | 'AutoFilter' | 'Reverb' | 'FeedbackDelay' | 'PingPongDelay' | 'Delay' | 'Chorus' | 'Phaser' | 'Tremolo' | 'Vibrato' | 'AutoWah' | 'Distortion' | 'Chebyshev' | 'BitCrusher' | 'Compressor' | 'Limiter' | 'Gate' | 'FrequencyShifter' | 'PitchShift' | 'JCReverb' | 'Freeverb' | 'StereoWidener' | 'MidSideCompressor' | 'Destination';
    options: Record<string, any>;
    target?: string;
    presetRef?: string;
}
export interface JmonTrack {
    name?: string;
    instrument?: JmonInstrument;
    effects?: JmonEffect[];
    modulation?: JmonModulation[];
    sequence?: JmonNote[];
    loop?: string | number;
    notes?: JmonNote[];
}
export interface JMonSequence {
    label: string;
    midiChannel?: number;
    synth?: SynthConfig;
    synthRef?: string;
    notes: JmonNote[];
    loop?: boolean | string;
    loopEnd?: MusicalTime;
    effects?: Effect[];
}
export interface TempoChange {
    time: FlexibleTime;
    bpm: number;
}
export interface KeySignatureChange {
    time: FlexibleTime;
    keySignature: KeySignature;
}
export interface TimeSignatureChange {
    time: FlexibleTime;
    timeSignature: TimeSignature;
}
export interface Transport {
    startOffset?: FlexibleTime;
    globalLoop?: boolean;
    globalLoopEnd?: MusicalTime;
    swing?: number;
}
export interface Metadata {
    name?: string;
    title?: string;
    author?: string;
    composer?: string;
    description?: string;
    [key: string]: any;
}
export interface AutomationEvent {
    target: string;
    time: FlexibleTime;
    value: number;
}
export interface Annotation {
    text: string;
    time: FlexibleTime;
    type?: string;
    duration?: NoteDuration | MusicalTime | number;
}
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
        channel?: number;
        port?: string;
    };
}
export interface JmonComposition {
    format: string;
    version: string;
    bpm?: number;
    keySignature?: KeySignature;
    keySignatureMap?: KeySignatureChange[];
    timeSignature?: TimeSignature;
    timeSignatureMap?: TimeSignatureChange[];
    tempoMap?: TempoChange[];
    title?: string;
    composer?: string;
    tracks?: JmonTrack[] | Record<string, JmonNote[]>;
    masterEffects?: JmonEffect[];
    transport?: Transport;
    metadata?: Metadata;
    customPresets?: CustomPreset[];
    audioGraph?: AudioNode[];
    connections?: [string, string][];
    sequences?: JMonSequence[];
    automation?: AutomationEvent[];
    annotations?: Annotation[];
    synthConfig?: SynthConfig;
    converterHints?: ConverterHints;
}
export interface JmonValidationError {
    field: string;
    message: string;
    value?: any;
}
export interface JmonValidationResult {
    valid: boolean;
    isValid?: boolean;
    errors: JmonValidationError[];
    warnings: string[];
}
export interface ToneInstrument {
    triggerAttackRelease(note: string | number, duration: string | number, time?: string | number, velocity?: number): void;
    dispose(): void;
}
export interface ToneEffect {
    wet: any;
    dispose(): void;
}
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
export { JmonComposition as JMonComposition };
export { JmonNote as JMonNote };
export { JmonTrack as JMonTrack };
//# sourceMappingURL=jmon.d.ts.map