// Example: JMON composition with reverb effect on sampled instruments
const exampleWithReverb = {
  format: "jmon",
  version: "1.0.0",
  tempo: 120,
  
  // Audio graph with sampler -> reverb -> destination chain
  audioGraph: [
    {
      id: "piano",
      type: "Sampler", 
      options: {
        urls: {
          "C4": "https://tonejs.github.io/audio/salamander/C4.mp3",
          "F#4": "https://tonejs.github.io/audio/salamander/Fs4.mp3",
          "A4": "https://tonejs.github.io/audio/salamander/A4.mp3"
        }
      },
      target: "hall" // Route piano through reverb
    },
    {
      id: "hall",
      type: "Reverb",
      options: {
        roomSize: 0.8,
        dampening: 3000
      },
      target: "master" // Route reverb to destination
    },
    {
      id: "master", 
      type: "Destination"
    }
  ],
  
  tracks: [
    {
      label: "Piano with Reverb",
      synthRef: "piano", // Use the audioGraph sampler
      notes: [
        { pitch: "C4", time: 0, duration: 1, velocity: 0.8 },
        { pitch: "E4", time: 1, duration: 1, velocity: 0.8 },
        { pitch: "G4", time: 2, duration: 1, velocity: 0.8 },
        { pitch: "C5", time: 3, duration: 2, velocity: 0.8 }
      ]
    }
  ]
};

// Example: JMON composition with synth through reverb
const synthWithReverb = {
  format: "jmon",
  version: "1.0.0", 
  tempo: 120,
  
  audioGraph: [
    {
      id: "lead",
      type: "PolySynth",
      options: {
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
      },
      target: "reverb"
    },
    {
      id: "reverb",
      type: "JCReverb", 
      options: {
        roomSize: 0.6,
        dampening: 2000
      },
      target: "master"
    },
    {
      id: "master",
      type: "Destination"
    }
  ],
  
  tracks: [
    {
      label: "Synth Lead with JCReverb",
      synthRef: "lead",
      notes: [
        { pitch: ["C4", "E4", "G4"], time: 0, duration: 2, velocity: 0.7 },
        { pitch: ["D4", "F#4", "A4"], time: 2, duration: 2, velocity: 0.7 }
      ]
    }
  ]
};

console.log("Reverb examples created");