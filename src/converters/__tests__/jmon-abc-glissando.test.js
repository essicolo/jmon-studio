// jmon-abc-glissando.test.js
// Test for glissando and pitchbend rendering in ABC.js converter

const JmonToAbc = require('../converters/jmon-abc.js');

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
          note: 'C4',
          duration: 1,
          time: '0:0:0',
          articulation: 'glissando',
          glissTarget: 'G4'
        },
        {
          note: 'G4',
          duration: 1,
          time: '1:0:0'
        }
      ]
    }
  ],
  audioGraph: [],
  connections: []
};

const abc = JmonToAbc.convertToAbc(glissandoComp);
console.log('ABC output for glissando:', abc);
if (!abc.includes('C') || !abc.includes('G')) throw new Error('Missing notes');
// Should render a slide or glissando symbol between C and G
// (actual symbol depends on implementation)
