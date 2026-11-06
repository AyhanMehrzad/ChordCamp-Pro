/* ==========================================================================
   CHORDCAMP PRO — STUDIO GUITAR TUNER ENGINE
   Based on open-source Web Audio autocorrelation pitch detection (MIT License)
   Optimized for acoustic & electric guitars with parabolic peak interpolation
   ========================================================================== */

(function() {
  'use strict';

  // Tuner State
  let audioCtx = null;
  let micStream = null;
  let analyserNode = null;
  let sourceNode = null;
  let filterNode = null;
  let isTuningActive = false;
  let animationFrameId = null;

  // Smoothing buffers
  let smoothedCents = 0;
  let smoothedFreq = 0;
  let lastStableNote = 'E';
  let lastStableOctave = '2';
  let inTuneHoldFrames = 0;

  // Settings
  let currentTuningPreset = 'standard';
  let lockedStringIndex = -1; // -1 for Auto-Detect, 0-5 for specific string

  // Tuning Definitions
  const TUNING_PRESETS = {
    standard: {
      name: 'Standard (E A D G B E)',
      strings: [
        { label: '6: E2', note: 'E', octave: 2, freq: 82.41, midi: 40 },
        { label: '5: A2', note: 'A', octave: 2, freq: 110.00, midi: 45 },
        { label: '4: D3', note: 'D', octave: 3, freq: 146.83, midi: 50 },
        { label: '3: G3', note: 'G', octave: 3, freq: 196.00, midi: 55 },
        { label: '2: B3', note: 'B', octave: 3, freq: 246.94, midi: 59 },
        { label: '1: E4', note: 'E', octave: 4, freq: 329.63, midi: 64 }
      ]
    },
    drop_d: {
      name: 'Drop D (D A D G B E)',
      strings: [
        { label: '6: D2', note: 'D', octave: 2, freq: 73.42, midi: 38 },
        { label: '5: A2', note: 'A', octave: 2, freq: 110.00, midi: 45 },
        { label: '4: D3', note: 'D', octave: 3, freq: 146.83, midi: 50 },
        { label: '3: G3', note: 'G', octave: 3, freq: 196.00, midi: 55 },
        { label: '2: B3', note: 'B', octave: 3, freq: 246.94, midi: 59 },
        { label: '1: E4', note: 'E', octave: 4, freq: 329.63, midi: 64 }
      ]
    },
    half_down: {
      name: 'Half Step Down / E♭ (E♭ A♭ D♭ G♭ B♭ E♭)',
      strings: [
        { label: '6: E♭2', note: 'D#', octave: 2, freq: 77.78, midi: 39 },
        { label: '5: A♭2', note: 'G#', octave: 2, freq: 103.83, midi: 44 },
        { label: '4: D♭3', note: 'C#', octave: 3, freq: 138.59, midi: 49 },
        { label: '3: G♭3', note: 'F#', octave: 3, freq: 185.00, midi: 54 },
        { label: '2: B♭3', note: 'A#', octave: 3, freq: 233.08, midi: 58 },
        { label: '1: E♭4', note: 'D#', octave: 4, freq: 311.13, midi: 63 }
      ]
    },
    full_down: {
      name: 'Full Step Down / D (D G C F A D)',
      strings: [
        { label: '6: D2', note: 'D', octave: 2, freq: 73.42, midi: 38 },
        { label: '5: G2', note: 'G', octave: 2, freq: 98.00, midi: 43 },
        { label: '4: C3', note: 'C', octave: 3, freq: 130.81, midi: 48 },
        { label: '3: F3', note: 'F', octave: 3, freq: 174.61, midi: 53 },
        { label: '2: A3', note: 'A', octave: 3, freq: 220.00, midi: 57 },
        { label: '1: D4', note: 'D', octave: 4, freq: 293.66, midi: 62 }
      ]
    },
    dadgad: {
      name: 'DADGAD (D A D G A D)',
      strings: [
        { label: '6: D2', note: 'D', octave: 2, freq: 73.42, midi: 38 },
        { label: '5: A2', note: 'A', octave: 2, freq: 110.00, midi: 45 },
        { label: '4: D3', note: 'D', octave: 3, freq: 146.83, midi: 50 },
        { label: '3: G3', note: 'G', octave: 3, freq: 196.00, midi: 55 },
        { label: '2: A3', note: 'A', octave: 3, freq: 220.00, midi: 57 },
        { label: '1: D4', note: 'D', octave: 4, freq: 293.66, midi: 62 }
      ]
    },
    open_d: {
      name: 'Open D (D A D F♯ A D)',
      strings: [
        { label: '6: D2', note: 'D', octave: 2, freq: 73.42, midi: 38 },
        { label: '5: A2', note: 'A', octave: 2, freq: 110.00, midi: 45 },
        { label: '4: D3', note: 'D', octave: 3, freq: 146.83, midi: 50 },
        { label: '3: F♯3', note: 'F#', octave: 3, freq: 185.00, midi: 54 },
        { label: '2: A3', note: 'A', octave: 3, freq: 220.00, midi: 57 },
        { label: '1: D4', note: 'D', octave: 4, freq: 293.66, midi: 62 }
      ]
    },
    open_g: {
      name: 'Open G (D G D G B D)',
      strings: [
        { label: '6: D2', note: 'D', octave: 2, freq: 73.42, midi: 38 },
        { label: '5: G2', note: 'G', octave: 2, freq: 98.00, midi: 43 },
        { label: '4: D3', note: 'D', octave: 3, freq: 146.83, midi: 50 },
        { label: '3: G3', note: 'G', octave: 3, freq: 196.00, midi: 55 },
        { label: '2: B3', note: 'B', octave: 3, freq: 246.94, midi: 59 },
        { label: '1: D4', note: 'D', octave: 4, freq: 293.66, midi: 62 }
      ]
    },
    chromatic: {
      name: 'Chromatic Mode (All 12 Notes)',
      strings: []
    }
  };

  const NOTE_STRINGS = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

  // Fast autocorrelation pitch detection algorithm
  // Buffer size 2048, with parabolic interpolation
  function autoCorrelate(buf, sampleRate) {
    const SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    // Audio level meter update
    updateVolumeMeter(rms);

    // Noise gate threshold: Ignore silence / room noise
    if (rms < 0.012) return -1;

    // Autocorrelation search range for guitar (approx 60 Hz to 1200 Hz)
    const minPeriod = Math.floor(sampleRate / 1200);
    const maxPeriod = Math.floor(sampleRate / 60);

    let bestPeriod = -1;
    let maxCorrelation = 0;

    // Normalizing autocorrelation
    let r = new Float32Array(maxPeriod + 1);
    for (let offset = minPeriod; offset <= maxPeriod; offset++) {
      let correlation = 0;
      for (let i = 0; i < SIZE - offset; i++) {
        correlation += buf[i] * buf[i + offset];
      }
      r[offset] = correlation;
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestPeriod = offset;
      }
    }

    if (bestPeriod === -1 || maxCorrelation <= 0) return -1;

    // Parabolic interpolation around peak for sub-Hertz accuracy
    const y1 = r[bestPeriod - 1] || 0;
    const y2 = r[bestPeriod];
    const y3 = r[bestPeriod + 1] || 0;

    const denominator = 2 * (2 * y2 - y1 - y3);
    const delta = denominator !== 0 ? (y3 - y1) / denominator : 0;
    const refinedPeriod = bestPeriod + delta;

    return sampleRate / refinedPeriod;
  }

  function noteFromPitch(frequency) {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
  }

  function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function centsOffFromPitch(frequency, note) {
    return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
  }

  function updateVolumeMeter(rms) {
    const bar = document.getElementById('tunerVolumeBar');
    if (!bar) return;
    const pct = Math.min(100, Math.max(0, Math.round(rms * 450)));
    bar.style.width = pct + '%';
    if (pct > 75) {
      bar.style.background = '#ffd166';
    } else if (pct > 5) {
      bar.style.background = '#d8ff65';
    } else {
      bar.style.background = '#445544';
    }
  }

  function findTargetString(frequency) {
    const preset = TUNING_PRESETS[currentTuningPreset];
    if (!preset || !preset.strings || preset.strings.length === 0) {
      return null;
    }

    if (lockedStringIndex >= 0 && lockedStringIndex < preset.strings.length) {
      return {
        string: preset.strings[lockedStringIndex],
        index: lockedStringIndex
      };
    }

    // Auto find closest string frequency
    let closest = preset.strings[0];
    let closestDiff = Math.abs(frequency - closest.freq);
    let closestIndex = 0;

    for (let i = 1; i < preset.strings.length; i++) {
      const diff = Math.abs(frequency - preset.strings[i].freq);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = preset.strings[i];
        closestIndex = i;
      }
    }

    return { string: closest, index: closestIndex };
  }

  function updateTunerLoop() {
    if (!isTuningActive || !analyserNode) return;

    const buffer = new Float32Array(analyserNode.fftSize);
    analyserNode.getFloatTimeDomainData(buffer);

    const freq = autoCorrelate(buffer, audioCtx.sampleRate);

    if (freq !== -1) {
      // Exponential moving average for silky smooth needle response
      smoothedFreq = smoothedFreq === 0 ? freq : (smoothedFreq * 0.7 + freq * 0.3);

      const midiNum = noteFromPitch(smoothedFreq);
      const noteName = NOTE_STRINGS[midiNum % 12];
      const octave = Math.floor(midiNum / 12) - 1;

      let cents = centsOffFromPitch(smoothedFreq, midiNum);
      cents = Math.max(-50, Math.min(50, cents));
      smoothedCents = smoothedCents * 0.65 + cents * 0.35;

      lastStableNote = noteName;
      lastStableOctave = octave;

      // Find target guitar string
      const target = findTargetString(smoothedFreq);

      renderTunerUI(noteName, octave, smoothedFreq, smoothedCents, target);
    } else {
      // Signal faded
      updateVolumeMeter(0);
      inTuneHoldFrames = Math.max(0, inTuneHoldFrames - 1);
      if (inTuneHoldFrames === 0) {
        renderTunerIdleUI();
      }
    }

    animationFrameId = requestAnimationFrame(updateTunerLoop);
  }

  function renderTunerUI(note, octave, freq, cents, target) {
    const noteEl = document.getElementById('tunerNoteDisplay');
    const octEl = document.getElementById('tunerOctaveDisplay');
    const freqEl = document.getElementById('tunerLiveFreq');
    const targetFreqEl = document.getElementById('tunerTargetFreq');
    const needleEl = document.getElementById('tunerNeedle');
    const centsValEl = document.getElementById('tunerCentsVal');
    const statusPill = document.getElementById('tunerStatusPill');
    const dialCard = document.getElementById('tunerDialCard');

    if (noteEl) noteEl.textContent = note;
    if (octEl) octEl.textContent = octave;
    if (freqEl) freqEl.textContent = freq.toFixed(1) + ' Hz';

    // Calculate rotation angle for needle (-50 cents = -45 deg, +50 cents = +45 deg)
    const angle = (cents / 50) * 44;
    if (needleEl) {
      needleEl.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }

    if (centsValEl) {
      const sign = cents > 0 ? '+' : '';
      centsValEl.textContent = `${sign}${Math.round(cents)} ¢`;
    }

    // In-tune threshold (±3 cents)
    const isInTune = Math.abs(cents) <= 3;

    if (isInTune) {
      inTuneHoldFrames = 15;
      if (statusPill) {
        statusPill.textContent = '🎯 PERFECT! IN TUNE';
        statusPill.className = 'tuner-status-pill in-tune';
      }
      if (dialCard) dialCard.classList.add('glow-in-tune');
      if (needleEl) needleEl.classList.add('in-tune');
    } else if (cents < -3) {
      if (statusPill) {
        statusPill.textContent = '▲ TUNE UP (FLAT)';
        statusPill.className = 'tuner-status-pill tune-up';
      }
      if (dialCard) dialCard.classList.remove('glow-in-tune');
      if (needleEl) needleEl.classList.remove('in-tune');
    } else {
      if (statusPill) {
        statusPill.textContent = '▼ TUNE DOWN (SHARP)';
        statusPill.className = 'tuner-status-pill tune-down';
      }
      if (dialCard) dialCard.classList.remove('glow-in-tune');
      if (needleEl) needleEl.classList.remove('in-tune');
    }

    if (target && target.string) {
      if (targetFreqEl) targetFreqEl.textContent = target.string.freq.toFixed(1) + ' Hz';
      highlightTunerString(target.index);
    } else {
      const targetMidiFreq = frequencyFromNoteNumber(noteFromPitch(freq));
      if (targetFreqEl) targetFreqEl.textContent = targetMidiFreq.toFixed(1) + ' Hz';
    }
  }

  function renderTunerIdleUI() {
    const statusPill = document.getElementById('tunerStatusPill');
    const dialCard = document.getElementById('tunerDialCard');
    const needleEl = document.getElementById('tunerNeedle');

    if (statusPill && isTuningActive) {
      statusPill.textContent = '🎤 Pluck any string to tune...';
      statusPill.className = 'tuner-status-pill listening';
    }
    if (dialCard) dialCard.classList.remove('glow-in-tune');
    if (needleEl) needleEl.classList.remove('in-tune');
  }

  function highlightTunerString(strIdx) {
    document.querySelectorAll('.headstock-peg-btn').forEach((peg, idx) => {
      peg.classList.toggle('active-peg', idx === strIdx);
    });
    document.querySelectorAll('.tuner-string-line').forEach((line, idx) => {
      line.classList.toggle('vibrating', idx === strIdx);
    });
  }

  // Public Methods
  window.startTuner = async function() {
    const toggleBtn = document.getElementById('btnTunerToggle');
    const statusPill = document.getElementById('tunerStatusPill');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        });
      } else {
        alert("Microphone access is not supported by your current environment. You can still use 'Tune by Ear' mode below!");
        return;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      sourceNode = audioCtx.createMediaStreamSource(micStream);

      // Low-pass / bandpass filter to isolate guitar frequencies
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 1100;

      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 2048;

      sourceNode.connect(filterNode);
      filterNode.connect(analyserNode);

      isTuningActive = true;
      if (toggleBtn) {
        toggleBtn.innerHTML = '⏹ Stop Microphone';
        toggleBtn.classList.add('listening');
      }
      if (statusPill) {
        statusPill.textContent = '🎤 Listening... Pluck a string!';
        statusPill.className = 'tuner-status-pill listening';
      }

      smoothedCents = 0;
      smoothedFreq = 0;
      updateTunerLoop();
      toast('🎯 Guitar Tuner active! Pluck any open string.');
    } catch (err) {
      console.error('Tuner Microphone Error:', err);
      let errMsg = 'Could not access microphone.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg = 'Microphone permission was denied. Please allow microphone access in system settings or use "Tune By Ear" below!';
      }
      alert(errMsg);
      if (statusPill) {
        statusPill.textContent = '⚠️ Mic blocked • Use "Tune by Ear" below';
        statusPill.className = 'tuner-status-pill tune-down';
      }
    }
  };

  window.stopTuner = function() {
    isTuningActive = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      micStream = null;
    }

    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close();
      audioCtx = null;
    }

    const toggleBtn = document.getElementById('btnTunerToggle');
    const statusPill = document.getElementById('tunerStatusPill');
    const needleEl = document.getElementById('tunerNeedle');
    const dialCard = document.getElementById('tunerDialCard');

    if (toggleBtn) {
      toggleBtn.innerHTML = '▶ Start Microphone Tuner';
      toggleBtn.classList.remove('listening');
    }
    if (statusPill) {
      statusPill.textContent = 'Mic off • Tap Start to begin';
      statusPill.className = 'tuner-status-pill';
    }
    if (needleEl) {
      needleEl.style.transform = 'translateX(-50%) rotate(0deg)';
      needleEl.classList.remove('in-tune');
    }
    if (dialCard) dialCard.classList.remove('glow-in-tune');
    updateVolumeMeter(0);
    highlightTunerString(-1);
  };

  window.toggleTuner = function() {
    if (isTuningActive) {
      window.stopTuner();
    } else {
      window.startTuner();
    }
  };

  window.setTuningPreset = function(presetKey) {
    currentTuningPreset = presetKey;
    lockedStringIndex = -1;
    renderHeadstockPegs();
    toast(`🎸 Tuner preset changed to: ${TUNING_PRESETS[presetKey].name}`);
  };

  window.lockTunerString = function(index) {
    if (lockedStringIndex === index) {
      lockedStringIndex = -1; // Toggle back to auto
      toast('🎯 Auto-Detect String mode enabled');
    } else {
      lockedStringIndex = index;
      const preset = TUNING_PRESETS[currentTuningPreset];
      if (preset && preset.strings[index]) {
        toast(`🔒 Locked to String ${preset.strings[index].label}`);
      }
    }
    renderHeadstockPegs();
  };

  // Pluck reference tone to tune by ear
  window.playReferencePitch = function(midiPitch, label) {
    if (window.playGuitarString) {
      // Use ChordCamp's Karplus-Strong physical modeling synth!
      window.playGuitarString(midiPitch, 3.2, 0, 0.35);
      toast(`🔊 Playing reference pitch: ${label}`);
    } else {
      // Fallback sine tone
      const ctx = window.getAudioContext ? window.getAudioContext() : new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const f = 440 * Math.pow(2, (midiPitch - 69) / 12);
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.5);
      toast(`🔊 Playing reference pitch: ${label}`);
    }
  };

  window.renderHeadstockPegs = function() {
    const container = document.getElementById('headstockPegsRow');
    if (!container) return;

    const preset = TUNING_PRESETS[currentTuningPreset];
    if (!preset || !preset.strings || preset.strings.length === 0) {
      container.innerHTML = `<div style="color:var(--muted);font-size:12px;padding:8px">Chromatic mode active • Tunes any instrument note across the full scale</div>`;
      return;
    }

    container.innerHTML = preset.strings.map((s, idx) => {
      const isLocked = lockedStringIndex === idx;
      return `
        <div class="headstock-peg-col">
          <button class="headstock-peg-btn ${isLocked ? 'locked' : ''}" onclick="lockTunerString(${idx})" title="Click to lock tuner to this string">
            <span class="peg-name">${s.label}</span>
            <span class="peg-freq">${s.freq.toFixed(1)} Hz</span>
          </button>
          <button class="peg-listen-btn" onclick="playReferencePitch(${s.midi}, '${s.label}')" title="Play reference audio tone">
            🔊 Hear
          </button>
        </div>
      `;
    }).join('');
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    window.renderHeadstockPegs();
  });
})();
