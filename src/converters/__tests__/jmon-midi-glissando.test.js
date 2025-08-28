// jmon-midi-glissando.test.js
// Test for glissando and pitchbend rendering in MIDI converter

const JmonToMidi = require('../converters/jmon-midi.js');

const glissandoComp = {
  format: 'jmonTone',
  version: '1.0',
  bpm: 120,
  keySignature: 'C',
  sequences: [
    {
      label: 'GlissandoTest',
      notes: [
        {
          note: 60,
          duration: 1,
          time: '0:0:0',
          articulation: 'glissando',
          glissTarget: 67 // C4 to G4
        },
        {
          note: 67,
          duration: 1,
          time: '1:0:0'
        }
      ]
    }
  ],
  audioGraph: [],
  connections: []
};

const midi = JmonToMidi.convertToMidi(glissandoComp);
console.log('MIDI output for glissando:', JSON.stringify(midi, null, 2));
if (!midi.tracks[0].notes.some(n => n.midi === 60) || !midi.tracks[0].notes.some(n => n.midi === 67)) throw new Error('Missing notes');
// Should include pitchBend events for glissando
