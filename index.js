/**
 * JMON Studio - Minimal Observable-Compatible Version
 * No automatic dependency loading - user must provide externals
 */

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.jmonStudio = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    
    // === ABC Converter ===
    function toAbc(composition) {
        try {
            let abc = 'X:1\n';
            abc += `T:${composition.metadata?.title || composition.label || 'Untitled'}\n`;
            abc += 'M:4/4\nL:1/4\nQ:1/4=120\nK:C\n';
            
            const tracks = composition.tracks || {};
            const allTracks = Object.values(tracks);
            
            if (allTracks.length > 0) {
                for (const track of allTracks) {
                    if (Array.isArray(track) && track.length > 0) {
                        let abcNotes = '';
                        let beatCount = 0;
                        
                        const sortedNotes = track.filter(n => n.pitch).sort((a, b) => (a.time || 0) - (b.time || 0));
                        
                        for (const note of sortedNotes) {
                            if (note.pitch) {
                                if (beatCount > 0 && beatCount % 4 === 0) {
                                    abcNotes += '| ';
                                }
                                
                                const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                                const octave = Math.floor(note.pitch / 12) - 1;
                                const noteIndex = note.pitch % 12;
                                let noteName = noteNames[noteIndex].replace('#', '^');
                                
                                if (octave >= 4) {
                                    noteName = noteName.toLowerCase();
                                    if (octave > 4) {
                                        noteName += "'".repeat(octave - 4);
                                    }
                                } else if (octave < 4) {
                                    noteName = noteName.toUpperCase();
                                    if (octave < 3) {
                                        noteName += ','.repeat(3 - octave);
                                    }
                                }
                                
                                const duration = note.duration || 1.0;
                                if (duration === 2.0) {
                                    noteName += '2';
                                } else if (duration === 0.5) {
                                    noteName += '/2';
                                }
                                
                                abcNotes += noteName + ' ';
                                beatCount += duration;
                            }
                        }
                        
                        if (abcNotes.trim()) {
                            abcNotes += '|';
                            abc += abcNotes + '\n';
                        }
                        break;
                    }
                }
            }
            
            return abc;
        } catch (error) {
            console.error('Error converting to ABC notation:', error);
            return `X:1\nT:Error\nK:C\nz |`;
        }
    }
    
    // === Simple Score Display ===
    function score(composition, options = {}) {
        const container = document.createElement('div');
        container.style.cssText = `
            width: 100%;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: white;
            font-family: monospace;
        `;
        
        const abc = toAbc(composition);
        
        // Title
        const title = document.createElement('h4');
        title.textContent = composition.metadata?.title || 'Musical Score';
        title.style.cssText = 'margin: 0 0 10px 0; color: #333;';
        container.appendChild(title);
        
        // Instructions for user
        const instructions = document.createElement('div');
        instructions.innerHTML = `
            <p style="font-size: 12px; color: #666; margin: 5px 0;">
                <strong>To render visually:</strong> Load ABC.js first, then call <code>renderScore(abcjs)</code>
            </p>
            <p style="font-size: 11px; color: #888; margin: 5px 0;">
                Example: <code>abcjs = await require("abcjs@5.1.2")</code>
            </p>
            <p style="font-size: 10px; color: #999; margin: 5px 0;">
                Alternative: <code>abcjs = await require("https://cdn.jsdelivr.net/npm/abcjs@5.1.2/dist/abcjs-basic-min.js")</code>
            </p>
            <p style="font-size: 11px; color: #888; margin: 5px 0;">
                Optional: <code>score.renderMidi(abcjs)</code> for interactive playback
            </p>
        `;
        container.appendChild(instructions);
        
        // ABC notation display
        const abcPre = document.createElement('pre');
        abcPre.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 10px;
            font-size: 11px;
            margin: 10px 0;
            overflow-x: auto;
        `;
        abcPre.textContent = abc;
        container.appendChild(abcPre);
        
        // Add render function to container (user can call this after loading ABC.js)
        container.renderScore = function(abcjsLibrary) {
            if (abcjsLibrary && abcjsLibrary.renderAbc) {
                try {
                    // Create score container using your proven pattern
                    const scoreDiv = document.createElement('div');
                    scoreDiv.style.cssText = `
                        width: 100%;
                        background: white;
                        padding: 10px;
                        margin-top: 10px;
                        border: 1px solid #eee;
                        border-radius: 4px;
                    `;
                    
                    // Use minimal options like the working example
                    const abcElem = abcjsLibrary.renderAbc(scoreDiv, abc);
                    
                    if (abcElem && abcElem.length > 0) {
                        // Replace ABC text with visual score
                        abcPre.style.display = 'none';
                        container.appendChild(scoreDiv);
                        
                        // Update instructions
                        instructions.innerHTML = '<p style="color: green; font-size: 12px;">✓ Visual score rendered successfully</p>';
                        
                        // Store reference for potential MIDI rendering
                        container._abcElem = abcElem;
                    } else {
                        throw new Error('No visual output generated');
                    }
                } catch (error) {
                    console.error('ABC rendering error:', error);
                    instructions.innerHTML = `<p style="color: red; font-size: 12px;">Render error: ${error.message}</p>`;
                }
            } else {
                instructions.innerHTML = '<p style="color: red; font-size: 12px;">ABC.js library not found or invalid</p>';
            }
        };
        
        // Add MIDI rendering function (optional, following your pattern)
        container.renderMidi = function(abcjsLibrary) {
            if (abcjsLibrary && abcjsLibrary.renderMidi && container._abcElem) {
                try {
                    // Add MIDI CSS (following your pattern)
                    const midiCSS = document.createElement('link');
                    midiCSS.rel = 'stylesheet';
                    midiCSS.href = 'https://unpkg.com/abcjs@5.1.2/abcjs-midi.css';
                    document.head.appendChild(midiCSS);
                    
                    const midiDiv = document.createElement('div');
                    midiDiv.style.marginTop = '10px';
                    
                    abcjsLibrary.renderMidi(midiDiv, abc, {
                        midiListener: function(a, b, c) {},
                        animate: {
                            listener: function(lastRange, currentRange, context) {
                                // Color animation (your pattern)
                                if (lastRange && lastRange.elements) {
                                    lastRange.elements.forEach(set => {
                                        set.forEach(item => item.setAttribute("fill", "#000000"));
                                    });
                                }
                                if (currentRange && currentRange.elements) {
                                    currentRange.elements.forEach(set => {
                                        set.forEach(item => item.setAttribute("fill", "#3D9AFC"));
                                    });
                                }
                            },
                            target: container._abcElem[0],
                            qpm: container._abcElem[0].getBpm()
                        }
                    });
                    
                    container.appendChild(midiDiv);
                    instructions.innerHTML = '<p style="color: green; font-size: 12px;">✓ Score and MIDI controls rendered</p>';
                } catch (error) {
                    console.error('MIDI rendering error:', error);
                }
            }
        };
        
        return container;
    }
    
    // === Simple Player Interface ===
    function createPlayer(composition, options = {}) {
        const container = document.createElement('div');
        container.style.cssText = `
            font-family: Arial, sans-serif;
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #ccc;
            width: 400px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        // Title
        const title = document.createElement('h4');
        title.textContent = composition.metadata?.title || 'Music Player';
        title.style.cssText = 'margin: 0 0 15px 0; color: #333;';
        container.appendChild(title);
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.innerHTML = `
            <p style="font-size: 12px; color: #666; margin-bottom: 15px;">
                <strong>To enable playback:</strong> Load Tone.js first, then use controls below
            </p>
            <p style="font-size: 11px; color: #888; margin-bottom: 15px;">
                Example: <code>Tone = require("tone@14.8.49")</code><br/>
                Then: <code>player.setTone(Tone)</code>
            </p>
        `;
        container.appendChild(instructions);
        
        // Controls
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 15px;';
        
        const playButton = document.createElement('button');
        playButton.textContent = '▶ Play';
        playButton.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #007bff;
            color: white;
            cursor: pointer;
        `;
        
        const stopButton = document.createElement('button');
        stopButton.textContent = '⏹ Stop';
        stopButton.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #6c757d;
            color: white;
            cursor: pointer;
        `;
        
        const tempoInput = document.createElement('input');
        tempoInput.type = 'number';
        tempoInput.min = 60;
        tempoInput.max = 200;
        tempoInput.value = options.tempo || composition.bpm || 120;
        tempoInput.style.cssText = 'width: 60px; padding: 4px;';
        
        const tempoLabel = document.createElement('label');
        tempoLabel.textContent = 'BPM';
        tempoLabel.style.cssText = 'font-size: 12px;';
        
        controls.append(playButton, stopButton, tempoInput, tempoLabel);
        container.appendChild(controls);
        
        // Download buttons
        const downloads = document.createElement('div');
        downloads.style.cssText = 'display: flex; gap: 10px;';
        
        const downloadMidi = document.createElement('button');
        downloadMidi.textContent = '📥 MIDI';
        downloadMidi.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #28a745;
            color: white;
            cursor: pointer;
            flex: 1;
        `;
        
        const downloadJson = document.createElement('button');
        downloadJson.textContent = '📥 JSON';
        downloadJson.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #ffc107;
            color: black;
            cursor: pointer;
            flex: 1;
        `;
        
        downloads.append(downloadMidi, downloadJson);
        container.appendChild(downloads);
        
        // Status
        const status = document.createElement('div');
        status.style.cssText = 'margin-top: 10px; font-size: 12px; color: #666;';
        status.textContent = 'Ready (Tone.js required for playback)';
        container.appendChild(status);
        
        // Store Tone.js reference when player is created
        container._ToneLib = null;
        
        // Method to set Tone.js reference from Observable cell
        container.setTone = function(toneLibrary) {
            container._ToneLib = toneLibrary;
            window.Tone = toneLibrary; // Also set globally
            const success = !!(toneLibrary && toneLibrary.PolySynth);
            console.log('Tone.js set for player:', typeof toneLibrary, success);
            
            // Update status to show it's connected
            if (success) {
                status.textContent = 'Ready - Tone.js connected!';
                status.style.color = 'green';
            } else {
                status.textContent = 'Tone.js connection failed';
                status.style.color = 'red';
            }
            
            return {
                connected: success,
                version: toneLibrary?.version || 'unknown',
                hasPolySynth: !!toneLibrary?.PolySynth
            };
        };
        
        // Event handlers (using Tom MacWright's proven patterns)
        let currentSynth = null;
        let isPlaying = false;
        
        playButton.addEventListener('click', async () => {
            // Check for Tone.js - try stored reference first
            let ToneLib = container._ToneLib;
            
            if (!ToneLib) {
                // Fallback to detection
                try {
                    if (typeof Tone !== 'undefined' && Tone && (Tone.PolySynth || Tone.Synth)) {
                        ToneLib = Tone;
                    }
                    else if (typeof window !== 'undefined' && window.Tone && (window.Tone.PolySynth || window.Tone.Synth)) {
                        ToneLib = window.Tone;
                    }
                    else if (typeof globalThis !== 'undefined' && globalThis.Tone && (globalThis.Tone.PolySynth || globalThis.Tone.Synth)) {
                        ToneLib = globalThis.Tone;
                    }
                } catch (e) {
                    console.log('Tone.js access error:', e);
                }
            }
            
            console.log('Tone.js detection result:', ToneLib ? 'found' : 'not found');
            
            if (!ToneLib) {
                // More helpful debug message
                const toneDebug = {
                    'typeof Tone': typeof Tone,
                    'typeof window.Tone': typeof window !== 'undefined' ? typeof window.Tone : 'no window',
                    'window.Tone.Synth': typeof window !== 'undefined' && window.Tone ? typeof window.Tone.Synth : 'no window.Tone',
                    'window.Tone.PolySynth': typeof window !== 'undefined' && window.Tone ? typeof window.Tone.PolySynth : 'no window.Tone'
                };
                console.log('Tone.js debug info:', toneDebug);
                status.textContent = `Tone.js not accessible. Check console for debug info.`;
                status.style.color = 'red';
                return;
            }
            
            if (isPlaying) {
                // Stop playback
                if (currentSynth) {
                    currentSynth.dispose();
                    currentSynth = null;
                }
                if (ToneLib.Transport) {
                    ToneLib.Transport.stop();
                    ToneLib.Transport.cancel();
                }
                isPlaying = false;
                playButton.textContent = '▶ Play';
                status.textContent = 'Stopped';
                status.style.color = '#666';
                return;
            }
            
            try {
                status.textContent = 'Starting audio...';
                status.style.color = 'orange';
                
                // Ensure audio context is started (required for user interaction)
                if (ToneLib.context && ToneLib.context.state !== 'running') {
                    await ToneLib.start();
                }
                
                // Create volume control (Tom's pattern)
                const volume = new ToneLib.Volume(-10); // Slightly quieter
                
                // Create synth with Tom's proven pattern
                currentSynth = new ToneLib.PolySynth(ToneLib.Synth).chain(volume, ToneLib.Destination);
                
                // Configure synth (Tom's pattern)
                currentSynth.set({
                    oscillator: { type: 'triangle' },
                    envelope: { 
                        attack: 0.02,
                        decay: 0.1, 
                        sustain: 0.3,
                        release: 1 
                    }
                });
                
                const tracks = composition.tracks || {};
                const tempo = parseInt(tempoInput.value);
                
                status.textContent = 'Playing...';
                status.style.color = 'green';
                isPlaying = true;
                playButton.textContent = '⏹ Stop';
                
                // Simple sequential playback (Tom's triggerAttackRelease pattern)
                let noteIndex = 0;
                const allNotes = [];
                
                // Collect all notes from all tracks
                Object.values(tracks).forEach(track => {
                    if (Array.isArray(track)) {
                        track.forEach(note => {
                            if (note.pitch) {
                                allNotes.push({
                                    time: note.time || 0,
                                    pitch: note.pitch,
                                    duration: note.duration || 1
                                });
                            }
                        });
                    }
                });
                
                // Sort by time
                allNotes.sort((a, b) => a.time - b.time);
                
                // Play notes sequentially
                const playNextNote = () => {
                    if (!isPlaying || noteIndex >= allNotes.length) {
                        // Finished
                        isPlaying = false;
                        playButton.textContent = '▶ Play';
                        status.textContent = 'Finished';
                        status.style.color = '#666';
                        if (currentSynth) {
                            currentSynth.dispose();
                            currentSynth = null;
                        }
                        return;
                    }
                    
                    const note = allNotes[noteIndex];
                    const noteName = ToneLib.Frequency(note.pitch, "midi").toNote();
                    const durationMs = (note.duration * 60000) / tempo; // Convert to ms
                    
                    // Use Tom's proven triggerAttackRelease pattern
                    currentSynth.triggerAttackRelease(noteName, note.duration + 'n');
                    
                    noteIndex++;
                    
                    // Schedule next note
                    const nextNote = allNotes[noteIndex];
                    if (nextNote) {
                        const delay = ((nextNote.time - note.time) * 60000) / tempo;
                        setTimeout(playNextNote, Math.max(delay, 100)); // Min 100ms between notes
                    } else {
                        setTimeout(playNextNote, durationMs); // Wait for last note to finish
                    }
                };
                
                // Start playback
                playNextNote();
                
            } catch (error) {
                console.error('Playback error:', error);
                status.textContent = `Playback error: ${error.message}`;
                status.style.color = 'red';
                isPlaying = false;
                playButton.textContent = '▶ Play';
            }
        });
        
        stopButton.addEventListener('click', () => {
            status.textContent = 'Stopped';
            status.style.color = '#666';
            container.stop && container.stop();
        });
        
        downloadMidi.addEventListener('click', () => {
            const midiData = generateBasicMidi(composition);
            downloadBlob(midiData, `${composition.metadata?.title || 'composition'}.mid`, 'audio/midi');
            status.textContent = 'MIDI downloaded';
        });
        
        downloadJson.addEventListener('click', () => {
            const jsonStr = JSON.stringify(composition, null, 2);
            const jsonData = new TextEncoder().encode(jsonStr);
            downloadBlob(jsonData, `${composition.metadata?.title || 'composition'}.json`, 'application/json');
            status.textContent = 'JSON downloaded';
        });
        
        return container;
    }
    
    // === Basic MIDI Generation ===
    function generateBasicMidi(composition) {
        const tracks = composition.tracks || {};
        const notes = [];
        
        // Collect all notes
        Object.values(tracks).forEach(track => {
            if (Array.isArray(track)) {
                track.forEach(note => {
                    if (note.pitch) {
                        notes.push({
                            time: (note.time || 0) * 480,
                            pitch: note.pitch,
                            duration: (note.duration || 1) * 480,
                            velocity: Math.floor((note.velocity || 0.7) * 127)
                        });
                    }
                });
            }
        });
        
        // Sort by time
        notes.sort((a, b) => a.time - b.time);
        
        // Create basic MIDI structure
        const header = new Uint8Array([
            0x4D, 0x54, 0x68, 0x64, // "MThd"
            0x00, 0x00, 0x00, 0x06, // Header length
            0x00, 0x00, // Format 0
            0x00, 0x01, // One track
            0x01, 0xE0  // 480 ticks per quarter
        ]);
        
        // Create track events
        const events = [];
        let currentTime = 0;
        
        notes.forEach(note => {
            // Delta time to note start
            const deltaStart = note.time - currentTime;
            events.push(...variableLengthQuantity(deltaStart));
            events.push(0x90, note.pitch, note.velocity); // Note on
            
            // Delta time to note end
            events.push(...variableLengthQuantity(note.duration));
            events.push(0x80, note.pitch, 0x00); // Note off
            
            currentTime = note.time + note.duration;
        });
        
        // End of track
        events.push(0x00, 0xFF, 0x2F, 0x00);
        
        // Track header
        const trackHeader = new Uint8Array([
            0x4D, 0x54, 0x72, 0x6B, // "MTrk"
            ...numberToBytes(events.length, 4)
        ]);
        
        // Combine
        const midiFile = new Uint8Array(header.length + trackHeader.length + events.length);
        midiFile.set(header, 0);
        midiFile.set(trackHeader, header.length);
        midiFile.set(events, header.length + trackHeader.length);
        
        return midiFile;
    }
    
    function variableLengthQuantity(value) {
        if (value < 128) return [value];
        const result = [];
        result.unshift(value & 0x7F);
        value >>= 7;
        while (value > 0) {
            result.unshift((value & 0x7F) | 0x80);
            value >>= 7;
        }
        return result;
    }
    
    function numberToBytes(num, bytes) {
        const result = [];
        for (let i = bytes - 1; i >= 0; i--) {
            result.push((num >> (i * 8)) & 0xFF);
        }
        return result;
    }
    
    function downloadBlob(data, filename, mimeType) {
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // === Core Algorithm Classes (minimal) ===
    class Scale {
        constructor(tonic, mode = 'major') {
            this.tonic = tonic;
            this.mode = mode;
            this.intervals = {
                major: [0, 2, 4, 5, 7, 9, 11],
                minor: [0, 2, 3, 5, 7, 8, 10]
            };
        }
        
        generate(octave = 4, length = 7) {
            const intervals = this.intervals[this.mode] || this.intervals.major;
            const result = [];
            const baseNote = 60 + (octave - 4) * 12;
            
            for (let i = 0; i < length; i++) {
                const interval = intervals[i % intervals.length];
                const note = baseNote + interval + Math.floor(i / intervals.length) * 12;
                result.push(note);
            }
            
            return result;
        }
    }
    
    class Rhythm {
        constructor(measureLength = 4.0) {
            this.measureLength = measureLength;
        }
        
        random(options = {}) {
            const durations = [0.25, 0.5, 1.0, 2.0];
            const pattern = [];
            let currentLength = 0;
            
            while (currentLength < this.measureLength) {
                const remaining = this.measureLength - currentLength;
                const validDurations = durations.filter(d => d <= remaining);
                if (validDurations.length === 0) break;
                
                const duration = validDurations[Math.floor(Math.random() * validDurations.length)];
                pattern.push(duration);
                currentLength += duration;
            }
            
            return { durations: pattern, measureLength: this.measureLength };
        }
    }
    
    // Main API - Clean and minimal
    return {
        // Core functions
        toAbc: toAbc,
        score: score,
        player: createPlayer,
        
        // Algorithm classes
        dj: {
            Scale: Scale,
            Rhythm: Rhythm
        },
        
        // Observable-compatible grouped API
        jmon: {
            toAbc: toAbc,
            score: score,
            play: createPlayer
        },
        
        VERSION: '1.4.22'
    };
}));