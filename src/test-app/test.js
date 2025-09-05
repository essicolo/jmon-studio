import { jm } from '../src/index.js';

// Exemple de test
const piece = {
  bpm: 120,
  tracks: [
    { label: 'Test', notes: [{ pitch: 60, duration: 1, time: 0 }] }
  ]
};

console.log(jm.converters.abc(piece));