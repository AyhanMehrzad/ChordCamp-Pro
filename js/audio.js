/* -------------------------------------------------------------
   5. KARPLUS-STRONG PHYSICAL MODELING AUDIO SYNTHESIZER
------------------------------------------------------------- */
let audioCtx = null;
let currentSoundPreset = 'acoustic';
const pluckBufferCache = new Map();

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function setGuitarSound(preset) {
  currentSoundPreset = preset;
  document.getElementById('btnSoundAcoustic').classList.toggle('active', preset === 'acoustic');
  document.getElementById('btnSoundElectric').classList.toggle('active', preset === 'electric');
  pluckBufferCache.clear();
  toast(preset === 'acoustic' ? '🎸 Warm Acoustic Guitar Engine active' : '⚡ Clean Electric Guitar Engine active');
}

function createPluckedStringAudioBuffer(ctx, freq, duration = 1.8, preset = 'acoustic') {
  const sampleRate = ctx.sampleRate;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);

  const N = Math.round(sampleRate / freq);
  if (N <= 1) return buffer;

  const ring = new Float32Array(N);

  const pickPos = 0.22;
  for (let i = 0; i < N; i++) {
    ring[i] = (Math.random() * 2 - 1);
  }
  const pickDelay = Math.max(1, Math.round(N * pickPos));
  for (let i = 0; i < N; i++) {
    const prev = ring[(i - pickDelay + N) % N];
    ring[i] = (ring[i] - 0.72 * prev) * 0.7;
  }

  let decayFactor = 0.9955 - (freq / 3500) * 0.015;
  decayFactor = Math.max(0.975, Math.min(0.9975, decayFactor));
  if (preset === 'electric') decayFactor = Math.min(0.9985, decayFactor + 0.002);

  let ringIndex = 0;
  let prevSample = 0;

  for (let i = 0; i < numSamples; i++) {
    const currentSample = ring[ringIndex];
    const newSample = 0.5 * (currentSample + prevSample) * decayFactor;
    ring[ringIndex] = newSample;
    prevSample = currentSample;

    let env = 1.0;
    if (i > numSamples - 1200) {
      env = (numSamples - i) / 1200;
    }
    channelData[i] = currentSample * env;

    ringIndex++;
    if (ringIndex >= N) ringIndex = 0;
  }

  return buffer;
}

function playGuitarString(midi, duration = 1.8, when = 0, velocity = 0.24) {
  const ctx = getAudioContext();
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  const cacheKey = `${midi}_${currentSoundPreset}`;

  let buffer = pluckBufferCache.get(cacheKey);
  if (!buffer) {
    buffer = createPluckedStringAudioBuffer(ctx, freq, duration, currentSoundPreset);
    pluckBufferCache.set(cacheKey, buffer);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const t = ctx.currentTime + when;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(velocity, t);

  const bodyFilter = ctx.createBiquadFilter();
  bodyFilter.type = 'peaking';
  bodyFilter.frequency.setValueAtTime(115, t);
  bodyFilter.Q.setValueAtTime(2.2, t);
  bodyFilter.gain.setValueAtTime(currentSoundPreset === 'acoustic' ? 5.0 : 1.5, t);

  const highTame = ctx.createBiquadFilter();
  highTame.type = 'lowpass';
  highTame.frequency.setValueAtTime(currentSoundPreset === 'acoustic' ? 5200 : 7200, t);

  source.connect(bodyFilter);
  bodyFilter.connect(highTame);
  highTame.connect(gain);
  gain.connect(ctx.destination);

  source.start(t);

  const totalEl = document.getElementById('totalStrumCount');
  if (totalEl) totalEl.textContent = +totalEl.textContent + 1;
}

/* -------------------------------------------------------------
   6. AMBIENT MODAL DRONE PLAYER
------------------------------------------------------------- */
let droneActive = false;
let droneNodes = null;

function toggleDrone() {
  if (droneActive) {
    stopDrone();
  } else {
    startDrone();
  }
}

function startDrone() {
  const ctx = getAudioContext();
  stopDrone();

  const scaleRoot = +document.getElementById('scaleRootSelect').value;
  const rootMidi = 36 + scaleRoot;
  const freqRoot = 440 * Math.pow(2, (rootMidi - 69) / 12);
  const freqFifth = freqRoot * 1.5;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const osc3 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc2.type = 'sawtooth';
  osc3.type = 'sine';

  osc1.frequency.value = freqRoot;
  osc2.frequency.value = freqFifth;
  osc3.frequency.value = freqRoot * 2.0;
  osc2.detune.value = 5;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 460;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);

  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start();
  osc2.start();
  osc3.start();

  droneNodes = { osc1, osc2, osc3, gain, filter };
  droneActive = true;
  updateDroneUI();
}

function stopDrone() {
  if (droneNodes) {
    try {
      const ctx = getAudioContext();
      droneNodes.gain.gain.setValueAtTime(droneNodes.gain.gain.value, ctx.currentTime);
      droneNodes.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      setTimeout(() => {
        droneNodes.osc1.stop();
        droneNodes.osc2.stop();
        droneNodes.osc3.stop();
        droneNodes = null;
      }, 550);
    } catch (e) {}
  }
  droneActive = false;
  updateDroneUI();
}

function updateDroneUI() {
  const btn = document.getElementById('droneToggleBtn');
  const dockBtn = document.getElementById('dockDroneBtn');
  const icon = document.getElementById('droneBtnIcon');
  const text = document.getElementById('droneBtnText');

  if (droneActive) {
    btn.classList.add('playing');
    dockBtn.classList.add('active');
    icon.textContent = '⏹';
    text.textContent = 'Stop Drone';
  } else {
    btn.classList.remove('playing');
    dockBtn.classList.remove('active');
    icon.textContent = '▶';
    text.textContent = 'Start Drone';
  }
}

// Zero-latency mobile audio unlock on first user gesture
window.addEventListener('pointerdown', function initAudioOnce() {
  try { getAudioContext(); } catch (e) {}
}, { once: true, passive: true });