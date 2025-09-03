/**
 * ABC Notation Converter
 * Converts JMON compositions to ABC notation format
 */

export function toAbc(composition) {
    try {
        // ABC Header with composition title
        let abc = 'X:1\n';
        abc += `T:${composition.metadata?.title || composition.label || 'Untitled'}\n`;
        abc += 'M:4/4\n';          // Default time signature
        abc += 'L:1/4\n';          // Default note length (quarter note)
        abc += 'Q:1/4=120\n';      // Default tempo
        abc += 'K:C\n';            // Default key (C major)
        
        // Convert notes from tracks
        const tracks = composition.tracks || {};
        const allTracks = Object.values(tracks);
        
        if (allTracks.length > 0) {
            for (const track of allTracks) {
                if (Array.isArray(track) && track.length > 0) {
                    let abcNotes = '';
                    let beatCount = 0;
                    
                    // Sort notes by time
                    const sortedNotes = track.filter(n => n.pitch).sort((a, b) => (a.time || 0) - (b.time || 0));
                    
                    for (const note of sortedNotes) {
                        if (note.pitch) {
                            // Add measure bar every 4 beats (but not at the very start)
                            if (beatCount > 0 && beatCount % 4 === 0) {
                                abcNotes += '| ';
                            }
                            
                            // Convert MIDI note to ABC notation
                            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                            const octave = Math.floor(note.pitch / 12) - 1;
                            const noteIndex = note.pitch % 12;
                            let noteName = noteNames[noteIndex].replace('#', '^');
                            
                            // Handle octaves: C4=c, C5=c', C3=C
                            if (octave >= 4) {
                                noteName = noteName.toLowerCase();
                                if (octave > 4) {
                                    noteName += "'".repeat(octave - 4);
                                }
                            } else if (octave < 4) {
                                noteName = noteName.toUpperCase();
                                if (octave < 3) {
                                    noteName += ','.repeat(3 - octave);
                                }
                            }
                            
                            // Handle duration
                            const duration = note.duration || 1.0;
                            if (duration === 2.0) {
                                noteName += '2';
                            } else if (duration === 0.5) {
                                noteName += '/2';
                            }
                            
                            abcNotes += noteName + ' ';
                            beatCount += duration;
                        }
                    }
                    
                    // Final bar line
                    if (abcNotes.trim()) {
                        abcNotes += '|';
                        abc += abcNotes + '\n';
                    }
                    break; // Only process first track for now
                }
            }
        }
        
        return abc;
    } catch (error) {
        console.error('Error converting to ABC notation:', error);
        return `X:1\nT:Error\nK:C\nz |`;
    }
}