/**
 * Music Player
 * Comprehensive music player inspired by djalgo player.py
 */

export function createPlayer(composition, options = {}) {
    const {
        tempo = composition.bpm || 120,
        showDebug = false,
        customInstruments = {}
    } = options;

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
    
    // Get tracks from composition
    const tracks = composition.tracks || composition.sequences || [];
    const synthSelectors = [];
    
    tracks.forEach((track, index) => {
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
    let Tone, isPlaying = false, totalDuration = 0, synths = [], parts = [];

    const formatTime = (seconds) => {
        return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
    };

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
                await Tone.start();
                return true;
            }
        }
        console.warn('Tone.js not available');
        return false;
    };

    const setupAudio = () => {
        if (!Tone) return;

        // Clean up existing synths and parts
        synths.forEach(s => s.dispose());
        parts.forEach(p => p.dispose());
        synths = [];
        parts = [];

        // Convert JMON to playable format
        const tracks = composition.tracks || composition.sequences || [];
        
        tracks.forEach((track, index) => {
            // Use selected synthesizer or default to PolySynth
            const selectedSynth = synthSelectors[index] ? synthSelectors[index].value : 'PolySynth';
            let synth;
            
            try {
                // Create the selected synthesizer type
                synth = new Tone[selectedSynth]().toDestination();
            } catch (error) {
                console.warn(`Failed to create ${selectedSynth}, using PolySynth:`, error);
                synth = new Tone.PolySynth().toDestination();
            }
            
            synths.push(synth);

            const notes = track.sequence || track.notes || [];
            const part = new Tone.Part((time, note) => {
                if (Array.isArray(note.note)) {
                    // Chord
                    note.note.forEach(n => {
                        if (typeof n === 'number') {
                            const noteName = Tone.Frequency(n, 'midi').toNote();
                            synth.triggerAttackRelease(noteName, note.duration, time);
                        } else if (typeof n === 'string') {
                            synth.triggerAttackRelease(n, note.duration, time);
                        }
                    });
                } else {
                    // Single note
                    let noteName = note.note;
                    if (typeof noteName === 'number') {
                        noteName = Tone.Frequency(noteName, 'midi').toNote();
                    }
                    synth.triggerAttackRelease(noteName, note.duration, time);
                }
            }, notes.map(note => ({
                time: parseFloat(note.time) || 0,
                note: note,
                duration: parseFloat(note.duration) || 0.5
            }))).start(0);
            
            parts.push(part);
        });

        // Calculate total duration
        const allNotes = tracks.flatMap(track => track.sequence || track.notes || []);
        if (allNotes.length > 0) {
            totalDuration = Math.max(...allNotes.map(note => 
                (parseFloat(note.time) || 0) + (parseFloat(note.duration) || 0.5)
            ));
        }
        
        Tone.Transport.bpm.value = tempo;
        Tone.Transport.loopEnd = totalDuration;
        Tone.Transport.loop = false;
        
        totalTime.textContent = formatTime(totalDuration);
    };

    const updateTimeline = () => {
        if (Tone && isPlaying) {
            const progress = (Tone.Transport.seconds / totalDuration) * 100;
            timeline.value = Math.min(progress, 100);
            currentTime.textContent = formatTime(Tone.Transport.seconds);
            
            if (Tone.Transport.state === 'started') {
                requestAnimationFrame(updateTimeline);
            } else {
                isPlaying = false;
                playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`;
            }
        }
    };

    // Event handlers - using addEventListener to avoid CSP violations
    playButton.addEventListener('click', async () => {
        if (!Tone) {
            if (await initializeTone()) {
                setupAudio();
            } else {
                return;
            }
        }

        if (isPlaying) {
            Tone.Transport.stop();
            isPlaying = false;
            playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`;
        } else {
            if (synths.length === 0) setupAudio();
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