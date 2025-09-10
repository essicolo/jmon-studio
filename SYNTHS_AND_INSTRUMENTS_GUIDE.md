# Synths and Instruments Guide for JMON Studio

## Table of Contents
1. [Introduction](#introduction)
2. [Basic Tone.js Synthesizers](#basic-tonejs-synthesizers)
3. [General MIDI Instruments](#general-midi-instruments)
4. [Audio Graph Configuration](#audio-graph-configuration)
5. [Sampling Strategies](#sampling-strategies)
6. [Complete Examples](#complete-examples)

## Introduction

JMON Studio provides powerful audio synthesis capabilities through integration with Tone.js and pre-configured General MIDI (GM) instruments. This guide will walk you through creating musical compositions with different types of synthesizers and high-quality sampled instruments.

### Key Concepts

- **Synth**: A synthesizer generates sounds algorithmically using oscillators, filters, and envelopes
- **Sampler**: Plays back recorded audio samples, triggered by MIDI notes
- **Audio Graph**: Defines the synthesis chain and effects processing
- **synthRef**: A label that connects tracks to their sound sources in the audio graph

## Basic Tone.js Synthesizers

Let's start with a simple example using Tone.js synthesizers. Here's "One Small Step for Man..." rendered with different synth types:

### Simple Synth Example

```javascript
// A gentle lullaby inspired by minimalist composition patterns
const gentleLullaby = {
  format: "jmon",
  tempo: 60, // Slow, peaceful tempo
  tracks: [
    {
      name: "left_hand_arpeggio",
      notes: [
        // C minor arpeggio pattern (C-Eb-G) repeated
        { time: 0,  pitch: 48, duration: 1, velocity: 0.4 }, // C3
        { time: 1,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 2,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 3,  pitch: 60, duration: 1, velocity: 0.3 }, // C4
        { time: 4,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 5,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 6,  pitch: 48, duration: 1, velocity: 0.4 }, // C3
        { time: 7,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        
        // Repeat pattern
        { time: 8,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 9,  pitch: 60, duration: 1, velocity: 0.3 }, // C4
        { time: 10, pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 11, pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 12, pitch: 48, duration: 4, velocity: 0.4 }, // C3 (held)
      ],
      synthRef: "left_hand_piano"
    },
    {
      name: "right_hand_melody",
      notes: [
        // Simple melodic movement inspired by the pattern you described
        { time: 2,  pitch: 74, duration: 2, velocity: 0.6 }, // D5
        { time: 4,  pitch: 72, duration: 2, velocity: 0.5 }, // C5
        { time: 6,  pitch: 75, duration: 2, velocity: 0.6 }, // Eb5 (D#)
        { time: 8,  pitch: 74, duration: 2, velocity: 0.5 }, // D5
        { time: 10, pitch: 72, duration: 2, velocity: 0.6 }, // C5
        { time: 12, pitch: 67, duration: 4, velocity: 0.4 }, // G4 (resolution)
      ],
      synthRef: "right_hand_piano"
    }
  ],
  audioGraph: {
    nodes: [
      {
        id: "left_hand_piano",
        type: "Synth",
        options: {
          oscillator: { type: "sine" },
          envelope: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 1.5 }
        },
        target: "destination"
      },
      {
        id: "right_hand_piano", 
        type: "Synth",
        options: {
          oscillator: { type: "triangle" },
          envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 2.0 }
        },
        target: "destination"
      }
    ],
    connections: []
  }
};

// Play the composition
jm.play(gentleLullaby, { Tone });
```

### Different Synth Types

Here are examples of various Tone.js synthesizers you can use:

#### 1. Basic Synth (Monophonic)
```javascript
{
  id: "mono_synth",
  type: "Synth",
  options: {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.4 }
  },
  target: "destination"
}
```

#### 2. PolySynth (Polyphonic)
```javascript
{
  id: "poly_synth", 
  type: "PolySynth",
  options: {
    polyphony: 8,
    synth: {
      oscillator: { type: "square" },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.9 }
    }
  },
  target: "destination"
}
```

#### 3. FMSynth (Frequency Modulation)
```javascript
{
  id: "fm_synth",
  type: "FMSynth", 
  options: {
    harmonicity: 3,
    modulationIndex: 10,
    envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.5 }
  },
  target: "destination"
}
```

#### 4. AMSynth (Amplitude Modulation)
```javascript
{
  id: "am_synth",
  type: "AMSynth",
  options: {
    harmonicity: 2,
    envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.5 }
  },
  target: "destination"
}
```

## General MIDI Instruments

JMON Studio includes high-quality sampled instruments based on the General MIDI standard. These use FluidR3 soundfonts for realistic instrument sounds.

### Available GM Instruments

You can get a list of popular instruments:

```javascript
const popularInstruments = jm.instruments.getPopularInstruments();
console.log(popularInstruments);
/* Output:
[
  { program: 0, name: "Acoustic Grand Piano", category: "Piano" },
  { program: 40, name: "Violin", category: "Strings" },
  { program: 56, name: "Trumpet", category: "Brass" },
  { program: 73, name: "Flute", category: "Woodwinds" },
  // ... more instruments
]
*/
```

### Using GM Instruments

Here's our lullaby example using a high-quality piano sampler:

```javascript
const lullabyPiano = {
  format: "jmon",
  tempo: 60,
  tracks: [
    {
      name: "left_hand_arpeggio",
      notes: [
        // C minor arpeggio pattern
        { time: 0,  pitch: 48, duration: 1, velocity: 0.4 }, // C3
        { time: 1,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 2,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 3,  pitch: 60, duration: 1, velocity: 0.3 }, // C4
        { time: 4,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 5,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 6,  pitch: 48, duration: 1, velocity: 0.4 }, // C3
        { time: 7,  pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 8,  pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 9,  pitch: 60, duration: 1, velocity: 0.3 }, // C4
        { time: 10, pitch: 55, duration: 1, velocity: 0.3 }, // G3
        { time: 11, pitch: 51, duration: 1, velocity: 0.3 }, // Eb3
        { time: 12, pitch: 48, duration: 4, velocity: 0.4 }, // C3 (held)
      ],
      synthRef: "piano_left"
    },
    {
      name: "right_hand_melody", 
      notes: [
        // Gentle melodic movement
        { time: 2,  pitch: 74, duration: 2, velocity: 0.6 }, // D5
        { time: 4,  pitch: 72, duration: 2, velocity: 0.5 }, // C5
        { time: 6,  pitch: 75, duration: 2, velocity: 0.6 }, // Eb5
        { time: 8,  pitch: 74, duration: 2, velocity: 0.5 }, // D5
        { time: 10, pitch: 72, duration: 2, velocity: 0.6 }, // C5
        { time: 12, pitch: 67, duration: 4, velocity: 0.4 }, // G4
      ],
      synthRef: "piano_right"
    }
  ],
  audioGraph: {
    nodes: [
      jm.instruments.createGMInstrumentNode(0, "piano_left", {
        noteRange: [21, 108],
        envelope: { attack: 0.02, release: 1.5 }
      }),
      jm.instruments.createGMInstrumentNode(0, "piano_right", {
        noteRange: [21, 108], 
        envelope: { attack: 0.1, release: 2.0 }
      })
    ],
    connections: []
  }
};

jm.play(lullabyPiano, { Tone });
```

### Popular GM Program Numbers

Here are some commonly used GM instrument program numbers:

```javascript
// Piano Family
0  - Acoustic Grand Piano
1  - Bright Acoustic Piano  
4  - Electric Piano 1

// Strings
40 - Violin
42 - Cello
48 - String Ensemble 1

// Brass
56 - Trumpet
57 - Trombone
58 - Tuba

// Woodwinds
65 - Alto Sax
71 - Clarinet
73 - Flute

// Guitar & Bass
24 - Acoustic Guitar (nylon)
25 - Acoustic Guitar (steel)
33 - Electric Bass (finger)

// Organs
16 - Drawbar Organ
21 - Accordion
```

## Audio Graph Configuration

The `audioGraph` defines how your synthesizers and effects are connected. Here's the basic structure:

### Simple Audio Graph
```javascript
audioGraph: {
  nodes: [
    {
      id: "my_synth",           // Unique identifier
      type: "Synth",            // Synth type
      options: { /* ... */ },   // Synth-specific options
      target: "destination"     // Where to send the audio
    }
  ],
  connections: []             // For more complex routing
}
```

### Multi-Track Example
```javascript
const multiTrackExample = {
  format: "jmon",
  tempo: 120,
  tracks: [
    {
      name: "piano",
      notes: [
        { time: 0, pitch: 60, duration: 2, velocity: 0.8 },
        { time: 2, pitch: 64, duration: 2, velocity: 0.8 },
      ],
      synthRef: "piano_sampler"
    },
    {
      name: "strings",
      notes: [
        { time: 1, pitch: 67, duration: 2, velocity: 0.6 },
        { time: 3, pitch: 72, duration: 2, velocity: 0.6 },
      ],
      synthRef: "string_ensemble"
    }
  ],
  audioGraph: {
    nodes: [
      jm.instruments.createGMInstrumentNode(0, "piano_sampler"),      // Acoustic Grand Piano
      jm.instruments.createGMInstrumentNode(48, "string_ensemble")    // String Ensemble 1
    ],
    connections: []
  }
};
```

## Sampling Strategies

JMON Studio offers different sampling strategies to balance audio quality with loading time and bandwidth usage.

### Strategy Options

1. **minimal** - ~8 samples, fastest loading
2. **balanced** - ~16 samples, good quality/size ratio
3. **quality** - ~20 samples, high quality
4. **complete** - 88 samples, maximum quality (default)

### Strategy Comparison

```javascript
// Minimal sampling (fast loading, good for prototyping)
const minimalInstrument = jm.instruments.createGMInstrumentNode(40, "violin_min", {
  strategy: "minimal",
  envelope: { attack: 0.01, release: 1.0 }
});

// Balanced sampling (recommended for most applications)
const balancedInstrument = jm.instruments.createGMInstrumentNode(40, "violin_bal", {
  strategy: "balanced", 
  envelope: { attack: 0.01, release: 1.0 }
});

// Complete sampling (best quality, default)
const completeInstrument = jm.instruments.createGMInstrumentNode(40, "violin_full", {
  strategy: "complete",
  envelope: { attack: 0.01, release: 1.0 }
});
```

### Custom Note Ranges

You can also specify custom note ranges for your instruments:

```javascript
// Bass instrument with limited low range
const bassInstrument = jm.instruments.createGMInstrumentNode(33, "bass", {
  noteRange: [28, 55],  // E1 to G3
  strategy: "complete"
});

// High strings with limited high range  
const highStrings = jm.instruments.createGMInstrumentNode(40, "high_violin", {
  noteRange: [55, 96],  // G3 to C7
  strategy: "balanced"
});
```

## Complete Examples

### Example 1: Classical String Quartet
```javascript
const stringQuartet = {
  format: "jmon",
  tempo: 90,
  tracks: [
    {
      name: "violin1",
      notes: [
        { time: 0, pitch: 72, duration: 1, velocity: 0.8 },
        { time: 1, pitch: 74, duration: 1, velocity: 0.7 },
        { time: 2, pitch: 76, duration: 2, velocity: 0.9 }
      ],
      synthRef: "violin1"
    },
    {
      name: "violin2", 
      notes: [
        { time: 0, pitch: 67, duration: 1, velocity: 0.7 },
        { time: 1, pitch: 69, duration: 1, velocity: 0.6 },
        { time: 2, pitch: 71, duration: 2, velocity: 0.8 }
      ],
      synthRef: "violin2"
    },
    {
      name: "viola",
      notes: [
        { time: 0, pitch: 60, duration: 2, velocity: 0.6 },
        { time: 2, pitch: 62, duration: 2, velocity: 0.7 }
      ],
      synthRef: "viola"
    },
    {
      name: "cello",
      notes: [
        { time: 0, pitch: 48, duration: 4, velocity: 0.8 },
      ],
      synthRef: "cello"
    }
  ],
  audioGraph: {
    nodes: [
      jm.instruments.createGMInstrumentNode(40, "violin1"),  // Violin
      jm.instruments.createGMInstrumentNode(40, "violin2"),  // Violin  
      jm.instruments.createGMInstrumentNode(41, "viola"),    // Viola
      jm.instruments.createGMInstrumentNode(42, "cello")     // Cello
    ],
    connections: []
  }
};
```

### Example 2: Jazz Combo with Effects
```javascript
const jazzCombo = {
  format: "jmon",
  tempo: 120,
  tracks: [
    {
      name: "piano", 
      notes: [
        { time: 0, pitch: 60, duration: 0.5, velocity: 0.8 },
        { time: 0.5, pitch: 64, duration: 0.5, velocity: 0.7 },
        { time: 1, pitch: 67, duration: 1, velocity: 0.9 }
      ],
      synthRef: "jazz_piano"
    },
    {
      name: "bass",
      notes: [
        { time: 0, pitch: 36, duration: 1, velocity: 0.9 },
        { time: 1, pitch: 43, duration: 1, velocity: 0.8 }
      ],
      synthRef: "upright_bass"
    },
    {
      name: "trumpet",
      notes: [
        { time: 2, pitch: 72, duration: 0.5, velocity: 0.9 },
        { time: 2.5, pitch: 74, duration: 0.5, velocity: 0.8 },
        { time: 3, pitch: 76, duration: 1, velocity: 1.0 }
      ],
      synthRef: "trumpet"
    }
  ],
  audioGraph: {
    nodes: [
      jm.instruments.createGMInstrumentNode(4, "jazz_piano", {   // Electric Piano 1
        strategy: "quality"
      }),
      jm.instruments.createGMInstrumentNode(32, "upright_bass", { // Acoustic Bass
        noteRange: [28, 55],
        strategy: "complete"
      }),
      jm.instruments.createGMInstrumentNode(56, "trumpet", {      // Trumpet
        strategy: "balanced",
        envelope: { attack: 0.02, release: 0.8 }
      })
    ],
    connections: []
  }
};
```

### Example 3: Electronic Music with Synths
```javascript
const electronicTrack = {
  format: "jmon",
  tempo: 128,
  tracks: [
    {
      name: "lead",
      notes: [
        { time: 0, pitch: 60, duration: 0.25, velocity: 0.8 },
        { time: 0.25, pitch: 62, duration: 0.25, velocity: 0.7 },
        { time: 0.5, pitch: 64, duration: 0.25, velocity: 0.9 },
        { time: 0.75, pitch: 67, duration: 0.25, velocity: 0.8 }
      ],
      synthRef: "lead_synth"
    },
    {
      name: "bass",
      notes: [
        { time: 0, pitch: 36, duration: 0.5, velocity: 0.9 },
        { time: 0.5, pitch: 36, duration: 0.5, velocity: 0.8 }
      ],
      synthRef: "bass_synth"
    }
  ],
  audioGraph: {
    nodes: [
      {
        id: "lead_synth",
        type: "FMSynth",
        options: {
          harmonicity: 3,
          modulationIndex: 10,
          envelope: { attack: 0.01, decay: 0.01, sustain: 1, release: 0.5 }
        },
        target: "destination"
      },
      {
        id: "bass_synth", 
        type: "Synth",
        options: {
          oscillator: { type: "square" },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.4 },
          filter: { frequency: 200, Q: 10 }
        },
        target: "destination"
      }
    ],
    connections: []
  }
};
```

## Best Practices

### 1. Choosing Between Synths and Samplers
- Use **synthesizers** for electronic music, sound effects, and when you need precise control over timbre
- Use **samplers** (GM instruments) for acoustic instruments and realistic orchestral sounds

### 2. Sampling Strategy Selection
- **minimal**: For quick prototypes and when bandwidth is very limited
- **balanced**: Good default choice for most applications
- **quality**: When audio quality is important but file size matters  
- **complete**: When you need the highest possible quality

### 3. Performance Considerations
- Limit the number of simultaneous sampler instances to avoid memory issues
- Use appropriate note ranges to reduce sample loading
- Consider using "balanced" strategy for most instruments unless maximum quality is required

### 4. Envelope Settings
- **attack**: How quickly the sound reaches full volume (0.01-0.1 for most instruments)
- **release**: How long the sound takes to fade after note off (0.5-2.0 for sustained instruments)

### 5. Velocity Mapping
- Use velocity values between 0.1-1.0 for realistic dynamics
- Vary velocities within tracks for musical expression
- Higher velocity values (0.8-1.0) for accents and strong beats

## Troubleshooting

### Common Issues

1. **No sound playing**: Check that `Tone` is passed to `jm.play(composition, { Tone })`
2. **Samples not loading**: Verify internet connection; GM instruments load from CDN
3. **Performance issues**: Try using "balanced" or "minimal" sampling strategies
4. **Missing instruments**: Check that the GM program number exists in `jm.instruments.GM_INSTRUMENTS`

### Debugging Tips

```javascript
// Check available instruments
console.log(jm.instruments.getPopularInstruments());

// Test sample URL generation
console.log(jm.instruments.generateSamplerUrls(40, undefined, [60, 72], "balanced"));

// Validate JMON object
const result = jm.validate(composition);
console.log("Valid:", result.valid);
if (!result.valid) console.log("Errors:", result.errors);
```

This guide should help you get started with creating rich musical compositions using both synthetic and sampled instruments in JMON Studio. Experiment with different combinations of synthesizers and GM instruments to find the perfect sound for your musical creations!

<citations>
<document>
<document_type>RULE</document_type>
<document_id>/Users/essi/Documents/GitHub/jmon-studio/WARP.md</document_id>
</document>
</citations>
