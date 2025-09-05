/* JMON to Tone.js Converter */
// ...existing code...
export class Tonejs {
    constructor(options = {}) {
        this.options = options;
    }
    convert(composition) {
        const tracks = composition.tracks || [];
        return tracks.map(track => ({
            label: track.label,
            part: track.notes.map(note => ({
                time: note.time,
                note: note.pitch,
                duration: note.duration,
                velocity: note.velocity || 0.8
            }))
        }));
    }
}
export function tonejs(composition, options = {}) {
    const converter = new Tonejs(options);
    return converter.convert(composition);
}
