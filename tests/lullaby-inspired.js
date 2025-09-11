// A gentle lullaby inspired by minimalist composition patterns
// Features C minor arpeggio in left hand and simple melodic movement in right hand
// Original composition - not a reproduction of copyrighted material

const lullabyInspired = {
  format: "jmon",
  tempo: 60, // Slow, peaceful tempo
  timeSignature: "4/4",
  keySignature: "Cm",
  metadata: { 
    title: "Gentle Lullaby (Original)",
    composer: "JMON Studio Example",
    description: "Inspired by minimalist patterns with C minor arpeggio and gentle melody"
  },
  tracks: [
    {
      name: "left_hand_arpeggio",
      notes: [
        // C minor arpeggio pattern (C-Eb-G) - flowing and gentle
        { time: 0,  pitch: 48, duration: 1, velocity: 0.4 }, // C3
        { time: 1,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 2,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 3,  pitch: 60, duration: 1, velocity: 0.3 }, // C4
        { time: 4,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 5,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 6,  pitch: 48, duration: 1, velocity: 0.4 }, // C3
        { time: 7,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        
        // Second phrase - slight variation
        { time: 8,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 9,  pitch: 60, duration: 1, velocity: 0.3 }, // C4
        { time: 10, pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 11, pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 12, pitch: 48, duration: 2, velocity: 0.4 }, // C3
        { time: 14, pitch: 43, duration: 2, velocity: 0.3 }, // G2 (deeper resolution)
        
        // Third phrase - extended pattern
        { time: 16, pitch: 48, duration: 1, velocity: 0.4 }, // C3
        { time: 17, pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 18, pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 19, pitch: 60, duration: 1, velocity: 0.3 }, // C4
        { time: 20, pitch: 63, duration: 1, velocity: 0.3 }, // Eb4 (higher)
        { time: 21, pitch: 60, duration: 1, velocity: 0.3 }, // C4
        { time: 22, pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 23, pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 24, pitch: 48, duration: 8, velocity: 0.4 }, // C3 (long resolution)
      ],
      synthRef: "piano_left"
    },
    {
      name: "right_hand_melody",
      notes: [
        // Simple melodic movement - enters after the arpeggio is established
        { time: 2,  pitch: 74, duration: 2, velocity: 0.6 }, // D5
        { time: 4,  pitch: 72, duration: 2, velocity: 0.5 }, // C5
        { time: 6,  pitch: 75, duration: 2, velocity: 0.6 }, // Eb5 (D#)
        { time: 8,  pitch: 74, duration: 2, velocity: 0.5 }, // D5
        { time: 10, pitch: 72, duration: 2, velocity: 0.6 }, // C5
        { time: 12, pitch: 67, duration: 4, velocity: 0.4 }, // G4 (resolution)
        
        // Second phrase - higher and more expressive
        { time: 18, pitch: 79, duration: 1.5, velocity: 0.7 }, // G5
        { time: 19.5, pitch: 77, duration: 1.5, velocity: 0.6 }, // F5
        { time: 21, pitch: 75, duration: 2, velocity: 0.6 }, // Eb5
        { time: 23, pitch: 74, duration: 2, velocity: 0.5 }, // D5
        { time: 25, pitch: 72, duration: 3, velocity: 0.5 }, // C5
        { time: 28, pitch: 67, duration: 4, velocity: 0.4 }, // G4 (final resolution)
      ],
      synthRef: "piano_right"
    }
  ],
  audioGraph: {
    nodes: [
      // Left hand - deeper, more sustained envelope
      jm.instruments.createGMInstrumentNode(0, "piano_left", {
        noteRange: [21, 108],
        envelope: { attack: 0.02, release: 1.5 },
        strategy: "complete" // Full sampling for best quality
      }),
      // Right hand - softer attack, longer release for melodic expression
      jm.instruments.createGMInstrumentNode(0, "piano_right", {
        noteRange: [21, 108], 
        envelope: { attack: 0.1, release: 2.0 },
        strategy: "complete"
      })
    ],
    connections: []
  }
};

console.log("Lullaby composition created");
console.log("Duration: ~32 beats (32 seconds at 60 BPM)");
console.log("Key: C minor");
console.log("Pattern: Left hand C minor arpeggio, right hand melodic movement");

// Display the player (if in browser environment)
if (typeof document !== 'undefined') {
  const playerContainer = document.getElementById('player-container') || document.body;
  playerContainer.appendChild(jm.play(lullabyInspired, { autoplay: false }));
  
  // Also show the score if possible
  const scoreContainer = document.getElementById('score-container');
  if (scoreContainer) {
    scoreContainer.appendChild(jm.score(lullabyInspired));
  }
}

// Export for use in other modules
if (typeof module !== 'undefined') {
  module.exports = lullabyInspired;
}
