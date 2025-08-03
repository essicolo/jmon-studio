export interface JmonNote {
    time: string | number;
    note: string | number | string[] | number[];
    duration: string | number;
    velocity?: number;
    channel?: number;
    pan?: number;
    effects?: JmonEffect[];
    modulation?: JmonModulation[];
}
export interface JmonEffect {
    type: string;
    wet?: number;
    [key: string]: any;
}
export interface JmonModulation {
    target: string;
    type: string;
    frequency?: number;
    depth?: number;
    [key: string]: any;
}
export interface JmonTrack {
    name?: string;
    instrument?: JmonInstrument;
    effects?: JmonEffect[];
    modulation?: JmonModulation[];
    sequence: JmonNote[];
    loop?: string | number;
}
export interface JmonInstrument {
    type: string;
    oscillator?: any;
    envelope?: any;
    [key: string]: any;
}
export interface JmonComposition {
    format: string;
    version: string;
    title?: string;
    composer?: string;
    bpm?: number;
    timeSignature?: string;
    key?: string;
    tracks: JmonTrack[];
    masterEffects?: JmonEffect[];
}
export interface JmonValidationError {
    field: string;
    message: string;
    value?: any;
}
export interface JmonValidationResult {
    valid: boolean;
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
//# sourceMappingURL=jmon.d.ts.map