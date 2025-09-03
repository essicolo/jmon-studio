import { MusicTheoryConstants } from './MusicTheoryConstants.js';

export class Scale {
  constructor(tonic, mode = 'major') {
    this.tonic = tonic;
    this.mode = mode;
  }

  generate(octave = 4, length) {
    const intervals = MusicTheoryConstants.scaleIntervals[this.mode];
    if (!intervals) {
      console.warn(`Unknown scale mode: ${this.mode}`);
      return [];
    }
    
    const tonicIndex = MusicTheoryConstants.getChromaticIndex(this.tonic);
    if (tonicIndex === -1) {
      console.warn(`Unknown tonic: ${this.tonic}`);
      return [];
    }
    
    const basePitches = intervals.map(interval => {
      const noteIndex = (tonicIndex + interval) % 12;
      return 60 + (octave - 4) * 12 + noteIndex; // MIDI note number
    });

    if (length === undefined) {
      return basePitches;
    }

    const result = [];
    let currentOctave = octave;
    
    for (let i = 0; i < length; i++) {
      const scaleIndex = i % intervals.length;
      if (scaleIndex === 0 && i > 0) {
        currentOctave++;
      }
      
      const interval = intervals[scaleIndex];
      const noteIndex = (tonicIndex + interval) % 12;
      const pitch = 60 + (currentOctave - 4) * 12 + noteIndex;
      result.push(pitch);
    }

    return result;
  }

  getNoteNames() {
    const intervals = MusicTheoryConstants.scaleIntervals[this.mode];
    if (!intervals) return [];
    
    const tonicIndex = MusicTheoryConstants.getChromaticIndex(this.tonic);
    if (tonicIndex === -1) return [];
    
    return intervals.map(interval => {
      const noteIndex = (tonicIndex + interval) % 12;
      return MusicTheoryConstants.chromaticNotes[noteIndex];
    });
  }

  isInScale(pitch) {
    const pitchClass = pitch % 12;
    const scalePitches = this.generate().map(p => p % 12);
    return scalePitches.includes(pitchClass);
  }
}
