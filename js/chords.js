/* -------------------------------------------------------------
   7. CHORD PLAYGROUND STATE & RENDERING
------------------------------------------------------------- */
let activeRootFilter = 'All';
let activeQualityFilter = 'All';
let activeChordName = 'Am';
let activePositionIndex = 0; // 0 for Pos 1, 1 for Pos 2...
let useEasyShapes = true;

const ROOT_FILTER_LIST = ['All', 'E', 'A', 'D', 'G', 'B', 'C', 'F', 'F♯', 'C♯', 'G♯', 'D♯', 'B♭'];
const QUALITY_FILTER_LIST = ['All', 'Power', 'Major', 'Minor', '7th', 'Dim / Aug', 'Suspended', 'Extended'];

function initChordFilters() {
  const rootWrap = document.getElementById('rootFilterPills');
  rootWrap.innerHTML = ROOT_FILTER_LIST.map(r => `
    <button class="root-pill ${r === activeRootFilter ? 'active' : ''}" onclick="setRootFilter('${r}')">${r}</button>
  `).join('');

  const qWrap = document.getElementById('qualityFilterPills');
  qWrap.innerHTML = QUALITY_FILTER_LIST.map(q => `
    <button class="quality-pill ${q === activeQualityFilter ? 'active' : ''}" onclick="setQualityFilter('${q}')">${q}</button>
  `).join('');
}

function setRootFilter(root) {
  activeRootFilter = root;
  initChordFilters();
  renderChordGrid();
}

function setQualityFilter(quality) {
  activeQualityFilter = quality;
  initChordFilters();
  renderChordGrid();
}

function toggleGlobalEasyMode() {
  useEasyShapes = !useEasyShapes;
  const easyBtnText = document.getElementById('easyStateText');
  if (easyBtnText) easyBtnText.textContent = useEasyShapes ? 'ON' : 'OFF';
  selectChord(activeChordName, true);
  renderChordGrid();
  toast(useEasyShapes ? '✨ Beginner Easy Shapes enabled!' : '🎸 Standard barre/open shapes enabled');
}

function setVoicingMode(easy) {
  useEasyShapes = easy;
  const easyBtnText = document.getElementById('easyStateText');
  if (easyBtnText) easyBtnText.textContent = useEasyShapes ? 'ON' : 'OFF';

  const c = chordDatabase.find(x => x.name === activeChordName) || chordDatabase[0];
  if (!easy && c.positions) {
    activePositionIndex = 0;
  }
  selectChord(activeChordName, true);
  renderChordGrid();

  if (c.easyF) {
    toast(easy ? `✨ Easy shape for ${c.name} activated!` : `🎸 Standard barre shape for ${c.name} activated`);
  } else {
    toast(easy ? '✨ Beginner Easy Shapes enabled!' : '🎸 Standard barre/open shapes enabled');
  }
}

function getActiveVoicing(chord) {
  // 1. Easy mode override: if easy shapes is active and chord has an easy variant
  if (useEasyShapes && chord.easyF) {
    return {
      f: chord.easyF,
      fingers: chord.easyFingers,
      isEasyVariant: true,
      label: chord.easyLabel || 'Easy Shape',
      tip: chord.tip
    };
  }

  // 2. Multi-position selection
  if (chord.positions && chord.positions[activePositionIndex]) {
    const pos = chord.positions[activePositionIndex];
    return {
      f: pos.f,
      fingers: pos.fingers,
      isEasyVariant: false,
      label: pos.label,
      tip: pos.tip || chord.tip
    };
  }

  // 3. Fallback standard shape
  return {
    f: chord.f,
    fingers: chord.fingers,
    isEasyVariant: false,
    label: chord.level || 'Standard',
    tip: chord.tip
  };
}

function setChordPosition(idx) {
  activePositionIndex = idx;
  // When user explicitly clicks a position pill, deactivate easy override so chosen position displays
  useEasyShapes = false;
  const easyBtnText = document.getElementById('easyStateText');
  if (easyBtnText) easyBtnText.textContent = 'OFF';

  const c = chordDatabase.find(x => x.name === activeChordName) || chordDatabase[0];
  renderPositionPills(c);
  renderStageView(c);
  playActiveChord('strum');
}

function formatPositionBtnHtml(p, idx) {
  const posBadge = `Pos ${idx + 1}`;
  let posSub = '';
  const raw = (p.label || '').trim();
  const parenMatch = raw.match(/\((.*?)\)/);
  if (parenMatch && parenMatch[1]) {
    posSub = parenMatch[1];
  } else {
    const cleaned = raw.replace(/^Pos\s*\d+\s*/i, '').trim();
    posSub = cleaned || (idx === 0 ? 'Open' : `Fret ${p.f ? Math.min(...p.f.filter(x => x > 0)) : idx * 2}`);
  }
  return `
    <button class="pos-btn ${idx === activePositionIndex ? 'active' : ''}" onclick="setChordPosition(${idx})" title="${p.label || posBadge}">
      <span class="pos-badge">${posBadge}</span>
      <span class="pos-sub">${posSub}</span>
    </button>
  `;
}

function renderPositionPills(chord) {
  const container = document.getElementById('stagePositionPills');
  const positions = chord.positions || [
    { label: 'Pos 1 (Standard)', f: chord.f, fingers: chord.fingers }
  ];

  container.innerHTML = positions.map((p, idx) => formatPositionBtnHtml(p, idx)).join('');
}

function createChordSvg(chord, isInteractive = false) {
  const v = getActiveVoicing(chord);
  const fretsOnly = v.f.filter(x => x > 0);
  const maxFret = fretsOnly.length ? Math.max(...fretsOnly) : 1;
  const minFret = fretsOnly.length ? Math.min(...fretsOnly) : 1;
  const start = maxFret > 4 ? minFret : 1;

  const x0 = 30, y0 = 36, dx = 22, dy = 24;
  const viewW = 165, viewH = 175;

  let s = `<svg class="${isInteractive ? 'stage-diagram-svg' : 'card-diagram-svg'}" viewBox="0 0 ${viewW} ${viewH}" aria-label="${chord.name} chord diagram">`;

  // DRAW METALLIC GOLD CAPO CLAMP BAR (IF CAPO IS ACTIVE)
  if (activeCapoFret > 0 && start === 1) {
    s += `
      <g>
        <rect x="${x0 - 6}" y="${y0 - 5}" width="${5 * dx + 12}" height="9" rx="4.5" fill="#ffd166" stroke="#b38600" stroke-width="1.6"/>
        <text x="${x0 + 2.5 * dx}" y="${y0 - 9}" text-anchor="middle" font-size="8.5" font-weight="800" fill="#ffd166">CAPO FRET ${activeCapoFret}</text>
      </g>
    `;
  } else if (start > 1) {
    s += `<text x="6" y="${y0 + 16}" font-size="11" font-weight="700" fill="#d8ff65">${start}fr</text>`;
  }

  // Fret lines
  for (let j = 0; j <= 4; j++) {
    const y = y0 + j * dy;
    const isNut = (j === 0 && start === 1 && activeCapoFret === 0);
    s += `<line x1="${x0}" y1="${y}" x2="${x0 + 5 * dx}" y2="${y}" stroke="${isNut ? '#d7e2ce' : '#3a4e3a'}" stroke-width="${isNut ? 3.5 : 1.3}"/>`;
  }

  // Strings + Notes
  for (let i = 0; i < 6; i++) {
    const x = x0 + i * dx;
    const fretVal = v.f[i];
    const stringThickness = 2.2 - i * 0.22;
    const stringColor = fretVal < 0 ? '#343f33' : '#7b8d78';

    const clickAttr = isInteractive ? `onclick="pluckChordString(${i}, event)" class="string-pluckable"` : '';

    s += `<g ${clickAttr}>`;
    if (isInteractive) {
      s += `<rect x="${x - 10}" y="${y0 - 22}" width="20" height="${4 * dy + 44}" fill="transparent"/>`;
    }
    s += `<line class="str-line-anim-${i}" id="${isInteractive ? 'str-line-' + i : ''}" x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + 4 * dy}" stroke="${stringColor}" stroke-width="${stringThickness}"/>`;

    if (fretVal < 0) {
      s += `<text x="${x}" y="${y0 - 10}" text-anchor="middle" font-size="13" font-weight="700" fill="#ffad83">×</text>`;
    } else if (fretVal === 0) {
      s += `<circle cx="${x}" cy="${y0 - 15}" r="5" fill="none" stroke="${activeCapoFret > 0 ? '#ffd166' : '#d8ff65'}" stroke-width="1.8"/>`;
    }

    if (fretVal > 0) {
      const relFret = fretVal - start + 1;
      if (relFret >= 1 && relFret <= 4) {
        const cy = y0 + (relFret - 0.5) * dy;
        const fingerNum = v.fingers[i] || 0;
        const dotColor = FINGER_COLORS[fingerNum] || '#d8ff65';
        s += `<circle cx="${x}" cy="${cy}" r="8.5" fill="${dotColor}" stroke="#0e140f" stroke-width="1.5"/>`;
        s += `<text x="${x}" y="${cy + 3.5}" text-anchor="middle" font-size="10" font-weight="700" fill="#0e140f">${fingerNum || '•'}</text>`;
      }
    }

    // Actual sounding note (accounting for Capo transposition!)
    const midi = TUNING_MIDI[i] + activeCapoFret + fretVal;
    const playedNote = fretVal >= 0 ? NOTE_NAMES[midi % 12] : '—';
    s += `<text x="${x}" y="${y0 + 4 * dy + 15}" text-anchor="middle" font-size="10" font-weight="700" fill="${fretVal < 0 ? '#586556' : '#f4f7ec'}">${STRING_NAMES[i]}</text>`;
    if (isInteractive) {
      s += `<text x="${x}" y="${y0 + 4 * dy + 28}" text-anchor="middle" font-size="8.5" font-weight="700" fill="${activeCapoFret > 0 ? '#ffd166' : '#95a392'}">${playedNote}</text>`;
    }
    s += `</g>`;
  }

  s += `</svg>`;
  return s;
}

function selectChord(name, autoPlay = false) {
  const c = chordDatabase.find(x => x.name === name) || chordDatabase[0];
  if (name !== activeChordName) {
    activeChordName = c.name;
    activePositionIndex = 0; // reset to Pos 1
  }

  renderPositionPills(c);
  renderStageView(c);

  if (autoPlay) {
    playActiveChord('strum');
  }
}

function renderStageView(c) {
  const v = getActiveVoicing(c);
  const soundingName = getSoundingChordName(c.name, activeCapoFret);

  document.getElementById('stageBadge').textContent = c.name;
  document.getElementById('stageName').innerHTML = activeCapoFret > 0
    ? `${c.name} <span style="font-size:16px;color:var(--gold);font-weight:600">(Sounds as: ${soundingName})</span>`
    : `${c.name} ${c.type}`;

  document.getElementById('dockChordName').textContent = `Play ${c.name}`;

  const tag = document.getElementById('stageTag');
  tag.textContent = v.isEasyVariant ? `✨ ${v.label}` : (v.label || c.level);
  tag.className = 'tag ' + (v.isEasyVariant ? 'easy' : (c.level === 'Hard' ? 'barre' : 'standard'));

  updateCapoBanner();

  const btnEasy = document.getElementById('btnEasyVoicing');
  const btnStd = document.getElementById('btnStdVoicing');
  if (btnEasy && btnStd) {
    btnEasy.classList.toggle('active', useEasyShapes);
    btnStd.classList.toggle('active', !useEasyShapes);

    if (c.easyF) {
      btnEasy.innerHTML = `✨ ${c.easyLabel || 'Easy Shape'} <span class="has-alt-dot"></span>`;
      btnStd.innerHTML = '🎸 Standard Barre';
    } else {
      btnEasy.innerHTML = '✨ Easy Voicing';
      btnStd.innerHTML = '🎸 Standard Shape';
    }
  }

  document.getElementById('stageDiagramContainer').innerHTML = createChordSvg(c, true);

  const stepsWrap = document.getElementById('stageStepsGrid');
  const activeSteps = [];
  v.f.forEach((fret, strIdx) => {
    const fn = v.fingers[strIdx];
    if (fret > 0 && fn > 0) {
      const midi = TUNING_MIDI[strIdx] + activeCapoFret + fret;
      const soundingNote = NOTE_NAMES[midi % 12];
      const fretLabel = activeCapoFret > 0 ? `Fret ${fret} (rel to capo)` : `Fret ${fret}`;
      activeSteps.push(`
        <div class="step-card" onclick="pluckChordString(${strIdx}, event)" title="Tap to pluck this note">
          <span class="f-badge" style="background:${FINGER_COLORS[fn]}">${fn}</span>
          <div>
            <strong>${FINGER_NAMES[fn]} → ${fretLabel}</strong>
            <div style="font-size:11px;color:var(--muted)">${STRING_LABELS_FULL[strIdx]} (${soundingNote})</div>
          </div>
        </div>
      `);
    }
  });

  const openStrings = v.f.map((fret, idx) => fret === 0 ? STRING_NAMES[idx] : null).filter(Boolean);
  const mutedStrings = v.f.map((fret, idx) => fret < 0 ? STRING_NAMES[idx] : null).filter(Boolean);

  stepsWrap.innerHTML = activeSteps.join('') + `
    <div class="step-card">
      <span class="f-badge" style="background:#223023;color:${activeCapoFret > 0 ? '#ffd166' : '#d8ff65'}">○</span>
      <div>
        <strong>Open: ${openStrings.length ? openStrings.join(', ') : 'None'}</strong>
        <div style="font-size:11px;color:var(--muted)">${mutedStrings.length ? 'Mute/Skip: ' + mutedStrings.join(', ') : 'Strum all strings!'}</div>
      </div>
    </div>
  `;

  document.getElementById('stageCoachText').textContent = v.tip || c.tip;

  document.querySelectorAll('.chord-card').forEach(card => {
    card.classList.toggle('selected', card.dataset ? card.dataset.chord === c.name : false);
  });

  renderChordSheet(c);
}

function renderChordSheet(c) {
  const v = getActiveVoicing(c);
  const soundingName = getSoundingChordName(c.name, activeCapoFret);

  const badge = document.getElementById('sheetBadge');
  if (badge) badge.textContent = c.name;

  const nameEl = document.getElementById('sheetChordName');
  if (nameEl) {
    nameEl.innerHTML = activeCapoFret > 0
      ? `${c.name} <span style="font-size:15px;color:var(--gold);font-weight:600">(Sounds as: ${soundingName})</span>`
      : `${c.name} ${c.type}`;
  }

  const tag = document.getElementById('sheetTag');
  if (tag) {
    tag.textContent = v.isEasyVariant ? `✨ ${v.label}` : (v.label || c.level);
    tag.className = 'tag ' + (v.isEasyVariant ? 'easy' : (c.level === 'Hard' ? 'barre' : 'standard'));
  }

  const capoTag = document.getElementById('sheetCapoTag');
  if (capoTag) {
    if (activeCapoFret > 0) {
      capoTag.style.display = 'inline-block';
      capoTag.textContent = `Capo ${activeCapoFret}`;
    } else {
      capoTag.style.display = 'none';
    }
  }

  const sub = document.getElementById('sheetSubtitle');
  if (sub) {
    sub.textContent = activeCapoFret > 0
      ? `🔒 Capo on fret ${activeCapoFret}. Playing ${c.name} shape gives sounding pitch ${soundingName}!`
      : (c.tip || 'Tap individual strings to test each finger');
  }

  const btnEasy = document.getElementById('sheetBtnEasyVoicing');
  const btnStd = document.getElementById('sheetBtnStdVoicing');
  if (btnEasy && btnStd) {
    btnEasy.classList.toggle('active', useEasyShapes);
    btnStd.classList.toggle('active', !useEasyShapes);

    if (c.easyF) {
      btnEasy.innerHTML = `✨ ${c.easyLabel || 'Easy Shape'} <span class="has-alt-dot"></span>`;
      btnStd.innerHTML = '🎸 Standard Barre';
    } else {
      btnEasy.innerHTML = '✨ Easy Voicing';
      btnStd.innerHTML = '🎸 Standard Shape';
    }
  }

  const posWrap = document.getElementById('sheetPositionsWrap');
  const posContainer = document.getElementById('sheetPositionPills');
  if (posContainer && posWrap) {
    const positions = c.positions || [
      { label: 'Pos 1 (Standard)', f: c.f, fingers: c.fingers }
    ];
    posWrap.style.display = positions.length > 1 ? 'flex' : 'none';
    posContainer.innerHTML = positions.map((p, idx) => formatPositionBtnHtml(p, idx)).join('');
  }

  const diagContainer = document.getElementById('sheetDiagramContainer');
  if (diagContainer) {
    diagContainer.innerHTML = createChordSvg(c, true);
  }

  const stepsWrap = document.getElementById('sheetStepsGrid');
  if (stepsWrap) {
    const activeSteps = [];
    v.f.forEach((fret, strIdx) => {
      const fn = v.fingers[strIdx];
      if (fret > 0 && fn > 0) {
        const midi = TUNING_MIDI[strIdx] + activeCapoFret + fret;
        const soundingNote = NOTE_NAMES[midi % 12];
        const fretLabel = activeCapoFret > 0 ? `Fret ${fret} (rel to capo)` : `Fret ${fret}`;
        activeSteps.push(`
          <div class="step-card" onclick="pluckChordString(${strIdx}, event)" title="Tap to pluck this note">
            <span class="f-badge" style="background:${FINGER_COLORS[fn]}">${fn}</span>
            <div>
              <strong>${FINGER_NAMES[fn]} → ${fretLabel}</strong>
              <div style="font-size:11px;color:var(--muted)">${STRING_LABELS_FULL[strIdx]} (${soundingNote})</div>
            </div>
          </div>
        `);
      }
    });

    const openStrings = v.f.map((fret, idx) => fret === 0 ? STRING_NAMES[idx] : null).filter(Boolean);
    const mutedStrings = v.f.map((fret, idx) => fret < 0 ? STRING_NAMES[idx] : null).filter(Boolean);

    stepsWrap.innerHTML = (activeSteps.length ? activeSteps.join('') : '') + `
      <div class="step-card">
        <span class="f-badge" style="background:#223023;color:${activeCapoFret > 0 ? '#ffd166' : '#d8ff65'}">○</span>
        <div>
          <strong>Open: ${openStrings.length ? openStrings.join(', ') : 'None'}</strong>
          <div style="font-size:11px;color:var(--muted)">${mutedStrings.length ? 'Mute/Skip: ' + mutedStrings.join(', ') : 'Strum all strings!'}</div>
        </div>
      </div>
    `;
  }

  const tipText = document.getElementById('sheetTipText');
  if (tipText) tipText.textContent = v.tip || c.tip || 'Hold frets close behind the metal wire for crystal clear tone.';
}

let isChordSheetOpen = false;

function openChordSheet(name) {
  selectChord(name, true);
  const c = chordDatabase.find(x => x.name === name) || chordDatabase[0];
  renderChordSheet(c);

  const backdrop = document.getElementById('chordSheetBackdrop');
  const modal = document.getElementById('chordSheetModal');
  if (backdrop && modal) {
    backdrop.classList.add('open');
    modal.classList.add('open');
    isChordSheetOpen = true;
    if (document.body) document.body.style.overflow = 'hidden';
  }
}

function closeChordSheet() {
  const backdrop = document.getElementById('chordSheetBackdrop');
  const modal = document.getElementById('chordSheetModal');
  if (backdrop && modal) {
    backdrop.classList.remove('open');
    modal.classList.remove('open');
    isChordSheetOpen = false;
    if (document.body) document.body.style.overflow = '';
  }
}

function initSheetGestures() {
  const modal = document.getElementById('chordSheetModal');
  if (!modal) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  modal.addEventListener('touchstart', (e) => {
    if (modal.scrollTop <= 5) {
      startY = e.touches[0].clientY;
      currentY = startY;
      isDragging = true;
    }
  }, { passive: true });

  modal.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    if (deltaY > 0) {
      modal.style.transform = `translateY(${deltaY}px)`;
    }
  }, { passive: true });

  modal.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const deltaY = currentY - startY;
    modal.style.transform = '';
    if (deltaY > 80) {
      closeChordSheet();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isChordSheetOpen) {
      closeChordSheet();
    }
  });
}

function pluckChordString(strIdx, event) {
  if (event) event.stopPropagation();
  const c = chordDatabase.find(x => x.name === activeChordName);
  if (!c) return;
  const v = getActiveVoicing(c);
  const fret = v.f[strIdx];

  if (fret < 0) {
    toast(`× ${STRING_LABELS_FULL[strIdx]} is muted in ${c.name}`);
    return;
  }

  // ACCURATE CAPO PITCH TRANSPOSITION
  const midi = TUNING_MIDI[strIdx] + activeCapoFret + fret;
  playGuitarString(midi, 1.8, 0, 0.28);

  document.querySelectorAll('.str-line-anim-' + strIdx).forEach(line => {
    line.setAttribute('stroke', activeCapoFret > 0 ? '#ffd166' : '#d8ff65');
    line.setAttribute('stroke-width', '3.5');
    setTimeout(() => {
      line.setAttribute('stroke', '#7b8d78');
      line.setAttribute('stroke-width', String(2.2 - strIdx * 0.22));
    }, 240);
  });
}

function playActiveChord(mode = 'strum') {
  const c = chordDatabase.find(x => x.name === activeChordName);
  if (!c) return;
  const v = getActiveVoicing(c);
  const stepDelay = mode === 'arpeggio' ? 0.16 : 0.038;

  let activeIdx = 0;
  v.f.forEach((fret, strIdx) => {
    if (fret >= 0) {
      // ACCURATE CAPO PITCH TRANSPOSITION
      const midi = TUNING_MIDI[strIdx] + activeCapoFret + fret;
      const delay = activeIdx * stepDelay;
      playGuitarString(midi, 1.8, delay, 0.22);

      setTimeout(() => {
        document.querySelectorAll('.str-line-anim-' + strIdx).forEach(line => {
          line.setAttribute('stroke', activeCapoFret > 0 ? '#ffd166' : '#d8ff65');
          setTimeout(() => line.setAttribute('stroke', '#7b8d78'), 180);
        });
      }, delay * 1000);

      activeIdx++;
    }
  });

  const soundingName = getSoundingChordName(c.name, activeCapoFret);
  const capoMsg = activeCapoFret > 0 ? `(Capo ${activeCapoFret} ➔ Sounds as ${soundingName})` : '';
  toast(`${mode === 'arpeggio' ? '🎶 Slow Picking' : '🔊 Strumming'} ${c.name} ${capoMsg}`);
}

function handleChordSearch(val) {
  const clearBtn = document.getElementById('chordSearchClearBtn');
  if (clearBtn) {
    clearBtn.style.display = val && val.trim().length > 0 ? 'inline-flex' : 'none';
  }
  renderChordGrid();
}

function clearChordSearch() {
  const input = document.getElementById('chordSearchInput');
  if (input) {
    input.value = '';
    input.focus();
  }
  const clearBtn = document.getElementById('chordSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';
  renderChordGrid();
}

function renderChordGrid() {
  const query = (document.getElementById('chordSearchInput')?.value || '').trim().toLowerCase();
  const grid = document.getElementById('chordGrid');

  const filtered = chordDatabase.filter(c => {
    const matchesRoot = activeRootFilter === 'All' || c.root === activeRootFilter;
    const matchesCat = activeQualityFilter === 'All' || c.cat === activeQualityFilter;
    const matchesQuery = !query || c.name.toLowerCase().includes(query) || c.type.toLowerCase().includes(query);
    return matchesRoot && matchesCat && matchesQuery;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;padding:32px;text-align:center;color:var(--muted)">No chords match "${query || activeRootFilter}". Try selecting "All" or search C, Am, m11, or F!</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => {
    const v = getActiveVoicing(c);
    const soundingName = getSoundingChordName(c.name, activeCapoFret);
    const fingerSummary = [];
    v.f.forEach((fret, i) => {
      if (fret > 0 && v.fingers[i] > 0) {
        const fn = v.fingers[i];
        fingerSummary.push(`<span class="mini-f-dot" style="background:${FINGER_COLORS[fn]}">${fn}:${STRING_NAMES[i]}${fret}</span>`);
      }
    });

    return `
      <article class="chord-card ${c.name === activeChordName ? 'selected' : ''}" data-chord="${c.name}" onclick="openChordSheet('${c.name}')" title="Tap to slide up large view">
        <div class="card-top">
          <div>
            <div class="card-title">${c.name}</div>
            <div class="card-type">${activeCapoFret > 0 ? `<b style="color:var(--gold)">Sounds: ${soundingName}</b>` : c.type}</div>
          </div>
          <span class="tag ${v.isEasyVariant ? 'easy' : 'standard'}">${v.isEasyVariant ? '✨ Easy' : (c.positions ? `${c.positions.length} Pos` : c.level)}</span>
        </div>
        ${createChordSvg(c, false)}
        <div class="card-finger-pills">${fingerSummary.join('')}</div>
        <div class="card-actions">
          <button class="btn-card play" onclick="event.stopPropagation(); selectChord('${c.name}', true)" title="Quick strum">▶ Strum</button>
          <button class="btn-card stage" onclick="event.stopPropagation(); openChordSheet('${c.name}')" title="Slide up enlarged view">🔍 Enlarge</button>
        </div>
      </article>
    `;
  }).join('');
}