import { MusicTheoryConstants } from '../../constants/MusicTheoryConstants.js';
import { ORNAMENT_TYPES } from '../../constants/OrnamentTypes.js';
import { Voice } from './Voice.js';

/**
 * A class to represent musical ornaments
 */
export class Ornament extends MusicTheoryConstants {
    /**
     * Initialize an Ornament object
     * @param {string} type - The type of ornament ('grace_note', 'trill', 'mordent', 'arpeggio', 'turn', 'slide')
     * @param {string} tonic - The tonic note for the scale
     * @param {string} mode - The type of scale to generate
     * @param {number} by - The pitch step for the trill (default: 1.0)
     * @param {string} graceNoteType - Type of grace note ('acciaccatura' or 'appoggiatura')
     * @param {Array} gracePitches - List of pitches for the grace note
     * @param {number} trillRate - Duration of each individual note in the trill (default: 0.125)
     * @param {Array} arpeggioDegrees - Degrees in the scale to run the arpeggio
     * @param {number} slideLength - Length of the slide (default: 4.0)
     *//**
     * Initialize an Ornament object
     * @param {Object} options - Configuration object for the ornament
     * @param {string} options.type - The type of ornament
     * @param {string} [options.tonic] - The tonic note for the scale
     * @param {string} [options.mode] - The type of scale to generate
     * @param {Object} [options.parameters] - Specific parameters for the ornament type
     */
    constructor(options) {
        const ornamentType = ORNAMENT_TYPES[options.type];
        if (!ornamentType) {
            throw new Error(`Unknown ornament type: ${options.type}`);
        }

        this.type = options.type;

        // Initialize default parameters from ORNAMENT_TYPES

        const parameters = ornamentType.parameters;

        for (const [param, config] of Object.entries(parameters)) {

            this[param] = options.parameters?.[param] ?? config.default;

        }

        if (options.tonic && options.mode) {

            this.tonicIndex = MusicTheoryConstants.chromatic_scale.indexOf(options.tonic);

            this.scale = this.generateScale(options.tonic, options.mode);

            if (options.parameters?.arpeggioDegrees) {

                this.arpeggioVoice = new Voice(options.mode, options.tonic, options.parameters.arpeggioDegrees);

            } else {

                this.arpeggioVoice = null;

            }

        } else {

            this.scale = null;

            this.arpeggioVoice = null;

        }

    }

    /**
     * Generate a complete scale based on tonic and mode
     * @param {string} tonic - The tonic note for the scale
     * @param {string} mode - The type of scale to generate
     * @returns {Array} Array of MIDI notes for the complete scale
     */
    generateScale(tonic, mode) {
        const scalePattern = this.scale_intervals[mode];
        const scaleNotes = scalePattern.map(interval => (this.tonicIndex + interval) % 12);
        const completeScale = [];

        for (let octave = -1; octave < 10; octave++) {
            for (const note of scaleNotes) {
                const midiNote = 12 * octave + note;
                if (midiNote >= 0 && midiNote <= 127) {
                    completeScale.push(midiNote);
                }
            }
        }
        return completeScale;
    }

    /**
     * Add a grace note to a specified note
     * @param {Array} notes - The list of notes to be processed
     * @param {number} noteIndex - The index of the note to add grace note to
     * @returns {Array} The list of notes with the grace note added
     */
    addGraceNote(notes, noteIndex) {
        const [mainPitch, mainDuration, mainOffset] = notes[noteIndex];
        const ornamentPitch = this.gracePitches ? 
            this.gracePitches[Math.floor(Math.random() * this.gracePitches.length)] :
            mainPitch + 1;

        const config = ORNAMENT_TYPES.grace_note.parameters;
        const type = this.graceNoteType || config.graceNoteType.default;

        let newNotes;
        if (type === 'acciaccatura') {
            // Very brief, does not alter main note's start time
            const graceDuration = mainDuration * 0.125;
            const modifiedMain = [mainPitch, mainDuration, mainOffset + graceDuration];
            newNotes = [
                ...notes.slice(0, noteIndex),
                [ornamentPitch, graceDuration, mainOffset],
                modifiedMain,
                ...notes.slice(noteIndex + 1)
            ];
        } else if (type === 'appoggiatura') {
            // Takes half the time of the main note
            const graceDuration = mainDuration / 2;
            const modifiedMain = [mainPitch, graceDuration, mainOffset + graceDuration];
            newNotes = [
                ...notes.slice(0, noteIndex),
                [ornamentPitch, graceDuration, mainOffset],
                modifiedMain,
                ...notes.slice(noteIndex + 1)
            ];
        } else {
            newNotes = notes;
        }
        return newNotes;
    }

    /**
     * Add a trill ornament by alternating between original pitch and step above
     * @param {Array} notes - The list of notes to be processed
     * @param {number} noteIndex - The index of the note to add trill to
     * @returns {Array} The list of notes with the trill applied
     */
    addTrill(notes, noteIndex) {
        const [mainPitch, mainDuration, mainOffset] = notes[noteIndex];
        const trillNotes = [];
        let currentOffset = mainOffset;

        const config = ORNAMENT_TYPES.trill.parameters;
        const by = this.by || config.by.default;
        const trillRate = this.trillRate || config.trillRate.default;

        // Determine the trill pitch
        let trillPitch;
        if (this.scale && this.scale.includes(mainPitch)) {
            const pitchIndex = this.scale.indexOf(mainPitch);
            const trillIndex = (pitchIndex + Math.round(by)) % this.scale.length;
            trillPitch = this.scale[trillIndex];
        } else {
            trillPitch = mainPitch + by;
        }

        // Generate trill sequence
        while (currentOffset < mainOffset + mainDuration) {
            const remainingTime = mainOffset + mainDuration - currentOffset;
            const noteLength = Math.min(trillRate, remainingTime / 2);
            
            if (remainingTime >= noteLength * 2) {
                trillNotes.push([mainPitch, noteLength, currentOffset]);
                trillNotes.push([trillPitch, noteLength, currentOffset + noteLength]);
                currentOffset += 2 * noteLength;
            } else {
                break;
            }
        }

        return [
            ...notes.slice(0, noteIndex),
            ...trillNotes,
            ...notes.slice(noteIndex + 1)
        ];
    }

    /**
     * Add a mordent ornament
     * @param {Array} notes - The list of notes to be processed  
     * @param {number} noteIndex - The index of the note to add mordent to
     * @returns {Array} The list of notes with the mordent applied
     */
    addMordent(notes, noteIndex) {
        const [mainPitch, mainDuration, mainOffset] = notes[noteIndex];
        
        const config = ORNAMENT_TYPES.mordent.parameters;
        const by = this.by || config.by.default;

        let mordentPitch;
        if (this.scale && this.scale.includes(mainPitch)) {
            const pitchIndex = this.scale.indexOf(mainPitch);
            const mordentIndex = pitchIndex + Math.round(by);
            mordentPitch = this.scale[mordentIndex] || mainPitch + by;
        } else {
            mordentPitch = mainPitch + by;
        }

        const partDuration = mainDuration / 3;
        const mordentNotes = [
            [mainPitch, partDuration, mainOffset],
            [mordentPitch, partDuration, mainOffset + partDuration],
            [mainPitch, partDuration, mainOffset + 2 * partDuration]
        ];

        return [
            ...notes.slice(0, noteIndex),
            ...mordentNotes,
            ...notes.slice(noteIndex + 1)
        ];
    }

    /**
     * Generate the ornament on the specified notes
     * @param {Array} notes - The list of notes to be processed
     * @param {number} noteIndex - The index of the note to ornament (random if null)
     * @returns {Array} The list of notes with the ornamentation applied
     */
    generate(notes, noteIndex = null) {
        if (!Array.isArray(notes) || notes.length === 0) {
            return notes;
        }

        if (noteIndex === null) {
            noteIndex = Math.floor(Math.random() * notes.length);
        }

        if (noteIndex < 0 || noteIndex >= notes.length) {
            return notes;
        }

        switch (this.type) {
            case 'grace_note':
                return this.addGraceNote(notes, noteIndex);
            case 'trill':
                return this.addTrill(notes, noteIndex);
            case 'mordent':
                return this.addMordent(notes, noteIndex);
            // Add other ornament types as needed
            default:
                return notes;
        }
    }
}
