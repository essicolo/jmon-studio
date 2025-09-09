// Twinkle, Twinkle, Little Star - base melody
const baseTwinkle = {
  format: "jmon",
  version: "1.0.0",
  bpm: 120,
  timeSignature: "4/4",
  keySignature: "C",
  metadata: {
    title: "Twinkle, Twinkle, Little Star",
    composer: "Traditional",
  },
  tracks: [
    {
      label: "Base Melody",
      notes: [
        // First verse - JMON object format
        { pitch: 60, duration: 1.0, time: 0.0 }, // Twin
        { pitch: 60, duration: 1.0, time: 1.0 }, // kle
        { pitch: 67, duration: 1.0, time: 2.0 }, // twin
        { pitch: 67, duration: 1.0, time: 3.0 }, // kle
        { pitch: 69, duration: 1.0, time: 4.0 }, // lit
        { pitch: 69, duration: 1.0, time: 5.0 }, // tle
        { pitch: 67, duration: 2.0, time: 6.0 }, // star
        { pitch: 65, duration: 1.0, time: 8.0 }, // How
        { pitch: 65, duration: 1.0, time: 9.0 }, // I
        { pitch: 64, duration: 1.0, time: 10.0 }, // won
        { pitch: 64, duration: 1.0, time: 11.0 }, // der
        { pitch: 62, duration: 1.0, time: 12.0 }, // what
        { pitch: 62, duration: 1.0, time: 13.0 }, // you
        { pitch: 60, duration: 2.0, time: 14.0 }, // are

        // Second verse
        { pitch: 67, duration: 1.0, time: 16.0 }, // Up
        { pitch: 67, duration: 1.0, time: 17.0 }, // a
        { pitch: 65, duration: 1.0, time: 18.0 }, // bove
        { pitch: 65, duration: 1.0, time: 19.0 }, // the
        { pitch: 64, duration: 1.0, time: 20.0 }, // world
        { pitch: 64, duration: 1.0, time: 21.0 }, // so
        { pitch: 62, duration: 2.0, time: 22.0 }, // high

        // "Like a diamond in the sky"
        { pitch: 67, duration: 1.0, time: 24.0 }, // Like
        { pitch: 67, duration: 1.0, time: 25.0 }, // a
        { pitch: 65, duration: 1.0, time: 26.0 }, // dia
        { pitch: 65, duration: 1.0, time: 27.0 }, // mond
        { pitch: 64, duration: 1.0, time: 28.0 }, // in
        { pitch: 64, duration: 1.0, time: 29.0 }, // the
        { pitch: 62, duration: 2.0, time: 30.0 }, // sky

        // Final verse - repeat
        { pitch: 60, duration: 1.0, time: 32.0 }, // Twin
        { pitch: 60, duration: 1.0, time: 33.0 }, // kle
        { pitch: 67, duration: 1.0, time: 34.0 }, // twin
        { pitch: 67, duration: 1.0, time: 35.0 }, // kle
        { pitch: 69, duration: 1.0, time: 36.0 }, // lit
        { pitch: 69, duration: 1.0, time: 37.0 }, // tle
        { pitch: 67, duration: 2.0, time: 38.0 }, // star
        { pitch: 65, duration: 1.0, time: 40.0 }, // How
        { pitch: 65, duration: 1.0, time: 41.0 }, // I
        { pitch: 64, duration: 1.0, time: 42.0 }, // won
        { pitch: 64, duration: 1.0, time: 43.0 }, // der
        { pitch: 62, duration: 1.0, time: 44.0 }, // what
        { pitch: 62, duration: 1.0, time: 45.0 }, // you
        { pitch: 60, duration: 4.0, time: 46.0 }, // are
      ],
    },
  ],
};

// Apply ornaments using the API
let ornamentedNotes = [...baseTwinkle.tracks[0].notes];
console.log([...baseTwinkle.tracks[0].notes]);

// 1. Grace note (acciaccatura) - first note
const graceNote1 = new jm.theory.harmony.Ornament({
  type: "grace_note",
  parameters: {
    graceNoteType: "acciaccatura",
    gracePitches: [59],
  },
});
ornamentedNotes = graceNote1.apply(ornamentedNotes, 0);

// 2. Turn - on "little"
const turn1 = new jm.theory.harmony.Ornament({
  type: "turn",
});
ornamentedNotes = turn1.apply(ornamentedNotes, 2);

// 3. Mordent - on "How"
const mordent1 = new jm.theory.harmony.Ornament({
  type: "mordent",
  parameters: { by: 1 },
});
ornamentedNotes = mordent1.apply(ornamentedNotes, 4);

// 4. Trill - on "wonder"
const trill1 = new jm.theory.harmony.Ornament({
  type: "trill",
  parameters: { by: 1, trillRate: 0.125 },
});
ornamentedNotes = trill1.apply(ornamentedNotes, 6);

// 5. Grace note (appoggiatura) - on "what"
const graceNote2 = new jm.theory.harmony.Ornament({
  type: "grace_note",
  parameters: {
    graceNoteType: "appoggiatura",
    gracePitches: [66],
  },
});
ornamentedNotes = graceNote2.apply(ornamentedNotes, 7);

// 6. Arpeggio - on "so"
const arpeggio1 = new jm.theory.harmony.Ornament({
  type: "arpeggio",
  parameters: {
    arpeggioDegrees: [0, 2, 4],
    direction: "up",
  },
});
ornamentedNotes = arpeggio1.apply(ornamentedNotes, 20);

// 7. Mordent (lower) - on "diamond"
const mordent2 = new jm.theory.harmony.Ornament({
  type: "mordent",
  parameters: { by: -1 },
});
ornamentedNotes = mordent2.apply(ornamentedNotes, 26);

// 8. Arpeggio (downward) - on "the"
const arpeggio2 = new jm.theory.harmony.Ornament({
  type: "arpeggio",
  parameters: {
    arpeggioDegrees: [0, -2, -4],
    direction: "down",
  },
});
ornamentedNotes = arpeggio2.apply(ornamentedNotes, 28);

// 9. Final trill with different settings
const trill2 = new jm.theory.harmony.Ornament({
  type: "trill",
  parameters: { by: 2, trillRate: 0.1 },
});
ornamentedNotes = trill2.apply(ornamentedNotes, ornamentedNotes.length - 1);

// Create the final ornamented piece - no conversion needed!
const twinkleWithOrnaments = {
  ...baseTwinkle,
  metadata: {
    title: "Twinkle, Twinkle, Little Star (with Ornaments)",
    composer: "Traditional (ornamented with API)",
  },
  tracks: [
    {
      label: "Ornamented Melody",
      notes: ornamentedNotes,
    },
  ],
};

// Display the player
document.getElementById("player-container").appendChild(
  jm.play(twinkleWithOrnaments, { autoplay: false }),
);

// Display the score
document.getElementById("score-container").appendChild(
  jm.score(twinkleWithOrnaments),
);

// Log information about ornaments used
console.log("Ornament types demonstrated:");
console.log("1. Grace notes (acciaccatura and appoggiatura)");
console.log("2. Trills (various speeds and intervals)");
console.log("3. Mordents (upper and lower)");
console.log("4. Turns (melodic ornaments)");
console.log("5. Arpeggios (up, down, and both directions)");

// Show the ABC notation with smart line breaks
const abcNotation = jm.converters.abc(twinkleWithOrnaments, {
  measuresPerLine: 4, // 4 measures per line
  lineBreaks: [8, 16], // Additional breaks after measures 8 and 16
});
console.log("ABC notation with smart line breaks:", abcNotation);

// Example without line breaks for comparison
const abcNoBreaks = jm.converters.abc(twinkleWithOrnaments);
console.log("ABC notation without line breaks:", abcNoBreaks);
