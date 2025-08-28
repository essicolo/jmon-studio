import { JmonValidator } from '../utils/jmon-validator.js';
/**
 * jmon-to-abc.js - Convert jmon format to ABC notation
 * 
 * Converts jmon compositions to ABC score format for traditional music notation.
 * Supports multi-voice scores, ornamentations, and dynamic markings.
 */

export class JmonToAbc {
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
            // Try to use jmonTone method if available
            if (jmonTone && jmonTone._parseTimeString) {
                return jmonTone._parseTimeString(timeString, bpm);
            }
        } catch (e) {
            // Fallback parsing
        }
        
        // Enhanced bars:beats:ticks format support (e.g., "2:1:240")
        if (timeString.includes(':')) {
            const parts = timeString.split(':').map(parseFloat);
            const bars = parts[0] || 0;
            const beats = parts[1] || 0;
            const ticks = parts[2] || 0;
            
            const beatLength = 60 / bpm; // seconds per beat
            const barLength = beatLength * 4; // Assuming 4/4 time
            const tickLength = beatLength / 480; // Standard MIDI ticks per quarter note
            
            return bars * barLength + beats * beatLength + ticks * tickLength;
        }
        
        // Handle Tone.js note values (4n, 8n, etc.)
        if (timeString.match(/^\d+[nthq]$/)) {
            const noteValue = parseInt(timeString);
            const noteType = timeString.slice(-1);
            const beatLength = 60 / bpm;
            
            switch (noteType) {
                case 'n': return beatLength * (4 / noteValue); // note values
                case 't': return beatLength * (4 / noteValue) * (2/3); // triplets
                case 'h': return beatLength * 2; // half note
                case 'q': return beatLength; // quarter note
                default: return beatLength;
            }
        }
        
        return parseFloat(timeString) || 0;
    }

    /**
     * Convert a jmon composition to ABC notation
     * @param {Object} composition - jmon composition object or any compatible format
     * @returns {string} ABC notation string
     */
    static convertToAbc(composition) {
        // Normalize composition structure
        const normalizedComposition = { ...composition };
        
        // Handle both tracks and sequences formats
        if (composition.tracks && !composition.sequences) {
            normalizedComposition.sequences = composition.tracks.map(track => ({
                ...track,
                notes: track.sequence || track.notes || []
            }));
        }

        let abc = '';
        // ABC Header
        abc += this.generateAbcHeader(normalizedComposition);

        // Multi-voice: ajouter %%score et déclarations V: dans l'en-tête
        if (normalizedComposition.sequences && normalizedComposition.sequences.length > 1) {
            // Déclaration des voix
            normalizedComposition.sequences.forEach((sequence, index) => {
                abc += `V:${index + 1} name=\"${sequence.label || `Voice ${index + 1}`}\"\n`;
            });
            // Ligne %%score
            const scoreLine = '%%score ' + normalizedComposition.sequences.map((_, i) => `V:${i+1}`).join(' ');
            abc += scoreLine + '\n';
        }

        // Génération des voix/tracks
        if (normalizedComposition.sequences && normalizedComposition.sequences.length > 0) {
            if (normalizedComposition.sequences.length > 1) {
                abc += this.generateMultiVoiceAbc(normalizedComposition);
            } else {
                abc += this.generateSingleVoiceAbc(normalizedComposition.sequences[0], normalizedComposition);
            }
        }
        return abc;
    }

    /**
     * Generate ABC header section
     * @param {Object} composition - jmon composition
     * @returns {string} ABC header
     */
    static generateAbcHeader(composition) {
        let header = '';
        
        // Index number (required)
        header += 'X:1\n';
        
        // Title
        const title = composition.metadata?.name || 'Untitled';
        header += `T:${title}\n`;
        
        // Composer
        if (composition.metadata?.author) {
            header += `C:${composition.metadata.author}\n`;
        }
        
        // Additional metadata BEFORE the key signature
        if (composition.metadata?.description) {
            header += `N:${composition.metadata.description}\n`;
        }
        
        // Source info
        header += 'S:Generated from jmon format\n';
        
        // Meter (time signature)
        const timeSignature = composition.timeSignature || '4/4';
        header += `M:${timeSignature}\n`;
        
        // Default note length (usually 1/4 for quarter notes)
        header += 'L:1/4\n';
        
        // Tempo
        const bpm = composition.bpm || 120;
        header += `Q:1/4=${bpm}\n`;
        
        // Add tempo changes as comments if present
        if (composition.tempoMap && composition.tempoMap.length > 0) {
            header += '% Tempo changes:\n';
            composition.tempoMap.forEach(change => {
                header += `% Time ${change.time}: ${change.bpm} BPM\n`;
            });
        }
        
        // Key signature (MUST be last in header)
        const keySignature = composition.keySignature || 'C';
        header += `K:${this.convertKeySignature(keySignature)}\n`;
        
        // Add key changes as comments if present
        if (composition.keySignatureMap && composition.keySignatureMap.length > 0) {
            header += '% Key changes:\n';
            composition.keySignatureMap.forEach(change => {
                header += `% Time ${change.time}: ${this.convertKeySignature(change.keySignature)}\n`;
            });
        }
        
        return header;
    }

    /**
     * Convert jmon key signature to ABC key signature
     * @param {string} keySignature - jmon key signature (e.g., 'C', 'Am', 'F#')
     * @returns {string} ABC key signature
     */
    static convertKeySignature(keySignature) {
        // ABC notation key signatures
        const keyMap = {
            'C': 'C',
            'G': 'G',
            'D': 'D', 
            'A': 'A',
            'E': 'E',
            'B': 'B',
            'F#': 'F#',
            'C#': 'C#',
            'F': 'F',
            'Bb': 'Bb',
            'Eb': 'Eb',
            'Ab': 'Ab',
            'Db': 'Db',
            'Gb': 'Gb',
            'Cb': 'Cb',
            // Minor keys
            'Am': 'Am',
            'Em': 'Em',
            'Bm': 'Bm',
            'F#m': 'F#m',
            'C#m': 'C#m',
            'G#m': 'G#m',
            'D#m': 'D#m',
            'A#m': 'A#m',
            'Dm': 'Dm',
            'Gm': 'Gm',
            'Cm': 'Cm',
            'Fm': 'Fm',
            'Bbm': 'Bbm',
            'Ebm': 'Ebm',
            'Abm': 'Abm'
        };
        
        return keyMap[keySignature] || 'C';
    }

    /**
     * Generate single voice ABC notation
     * @param {Object} sequence - jmon sequence
     * @param {Object} composition - full composition for context
     * @returns {string} ABC notation
     */
    static generateSingleVoiceAbc(sequence, composition) {
        let abc = '';
        
        // Sort notes by time
        const sortedNotes = [...sequence.notes].sort((a, b) => {
            const timeA = this.parseTimeString(a.time, composition.bpm || 120);
            const timeB = this.parseTimeString(b.time, composition.bpm || 120);
            return timeA - timeB;
        });

        // Generate notes with proper spacing
        sortedNotes.forEach((note, index) => {
            // Add space between notes (except for first note)
            if (index > 0) {
                abc += ' ';
            }
            
            // Convert note (without dynamics for now to test)
            abc += this.convertNoteToAbcSimple(note, composition);
        });

        // Add bar line and end
        abc += ' |]';

        return abc;
    }
    
    /**
     * Convert a single note pitch to ABC notation
     * @param {string} pitch - note pitch (e.g., "C4", "D#5")
     * @returns {string} ABC note
     */
    static convertSingleNoteToAbc(pitch) {
        if (!pitch || typeof pitch !== 'string') return 'C';
        
        // Parse note name and octave
        const match = pitch.match(/^([A-Ga-g])([#b]?)(\d+)$/);
        if (!match) return 'C';
        
        const [, noteName, accidental, octaveStr] = match;
        const octave = parseInt(octaveStr);
        
        let abcNote = noteName.toUpperCase();
        
        // Add accidental
        if (accidental === '#') abcNote = '^' + abcNote;
        if (accidental === 'b') abcNote = '_' + abcNote;
        
        // Handle octave
        if (octave <= 3) {
            // Lower octaves use uppercase and commas
            abcNote = abcNote.toUpperCase();
            for (let i = 3; i > octave; i--) {
                abcNote += ',';
            }
        } else if (octave >= 5) {
            // Higher octaves use lowercase and apostrophes
            abcNote = abcNote.toLowerCase();
            for (let i = 5; i <= octave; i++) {
                abcNote += "'";
            }
        } else if (octave === 4) {
            // Octave 4 uses uppercase
            abcNote = abcNote.toUpperCase();
        }
        
        return abcNote;
    }

    /**
     * Simple note conversion without complex formatting
     */
    static convertNoteToAbcSimple(note, composition) {
    let abcNote = '';

        // Glissando: if articulation is glissando and glissTarget is present
        if (note.articulation === 'glissando' && note.glissTarget !== undefined) {
            // Use !slide! after the note, no target note, to visually indicate a slide
            const from = this.convertSingleNoteToAbc(note.pitch);
            let duration = note.duration;
            if (typeof note.duration === 'string') {
                duration = this.parseTimeString(note.duration, composition.bpm || 120);
            }
            abcNote = `${from}!slide!${this.durationToAbcNotation(duration, composition.bpm || 120)}`;
            return abcNote;
        }

        // Handle chords
        if (Array.isArray(note.pitch)) {
            abcNote += '[';
            note.pitch.forEach((n, index) => {
                if (index > 0) abcNote += '';
                abcNote += this.convertSingleNoteToAbc(n);
            });
            abcNote += ']';
        } else {
            abcNote += this.convertSingleNoteToAbc(note.pitch);
        }

        // Add duration
        let duration = note.duration;
        if (typeof note.duration === 'string') {
            duration = this.parseTimeString(note.duration, composition.bpm || 120);
        }
        abcNote += this.durationToAbcNotation(duration, composition.bpm || 120);

        // Add articulation markings (except glissando, which is handled above)
        // Only add articulation if not glissando
        if (note.articulation && note.articulation !== 'glissando') {
            switch (note.articulation) {
                case 'staccato':
                    abcNote = `${abcNote}!staccato!`;
                    break;
                case 'accent':
                    abcNote = `${abcNote}!accent!`;
                    break;
                case 'tenuto':
                    abcNote = `${abcNote}!tenuto!`;
                    break;
                default:
                    break;
            }
        }

        return abcNote;
    }

    /**
     * Generate multi-voice ABC notation
     * @param {Object} composition - jmon composition
     * @returns {string} ABC notation
     */
    static generateMultiVoiceAbc(composition) {
        let abc = '';
        
        composition.sequences.forEach((sequence, index) => {
            // Voice header
            abc += `V:${index + 1} name="${sequence.label || `Voice ${index + 1}`}"\n`;
            
            // Generate voice content
            abc += this.generateSingleVoiceAbc(sequence, composition);
            abc += '\n';
        });

        return abc;
    }

    /**
     * Convert duration to ABC notation
     * @param {number} duration - duration in seconds
     * @param {number} bpm - beats per minute
     * @returns {string} ABC duration notation
     */
    static durationToAbcNotation(duration, bpm) {
        // Duration is already in beats (quarter notes), so ratio is just the duration
        const ratio = duration;

        // Common note durations
        if (Math.abs(ratio - 4) < 0.1) return '4';      // whole note
        if (Math.abs(ratio - 2) < 0.1) return '2';      // half note
        if (Math.abs(ratio - 1) < 0.1) return '';       // quarter note (default)
        if (Math.abs(ratio - 0.5) < 0.1) return '/2';   // eighth note
        if (Math.abs(ratio - 0.25) < 0.1) return '/4';  // sixteenth note
        if (Math.abs(ratio - 0.125) < 0.1) return '/8'; // thirty-second note
        
        // Dotted notes
        if (Math.abs(ratio - 1.5) < 0.1) return '3/2';  // dotted quarter
        if (Math.abs(ratio - 0.75) < 0.1) return '3/4'; // dotted eighth
        if (Math.abs(ratio - 3) < 0.1) return '3';      // dotted half
        
        // Triplets
        if (Math.abs(ratio - 2/3) < 0.1) return '2/3';  // quarter triplet
        if (Math.abs(ratio - 1/3) < 0.1) return '/3';   // eighth triplet

        // For other durations, use fractional notation
        const numerator = Math.round(ratio * 8);
        return numerator === 8 ? '' : `${numerator}/8`;
    }

    /**
     * Convert duration to ABC rest notation
     * @param {number} duration - rest duration in seconds
     * @param {number} bpm - beats per minute
     * @returns {string} ABC rest notation
     */
    static durationToAbcRest(duration, bpm) {
        const notation = this.durationToAbcNotation(duration, bpm);
        return 'z' + notation;
    }

    /**
     * Export ABC notation as downloadable file
     * @param {string} abc - ABC notation string
     * @param {string} filename - filename for download
     */
    static exportAbcAsFile(abc, filename = 'composition.abc') {
        const blob = new Blob([abc], { type: 'text/plain' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Convert jmon composition to ABC and download
     * @param {Object} composition - jmon composition
     * @param {string} filename - Optional filename
     */
    static convertAndDownload(composition, filename) {
        try {
            const abc = this.convertToAbc(composition);
            const downloadName = filename || `${composition.metadata?.name || 'composition'}.abc`;
            this.exportAbcAsFile(abc, downloadName);
            console.log(`✅ ABC file "${downloadName}" exported successfully`);
            return abc;
        } catch (error) {
            console.error('❌ Error converting to ABC:', error);
            throw error;
        }
    }

    /**
     * Analyze jmon composition for ABC conversion compatibility
     * @param {Object} composition - jmon composition
     * @returns {Object} Analysis report
     */
    static analyzeForAbc(composition) {
        const report = {
            voices: composition.sequences?.length || 0,
            totalNotes: 0,
            chords: 0,
            microtuning: 0,
            modulations: 0,
            tempoChanges: composition.tempoMap?.length || 0,
            keyChanges: composition.keySignatureMap?.length || 0,
            warnings: [],
            recommendations: []
        };

        if (composition.sequences) {
            composition.sequences.forEach((seq, index) => {
                report.totalNotes += seq.notes?.length || 0;
                
                seq.notes?.forEach(note => {
                    if (Array.isArray(note.note)) {
                        report.chords++;
                    }
                    
                    if (note.microtuning) {
                        report.microtuning++;
                    }
                    
                    if (note.modulations) {
                        report.modulations += note.modulations.length;
                    }
                });

                // Check for unsupported features
                if (seq.effects && seq.effects.length > 0) {
                    report.warnings.push(`Voice ${index + 1} (${seq.label}): Effects not supported in ABC notation`);
                }
            });
        }

        // Recommendations
        if (report.microtuning > 0) {
            report.recommendations.push('Consider using standard tuning for better ABC compatibility');
        }
        
        if (report.modulations > 0) {
            report.recommendations.push('Modulations will be converted to ornaments - review output for accuracy');
        }
        
        if (composition.audioGraph && composition.audioGraph.length > 1) {
            report.warnings.push('Audio routing and synthesis parameters will be lost in ABC conversion');
        }

        return report;
    }

    /**
     * Generate ABC notation with lyrics from annotations
     * @param {Object} composition - jmon composition with annotations or any compatible format
     * @returns {string} ABC notation with lyrics
     */
    static convertWithLyrics(composition) {
        // Smart normalize: convert various formats to jmon
    const normalizedComposition = composition;
        let abc = this.convertToAbc(composition);
        
        // Add lyrics from annotations
        if (normalizedComposition.annotations && Array.isArray(normalizedComposition.annotations)) {
            const lyrics = normalizedComposition.annotations
                .filter(ann => ann.type === 'lyric')
                .sort((a, b) => {
                    const timeA = this.parseTimeString(a.time, normalizedComposition.bpm || 120);
                    const timeB = this.parseTimeString(b.time, normalizedComposition.bpm || 120);
                    return timeA - timeB;
                });
                
            if (lyrics.length > 0) {
                abc += '\nw: ';
                lyrics.forEach((lyric, index) => {
                    if (index > 0) abc += ' ';
                    abc += lyric.text;
                });
                abc += '\n';
            }
            
            // Add rehearsal marks and comments
            const markers = normalizedComposition.annotations
                .filter(ann => ann.type === 'marker' || ann.type === 'rehearsal')
                .sort((a, b) => {
                    const timeA = this.parseTimeString(a.time, normalizedComposition.bpm || 120);
                    const timeB = this.parseTimeString(b.time, normalizedComposition.bpm || 120);
                    return timeA - timeB;
                });
            
            if (markers.length > 0) {
                abc += '\n% Rehearsal marks and markers:\n';
                markers.forEach(marker => {
                    abc += `% Time ${marker.time}: ${marker.text}\n`;
                });
            }
        }
        
        return abc;
    }
}

// ESM export for Rollup/browser compatibility
export function convertToAbc(composition) {
    return JmonToAbc.convertToAbc(composition);
}