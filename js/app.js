/* -------------------------------------------------------------
   11. HUB NAVIGATION & BOOT
------------------------------------------------------------- */
function switchHub(hubId) {
  document.querySelectorAll('.hub-view').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`hub-${hubId}`);
  if (targetView) targetView.classList.add('active');

  document.querySelectorAll('.dock-hub-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.dock === hubId);
  });

  // Contextually adapt dock primary action button
  const strumBtn = document.getElementById('dockStrumBtn');
  const chordNameSpan = document.getElementById('dockChordName');
  if (strumBtn && chordNameSpan) {
    if (hubId === 'modes') {
      chordNameSpan.textContent = 'Play Scale';
      strumBtn.onclick = () => playScaleNotesAscending();
    } else if (hubId === 'metronome') {
      chordNameSpan.textContent = 'Tap Beat';
      strumBtn.onclick = () => toggleMetronome();
    } else if (hubId === 'tuner') {
      chordNameSpan.textContent = 'Toggle Mic';
      strumBtn.onclick = () => toggleTunerPower();
    } else if (hubId === 'studio') {
      chordNameSpan.textContent = 'Amp Rig';
      strumBtn.onclick = () => toggleDspPower();
    } else {
      chordNameSpan.textContent = `Play ${typeof activeChordName !== 'undefined' ? activeChordName : 'Am'}`;
      strumBtn.onclick = () => playActiveChord('strum');
    }
  }

  if (hubId === 'studio' && typeof initNotebook === 'function') {
    initNotebook();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Studio Sub-Navigation */
function switchStudioTab(tabId) {
  document.querySelectorAll('.studio-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.studio-view-pane').forEach(p => p.classList.remove('active'));

  const clickedBtn = Array.from(document.querySelectorAll('.studio-tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabId));
  if (clickedBtn) clickedBtn.classList.add('active');

  const targetPane = document.getElementById(`pane-${tabId}`);
  if (targetPane) targetPane.classList.add('active');

  if (tabId === 'scores' && typeof initAlphaTabEngine === 'function') {
    initAlphaTabEngine();
  }
  if (tabId === 'notebook' && typeof initNotebook === 'function') {
    initNotebook();
  }
}

/* DSP Power & Amp Presets */
function toggleDspPower() {
  const btn = document.getElementById('btnDspPower');
  if (DspEngine.isActive()) {
    DspEngine.stop();
    if (btn) btn.textContent = '⚡ Turn Amp ON';
    toast('Guitar Amp Rig turned off');
  } else {
    DspEngine.start().then(started => {
      if (started) {
        if (btn) btn.textContent = '⏹ Turn Amp OFF';
        toast('⚡ Amp Rig Live! Connect guitar or mic.');
      } else {
        toast('⚠️ Mic permission required for guitar input');
      }
    });
  }
}

function setAmpPreset(preset) {
  if (!DspEngine.isActive()) {
    DspEngine.start().then(() => applyPresetValues(preset));
    const btn = document.getElementById('btnDspPower');
    if (btn) btn.textContent = '⏹ Turn Amp OFF';
  } else {
    applyPresetValues(preset);
  }
}

function applyPresetValues(preset) {
  if (preset === 'clean') {
    DspEngine.setDrive(8);
    DspEngine.setBass(3);
    DspEngine.setMid(0);
    DspEngine.setTreble(4);
    DspEngine.setDelayMix(15);
    toast('✨ Clean Acoustic Tone active');
  } else if (preset === 'crunch') {
    DspEngine.setDrive(28);
    DspEngine.setBass(2);
    DspEngine.setMid(3);
    DspEngine.setTreble(1);
    DspEngine.setDelayMix(22);
    toast('🎸 Blues Crunch Tone active');
  } else if (preset === 'lead') {
    DspEngine.setDrive(50);
    DspEngine.setBass(4);
    DspEngine.setMid(6);
    DspEngine.setTreble(3);
    DspEngine.setDelayMix(35);
    toast('⚡ Metal Lead Tone active');
  }
}

/* Audio Recording */
function toggleAudioRecording() {
  const btn = document.getElementById('btnRecordToggle');
  const wrap = document.getElementById('recordingAudioPlayerWrap');

  if (DspEngine.isRecording()) {
    DspEngine.stopRecording();
    if (btn) btn.textContent = '🎙️ Start Record';
    toast('⏹ Recording stopped! Generating player...');
  } else {
    if (!DspEngine.isActive()) {
      toast('Starting amp rig for recording...');
      DspEngine.start().then(() => doStartRecording(btn, wrap));
    } else {
      doStartRecording(btn, wrap);
    }
  }
}

function doStartRecording(btn, wrap) {
  const started = DspEngine.startRecording((audioUrl) => {
    if (wrap) {
      wrap.innerHTML = `
        <audio controls src="${audioUrl}" style="height:32px;vertical-align:middle"></audio>
        <a href="${audioUrl}" download="ChordCamp-Guitar-Take.webm" class="fine-btn" style="color:var(--lime);text-decoration:none">⬇️ Save</a>
      `;
    }
    toast('💾 Audio Take ready to play or save!');
  });
  if (started && btn) {
    btn.textContent = '⏹ Stop Record';
    toast('🔴 Recording guitar audio now...');
  }
}

/* Settings Modal */
function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.style.display = 'flex';
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.style.display = 'none';
}

function toggleWindowsStartup(chk) {
  localStorage.setItem('chordcamp_startup_enabled', chk.checked ? 'true' : 'false');
  toast(chk.checked ? '✅ Enabled: ChordCamp will launch on Windows startup' : 'Disabled: Launch on startup turned off');
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.style.display = 'none', 2400);
}

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('phone-mode');
  try { localStorage.removeItem('chordcamp_view_mode'); } catch (e) {}
  initSheetGestures();
  initChordFilters();
  renderChordGrid();
  selectChord('Am', false);

  setScaleCategory('pentatonic');
  buildBeatBulbs();

  document.getElementById('bestChanges').textContent = localStorage.getItem('chordcamp_best_changes') || '0';
  document.getElementById('bestHunter').textContent = localStorage.getItem('chordcamp_best_hunter') || '0';

  // Load startup setting state
  const startupChk = document.getElementById('chkWindowsStartup');
  if (startupChk) {
    startupChk.checked = localStorage.getItem('chordcamp_startup_enabled') === 'true';
  }
});