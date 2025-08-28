// jmon-wav-glissando.test.js
// Test for glissando rendering in WAV converter

const { JmonWav } = require('../converters/jmon-wav.js');

const glissandoComp = {
  format: 'jmonTone',
  version: '1.0',
  bpm: 120,
  keySignature: 'C',
  tracks: {
    main: [
      {
        pitch: 60,
        duration: 1,
        time: 0,
        articulation: 'glissando',
        glissTarget: 67 // C4 to G4
      },
      {
        pitch: 67,
        duration: 1,
        time: 1
      }
    ]
  }
};

const wav = JmonWav().generateWAV(glissandoComp, { duration: 2 });
console.log('WAV buffer length:', wav.byteLength);
if (!wav || wav.byteLength < 1000) throw new Error('WAV output too small');
// Should synthesize a glissando between C4 and G4
