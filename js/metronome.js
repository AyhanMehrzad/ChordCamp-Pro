/* -------------------------------------------------------------
   10. CHORDCAMP PRO — VISUAL GROOVE METRONOME & RHYTHM COACH
   Web Audio lookahead scheduling (zero drift) + physics pendulum
   Interactive subdivision visualizer + beginner strumming coach
------------------------------------------------------------- */

(function() {
  'use strict';

  let isRunning = false;
  let bpm = 80;
  let timeSig = 4; // 2, 3, 4, 5, 6, 7
  let subdivMode = '1'; // '1', '2', '4', '3', 'swing'
  let activeSound = 'woodblock';

  // Precision Web Audio scheduling variables
  let audioContext = null;
  let nextNoteTime = 0.0;
  let currentSubBeat = 0; // sub-beat counter within measure
  let timerWorker = null;
  const scheduleAheadTime = 0.1; // 100ms lookahead
  const lookaheadInterval = 25; // check every 25ms
  let schedulerTimerId = null;

  // Strumming Pattern Coach Presets
  const STRUM_PRESETS = {
    'pop': {
      name: 'Pop / Rock Groove (D - D U - U D U)',
      sig: 4,
      sub: 2,
      pattern: [
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'miss', text: '•', label: 'Rest' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'up',   text: '↑', label: 'Up' },
        { dir: 'miss', text: '•', label: 'Rest' },
        { dir: 'up',   text: '↑', label: 'Up' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'up',   text: '↑', label: 'Up' }
      ]
    },
    'folk': {
      name: 'Folk / Campfire (D - D U D - D U)',
      sig: 4,
      sub: 2,
      pattern: [
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'miss', text: '•', label: 'Rest' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'up',   text: '↑', label: 'Up' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'miss', text: '•', label: 'Rest' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'up',   text: '↑', label: 'Up' }
      ]
    },
    'rock8th': {
      name: 'Punk / Rock Steady 8ths (D D D D D D D D)',
      sig: 4,
      sub: 2,
      pattern: [
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'down', text: '↓', label: 'Down' },
        { dir: 'down', text: '↓', label: 'Down' }
      ]
    },
    'waltz': {
      name: '3/4 Waltz / Ballad (D - D - D)',
      sig: 3,
      sub: 1,
      pattern: [
        { dir: 'down', text: '↓', label: 'Strong Down' },
        { dir: 'down', text: '↓', label: 'Soft Down' },
        { dir: 'down', text: '↓', label: 'Soft Down' }
      ]
    },
    'blues68': {
      name: '6/8 Slow Blues (D . . D . .)',
      sig: 6,
      sub: 1,
      pattern: [
        { dir: 'down', text: '↓', label: 'Heavy Accent' },
        { dir: 'miss', text: '•', label: 'Roll' },
        { dir: 'miss', text: '•', label: 'Roll' },
        { dir: 'down', text: '↓', label: 'Secondary' },
        { dir: 'miss', text: '•', label: 'Roll' },
        { dir: 'miss', text: '•', label: 'Roll' }
      ]
    }
  };
  let activeStrumPreset = 'pop';

  // Speed ladder & tap tempo
  let tapTimes = [];
  let barCounter = 0;
  let visualFlashEnabled = false;

  // Tempo Italian Markings & Advice
  function getTempoInfo(tempo) {
    if (tempo < 60) {
      return {
        italian: 'Largo',
        feel: 'Broad & Solemn',
        coach: '💡 Perfect slow speed for muscle memory, clean chord transitions, and finger stretches.'
      };
    } else if (tempo < 76) {
      return {
        italian: 'Adagio',
        feel: 'Leisurely & Melodic',
        coach: '💡 Excellent for acoustic fingerpicking, soulful blues phrasing, and clean arpeggios.'
      };
    } else if (tempo < 108) {
      return {
        italian: 'Andante',
        feel: 'Walking Pace',
        coach: '💡 Classic acoustic guitar tempo. Great for campfire strumming, folk, and pop ballads.'
      };
    } else if (tempo < 120) {
      return {
        italian: 'Moderato',
        feel: 'Moderate Groove',
        coach: '💡 The golden rock tempo! Steady, groove-heavy rhythm playing and funk comping.'
      };
    } else if (tempo < 156) {
      return {
        italian: 'Allegro',
        feel: 'Fast & Bright',
        coach: '💡 Upbeat rock, pop-punk, and driving country rhythm. Keep your strumming wrist loose!'
      };
    } else if (tempo < 176) {
      return {
        italian: 'Vivace',
        feel: 'Lively & Brisk',
        coach: '💡 High energy! Alternate picking speed drills and rapid chord chops.'
      };
    } else {
      return {
        italian: 'Presto',
        feel: 'Rapid Fire',
        coach: '⚡ Metal thrash, speed shredding, and fast sweeps. Stay relaxed—tension slows you down!'
      };
    }
  }

  function getSubdivMultiplier() {
    switch (subdivMode) {
      case '2': return 2; // 8th notes
      case '4': return 4; // 16th notes
      case '3': return 3; // Triplets
      case 'swing': return 2; // Swing 8ths
      default: return 1; // Quarter notes
    }
  }

  function getTotalSubBeatsPerMeasure() {
    return timeSig * getSubdivMultiplier();
  }

  function scheduleClick(time, isAccent, isMainBeat, isSubdivision) {
    if (!audioContext) return;

    const ctx = audioContext;
    const sound = document.getElementById('metroSoundSelect')?.value || 'woodblock';

    if (sound === 'woodblock') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      let startFreq = isAccent ? 1400 : (isMainBeat ? 950 : 680);
      osc.frequency.setValueAtTime(startFreq, time);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.4, time + 0.045);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isAccent ? 1200 : 850, time);
      filter.Q.value = 4.5;

      const vol = isAccent ? 0.48 : (isMainBeat ? 0.32 : 0.16);
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + (isAccent ? 0.075 : 0.05));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.08);
    } else if (sound === 'rimshot') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const f = isAccent ? 1850 : (isMainBeat ? 1350 : 920);
      osc.frequency.setValueAtTime(f, time);
      osc.frequency.exponentialRampToValueAtTime(180, time + 0.035);
      const vol = isAccent ? 0.45 : (isMainBeat ? 0.28 : 0.15);
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.05);
    } else if (sound === 'mechanical') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const f = isAccent ? 540 : (isMainBeat ? 380 : 260);
      osc.frequency.setValueAtTime(f, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);
      const vol = isAccent ? 0.52 : (isMainBeat ? 0.32 : 0.18);
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.06);
    } else {
      // Digital beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = isAccent ? 1760 : (isMainBeat ? 1174 : 784);
      const vol = isAccent ? 0.35 : (isMainBeat ? 0.22 : 0.12);
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  function advanceNote() {
    const mult = getSubdivMultiplier();
    let secondsPerSubBeat = (60.0 / bpm) / mult;

    // Swing feel modulation (60/40 swing ratio on 8ths)
    if (subdivMode === 'swing') {
      if (currentSubBeat % 2 === 0) {
        secondsPerSubBeat = ((60.0 / bpm) / 2) * 1.25; // Long downbeat
      } else {
        secondsPerSubBeat = ((60.0 / bpm) / 2) * 0.75; // Short upbeat
      }
    }

    nextNoteTime += secondsPerSubBeat;
    currentSubBeat++;

    const totalSubBeats = getTotalSubBeatsPerMeasure();
    if (currentSubBeat >= totalSubBeats) {
      currentSubBeat = 0;
      barCounter++;

      // Speed ladder check
      const ladderOn = document.getElementById('ladderToggle')?.checked;
      if (ladderOn && barCounter % 4 === 0) {
        window.adjustBpm(+3);
        if (window.toast) toast(`⚡ Speed Ladder: Tempo stepped up to ${bpm} BPM!`);
      }
    }
  }

  function schedule() {
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
      const mult = getSubdivMultiplier();
      const isMainBeat = (currentSubBeat % mult === 0);
      const mainBeatIndex = Math.floor(currentSubBeat / mult);
      const isAccent = (currentSubBeat === 0);
      const isSub = !isMainBeat;

      scheduleClick(nextNoteTime, isAccent, isMainBeat, isSub);

      // Trigger visual updates timed with the audio clock
      const delayMs = Math.max(0, (nextNoteTime - audioContext.currentTime) * 1000);
      const thisSubBeat = currentSubBeat;
      const thisMainBeat = mainBeatIndex;

      setTimeout(() => {
        triggerVisualBeat(thisMainBeat, thisSubBeat, isAccent, isMainBeat);
      }, delayMs);

      advanceNote();
    }

    if (isRunning) {
      schedulerTimerId = setTimeout(schedule, lookaheadInterval);
    }
  }

  function triggerVisualBeat(mainBeat, subBeat, isAccent, isMainBeat) {
    if (!isRunning) return;

    // 1. Update Beat Bulbs
    if (isMainBeat) {
      document.querySelectorAll('.beat-bulb').forEach((bulb, idx) => {
        bulb.classList.toggle('on', idx === mainBeat);
      });

      // Big beat counter display
      const counterEl = document.getElementById('metroBigBeatNum');
      if (counterEl) {
        counterEl.textContent = (mainBeat + 1);
        counterEl.className = 'metro-big-beat ' + (isAccent ? 'accent-flash' : 'beat-flash');
      }

      // Pendulum swing animation (left to right)
      const pendulum = document.getElementById('metroPendulumArm');
      if (pendulum) {
        const swingDirection = (mainBeat % 2 === 0) ? -1 : 1;
        const angle = swingDirection * 28;
        pendulum.style.transform = `rotate(${angle}deg)`;
      }

      // Screen flash for silent practice
      if (visualFlashEnabled) {
        const flashEl = document.getElementById('metroScreenFlash');
        if (flashEl) {
          flashEl.style.opacity = isAccent ? '0.22' : '0.08';
          setTimeout(() => flashEl.style.opacity = '0', 90);
        }
      }
    }

    // 2. Update Subdivision Chips
    document.querySelectorAll('.subdiv-chip').forEach((chip, idx) => {
      chip.classList.toggle('active', idx === subBeat);
    });

    // 3. Update Strumming Guide Active Arrow
    const preset = STRUM_PRESETS[activeStrumPreset];
    if (preset && preset.pattern) {
      const strumIdx = subBeat % preset.pattern.length;
      document.querySelectorAll('.strum-arrow-step').forEach((step, idx) => {
        step.classList.toggle('active', idx === strumIdx);
      });
    }
  }

  // Visual UI Builders
  window.buildBeatBulbs = function() {
    const container = document.getElementById('metroLights');
    if (!container) return;

    container.innerHTML = Array.from({ length: timeSig }, (_, i) => `
      <div class="beat-bulb ${i === 0 ? 'accent' : ''}" id="bulb-${i}">
        <span class="bulb-num">${i + 1}</span>
      </div>
    `).join('');
  };

  window.buildSubdivisionGrid = function() {
    const container = document.getElementById('metroSubdivChips');
    if (!container) return;

    const mult = getSubdivMultiplier();
    const total = getTotalSubBeatsPerMeasure();

    let html = '';
    for (let beat = 0; beat < timeSig; beat++) {
      html += `<div class="subdiv-measure-group">`;
      for (let sub = 0; sub < mult; sub++) {
        const overallIndex = beat * mult + sub;
        let label = '';
        if (mult === 1) {
          label = String(beat + 1);
        } else if (mult === 2) {
          label = sub === 0 ? String(beat + 1) : '&';
        } else if (mult === 3) {
          label = sub === 0 ? String(beat + 1) : (sub === 1 ? 'trip' : 'let');
        } else if (mult === 4) {
          const names = [String(beat + 1), 'e', '&', 'a'];
          label = names[sub];
        }
        const isMain = sub === 0;
        html += `
          <div class="subdiv-chip ${isMain ? 'main-beat' : 'sub-beat'}" id="subchip-${overallIndex}">
            ${label}
          </div>
        `;
      }
      html += `</div>`;
    }
    container.innerHTML = html;
  };

  window.buildStrummingGuide = function() {
    const container = document.getElementById('metroStrummingTrack');
    if (!container) return;

    const preset = STRUM_PRESETS[activeStrumPreset];
    if (!preset || !preset.pattern) return;

    container.innerHTML = preset.pattern.map((step, idx) => `
      <div class="strum-arrow-step ${step.dir}" id="strum-step-${idx}">
        <span class="strum-icon">${step.text}</span>
        <span class="strum-label">${step.label}</span>
      </div>
    `).join('');
  };

  window.updateBpm = function(val) {
    bpm = Math.max(40, Math.min(240, +val));
    const bpmEl = document.getElementById('metroBpmVal');
    const sliderEl = document.getElementById('metroSlider');
    const dockEl = document.getElementById('dockBpmText');
    const tempoTermEl = document.getElementById('metroTempoItalian');
    const tempoFeelEl = document.getElementById('metroTempoFeel');
    const coachEl = document.getElementById('metroCoachText');

    if (bpmEl) bpmEl.textContent = bpm;
    if (sliderEl) sliderEl.value = bpm;
    if (dockEl) dockEl.textContent = bpm;

    const info = getTempoInfo(bpm);
    if (tempoTermEl) tempoTermEl.textContent = info.italian;
    if (tempoFeelEl) tempoFeelEl.textContent = info.feel;
    if (coachEl) coachEl.textContent = info.coach;
  };

  window.adjustBpm = function(delta) {
    window.updateBpm(bpm + delta);
  };

  window.setBpmPreset = function(val) {
    window.updateBpm(val);
  };

  window.updateTimeSig = function() {
    timeSig = +document.getElementById('metroTimeSig').value;
    window.buildBeatBulbs();
    window.buildSubdivisionGrid();
  };

  window.updateSubdiv = function() {
    subdivMode = document.getElementById('metroSubdiv').value;
    window.buildSubdivisionGrid();
  };

  window.setStrumPreset = function(key) {
    activeStrumPreset = key;
    window.buildStrummingGuide();
  };

  window.toggleVisualFlash = function() {
    visualFlashEnabled = !visualFlashEnabled;
    const btn = document.getElementById('btnToggleFlash');
    if (btn) btn.classList.toggle('active', visualFlashEnabled);
    if (window.toast) toast(visualFlashEnabled ? '💡 Visual screen flash enabled' : 'Visual flash turned off');
  };

  window.toggleMetronome = function() {
    const btn = document.getElementById('btnMetroToggle');
    const dockBtn = document.getElementById('dockMetroBtn');
    const icon = document.getElementById('metroIcon');
    const label = document.getElementById('metroBtnLabel');

    if (isRunning) {
      isRunning = false;
      clearTimeout(schedulerTimerId);
      if (btn) {
        btn.style.background = 'var(--lime)';
        btn.style.color = '#111a0d';
      }
      if (icon) icon.textContent = '▶';
      if (label) label.textContent = 'Start Metronome';
      if (dockBtn) dockBtn.classList.remove('active');

      // Reset bulbs & pendulum
      document.querySelectorAll('.beat-bulb').forEach(b => b.classList.remove('on'));
      document.querySelectorAll('.subdiv-chip').forEach(c => c.classList.remove('active'));
      const counterEl = document.getElementById('metroBigBeatNum');
      if (counterEl) counterEl.textContent = '-';
      const pendulum = document.getElementById('metroPendulumArm');
      if (pendulum) pendulum.style.transform = 'rotate(0deg)';
    } else {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();

      isRunning = true;
      currentSubBeat = 0;
      barCounter = 0;
      nextNoteTime = audioContext.currentTime + 0.05;

      schedule();

      if (btn) {
        btn.style.background = '#ff758f';
        btn.style.color = '#fff';
      }
      if (icon) icon.textContent = '⏹';
      if (label) label.textContent = 'Stop Metronome';
      if (dockBtn) dockBtn.classList.add('active');
    }
  };

  window.handleTapTempo = function() {
    const now = performance.now();
    tapTimes.push(now);
    if (tapTimes.length > 5) tapTimes.shift();

    if (tapTimes.length >= 2) {
      let intervals = [];
      for (let i = 1; i < tapTimes.length; i++) {
        intervals.push(tapTimes[i] - tapTimes[i - 1]);
      }
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calcBpm = Math.round(60000 / avgMs);
      if (calcBpm >= 40 && calcBpm <= 240) {
        window.updateBpm(calcBpm);
      }
    }

    const tapBtn = document.getElementById('btnTapTempo');
    if (tapBtn) {
      tapBtn.classList.add('tap-glow');
      setTimeout(() => tapBtn.classList.remove('tap-glow'), 120);
    }
  };

  // Setup on page load
  document.addEventListener('DOMContentLoaded', () => {
    window.updateBpm(bpm);
    window.buildBeatBulbs();
    window.buildSubdivisionGrid();
    window.buildStrummingGuide();
  });
})();
