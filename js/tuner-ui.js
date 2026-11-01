/* -------------------------------------------------------------
   CHORDCAMP PRO — TUNER UI & DRILL LISTENER CONTROLLER
------------------------------------------------------------- */

let activeTargetNote = null;
let onDrillNoteMatched = null;
let listenerModeEnabled = false;

function toggleTunerPower() {
  const btn = document.getElementById('btnTunerToggle');
  const status = document.getElementById('tunerStatusText');
  const needle = document.getElementById('tunerNeedle');
  const noteDisplay = document.getElementById('tunerNoteName');
  const centsDisplay = document.getElementById('tunerCents');
  const freqDisplay = document.getElementById('tunerFreq');

  if (TunerEngine.isActive()) {
    TunerEngine.stop();
    if (btn) {
      btn.textContent = '🎤 Turn Tuner ON';
      btn.classList.remove('active');
    }
    if (status) status.textContent = 'Tuner standby. Click to start listening.';
    if (noteDisplay) noteDisplay.textContent = '—';
    if (centsDisplay) centsDisplay.textContent = '0 cents';
    if (freqDisplay) freqDisplay.textContent = '0.0 Hz';
    if (needle) needle.style.transform = 'translateX(-50%) rotate(0deg)';
    toast('Tuner turned off');
  } else {
    if (status) status.textContent = 'Listening to microphone...';
    if (btn) {
      btn.textContent = '⏹ Turn Tuner OFF';
      btn.classList.add('active');
    }

    TunerEngine.start((data) => {
      updateTunerDisplay(data);

      // Listener Mode Validation check for active drill
      if (listenerModeEnabled && activeTargetNote && data) {
        validateDrillPitch(data);
      }
    }).then(started => {
      if (!started) {
        if (status) status.textContent = '⚠️ Mic access denied. Allow mic permissions to use tuner.';
        if (btn) {
          btn.textContent = '🎤 Turn Tuner ON';
          btn.classList.remove('active');
        }
        toast('⚠️ Microphone access needed for tuner');
      } else {
        toast('🎤 Tuner listening!');
      }
    });
  }
}

function updateTunerDisplay(data) {
  const noteDisplay = document.getElementById('tunerNoteName');
  const centsDisplay = document.getElementById('tunerCents');
  const freqDisplay = document.getElementById('tunerFreq');
  const needle = document.getElementById('tunerNeedle');
  const dial = document.getElementById('tunerDialGauge');

  if (!data) {
    if (dial) dial.classList.remove('in-tune');
    return;
  }

  if (noteDisplay) noteDisplay.textContent = data.note;
  if (freqDisplay) freqDisplay.textContent = `${data.frequency.toFixed(1)} Hz`;

  const clampedCents = Math.max(-50, Math.min(50, data.cents));
  if (centsDisplay) {
    centsDisplay.textContent = `${clampedCents > 0 ? '+' : ''}${clampedCents} cents`;
  }

  // Needle rotation between -45deg and +45deg
  const rot = (clampedCents / 50) * 45;
  if (needle) {
    needle.style.transform = `translateX(-50%) rotate(${rot}deg)`;
  }

  if (dial) {
    dial.classList.toggle('in-tune', data.inTune);
  }

  // Highlight standard string if matching
  document.querySelectorAll('.guitar-string-chip').forEach(chip => {
    const sNote = chip.dataset.stringNote;
    chip.classList.toggle('matched', sNote === data.fullName);
  });
}

function validateDrillPitch(data) {
  if (!activeTargetNote) return;
  const targetClean = activeTargetNote.replace(/[0-9]/g, '').trim();
  const detectedClean = data.note.replace(/[0-9]/g, '').trim();
  const drillFeedback = document.getElementById('drillListenerFeedback');

  if (detectedClean === targetClean && Math.abs(data.cents) <= 25) {
    if (drillFeedback) {
      drillFeedback.innerHTML = `<span style="color:var(--lime);font-weight:700">✅ Perfect! Played ${data.note} (${data.cents > 0 ? '+' : ''}${data.cents}c)</span>`;
    }
    if (typeof onDrillNoteMatched === 'function') {
      const cb = onDrillNoteMatched;
      onDrillNoteMatched = null; // Prevent duplicate fire
      setTimeout(() => cb(data), 200);
    }
  } else {
    if (drillFeedback) {
      const dir = data.cents < 0 ? 'flat' : 'sharp';
      drillFeedback.innerHTML = `<span style="color:#ffad83">Heard <b>${data.note}</b> (${dir}). Waiting for <b>${activeTargetNote}</b>...</span>`;
    }
  }
}

function setDrillListenerTarget(targetNote, onMatched) {
  activeTargetNote = targetNote;
  onDrillNoteMatched = onMatched;
  const drillFeedback = document.getElementById('drillListenerFeedback');
  if (drillFeedback) {
    drillFeedback.innerHTML = `<span>Listening for note: <b style="color:var(--lime);font-size:16px">${targetNote}</b></span>`;
  }
}

function toggleDrillListenerMode(checkbox) {
  listenerModeEnabled = checkbox.checked;
  const panel = document.getElementById('drillListenerPanel');
  if (panel) panel.style.display = listenerModeEnabled ? 'block' : 'none';

  if (listenerModeEnabled) {
    if (!TunerEngine.isActive()) {
      toggleTunerPower();
    }
    toast('👂 Drill Listener active! Strum target note to advance.');
  } else {
    activeTargetNote = null;
    onDrillNoteMatched = null;
    toast('Listener validation turned off.');
  }
}
