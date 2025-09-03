// import { JmonValidator } from '../utils/jmon-validator.js';
import { convertJmonToTonejs } from '../converters/jmon-tonejs.js';
/**
 * Music Player
 * Comprehensive music player inspired by djalgo player.py
 */

export function createPlayer(composition, options = {}) {
    // Defensive validation
    if (!composition || typeof composition !== 'object') {
        console.error('[PLAYER] Invalid composition:', composition);
        throw new Error('Composition must be a valid JMON object');
    }

    // Ensure composition has the expected structure
    if (!composition.sequences && !composition.tracks) {
        console.error('[PLAYER] No sequences or tracks found in composition:', composition);
        throw new Error('Composition must have sequences or tracks');
    }

    // Normalize sequences/tracks to ensure forEach works
    const tracks = composition.tracks || composition.sequences || [];
    if (!Array.isArray(tracks)) {
        console.error('[PLAYER] Tracks/sequences must be an array:', tracks);
        throw new Error('Tracks/sequences must be an array');
    }

    console.log('[PLAYER] Processing composition with', tracks.length, 'tracks');

    const {
        tempo = composition.bpm || 120,
        showDebug = false,
        customInstruments = {},
        autoMultivoice = true, // Automatically create multiple synths for overlapping notes
        maxVoices = 4 // Maximum voices per track
    } = options;

    // Convert JMON to Tone.js format with multivoice support
    const conversionOptions = { autoMultivoice, maxVoices, showDebug };
    const convertedData = convertJmonToTonejs(composition, conversionOptions);
    
    // Use converted track data
    const { tracks: convertedTracks, metadata } = convertedData;
    let totalDuration = metadata.totalDuration;

    const colors = {
        background: '#FFFFFF',
        primary: '#333',
        secondary: '#F0F0F0',
        accent: '#333',
        text: '#000000',
        lightText: '#666666',
        border: '#CCCCCC'
    };

    // Create player UI container
    const container = document.createElement('div');
    container.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        background-color: ${colors.background};
        color: ${colors.text};
        padding: 20px;
        border-radius: 12px;
        width: 400px;
        border: 1px solid ${colors.border};
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
    `;

    // Top container with instruments and tempo
    const topContainer = document.createElement('div');
    topContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    `;

    // Left column for instruments
    const leftColumn = document.createElement('div');
    leftColumn.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 48%;
        justify-content: space-between;
    `;

    const instrumentsContainer = document.createElement('div');
    instrumentsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
    `;
    
    // Available synth types
    const synthTypes = ['PolySynth', 'Synth', 'AMSynth', 'DuoSynth', 'FMSynth', 'MembraneSynth', 'MetalSynth', 'MonoSynth', 'PluckSynth'];
    
    // Get tracks from composition for UI
    const originalTracks = composition.tracks || composition.sequences || [];
    const synthSelectors = [];
    
    originalTracks.forEach((track, index) => {
        // Find analysis for this track from converted data
        const trackAnalysis = convertedTracks.find(t => t.originalTrackIndex === index)?.analysis;
        if (trackAnalysis?.hasGlissando) {
            console.warn(`Track ${track.label || track.name || index + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`);
        }
        const synthSelectorItem = document.createElement('div');
        synthSelectorItem.style.cssText = `
            margin-bottom: 8px;
        `;
        
        const synthLabel = document.createElement('label');
        synthLabel.textContent = track.name || track.label || `Track ${index + 1}`;
        synthLabel.style.cssText = `
            font-size: 12px;
            color: ${colors.text};
            display: block;
            margin-bottom: 2px;
        `;
        
        const synthSelect = document.createElement('select');
        synthSelect.style.cssText = `
            padding: 4px;
            border: 1px solid ${colors.secondary};
            border-radius: 4px;
            background-color: ${colors.background};
            color: ${colors.text};
            font-size: 12px;
            width: 100%;
            height: 28px;
        `;
        
        synthTypes.forEach(synthType => {
            const option = document.createElement('option');
            option.value = synthType;
            option.textContent = synthType;
            // Désactive les synthés polyphoniques si glissando détecté
            if (trackAnalysis?.hasGlissando && (synthType === 'PolySynth' || synthType === 'DuoSynth')) {
                option.disabled = true;
                option.textContent += ' (mono only for glissando)';
            }
            synthSelect.appendChild(option);
        });
        
        synthSelectors.push(synthSelect);
        synthSelectorItem.append(synthLabel, synthSelect);
        instrumentsContainer.appendChild(synthSelectorItem);
    });
    
    leftColumn.appendChild(instrumentsContainer);

    // Right column for tempo
    const rightColumn = document.createElement('div');
    rightColumn.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 48%;
        justify-content: space-between;
    `;

    const bpmContainer = document.createElement('div');
    bpmContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
    `;

    const bpmLabel = document.createElement('label');
    bpmLabel.textContent = 'Tempo';
    bpmLabel.style.cssText = `
        font-size: 14px;
        margin-bottom: 5px;
        color: ${colors.text};
    `;

    const bpmInput = document.createElement('input');
    bpmInput.type = 'number';
    bpmInput.min = 60;
    bpmInput.max = 240;
    bpmInput.value = tempo;
    bpmInput.style.cssText = `
        padding: 8px;
        border: 1px solid ${colors.secondary};
        border-radius: 6px;
        background-color: ${colors.background};
        color: ${colors.text};
        font-size: 14px;
        text-align: center;
        width: 100%;
        height: 36px;
    `;

    bpmContainer.append(bpmLabel, bpmInput);
    rightColumn.appendChild(bpmContainer);

    // Timeline container
    const timelineContainer = document.createElement('div');
    timelineContainer.style.cssText = `
        position: relative;
        width: 100%;
        margin: 20px 0;
        display: flex;
        align-items: center;
    `;

    const timeline = document.createElement('input');
    timeline.type = 'range';
    timeline.min = 0;
    timeline.max = 100;
    timeline.value = 0;
    timeline.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${colors.secondary};
        outline: none;
        border-radius: 15px;
        overflow: visible;
        height: 8px;
    `;

    const playButton = document.createElement('button');
    playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`;
    playButton.style.cssText = `
        width: 40px;
        height: 40px;
        padding: 10px;
        border: none;
        border-radius: 50%;
        background-color: ${colors.primary};
        color: ${colors.background};
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 10px 0px 10px;
    `;

    const timeDisplay = document.createElement('div');
    timeDisplay.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: ${colors.lightText};
        margin: 0px 0px 0px 10px;
    `;

    const currentTime = document.createElement('span');
    currentTime.textContent = '0:00';
    const totalTime = document.createElement('span');
    totalTime.textContent = '0:00';

    timeDisplay.append(currentTime, ' / ', totalTime);
    timelineContainer.append(timeline, playButton);

    // Download buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `;

    const downloadMIDIButton = document.createElement('button');
    downloadMIDIButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>`;
    downloadMIDIButton.style.cssText = `
        padding: 10px 20px;
        margin: 0 5px;
        border: none;
        border-radius: 6px;
        background-color: ${colors.accent};
        color: ${colors.background};
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const downloadWavButton = document.createElement('button');
    downloadWavButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>`;
    downloadWavButton.style.cssText = `
        padding: 10px 20px;
        margin: 0 5px;
        border: none;
        border-radius: 6px;
        background-color: ${colors.accent};
        color: ${colors.background};
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    buttonContainer.append(downloadMIDIButton, downloadWavButton);

    topContainer.append(leftColumn, rightColumn);
    container.append(topContainer, timelineContainer, timeDisplay, buttonContainer);

    // Initialize Tone.js functionality
    let Tone, isPlaying = false, synths = [], parts = [];

    const formatTime = (seconds) => {
        return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
    };

    // totalDuration already set above

    const initializeTone = async () => {
        if (typeof window !== 'undefined') {
            if (!window.Tone) {
                try {
                    // Use Observable-compatible loading (no CSP violations)
                    if (typeof require !== 'undefined') {
                        // Try Observable's require first
                        window.Tone = await require('https://unpkg.com/tone@14.8.49/build/Tone.js');
                    } else {
                        // Fallback to ES6 import
                        const ToneModule = await import('https://unpkg.com/tone@14.8.49/build/Tone.js');
                        window.Tone = ToneModule.default || ToneModule;
                    }
                } catch (error) {
                    console.warn('Could not auto-load Tone.js:', error.message);
                    console.log('To use the player, load Tone.js manually first:');
                    console.log('Tone = await require("https://unpkg.com/tone@14.8.49/build/Tone.js")');
                    return false;
                }
            }
            
            if (window.Tone) {
                Tone = window.Tone;
                // Ensure audio context is started
                if (Tone.context.state !== 'running') {
                    await Tone.start();
                    console.log('[PLAYER] Audio context started:', Tone.context.state);
                }
                return true;
            }
        }
        console.warn('Tone.js not available');
        return false;
    };

    const setupAudio = () => {
        if (!Tone) return;

        // Clean up existing synths and parts
        console.log('[PLAYER] Cleaning up existing synths:', synths.length, 'parts:', parts.length);
        synths.forEach(s => s.dispose());
        parts.forEach(p => {
            p.stop();
            p.dispose();
        });
        synths = [];
        parts = [];

        // Create synths and parts from converted track data
        convertedTracks.forEach((trackConfig) => {
            const { originalTrackIndex, voiceIndex, totalVoices, trackInfo, synthConfig, partEvents } = trackConfig;
            
            // Use selected synthesizer from UI or converted config
            const selectedSynth = synthSelectors[originalTrackIndex] ? synthSelectors[originalTrackIndex].value : synthConfig.type;
            
            let synth;
            try {
                // Use synth type from converter (handles glissando compatibility)
                const synthType = (synthConfig.reason === 'glissando_compatibility') ? synthConfig.type : selectedSynth;
                synth = new Tone[synthType]().toDestination();
                
                if (synthConfig.reason === 'glissando_compatibility' && voiceIndex === 0) {
                    console.warn(`[MULTIVOICE] Using ${synthType} instead of ${synthConfig.original} for glissando in ${trackInfo.label}`);
                }
            } catch (error) {
                console.warn(`Failed to create ${selectedSynth}, using PolySynth:`, error);
                synth = new Tone.PolySynth().toDestination();
            }
            
            synths.push(synth);

            // Log voice info
            if (totalVoices > 1) {
                console.log(`[MULTIVOICE] Track "${trackInfo.label}" voice ${voiceIndex + 1}: ${partEvents.length} notes`);
            }
            
            console.log('[PLAYER] Part events array:', partEvents);
            
            const part = new Tone.Part((time, note) => {
                // Log chaque note jouée
                console.log('[PLAYER] Note event', {
                    time, pitch: note.pitch, duration: note.duration, articulation: note.articulation, velocity: note.velocity, glissTarget: note.glissTarget
                });
                if (Array.isArray(note.pitch)) {
                    // Chord (no glissando for chords)
                    note.pitch.forEach(n => {
                        let noteName = 'C4';
                        if (typeof n === 'number') {
                            noteName = Tone.Frequency(n, 'midi').toNote();
                        } else if (typeof n === 'string') {
                            noteName = n;
                        } else if (Array.isArray(n) && typeof n[0] === 'string') {
                            noteName = n[0];
                        }
                        console.log('[PLAYER] Chord note', {noteName, duration: note.duration, time});
                        synth.triggerAttackRelease(noteName, note.duration, time);
                    });
                } else if (note.articulation === 'glissando' && note.glissTarget !== undefined) {
                    // Glissando: play both notes with slight overlap to simulate slide
                    let noteName = typeof note.pitch === 'number' ? Tone.Frequency(note.pitch, 'midi').toNote() : note.pitch;
                    let targetName = typeof note.glissTarget === 'number' ? Tone.Frequency(note.glissTarget, 'midi').toNote() : note.glissTarget;
                    
                    console.log('[PLAYER] Glissando', {fromNote: noteName, toNote: targetName, duration: note.duration, time});
                    
                    console.log('[PLAYER] Glissando effect starting from', noteName, 'to', targetName);
                    
                    // Use triggerAttack/Release with pitch bend for smooth glissando
                    synth.triggerAttack(noteName, time, note.velocity || 0.8);
                    
                    // Calculate pitch bend in cents
                    const startFreq = Tone.Frequency(noteName).toFrequency();
                    const endFreq = Tone.Frequency(targetName).toFrequency();
                    const totalCents = 1200 * Math.log2(endFreq / startFreq);
                    
                    // Create pitch slide using detune if available
                    if (synth.detune && synth.detune.setValueAtTime && synth.detune.linearRampToValueAtTime) {
                        synth.detune.setValueAtTime(0, time);
                        synth.detune.linearRampToValueAtTime(totalCents, time + note.duration);
                        console.log('[PLAYER] Applied detune glissando:', totalCents, 'cents over', note.duration, 'beats');
                    } else {
                        // Fallback: Quick chromatic notes
                        const startMidi = Tone.Frequency(noteName).toMidi();
                        const endMidi = Tone.Frequency(targetName).toMidi();
                        const steps = Math.max(3, Math.abs(endMidi - startMidi));
                        const stepDuration = note.duration / steps;
                        
                        for (let i = 1; i < steps; i++) {
                            const ratio = i / (steps - 1);
                            const currentFreq = startFreq * Math.pow(endFreq / startFreq, ratio);
                            const currentNote = Tone.Frequency(currentFreq).toNote();
                            const currentTime = time + i * stepDuration;
                            synth.triggerAttackRelease(currentNote, stepDuration * 0.8, currentTime, (note.velocity || 0.8) * 0.7);
                        }
                        console.log('[PLAYER] Applied chromatic glissando with', steps, 'steps');
                    }
                    
                    synth.triggerRelease(time + note.duration);
                } else {
                    // Single note with articulation
                    let noteName = 'C4';
                    if (typeof note.pitch === 'number') {
                        noteName = Tone.Frequency(note.pitch, 'midi').toNote();
                    } else if (typeof note.pitch === 'string') {
                        noteName = note.pitch;
                    } else if (Array.isArray(note.pitch) && typeof note.pitch[0] === 'string') {
                        noteName = note.pitch[0];
                    }
                    let noteDuration = note.duration;
                    let noteVelocity = note.velocity || 0.8;
                    if (note.articulation === 'staccato') {
                        noteDuration = note.duration * 0.5; // Raccourcir à 50%
                    }
                    if (note.articulation === 'accent') {
                        noteVelocity = Math.min(noteVelocity * 2.0, 1.0); // Double la vélocité pour plus d'effet
                    }
                    if (note.articulation === 'tenuto') {
                        noteDuration = note.duration * 1.5; // Allonger significativement (150%)
                        noteVelocity = Math.min(noteVelocity * 1.3, 1.0); // Augmenter aussi la vélocité
                    }
                    console.log('[PLAYER] Single note', {noteName, noteDuration, time, noteVelocity});
                    synth.triggerAttackRelease(noteName, noteDuration, time, noteVelocity);
                }
            }, partEvents);
            
            // Start the part immediately
            part.start(0);
            console.log(`[PLAYER] Part created for voice ${voiceIndex + 1} with ${partEvents.length} notes, started at time 0`);
            
            parts.push(part);
        });

        // Use duration from converter
        console.log('[PLAYER] Total duration from converter:', totalDuration, 'seconds');
        
        // Set up Transport timing
        Tone.Transport.bpm.value = metadata.tempo;
        
        // Calculate loop end in beats from total duration
        const beatDuration = 60 / metadata.tempo;
        const totalBeats = totalDuration / beatDuration;
        Tone.Transport.loopEnd = totalBeats;
        console.log('[PLAYER] Transport loop end set to', totalBeats, 'beats');
        
        Tone.Transport.loop = true;
        
        // Reset transport completely but keep our new Parts
        Tone.Transport.stop();
        Tone.Transport.position = 0;
        
        console.log('[PLAYER] Transport fully reset - position:', Tone.Transport.position, 'state:', Tone.Transport.state);
        
        totalTime.textContent = formatTime(totalDuration);
    };

    const updateTimeline = () => {
        if (Tone && isPlaying) {
            const progress = (Tone.Transport.seconds / totalDuration) * 100;
            timeline.value = Math.min(progress, 100);
            currentTime.textContent = formatTime(Tone.Transport.seconds);
            
            // Check if we should continue updating
            if (Tone.Transport.state === 'started' && isPlaying) {
                requestAnimationFrame(updateTimeline);
            } else if (Tone.Transport.state === 'stopped') {
                // Reset to beginning when stopped
                Tone.Transport.seconds = 0;
                timeline.value = 0;
                currentTime.textContent = formatTime(0);
                isPlaying = false;
                playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`;
            }
        }
    };

    // Event handlers - using addEventListener to avoid CSP violations
    playButton.addEventListener('click', async () => {
        console.log('[PLAYER] Play button clicked, isPlaying:', isPlaying, 'Tone available:', !!Tone);
        
        if (!Tone) {
            console.log('[PLAYER] Initializing Tone.js...');
            if (await initializeTone()) {
                setupAudio();
            } else {
                console.error('[PLAYER] Failed to initialize Tone.js');
                return;
            }
        }

        if (isPlaying) {
            console.log('[PLAYER] Stopping transport...');
            Tone.Transport.stop();
            isPlaying = false;
            playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`;
        } else {
            console.log('[PLAYER] Starting transport...');
            if (synths.length === 0) {
                console.log('[PLAYER] No synths found, setting up audio...');
                setupAudio();
            }
            
            // Reset transport position to ensure clean start
            Tone.Transport.stop();
            Tone.Transport.position = 0;
            // Don't use cancel() here - it clears the Parts we just created
            
            console.log('[PLAYER] Transport state before start:', Tone.Transport.state);
            console.log('[PLAYER] Transport position reset to:', Tone.Transport.position);
            console.log('[PLAYER] Audio context state:', Tone.context.state);
            console.log('[PLAYER] Parts count:', parts.length);
            console.log('[PLAYER] Synths count:', synths.length);
            
            // Start immediately at position 0
            Tone.Transport.start();
            isPlaying = true;
            playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>`;
            updateTimeline();
        }
    });

    timeline.addEventListener('input', () => {
        if (Tone && totalDuration > 0) {
            const time = (timeline.value / 100) * totalDuration;
            Tone.Transport.seconds = time;
            currentTime.textContent = formatTime(time);
        }
    });

    bpmInput.addEventListener('change', () => {
        const newTempo = parseInt(bpmInput.value);
        if (Tone && newTempo >= 60 && newTempo <= 240) {
            Tone.Transport.bpm.value = newTempo;
        } else {
            bpmInput.value = Tone ? Tone.Transport.bpm.value : tempo;
        }
    });

    // Add event handlers for synthesizer selection changes
    synthSelectors.forEach(select => {
        select.addEventListener('change', () => {
            if (Tone && synths.length > 0) {
                setupAudio(); // Reinitialize audio with new synthesizers
            }
        });
    });

    downloadMIDIButton.addEventListener('click', () => {
        console.log('MIDI download - requires MIDI converter implementation');
    });

    downloadWavButton.addEventListener('click', () => {
        console.log('WAV download - requires WAV generator implementation');
    });

    // Initialize if Tone.js is already available
    if (typeof window !== 'undefined' && window.Tone) {
        initializeTone().then(() => setupAudio());
    }

    return container;
}