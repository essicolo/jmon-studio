export const MusicTheoryConstants = {
  // Scale intervals (semitones from root)
  scaleIntervals: {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10],
    'dorian': [0, 2, 3, 5, 7, 9, 10],
    'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'locrian': [0, 1, 3, 5, 6, 8, 10],
    'harmonic_minor': [0, 2, 3, 5, 7, 8, 11],
    'melodic_minor': [0, 2, 3, 5, 7, 9, 11]
  },
  
  // Chromatic note names
  chromaticNotes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  
  // Alternative property name for compatibility
  get chromaticScale() {
    return this.chromaticNotes;
  },
  
  // Get chromatic index of a note
  getChromaticIndex(note) {
    return this.chromaticNotes.indexOf(note.toUpperCase());
  },
  
  // Legacy constants for backwards compatibility
  MAJOR_SCALE: [0, 2, 4, 5, 7, 9, 11],
  MINOR_SCALE: [0, 2, 3, 5, 7, 8, 10]
};
