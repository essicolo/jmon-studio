import { JmonValidator } from '../utils/jmon-validator.js';
/**
 * toAbc.js - Convert jmon format to ABC notation
 * 
 * Converts jmon compositions to ABC score format for traditional music notation.
 * Supports multi-voice scores, ornamentations, and dynamic markings.
 */

export class ToAbc {
    /**
     * Convertit un objet JMON en ABC après validation/normalisation
     * @param {Object} composition - objet JMON
     * @returns {string} ABC notation string
     */
    static fromValidatedJmon(composition) {
        const validator = new JmonValidator();
        const { valid, normalized, errors } = validator.validateAndNormalize(composition);
        if (!valid) {
            console.warn('JMON non valide pour conversion ABC:', errors);
            throw new Error('JMON non valide');
        }
        return this.convertToAbc(normalized);
    }
    /**
     * Helper function to parse time strings with fallback
     * @param {string|number} timeString - time value
     * @param {number} bpm - beats per minute
     * @returns {number} parsed time in seconds
     */
    static parseTimeString(timeString, bpm) {
        if (typeof timeString === 'number') return timeString;
        if (typeof timeString !== 'string') return 0;
        try {
            if (jmonTone && jmonTone._parseTimeString) {
                return jmonTone._parseTimeString(timeString, bpm);
            }
        } catch (e) {}
        if (timeString.includes(':')) {
            const parts = timeString.split(':').map(parseFloat);
            const bars = parts[0] || 0;
            const beats = parts[1] || 0;
            const ticks = parts[2] || 0;
            const beatLength = 60 / bpm;
            const barLength = beatLength * 4;
            const tickLength = beatLength / 480;
            return bars * barLength + beats * beatLength + ticks * tickLength;
        }
        if (timeString.match(/^\d+[nthq]$/)) {
            const noteValue = parseInt(timeString);
            const noteType = timeString.slice(-1);
            const beatLength = 60 / bpm;
            switch (noteType) {
                case 'n': return beatLength * (4 / noteValue);
                case 't': return beatLength * (4 / noteValue) * (2/3);
                case 'h': return beatLength * 2;
                case 'q': return beatLength;
                default: return beatLength;
            }
        }
        return parseFloat(timeString) || 0;
    }
    static convertToAbc(composition) {
        // Header
        let abc = 'X:1\n';
        abc += `T:${composition.metadata?.title || composition.metadata?.name || composition.label || 'Untitled'}\n`;
        abc += `M:${composition.timeSignature || '4/4'}\n`;
        abc += 'L:1/4\n';
        abc += `Q:1/4=${composition.bpm || 120}\n`;
        abc += `K:${composition.keySignature || 'C'}\n`;

        // Prend le premier track (array ou objet)
        const tracks = Array.isArray(composition.tracks) ? composition.tracks : Object.values(composition.tracks || {});
        if (tracks.length > 0) {
            const notes = tracks[0].notes || tracks[0];
            let abcNotes = '';
            let beatCount = 0;
            // Tri par temps
            const sortedNotes = notes.filter(n => n.pitch !== undefined).sort((a, b) => (a.time || 0) - (b.time || 0));
            for (const note of sortedNotes) {
                if (beatCount > 0 && beatCount % 4 === 0) {
                    abcNotes += '| ';
                }
                // Conversion MIDI -> ABC
                let noteName = 'z';
                if (typeof note.pitch === 'number') {
                    const midi = note.pitch;
                    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                    const octave = Math.floor(midi / 12) - 1;
                    const noteIndex = midi % 12;
                    noteName = noteNames[noteIndex].replace('#', '^');
                    if (octave >= 4) {
                        noteName = noteName.toLowerCase();
                        if (octave > 4) noteName += "'".repeat(octave - 4);
                    } else if (octave < 4) {
                        noteName = noteName.toUpperCase();
                        if (octave < 3) noteName += ','.repeat(3 - octave);
                    }
                } else if (typeof note.pitch === 'string') {
                    noteName = note.pitch;
                }
                // Durée
                const duration = note.duration || 1.0;
                if (duration === 2.0) noteName += '2';
                else if (duration === 0.5) noteName += '/2';
                // Articulations (staccato, accent, etc.)
                if (note.articulation === 'staccato') noteName += '.';
                if (note.articulation === 'accent') noteName += '>';
                if (note.articulation === 'tenuto') noteName += '-';
                if (note.articulation === 'marcato') noteName += '^';
                abcNotes += noteName + ' ';
                beatCount += duration;
            }
            if (abcNotes.trim()) {
                abcNotes += '|';
                abc += abcNotes + '\n';
            }
        }
        return abc;
    }
}
export function abc(composition) {
    return ToAbc.convertToAbc(composition);
}
