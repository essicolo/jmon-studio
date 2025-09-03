/**
 * JMON WAV - WAV audio generation from JMON format
 * Generates WAV audio files from JMON compositions
 */

if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { JmonWav };
} else {
    // Browser environment - attach to global scope
    window.JmonWav = JmonWav;
}

function JmonWav() {
    
    function generateWAV(composition, options = {}) {
        const {
            sampleRate = 44100,
            duration = 10,
            channels = 1,
            bpm = composition.metadata?.tempo || 120
        } = options;
        
        const beatDuration = 60 / bpm;
        const length = sampleRate * duration;
        
        // Create audio buffer
        const buffer = new Float32Array(length);
        
        // Get all tracks
        const tracks = composition.tracks || {};
        const allNotes = [];
        
        // Collect all notes from all tracks
        Object.values(tracks).forEach(track => {
            if (Array.isArray(track)) {
                allNotes.push(...track);
            }
        });
        
        if (allNotes.length === 0) {
            throw new Error('No notes found in composition');
        }
        
        // Synthesize each note
        for (const note of allNotes) {
            if (note.pitch && note.time !== undefined && note.duration) {
                let startFreq = midiToFrequency(note.pitch);
                let endFreq = startFreq;
                let isGliss = note.articulation === 'glissando' && note.glissTarget !== undefined;
                if (isGliss) {
                    endFreq = midiToFrequency(note.glissTarget);
                }
                // Articulation logic
                let noteDuration = note.duration;
                let noteVelocity = note.velocity || 0.8;
                if (note.articulation === 'staccato') {
                    noteDuration = note.duration * 0.5;
                }
                if (note.articulation === 'accent') {
                    noteVelocity = Math.min(noteVelocity * 1.2, 1.0);
                }
                if (note.articulation === 'tenuto') {
                    noteDuration = note.duration * 1.1;
                    noteVelocity = Math.min(noteVelocity * 1.05, 1.0);
                }
                const startSample = Math.floor(note.time * beatDuration * sampleRate);
                const endSample = Math.floor((note.time + noteDuration) * beatDuration * sampleRate);
                for (let i = startSample; i < Math.min(endSample, length); i++) {
                    if (i >= 0) {
                        const t = (i - startSample) / sampleRate;
                        const totalNoteDuration = (endSample - startSample) / sampleRate;
                        // Linear frequency sweep for glissando
                        let freq = startFreq;
                        if (isGliss) {
                            freq = startFreq + (endFreq - startFreq) * (t / totalNoteDuration);
                        }
                        // ADSR envelope
                        let envelope = 1.0;
                        const attack = 0.01;
                        const decay = 0.1;
                        const sustain = 0.7;
                        const release = 0.2;
                        if (t < attack) {
                            envelope = t / attack;
                        } else if (t < attack + decay) {
                            envelope = 1.0 - (1.0 - sustain) * (t - attack) / decay;
                        } else if (t < totalNoteDuration - release) {
                            envelope = sustain;
                        } else {
                            envelope = sustain * (totalNoteDuration - t) / release;
                        }
                        // Simple sine wave synthesis with harmonics
                        const fundamental = Math.sin(2 * Math.PI * freq * t);
                        const harmonic2 = 0.3 * Math.sin(2 * Math.PI * freq * 2 * t);
                        const harmonic3 = 0.1 * Math.sin(2 * Math.PI * freq * 3 * t);
                        const sample = (fundamental + harmonic2 + harmonic3) * envelope * noteVelocity * 0.3;
                        buffer[i] += sample;
                    }
                }
            }
        }
        
        // Normalize to prevent clipping
        let maxSample = 0;
        for (let i = 0; i < length; i++) {
            maxSample = Math.max(maxSample, Math.abs(buffer[i]));
        }
        if (maxSample > 0) {
            for (let i = 0; i < length; i++) {
                buffer[i] /= maxSample;
                buffer[i] *= 0.95; // Leave headroom
            }
        }
        
        // Convert to WAV format
        return encodeWAV(buffer, sampleRate, channels);
    }
    
    function midiToFrequency(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }
    
    function encodeWAV(samples, sampleRate, channels) {
        const length = samples.length;
        const arrayBuffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(arrayBuffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM format
        view.setUint16(22, channels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * channels * 2, true);
        view.setUint16(32, channels * 2, true);
        view.setUint16(34, 16, true); // 16-bit
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);
        
        // Convert float samples to 16-bit PCM
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
        
        return arrayBuffer;
    }
    
    return {
        generateWAV: generateWAV,
        VERSION: '1.0',
        FORMAT_IDENTIFIER: 'jmonWav'
    };
}