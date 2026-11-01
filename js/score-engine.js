/* -------------------------------------------------------------
   CHORDCAMP PRO — GUITAR PRO SCORE FLOW & TEXT TAB AUTO-SYNC
   Full compatibility with .gp, .gp5, .gpx, MusicXML + Text Paste Auto-Sync
------------------------------------------------------------- */

let alphaTabApi = null;
let currentSongBpm = 100;
let autoScrollTimer = null;
let isSongPlaying = false;

// Load AlphaTab dynamically when Score Hub is opened
function initAlphaTabEngine() {
  const container = document.getElementById('alphaTabContainer');
  if (!container || alphaTabApi) return;

  if (typeof alphaTab === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/alphaTab.min.js';
    script.onload = () => setupAlphaTabInstance(container);
    script.onerror = () => {
      container.innerHTML = '<div style="padding:20px;text-align:center;color:#ffad83">⚠️ Could not load online AlphaTab library. Local GP tab reader available.</div>';
    };
    document.head.appendChild(script);
  } else {
    setupAlphaTabInstance(container);
  }
}

function setupAlphaTabInstance(container) {
  try {
    alphaTabApi = new alphaTab.AlphaTabApi(container, {
      core: {
        engine: 'html5',
        fontDirectory: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/font/'
      },
      display: {
        staveProfile: 'Default',
        layoutMode: 'Horizontal' // Flowing moving score view
      },
      player: {
        enablePlayer: true,
        soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2'
      }
    });

    alphaTabApi.soundFontLoaded.on(() => {
      const btn = document.getElementById('gpPlayBtn');
      if (btn) btn.disabled = false;
      toast('🎵 Guitar Pro soundfont ready!');
    });

    alphaTabApi.playerPositionChanged.on((e) => {
      // Flowing cursor sync
      const progress = (e.currentTime / e.endTime) * 100;
      const bar = document.getElementById('gpProgressBar');
      if (bar) bar.style.width = `${progress}%`;
    });
  } catch (err) {
    console.error('AlphaTab init failed:', err);
  }
}

function loadGuitarProFile(file) {
  if (!file) return;
  initAlphaTabEngine();
  const reader = new FileReader();
  reader.onload = (e) => {
    if (alphaTabApi) {
      alphaTabApi.load(new Uint8Array(e.target.result));
      document.getElementById('gpFileName').textContent = file.name;
      toast(`🎼 Loaded ${file.name}`);
    }
  };
  reader.readAsArrayBuffer(file);
}

function toggleGuitarProPlayback() {
  if (!alphaTabApi) return;
  alphaTabApi.playPause();
  const btn = document.getElementById('gpPlayBtn');
  if (btn) {
    const isPlaying = alphaTabApi.playerState === 1;
    btn.textContent = isPlaying ? '⏸ Pause' : '▶ Play Score';
  }
}

function setScorePlaybackSpeed(speed) {
  if (alphaTabApi) {
    alphaTabApi.playbackSpeed = +speed;
    toast(`Speed set to ${speed}x`);
  }
}

/* -------------------------------------------------------------
   TEXT CHORD & TAB AUTO-SYNC PARSER
------------------------------------------------------------- */
const CHORD_REGEX = /\b([A-G][b#]?(?:maj|min|m|M|dim|aug|sus[24]?|add[29]?|[0-9]+)?(?:\/[A-G][b#]?)?)\b/g;

function parsePastedChordSheet(text) {
  const lines = text.split('\n');
  const parsedSections = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (!line) {
      parsedSections.push({ type: 'empty' });
      continue;
    }

    // Section header (e.g. [Verse 1], [Chorus])
    if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
      parsedSections.push({ type: 'header', text: line.trim() });
      continue;
    }

    // Check if line is purely/mostly chords
    const chordMatches = line.match(CHORD_REGEX) || [];
    const nonSpaceCount = line.replace(/\s/g, '').length;
    const chordChars = chordMatches.join('').length;

    if (chordMatches.length > 0 && chordChars / nonSpaceCount > 0.6) {
      // This line is a chord progression line
      parsedSections.push({ type: 'chords', text: line, chords: chordMatches });
    } else {
      parsedSections.push({ type: 'lyrics', text: line });
    }
  }

  return parsedSections;
}

function renderSyncedSong(parsed) {
  const container = document.getElementById('syncedSongDisplay');
  if (!container) return;

  const html = parsed.map(item => {
    if (item.type === 'header') {
      return `<div class="song-section-badge">${item.text}</div>`;
    }
    if (item.type === 'chords') {
      const highlighted = item.text.replace(CHORD_REGEX, (m) => {
        return `<span class="synced-chord-chip" onclick="previewSongChord('${m}')" title="Click to view shape">${m}</span>`;
      });
      return `<pre class="song-chord-line">${highlighted}</pre>`;
    }
    if (item.type === 'lyrics') {
      return `<div class="song-lyric-line">${item.text}</div>`;
    }
    return `<div style="height:12px"></div>`;
  }).join('');

  container.innerHTML = html;
  toast('✨ Song sheet parsed & synced!');
}

function previewSongChord(chordName) {
  if (typeof selectChord === 'function') {
    selectChord(chordName, true);
  }
}

function handlePasteSongImport() {
  const input = document.getElementById('pasteSongText');
  if (!input || !input.value.trim()) {
    toast('Please paste your chords/tab text first!');
    return;
  }
  const parsed = parsePastedChordSheet(input.value);
  renderSyncedSong(parsed);
}

function toggleSongAutoScroll() {
  const display = document.getElementById('syncedSongDisplay');
  const btn = document.getElementById('btnSongScroll');
  if (!display || !btn) return;

  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
    btn.textContent = '▶ Auto-Scroll';
    toast('Auto-scroll paused');
  } else {
    btn.textContent = '⏸ Pause Scroll';
    toast('Auto-scroll started');
    autoScrollTimer = setInterval(() => {
      display.scrollTop += 1;
      if (display.scrollTop + display.clientHeight >= display.scrollHeight) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
        btn.textContent = '▶ Auto-Scroll';
      }
    }, 40); // Smooth scrolling
  }
}
