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
    
    // === Enhanced Professional Player (based on djalgo player.py) ===
    function createEnhancedPlayer(composition, options = {}) {
        const container = document.createElement('div');
        container.style.cssText = `
            font-family: 'PT Sans', 'Arial', sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            padding: 20px;
            border-radius: 12px;
            width: 400px;
            border: 1px solid #CCCCCC;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
        `;
        
        // Title
        const title = document.createElement('h4');
        title.textContent = composition.metadata?.title || 'Music Player';
        title.style.cssText = 'margin: 0 0 15px 0; color: #333; font-weight: 600;';
        container.appendChild(title);
        
        // Top container with two columns
        const topContainer = document.createElement('div');
        topContainer.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 20px;';
        
        // Left column for instruments
        const leftColumn = document.createElement('div');
        leftColumn.style.cssText = 'display: flex; flex-direction: column; width: 48%; justify-content: space-between;';
        
        // Instruments container
        const instrumentsContainer = document.createElement('div');
        instrumentsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
        
        // Right column for tempo
        const rightColumn = document.createElement('div');
        rightColumn.style.cssText = 'display: flex; flex-direction: column; width: 48%; justify-content: space-between;';
        
        // Tempo container
        const tempoContainer = document.createElement('div');
        tempoContainer.style.cssText = 'display: flex; flex-direction: column; width: 100%;';
        
        const tempoLabel = document.createElement('label');
        tempoLabel.textContent = 'Tempo';
        tempoLabel.style.cssText = 'font-size: 14px; margin-bottom: 5px; color: #000000;';
        
        const tempoInput = document.createElement('input');
        tempoInput.type = 'number';
        tempoInput.min = 60;
        tempoInput.max = 240;
        tempoInput.value = options.tempo || composition.bpm || 120;
        tempoInput.style.cssText = `
            padding: 8px;
            border: 1px solid #F0F0F0;
            border-radius: 6px;
            background-color: #FFFFFF;
            color: #000000;
            font-size: 14px;
            text-align: center;
            width: 100%;
            height: 36px;
        `;
        
        tempoContainer.append(tempoLabel, tempoInput);
        rightColumn.appendChild(tempoContainer);
        
        // Timeline container with play button
        const timelineContainer = document.createElement('div');
        timelineContainer.style.cssText = `
            position: relative;
            width: 100%;
            margin: 20px 0;
            display: flex;
            align-items: center;
        `;
        
        const timelineSlider = document.createElement('input');
        timelineSlider.type = 'range';
        timelineSlider.min = 0;
        timelineSlider.max = 100;
        timelineSlider.value = 0;
        timelineSlider.style.cssText = `
            flex-grow: 1;
            -webkit-appearance: none;
            background: #F0F0F0;
            outline: none;
            border-radius: 15px;
            overflow: visible;
            height: 8px;
        `;
        
        const playButton = document.createElement('button');
        playButton.innerHTML = '▶';
        playButton.style.cssText = `
            width: 40px;
            height: 40px;
            padding: 10px;
            border: none;
            border-radius: 50%;
            background-color: #333;
            color: #FFFFFF;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0px 10px 0px 10px;
        `;
        
        timelineContainer.append(timelineSlider, playButton);
        
        // Time display
        const timeDisplay = document.createElement('div');
        timeDisplay.style.cssText = `
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666666;
            margin: 0px 0px 0px 10px;
        `;
        
        const currentTimeSpan = document.createElement('span');
        currentTimeSpan.textContent = '0:00';
        const totalTimeSpan = document.createElement('span');
        totalTimeSpan.textContent = '0:00';
        timeDisplay.append(currentTimeSpan, totalTimeSpan);
        
        // Download buttons container
        const downloadContainer = document.createElement('div');
        downloadContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        `;
        
        const downloadMidiButton = document.createElement('button');
        downloadMidiButton.innerHTML = '🎹 MIDI';
        downloadMidiButton.style.cssText = `
            padding: 10px 20px;
            margin: 0 5px;
            border: none;
            border-radius: 6px;
            background-color: #333;
            color: #FFFFFF;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const downloadWavButton = document.createElement('button');
        downloadWavButton.innerHTML = '🔊 WAV';
        downloadWavButton.style.cssText = `
            padding: 10px 20px;
            margin: 0 5px;
            border: none;
            border-radius: 6px;
            background-color: #333;
            color: #FFFFFF;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        downloadContainer.append(downloadMidiButton, downloadWavButton);
        
        // Instructions for Tone.js setup
        const instructions = document.createElement('div');
        instructions.innerHTML = `
            <p style="font-size: 12px; color: #666; margin-bottom: 15px;">
                <strong>To enable playback:</strong> Load Tone.js first, then use controls
            </p>
            <p style="font-size: 11px; color: #888; margin-bottom: 15px;">
                Example: <code>Tone = require("tone@14.8.49")</code><br/>
                Then: <code>player.setTone(Tone)</code>
            </p>
        `;
        container.appendChild(instructions);
        
        // Status
        const status = document.createElement('div');
        status.style.cssText = 'margin-top: 10px; font-size: 12px; color: #666;';
        status.textContent = 'Ready (Tone.js required for playback)';
        
        // Build UI structure
        topContainer.append(leftColumn, rightColumn);
        container.append(topContainer, timelineContainer, timeDisplay, downloadContainer, status);
        
        // Audio variables
        let synths = [];
        let parts = [];
        let totalDuration = 0;
        let currentTime = 0;
        let isPlaying = false;
        let animationFrame = null;
        
        // Store Tone.js reference
        container._ToneLib = null;
        
        // Available synthesizer types (matching djalgo player)
        const synthTypes = ['Synth', 'AMSynth', 'DuoSynth', 'FMSynth', 'MembraneSynth', 'MetalSynth', 'MonoSynth', 'PluckSynth', 'PolySynth'];
        
        // Create instrument selectors for each track
        const tracks = composition.tracks || {};
        const trackNames = Object.keys(tracks);
        const synthSelectors = [];
        
        trackNames.forEach((trackName, index) => {
            const selectorContainer = document.createElement('div');
            selectorContainer.style.cssText = 'margin-bottom: 8px;';
            
            const label = document.createElement('label');
            label.textContent = trackName || `Track ${index + 1}`;
            label.style.cssText = 'font-size: 14px; color: #000; display: block; margin-bottom: 3px;';
            
            const select = document.createElement('select');
            select.style.cssText = `
                padding: 8px;
                margin: 5px 0;
                border: 1px solid #F0F0F0;
                border-radius: 6px;
                background-color: #FFFFFF;
                color: #000000;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                width: 100%;
                height: 36px;
            `;
            
            synthTypes.forEach(synthType => {
                const option = document.createElement('option');
                option.value = synthType;
                option.textContent = synthType;
                select.appendChild(option);
            });
            
            select.value = index === 0 ? 'PolySynth' : 'Synth';
            synthSelectors.push(select);
            
            selectorContainer.append(label, select);
            instrumentsContainer.appendChild(selectorContainer);
        });
        
        leftColumn.appendChild(instrumentsContainer);
        
        // Format time helper
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        };
        
        // Method to set Tone.js reference (preserving working pattern)
        container.setTone = function(toneLibrary) {
            container._ToneLib = toneLibrary;
            window.Tone = toneLibrary;
            const success = !!(toneLibrary && (toneLibrary.PolySynth || toneLibrary.Synth));
            console.log('Enhanced player: Tone.js set:', typeof toneLibrary, success);
            
            if (success) {
                status.textContent = 'Ready - Tone.js connected!';
                status.style.color = 'green';
                instructions.innerHTML = '<p style="color: green; font-size: 12px;">✓ Tone.js connected - Ready to play</p>';
                initializeAudio();
            } else {
                status.textContent = 'Tone.js connection failed';
                status.style.color = 'red';
                instructions.innerHTML = '<p style="color: red; font-size: 12px;">✗ Tone.js connection failed</p>';
            }
            
            return {
                connected: success,
                version: toneLibrary?.version || 'unknown',
                hasPolySynth: !!toneLibrary?.PolySynth
            };
        };
        
        // Initialize audio system
        const initializeAudio = () => {
            const ToneLib = container._ToneLib;
            if (!ToneLib) return;
            
            // Dispose previous synths and parts
            synths.forEach(s => s && s.dispose && s.dispose());
            parts.forEach(p => p && p.dispose && p.dispose());
            synths = [];
            parts = [];
            
            // Convert tracks to playable data format
            const tracksArray = Object.values(tracks);
            const bpm = parseInt(tempoInput.value);
            
            tracksArray.forEach((track, index) => {
                if (!Array.isArray(track) || track.length === 0) return;
                
                const selectedSynthType = synthSelectors[index]?.value || 'Synth';
                const synth = new ToneLib[selectedSynthType]().toDestination();
                synths.push(synth);
                
                // Convert track notes to Tone.js format
                const noteEvents = track.filter(note => note.pitch).map(note => ({
                    time: (note.time || 0) * 60 / bpm,
                    pitch: note.pitch,
                    duration: (note.duration || 1) * 60 / bpm,
                    velocity: note.velocity || 0.7
                }));
                
                const part = new ToneLib.Part((time, note) => {
                    const noteName = ToneLib.Frequency(note.pitch, "midi").toNote();
                    synth.triggerAttackRelease(noteName, note.duration, time, note.velocity);
                }, noteEvents).start(0);
                
                parts.push(part);
            });
            
            // Calculate total duration
            const allNotes = Object.values(tracks).flat().filter(n => n.pitch);
            if (allNotes.length > 0) {
                totalDuration = Math.max(...allNotes.map(note => (note.time || 0) + (note.duration || 1))) * 60 / bpm;
                ToneLib.Transport.loopEnd = totalDuration;
                ToneLib.Transport.loop = true;
                totalTimeSpan.textContent = formatTime(totalDuration);
            }
            
            console.log(`Enhanced player: Audio initialized, duration: ${totalDuration.toFixed(2)}s, BPM: ${bpm}`);
        };
        
        // Update timeline display
        const updateTimeline = () => {
            if (!container._ToneLib || !isPlaying) return;
            
            const ToneLib = container._ToneLib;
            currentTime = ToneLib.Transport.seconds;
            const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
            
            timelineSlider.value = progress;
            currentTimeSpan.textContent = formatTime(currentTime);
            
            if (isPlaying && ToneLib.Transport.state === 'started') {
                animationFrame = requestAnimationFrame(updateTimeline);
            }
        };
        
        // Play/Stop functionality
        playButton.addEventListener('click', async () => {
            const ToneLib = container._ToneLib;
            if (!ToneLib) {
                status.textContent = 'Tone.js not connected';
                status.style.color = 'red';
                return;
            }
            
            try {
                if (isPlaying) {
                    // Stop playback
                    await ToneLib.Transport.stop();
                    playButton.innerHTML = '▶';
                    playButton.style.backgroundColor = '#333';
                    isPlaying = false;
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                        animationFrame = null;
                    }
                    status.textContent = 'Stopped';
                    status.style.color = '#666';
                } else {
                    // Start playback
                    if (ToneLib.context.state !== 'running') {
                        await ToneLib.start();
                    }
                    
                    if (synths.length === 0) {
                        initializeAudio();
                    }
                    
                    ToneLib.Transport.bpm.value = parseInt(tempoInput.value);
                    await ToneLib.Transport.start();
                    playButton.innerHTML = '⏸';
                    playButton.style.backgroundColor = '#007bff';
                    isPlaying = true;
                    status.textContent = 'Playing...';
                    status.style.color = 'green';
                    updateTimeline();
                }
            } catch (error) {
                console.error('Enhanced player error:', error);
                status.textContent = `Error: ${error.message}`;
                status.style.color = 'red';
            }
        });
        
        // Timeline seeking
        timelineSlider.addEventListener('input', () => {
            if (container._ToneLib && totalDuration > 0) {
                const time = (timelineSlider.value / 100) * totalDuration;
                container._ToneLib.Transport.seconds = time;
                currentTimeSpan.textContent = formatTime(time);
            }
        });
        
        // Tempo change
        tempoInput.addEventListener('change', () => {
            const bpm = parseInt(tempoInput.value);
            if (bpm >= 60 && bpm <= 240) {
                if (container._ToneLib) {
                    container._ToneLib.Transport.bpm.value = bpm;
                    initializeAudio(); // Reinitialize with new tempo
                }
                status.textContent = `Tempo set to ${bpm} BPM`;
                status.style.color = 'green';
            } else {
                tempoInput.value = container._ToneLib?.Transport.bpm.value || 120;
                status.textContent = 'Invalid tempo. Use 60-240 BPM.';
                status.style.color = 'red';
            }
        });
        
        // Instrument change
        synthSelectors.forEach(select => {
            select.addEventListener('change', () => {
                if (container._ToneLib) {
                    initializeAudio();
                    status.textContent = 'Instruments updated';
                    status.style.color = 'green';
                }
            });
        });
        
        // MIDI Download
        downloadMidiButton.addEventListener('click', () => {
            const midiData = generateBasicMidi(composition);
            downloadBlob(midiData, `${composition.metadata?.title || 'composition'}.mid`, 'audio/midi');
            status.textContent = 'MIDI downloaded';
            status.style.color = 'green';
        });
        
        // WAV Download (placeholder - requires audio rendering)
        downloadWavButton.addEventListener('click', () => {
            status.textContent = 'WAV export: Feature coming soon';
            status.style.color = 'orange';
        });
        
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
        enhancedPlayer: createEnhancedPlayer,
        
        // Algorithm classes
        dj: {
            Scale: Scale,
            Rhythm: Rhythm
        },
        
        // Observable-compatible grouped API
        jmon: {
            toAbc: toAbc,
            score: score,
            play: createPlayer,
            enhancedPlay: createEnhancedPlayer
        },
        
        VERSION: '1.4.22'
    };
}));