/**
 * JmonTone (Tone Object Notation Extended) - Core Library
 *
 * A TypeScript library for parsing, validating, and manipulating
 * musical compositions in the JMON specification.
 *
 * Originally designed for Tone.js but extensible to other audio frameworks.
 */
import { JmonComposition, JmonValidationResult } from '../types/jmon';
export declare class JmonTone {
    static readonly VERSION = "1.0";
    static readonly FORMAT_IDENTIFIER = "jmonTone";
    /**
     * Convert MIDI note number to note name (e.g., 60 -> "C4")
     */
    static midiNoteToNoteName(midiNote: number): string;
    /**
     * Convert note name to MIDI note number (e.g., "C4" -> 60)
     */
    static noteNameToMidiNote(noteName: string): number;
    /**
     * Process note input (can be string, number, or array)
     */
    static processNoteInput(note: string | number | (string | number)[]): string | string[];
    /**
     * Parse time string to seconds
     */
    static parseTimeString(timeString: string | number, bpm?: number): number;
    /**
     * Validate JMON composition format
     */
    static validateComposition(composition: any): JmonValidationResult;
    /**
     * Create a Tone.js synth instance
     */
    static createSynth(type: string, options?: any): any;
    /**
     * Basic composition playback (requires Tone.js)
     */
    static playComposition(composition: JmonComposition, options?: any): Promise<void>;
}
export default JmonTone;
//# sourceMappingURL=JmonTone.d.ts.map