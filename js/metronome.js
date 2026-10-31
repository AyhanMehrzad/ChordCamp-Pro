/* -------------------------------------------------------------
   10. PRO METRONOME ENGINE
------------------------------------------------------------- */
let metroIsRunning = false;
let metroBpm = 80;
let metroTimeSig = 4;
let metroSubdiv = '1';
let metroCurrentBeat = 0;
let metroTimerID = null;
let metroTapTimes = [];
let metroBarCounter = 0;

function updateBpm(val) {
  metroBpm = Math.max(40, Math.min(240, +val));
  document.getElementById('metroBpmVal').textContent = metroBpm;
  document.getElementById('metroSlider').value = metroBpm;
  document.getElementById('dockBpmText').textContent = metroBpm;
}

function adjustBpm(delta) {
  updateBpm(metroBpm + delta);
}

function setBpmPreset(val) {
  updateBpm(val);
}

function updateTimeSig() {
  metroTimeSig = +document.getElementById('metroTimeSig').value;
  buildBeatBulbs();
}

function updateSubdiv() {
  metroSubdiv = document.getElementById('metroSubdiv').value;
}

function buildBeatBulbs() {
  const container = document.getElementById('metroLights');
  container.innerHTML = Array.from({ length: metroTimeSig }, (_, i) => `
    <div class="beat-bulb ${i === 0 ? 'accent' : ''}" id="bulb-${i}"></div>
  `).join('');
}

function playMetroClick(isAccent = false, isSub = false) {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  const sound = document.getElementById('metroSoundSelect').value;

  if (sound === 'woodblock') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const startFreq = isAccent ? 1250 : (isSub ? 680 : 880);
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.45, t + 0.045);

    filter.type = 'bandpass';
    filter.frequency.value = isAccent ? 1050 : 800;
    filter.Q.value = 4.2;

    gain.gain.setValueAtTime(isAccent ? 0.45 : (isSub ? 0.18 : 0.32), t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + (isAccent ? 0.08 : 0.055));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  } else if (sound === 'rimshot') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isAccent ? 1750 : 1300, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.03);
    gain.gain.setValueAtTime(isAccent ? 0.4 : 0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  } else if (sound === 'mechanical') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isAccent ? 480 : 340, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);
    gain.gain.setValueAtTime(isAccent ? 0.5 : 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);
  } else {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = isAccent ? 1760 : (isSub ? 880 : 1174);
    gain.gain.setValueAtTime(isAccent ? 0.3 : (isSub ? 0.12 : 0.2), t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.055);
  }
}

function metroTick() {
  const isAccent = (metroCurrentBeat === 0);
  playMetroClick(isAccent, false);

  document.querySelectorAll('.beat-bulb').forEach((b, idx) => {
    b.classList.toggle('on', idx === metroCurrentBeat);
  });
  setTimeout(() => {
    const bulb = document.getElementById(`bulb-${metroCurrentBeat}`);
    if (bulb) bulb.classList.remove('on');
  }, 100);

  metroCurrentBeat = (metroCurrentBeat + 1) % metroTimeSig;
  if (metroCurrentBeat === 0) {
    metroBarCounter++;
    const ladderOn = document.getElementById('ladderToggle')?.checked;
    if (ladderOn && metroBarCounter % 4 === 0) {
      adjustBpm(+3);
      toast(`⚡ Speed Ladder: Tempo stepped up to ${metroBpm} BPM!`);
    }
  }
}

function toggleMetronome() {
  const btn = document.getElementById('btnMetroToggle');
  const dockBtn = document.getElementById('dockMetroBtn');
  const icon = document.getElementById('metroIcon');
  const label = document.getElementById('metroBtnLabel');

  if (metroIsRunning) {
    clearInterval(metroTimerID);
    metroIsRunning = false;
    btn.style.background = 'var(--lime)';
    btn.style.color = '#111a0d';
    icon.textContent = '▶';
    label.textContent = 'Start Metronome';
    dockBtn.classList.remove('active');
  } else {
    getAudioContext();
    metroCurrentBeat = 0;
    metroBarCounter = 0;
    metroTick();
    metroTimerID = setInterval(metroTick, (60 / metroBpm) * 1000);
    metroIsRunning = true;
    btn.style.background = '#ff758f';
    btn.style.color = '#fff';
    icon.textContent = '⏹';
    label.textContent = 'Stop Metronome';
    dockBtn.classList.add('active');
  }
}

function handleTapTempo() {
  const now = performance.now();
  metroTapTimes.push(now);
  if (metroTapTimes.length > 5) metroTapTimes.shift();

  if (metroTapTimes.length >= 2) {
    let intervals = [];
    for (let i = 1; i < metroTapTimes.length; i++) {
      intervals.push(metroTapTimes[i] - metroTapTimes[i - 1]);
    }
    const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const calcBpm = Math.round(60000 / avgMs);
    if (calcBpm >= 40 && calcBpm <= 240) {
      updateBpm(calcBpm);
      if (metroIsRunning) {
        clearInterval(metroTimerID);
        metroTimerID = setInterval(metroTick, (60 / metroBpm) * 1000);
      }
    }
  }
}