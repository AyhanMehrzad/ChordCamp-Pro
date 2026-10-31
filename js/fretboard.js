/* -------------------------------------------------------------
   8. SIMPLIFIED SCALES & MODES ENGINE
------------------------------------------------------------- */
let activeScaleCategory = 'pentatonic';
let activeScaleId = 'minor-pentatonic';
let activeScaleViewMode = 'box1';
let displayIntervals = false;

function setScaleCategory(cat) {
  activeScaleCategory = cat;
  document.querySelectorAll('.scale-cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });

  const first = SCALE_DATABASE.find(s => s.category === cat);
  if (first) {
    activeScaleId = first.id;
  }
  renderScaleSelectorCards();
  renderActiveScaleView();
}

function renderScaleSelectorCards() {
  const container = document.getElementById('scaleCardsSelector');
  const scalesInCat = SCALE_DATABASE.filter(s => s.category === activeScaleCategory);

  container.innerHTML = scalesInCat.map(s => `
    <div class="scale-pick-card ${s.id === activeScaleId ? 'active' : ''}" onclick="selectScale('${s.id}')">
      <div class="scale-pick-title">
        <span>${s.name}</span>
        <span class="scale-pick-badge">${s.intervals.length} notes</span>
      </div>
      <div class="scale-pick-sub">${s.sub}</div>
    </div>
  `).join('');
}

function selectScale(id) {
  activeScaleId = id;
  renderScaleSelectorCards();
  renderActiveScaleView();
}

function changeScaleRoot() {
  const rootIdx = +document.getElementById('scaleRootSelect').value;
  document.getElementById('droneRootDisplay').textContent = NOTE_NAMES[rootIdx];
  renderActiveScaleView();
  if (droneActive) {
    startDrone();
  }
}

function setScaleViewMode(mode) {
  activeScaleViewMode = mode;
  document.getElementById('btnViewBox1').classList.toggle('active', mode === 'box1');
  document.getElementById('btnViewAll').classList.toggle('active', mode === 'all');
  drawFretboard();
}

function toggleIntervalDisplay() {
  displayIntervals = !displayIntervals;
  document.getElementById('displayModeLabel').textContent = displayIntervals ? 'Intervals (1, ♭3, 5)' : 'Note Names (A, C, D)';
  drawFretboard();
  renderScaleNotesChips();
}

function getActiveScale() {
  return SCALE_DATABASE.find(s => s.id === activeScaleId) || SCALE_DATABASE[0];
}

function renderActiveScaleView() {
  const s = getActiveScale();
  const rootIdx = +document.getElementById('scaleRootSelect').value;
  const rootName = NOTE_NAMES[rootIdx];

  document.getElementById('scaleTitleDisplay').textContent = `${rootName} ${s.name}`;
  document.getElementById('scaleFormulaTag').textContent = s.formula;
  document.getElementById('scaleSubDisplay').textContent = s.sub;

  document.getElementById('coachMoodText').textContent = s.mood;
  document.getElementById('coachVampText').textContent = s.vamp;

  const stepsList = document.getElementById('coachStepsList');
  stepsList.innerHTML = s.practiceSteps.map((step, idx) => `
    <li><strong>Step ${idx + 1}:</strong> ${step}</li>
  `).join('');

  renderScaleNotesChips();
  drawFretboard();
}

function renderScaleNotesChips() {
  const s = getActiveScale();
  const rootIdx = +document.getElementById('scaleRootSelect').value;
  const container = document.getElementById('scaleNotesChipsRow');
  const intervalLabels = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];

  container.innerHTML = s.intervals.map((interval) => {
    const noteIdx = (rootIdx + interval) % 12;
    const noteName = NOTE_NAMES[noteIdx];
    const midi = 48 + rootIdx + interval;
    const isRoot = (interval === 0);
    const isFlavor = (interval === s.flavorInterval && !isRoot);
    const isBlue = (s.isBlueScale && interval === 6);

    let chipClass = '';
    if (isRoot) chipClass = 'root-note';
    else if (isBlue) chipClass = 'blue-note';
    else if (isFlavor) chipClass = 'flavor-note';

    const label = displayIntervals ? intervalLabels[interval] : noteName;
    const sub = isRoot ? '(Root)' : (isBlue ? '(Blue Note ♭5)' : (isFlavor ? `(${s.flavorName})` : ''));

    return `
      <button class="note-play-chip ${chipClass}" onclick="playGuitarString(${midi}, 1.2, 0, 0.28)" title="Tap to hear note">
        <span>🔊</span>
        <strong>${label}</strong>
        ${sub ? `<span style="font-size:10px;opacity:0.8">${sub}</span>` : ''}
      </button>
    `;
  }).join('');
}

function playScaleNotesAscending() {
  const root = +document.getElementById('scaleRootSelect').value;
  const s = getActiveScale();
  s.intervals.forEach((interval, i) => {
    const midi = 48 + root + interval;
    playGuitarString(midi, 0.7, i * 0.24, 0.24);
  });
  toast(`🎵 Playing ${NOTE_NAMES[root]} ${s.name}`);
}

function drawFretboard() {
  const svg = document.getElementById('fretboardSvg');
  const root = +document.getElementById('scaleRootSelect').value;
  const s = getActiveScale();

  const x0 = 42, y0 = 32, dx = 48, dy = 30;
  const stringMidis = [64, 59, 55, 50, 45, 40];
  const stringLabels = ['e', 'B', 'G', 'D', 'A', 'E'];

  const rootFret6 = (root - 4 + 12) % 12;
  const boxStart = Math.max(0, rootFret6 - 1);
  const boxEnd = rootFret6 + 3;

  let svgContent = '';

  if (activeScaleViewMode === 'box1') {
    const bx1 = x0 + Math.max(0, boxStart) * dx;
    const bxW = (boxEnd - Math.max(0, boxStart) + 0.5) * dx;
    svgContent += `<rect x="${bx1}" y="${y0 - 12}" width="${bxW}" height="${5 * dy + 24}" rx="12" fill="rgba(216,255,101,0.06)" stroke="rgba(216,255,101,0.4)" stroke-dasharray="5 5"/>`;
    svgContent += `<text x="${bx1 + 10}" y="${y0 - 16}" fill="#d8ff65" font-size="10" font-weight="700">BOX 1 SOLOING ZONE</text>`;
  }

  for (let f = 0; f <= 15; f++) {
    const x = x0 + f * dx;
    svgContent += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + 5 * dy}" stroke="${f === 0 ? '#cad6c2' : '#2d3b2e'}" stroke-width="${f === 0 ? 4.5 : 1.5}"/>`;
    if (f > 0) {
      svgContent += `<text x="${x - dx / 2}" y="18" text-anchor="middle" fill="#889885" font-size="11" font-weight="700">${f}</text>`;
    }
  }

  const intervalLabels = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];

  for (let st = 0; st < 6; st++) {
    const y = y0 + st * dy;
    svgContent += `<text x="14" y="${y + 4}" font-size="12" font-weight="700" fill="#95a392">${stringLabels[st]}</text>`;
    svgContent += `<line x1="${x0}" y1="${y}" x2="${x0 + 15 * dx}" y2="${y}" stroke="#485846" stroke-width="${1.2 + st * 0.28}"/>`;

    for (let f = 0; f <= 15; f++) {
      const midi = stringMidis[st] + f;
      const noteIdx = midi % 12;
      const interval = (noteIdx - root + 12) % 12;

      let isIncluded = false;

      if (s.isChromatic) {
        isIncluded = true;
      } else if (activeScaleViewMode === 'box1') {
        isIncluded = s.intervals.includes(interval) && (f >= boxStart && f <= boxEnd);
      } else {
        isIncluded = s.intervals.includes(interval);
      }

      if (isIncluded) {
        const x = f === 0 ? x0 - 10 : x0 + (f - 0.5) * dx;
        const isRoot = (interval === 0);
        const isBlueNote = (s.isBlueScale && interval === 6);
        const isFlavor = (interval === s.flavorInterval && !isRoot);

        let dotColor = '#d8ff65';
        if (isRoot) dotColor = '#ffad83';
        else if (isBlueNote) dotColor = '#4de8ff';
        else if (isFlavor) dotColor = '#e58cff';

        const labelText = displayIntervals ? intervalLabels[interval] : NOTE_NAMES[noteIdx];

        svgContent += `
          <g class="fret-clickable" onclick="playGuitarString(${midi}, 1.2, 0, 0.26)">
            <circle cx="${x}" cy="${y}" r="${isRoot ? 11 : 9}" fill="${dotColor}" stroke="#0b110c" stroke-width="1.8"/>
            <text x="${x}" y="${y + 3.8}" text-anchor="middle" fill="#0b110c" font-size="${labelText.length > 2 ? 8 : 9}" font-weight="700">${labelText}</text>
          </g>
        `;
      }
    }
  }

  svg.innerHTML = svgContent;
}