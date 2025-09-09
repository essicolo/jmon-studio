# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Commands

### Building and Development
```bash
npm run build       # Build the library using Vite
npm run dev        # Start development server with Vite
npm run preview    # Preview the built library
npm run clean      # Remove the dist directory
```

### Testing
```bash
npm test           # Run all tests (build first, then run test/simple-test.js)
```

### Publishing
```bash
npm run prepublishOnly  # Clean and build before publishing (automatically run by npm publish)
```

### Running Individual Tests
The main library tests are located in `src/algorithms/__tests__/` and `src/converters/__tests__/`. For individual test execution:
```bash
# Run a specific test module using Node.js
node src/algorithms/__tests__/jmon-integration.test.js
node src/converters/__tests__/abc-glissando.test.js
```

Note: This project uses a custom test runner rather than Jest/Mocha, with tests written in plain Node.js modules.

## High-Level Architecture

### Core JMON Format
This library implements JMON (JSON Music Object Notation), a declarative format for algorithmic music composition. The format supports:
- Multi-track compositions with numeric timing in quarter notes for MIDI compatibility
- Synthesis and audio graph configuration with Tone.js integration
- Musical ornaments, articulations, and advanced performance instructions
- Format conversion to ABC notation, MIDI, WAV, and SuperCollider
- Comprehensive schema validation via JSON Schema
- Optional bars:beats:ticks format for display and external formats

### Main Entry Points
- **`src/index.js`**: Primary export providing the `jm` object with core functions (`render`, `play`, `score`, `validate`)
- **Package exports**: Both UMD (`dist/jmon.umd.js`) and ESM (`dist/jmon.esm.js`) builds available
- **Observable integration**: Designed for ObservableHQ with `require("jmon-studio@latest")` pattern

### Key Architectural Modules

#### 1. Algorithms (`src/algorithms/`)
- **Theory**: Harmony (scales, progressions, voices), rhythm, and motif handling
- **Generative**: Gaussian processes, cellular automata, genetic algorithms, fractals, random walks, minimalism processes
- **Analysis**: Musical analysis tools for algorithmic composition
- **Constants**: Music theory constants and data structures

#### 2. Converters (`src/converters/`)
- **ABC**: Musical score notation conversion with multi-voice support
- **MIDI**: MIDI file generation with modulation support
- **Tone.js**: Real-time audio synthesis integration
- **WAV**: Audio file generation
- **SuperCollider**: Code generation for SuperCollider

#### 3. Browser Integration (`src/browser/`)
- **Music Player**: HTML5 audio player creation with JMON objects
- **Score Renderer**: Visual score rendering using ABCJS library

#### 4. Validation (`src/utils/`)
- **JMON Validator**: Schema-based validation using AJV against `schemas/jmon-schema.json`
- Automatic normalization of JMON objects for consistent processing

### Core Workflow
1. **Composition Creation**: Use algorithmic tools to generate JMON objects or create them manually
2. **Validation**: All JMON objects are validated against the comprehensive JSON schema
3. **Rendering/Playback**: Convert to audio using Tone.js or visual scores using ABCJS
4. **Export**: Convert to various formats (MIDI, ABC, WAV, SuperCollider) for external use

### Key Design Patterns
- **Modular architecture**: Clear separation between theory, generation, conversion, and playback
- **Format-first approach**: Everything revolves around the JMON schema specification
- **Observable-ready**: Built for interactive notebook environments with immediate visual/audio feedback
- **Peer dependency pattern**: Core audio libraries (Tone.js, ABCJS, Plotly.js) are peer dependencies to avoid version conflicts

### Important Implementation Notes
- **Time format**: Uses numeric time in quarter notes (e.g., 4.5) as primary format for MIDI compatibility and algorithmic processing
- **Display format**: Provides bars:beats:ticks conversion for display and external format compatibility
- **Audio Graph**: Supports complex synthesis chains with effects processing via audio node graphs
- **Modulation support**: Comprehensive MIDI CC, pitch bend, and aftertouch support
- **Multi-track**: Full support for complex multi-track compositions with individual synthesis chains
