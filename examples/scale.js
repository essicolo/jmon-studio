// generate pitches - C major scale starting from C3
const c_major_pitches = new jm.theory.harmony.Scale("C", "major").generate({"start": "C3", "end": 83});
console.log('Generated pitches:', c_major_pitches);

// generate durations
const durations = new Array(c_major_pitches.length).fill(1);

// generate offsets
const offsets = durations.map(
  (duration, i) =>
    durations.slice(0, i + 1).reduce((sum, d) => sum + d, 0) - durations[0]
);

// assemble the track
const c_major_track = c_major_pitches.map((pitch, i) => ({
  pitch: pitch,
  duration: durations[i],
  time: offsets[i]
}));

// assemble the piece
const c_major_piece = {
  format: "jmon",
  version: "1.0.0",
  bpm: 120,
  timeSignature: "4/4",
  keySignature: "C",
  metadata: { title: "C-major Scale" },
  tracks: [
    {
      label: "My track",
      notes: c_major_track
    }
  ]
};

console.log(c_major_piece);

// display the player
document.getElementById('player-container').appendChild(jm.play(c_major_piece, { autoplay: false }));

// display the score
//const abcNotation = jm.converters.abc(c_major_piece);
document.getElementById('score-container').appendChild(jm.score(c_major_piece));