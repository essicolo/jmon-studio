/* jmon-to-midi.js - Convert jmon format to MIDI using Tone.js Midi */
// ...existing code...
export class Midi {
    static midiToNoteName(midi) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midi / 12) - 1;
        const noteIndex = midi % 12;
        return noteNames[noteIndex] + octave;
    }
    static convert(composition) {
        // Conversion JMON -> MIDI (structure JSON, articulations incluses)
        const bpm = composition.bpm || 120;
        const tracks = composition.tracks || [];
        return {
            header: {
                bpm,
                timeSignature: composition.timeSignature || '4/4',
            },
            tracks: tracks.map(track => ({
                label: track.label,
                notes: track.notes.map(note => ({
                    pitch: note.pitch,
                    noteName: typeof note.pitch === 'number' ? Midi.midiToNoteName(note.pitch) : note.pitch,
                    time: note.time,
                    duration: note.duration,
                    velocity: note.velocity || 0.8,
                    articulation: note.articulation || null
                }))
            }))
        };
    }
}
export function midi(composition) {
    return Midi.convert(composition);
}
