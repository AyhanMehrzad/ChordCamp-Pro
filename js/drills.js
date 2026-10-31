/* -------------------------------------------------------------
   9. PRACTICE DRILLS IMPLEMENTATION
------------------------------------------------------------- */
let changeDrillRunning = false;
let changeTimer = null;
let changeCount = 0;
let changeTimeRemaining = 60;

function toggleChangeDrill() {
  if (changeDrillRunning) {
    stopChangeDrill();
  } else {
    startChangeDrill();
  }
}

function startChangeDrill() {
  changeDrillRunning = true;
  changeCount = 0;
  changeTimeRemaining = 60;
  document.getElementById('drillChangeCount').textContent = '0';
  document.getElementById('btnStartDrill').textContent = '⏹ Stop Test';
  document.getElementById('btnCountDrill').style.display = 'block';

  changeTimer = setInterval(() => {
    changeTimeRemaining--;
    const m = String(Math.floor(changeTimeRemaining / 60)).padStart(2, '0');
    const s = String(changeTimeRemaining % 60).padStart(2, '0');
    document.getElementById('drillTimerDisplay').textContent = `${m}:${s}`;

    if (changeTimeRemaining <= 0) {
      stopChangeDrill();
      const best = Math.max(changeCount, +(localStorage.getItem('chordcamp_best_changes') || 0));
      localStorage.setItem('chordcamp_best_changes', best);
      document.getElementById('bestChanges').textContent = best;
      toast(`🎉 Time's up! You scored ${changeCount} changes in 60s!`);
    }
  }, 1000);
}

function stopChangeDrill() {
  clearInterval(changeTimer);
  changeDrillRunning = false;
  document.getElementById('btnStartDrill').textContent = '▶ Start 60s Test';
  document.getElementById('btnCountDrill').style.display = 'none';
}

function registerChange() {
  if (!changeDrillRunning) return;
  changeCount++;
  document.getElementById('drillChangeCount').textContent = changeCount;
  playGuitarString(60, 0.2, 0, 0.15);
}

function resetChangeDrill() {
  stopChangeDrill();
  document.getElementById('drillChangeCount').textContent = '0';
  document.getElementById('drillTimerDisplay').textContent = '01:00';
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && changeDrillRunning) {
    e.preventDefault();
    registerChange();
  }
});

// Drill 2: Fretboard Blind Note Hunter
let hunterRunning = false;
let hunterTimer = null;
let hunterScore = 0;
let hunterTimeLeft = 30;
let hunterTarget = 'A';

function startNoteHunter() {
  hunterRunning = true;
  hunterScore = 0;
  hunterTimeLeft = 30;
  hunterTarget = NOTE_NAMES[Math.floor(Math.random() * NOTE_NAMES.length)];
  document.getElementById('hunterTargetNote').textContent = hunterTarget;
  document.getElementById('hunterScore').textContent = '0';
  document.getElementById('hunterTime').textContent = '30s';
  document.getElementById('hunterStartBtn').textContent = 'Hunter Active (Tap Frets!)';

  switchHub('modes');
  toast(`🎯 Find every ${hunterTarget} note on the fretboard!`);

  clearInterval(hunterTimer);
  hunterTimer = setInterval(() => {
    hunterTimeLeft--;
    document.getElementById('hunterTime').textContent = `${hunterTimeLeft}s`;
    if (hunterTimeLeft <= 0) {
      clearInterval(hunterTimer);
      hunterRunning = false;
      document.getElementById('hunterStartBtn').textContent = '🎯 Start Hunting Challenge';
      const best = Math.max(hunterScore, +(localStorage.getItem('chordcamp_best_hunter') || 0));
      localStorage.setItem('chordcamp_best_hunter', best);
      document.getElementById('bestHunter').textContent = best;
      toast(`🏆 Challenge Complete! Final Score: ${hunterScore}`);
    }
  }, 1000);
}

// Drill 3: Modal Ear Trainer Quiz
let quizMode = null;
let quizStreakCount = 0;

function playQuizAudio() {
  const modesList = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian'];
  quizMode = modesList[Math.floor(Math.random() * modesList.length)];
  const m = SCALE_DATABASE.find(x => x.name.startsWith(quizMode));
  const root = 9;

  playGuitarString(45, 1.8, 0, 0.3);
  m.intervals.forEach((interval, idx) => {
    playGuitarString(48 + root + interval, 0.8, 0.4 + idx * 0.28, 0.2);
  });

  document.getElementById('quizResultText').textContent = '🔊 Mystery mode playing... Click your guess!';
}

function checkQuizAnswer(guess) {
  if (!quizMode) {
    toast('Tap "Play Mystery Mode" first!');
    return;
  }

  const resultEl = document.getElementById('quizResultText');
  if (guess === quizMode) {
    quizStreakCount++;
    document.getElementById('quizStreak').textContent = quizStreakCount;
    resultEl.innerHTML = `✅ <strong style="color:var(--lime)">Correct!</strong> It was ${quizMode}!`;
    toast('🎉 Spot on! Great ear.');
    quizMode = null;
  } else {
    quizStreakCount = 0;
    document.getElementById('quizStreak').textContent = '0';
    resultEl.innerHTML = `❌ That was <strong>${quizMode}</strong>. Notice its unique flavor note!`;
    toast(`Incorrect, it was ${quizMode}. Try another!`);
  }
}