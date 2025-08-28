// jmon-player-glissando.test.js
// Test for glissando rendering in music-player

const { createPlayer } = require('../browser/music-player.js');

const glissandoComp = {
  format: 'jmonTone',
  version: '1.0',
  bpm: 120,
  sequences: [
    {
      label: 'GlissandoTest',
      notes: [
        {
          note: 'C4',
          duration: 1,
          time: 0,
          articulation: 'glissando',
          glissTarget: 'G4'
        },
        {
          note: 'G4',
          duration: 1,
          time: 1
        }
      ]
    }
  ]
};

// This test is for manual/visual verification in browser
const player = createPlayer(glissandoComp);
document.body.appendChild(player);
console.log('Player created for glissando test. Please verify visually and by ear.');
