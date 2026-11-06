/* -------------------------------------------------------------
   1. CONSTANTS & METADATA
------------------------------------------------------------- */
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
const STRING_LABELS_FULL = ['6th (Low E)', '5th (A)', '4th (D)', '3rd (G)', '2nd (B)', '1st (High e)'];
const TUNING_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4
const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const FINGER_COLORS = {
  1: '#4de8ff', // Index
  2: '#d8ff65', // Middle
  3: '#ffad83', // Ring
  4: '#e58cff'  // Pinky
};
const FINGER_NAMES = {
  1: 'Index (1)',
  2: 'Middle (2)',
  3: 'Ring (3)',
  4: 'Pinky (4)'
};

/* -------------------------------------------------------------
   2. GLOBAL CAPO & TRANSPOSITION ENGINE
------------------------------------------------------------- */
let activeCapoFret = 0; // 0 = No Capo

function getSoundingChordName(chordName, capo) {
  if (!capo || capo === 0) return chordName;
  let root = '';
  let suffix = '';
  if (chordName.length > 1 && (chordName[1] === '#' || chordName[1] === '♯' || chordName[1] === 'b' || chordName[1] === '♭')) {
    root = chordName.slice(0, 2);
    suffix = chordName.slice(2);
  } else {
    root = chordName.slice(0, 1);
    suffix = chordName.slice(1);
  }

  const normMap = {
    'C': 0, 'C#': 1, 'C♯': 1, 'Db': 1, 'D♭': 1,
    'D': 2, 'D#': 3, 'D♯': 3, 'Eb': 3, 'E♭': 3,
    'E': 4,
    'F': 5, 'F#': 6, 'F♯': 6, 'Gb': 6, 'G♭': 6,
    'G': 7, 'G#': 8, 'G♯': 8, 'Ab': 8, 'A♭': 8,
    'A': 9, 'A#': 10, 'A♯': 10, 'Bb': 10, 'B♭': 10,
    'B': 11
  };

  const rootIdx = normMap[root];
  if (rootIdx === undefined) return chordName;

  const newRootIdx = (rootIdx + capo) % 12;
  return NOTE_NAMES[newRootIdx] + suffix;
}

function setGlobalCapo(fret) {
  activeCapoFret = Math.max(0, Math.min(9, fret));
  document.getElementById('navCapoSelect').value = String(activeCapoFret);

  // Update quick buttons
  document.querySelectorAll('.capo-btn').forEach(btn => {
    btn.classList.toggle('active', +btn.dataset.capo === activeCapoFret);
  });

  updateCapoBanner();
  selectChord(activeChordName, false);
  renderChordGrid();

  if (activeCapoFret > 0) {
    const sounding = getSoundingChordName(activeChordName, activeCapoFret);
    toast(`🔒 Capo clamped to Fret ${activeCapoFret}! ${activeChordName} shape now sounds as ${sounding}`);
    playGuitarString(TUNING_MIDI[4] + activeCapoFret, 0.4, 0, 0.2); // confirmation chime
  } else {
    toast('Standard Tuning (Capo removed)');
  }
}

function updateCapoBanner() {
  const title = document.getElementById('capoStatusTitle');
  const sub = document.getElementById('capoStatusSub');
  const tag = document.getElementById('stageCapoTag');

  if (activeCapoFret > 0) {
    const sounding = getSoundingChordName(activeChordName, activeCapoFret);
    title.innerHTML = `🔒 CAPO FRET ${activeCapoFret} ACTIVE • Shape: <strong>${activeChordName}</strong> ➔ Sounds as: <strong style="color:var(--gold);font-size:15px">${sounding}</strong>`;
    sub.textContent = `All diagrams and audio are transposed +${activeCapoFret} semitones. Frets on the diagram are relative to the capo!`;
    tag.style.display = 'inline-block';
    tag.textContent = `Sounds as: ${sounding}`;
  } else {
    title.textContent = 'Standard Tuning (No Capo)';
    sub.textContent = 'Select a capo fret to transpose chords to new positions up the neck!';
    tag.style.display = 'none';
  }
}

/* -------------------------------------------------------------
   3. EXTENSIVE CHORD DATABASE WITH MULTI-POSITION CAGED SHAPES
------------------------------------------------------------- */
const chordDatabase = [
  {
    "root": "E",
    "name": "E5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open Low E)",
        "f": [
          0,
          2,
          2,
          -1,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          2,
          0,
          0,
          0
        ],
        "tip": "The ultimate metal power chord! Heavy, palm-mutable, immortal."
      },
      {
        "label": "Pos 2 (7th Fret A-Root)",
        "f": [
          -1,
          7,
          9,
          9,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Tight 7th-fret power chord. Crisp attack for thrash and galloping riffs."
      },
      {
        "label": "Pos 3 (12th Fret Octave)",
        "f": [
          12,
          14,
          14,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Full octave higher on fret 12. Explosive high-energy metal hook."
      },
      {
        "label": "Pos 4 (Massive 6-String E5)",
        "f": [
          0,
          2,
          2,
          -1,
          0,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0,
          0,
          0
        ],
        "tip": "Let the high B and high e ring open for a gigantic wall of sound!"
      }
    ],
    "f": [
      0,
      2,
      2,
      -1,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      2,
      0,
      0,
      0
    ],
    "tip": "Keep your index on fret 2 of A and ring on fret 2 of D. Rest your palm near the bridge for heavy chugging!"
  },
  {
    "root": "E",
    "name": "E5(add9)",
    "type": "Prog Metal 9th Power",
    "cat": "Power",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (Open)",
        "f": [
          0,
          2,
          4,
          -1,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          0,
          0,
          0
        ],
        "tip": "Opeth & Tool favorite. Stretch pinky or ring to fret 4 for dark beauty."
      },
      {
        "label": "Pos 2 (7th Fret)",
        "f": [
          -1,
          7,
          9,
          11,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          2,
          4,
          0,
          0
        ],
        "tip": "Wide modern metal stretch voicing."
      }
    ],
    "f": [
      0,
      2,
      4,
      -1,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      0,
      0,
      0
    ],
    "tip": "The giant modern metal power chord used by Opeth, Tool, and Mastodon. Dark, brooding, epic."
  },
  {
    "root": "E",
    "name": "Em",
    "type": "Minor",
    "cat": "Minor",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open)",
        "f": [
          0,
          2,
          2,
          0,
          0,
          0
        ],
        "fingers": [
          0,
          2,
          3,
          0,
          0,
          0
        ],
        "tip": "The simplest and deepest open chord on guitar. Strum all 6 strings."
      },
      {
        "label": "Pos 2 (7th Fret Barre)",
        "f": [
          -1,
          7,
          9,
          9,
          8,
          7
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "A-minor shape barre at fret 7. Classic rock & metal staple."
      },
      {
        "label": "Pos 3 (12th Fret Octave)",
        "f": [
          12,
          14,
          14,
          12,
          12,
          12
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "Full E-minor barre at fret 12."
      }
    ],
    "f": [
      0,
      2,
      2,
      0,
      0,
      0
    ],
    "fingers": [
      0,
      2,
      3,
      0,
      0,
      0
    ],
    "tip": "Make sure fingers stand tall so the open G, B, and e strings ring completely clear."
  },
  {
    "root": "E",
    "name": "E",
    "type": "Major",
    "cat": "Major",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open)",
        "f": [
          0,
          2,
          2,
          1,
          0,
          0
        ],
        "fingers": [
          0,
          2,
          3,
          1,
          0,
          0
        ],
        "tip": "Same as Em, but Index on fret 1 of the G string provides the bright major 3rd."
      },
      {
        "label": "Pos 2 (7th Fret Barre)",
        "f": [
          -1,
          7,
          9,
          9,
          9,
          7
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "A-shape barre at fret 7."
      }
    ],
    "f": [
      0,
      2,
      2,
      1,
      0,
      0
    ],
    "fingers": [
      0,
      2,
      3,
      1,
      0,
      0
    ],
    "tip": "Index finger on 1st fret of G string transforms gloomy Em into heroic E Major."
  },
  {
    "root": "E",
    "name": "E7#9",
    "type": "Hendrix / Metal Tension",
    "cat": "Extended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (7th Fret)",
        "f": [
          0,
          7,
          6,
          7,
          8,
          -1
        ],
        "fingers": [
          0,
          2,
          1,
          3,
          4,
          0
        ],
        "tip": "The legendary \"Purple Haze\" chord! Gritty, dissonant, electrifying."
      }
    ],
    "f": [
      0,
      7,
      6,
      7,
      8,
      -1
    ],
    "fingers": [
      0,
      2,
      1,
      3,
      4,
      0
    ],
    "tip": "Middle on A7, Index on D6, Ring on G7, Pinky on B8. Open low E gives maximum thunder."
  },
  {
    "root": "E",
    "name": "Em11",
    "type": "Minor 11th",
    "cat": "Extended",
    "level": "Easy",
    "f": [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "fingers": [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "tip": "All 6 strings completely open! An ethereal, shimmering atmospheric minor 11th."
  },
  {
    "root": "E",
    "name": "E7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      0,
      2,
      0,
      1,
      0,
      0
    ],
    "fingers": [
      0,
      2,
      0,
      1,
      0,
      0
    ],
    "tip": "Classic blues tension. Lift your ring finger from standard E major."
  },
  {
    "root": "E",
    "name": "Emaj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      0,
      2,
      1,
      1,
      0,
      0
    ],
    "fingers": [
      0,
      3,
      1,
      2,
      0,
      0
    ],
    "tip": "Dreamy shoegaze/math-rock major 7th chord."
  },
  {
    "root": "E",
    "name": "Em7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      0,
      2,
      2,
      0,
      3,
      0
    ],
    "fingers": [
      0,
      1,
      2,
      0,
      3,
      0
    ],
    "tip": "Comfortable acoustic minor 7th with pinky on fret 3 of B."
  },
  {
    "root": "E",
    "name": "Esus4",
    "type": "Suspended 4",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      0,
      2,
      2,
      2,
      0,
      0
    ],
    "fingers": [
      0,
      2,
      3,
      4,
      0,
      0
    ],
    "tip": "Suspended tension that begs to resolve down to standard E major."
  },
  {
    "root": "E",
    "name": "Esus2",
    "type": "Suspended 2",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      0,
      2,
      4,
      4,
      0,
      0
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Lush Rush / Alex Lifeson acoustic suspended chord."
  },
  {
    "root": "E",
    "name": "Edim7",
    "type": "Diminished 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      -1,
      2,
      3,
      2,
      3
    ],
    "fingers": [
      0,
      0,
      1,
      3,
      2,
      4
    ],
    "tip": "Neoclassical Yngwie Malmsteen metal symmetry. Move up 3 frets for identical notes!"
  },
  {
    "root": "E",
    "name": "Eaug",
    "type": "Augmented",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      0,
      3,
      2,
      1,
      1,
      0
    ],
    "fingers": [
      0,
      4,
      3,
      1,
      2,
      0
    ],
    "tip": "Sharp 5th creates an unsettling, suspenseful horror/prog metal atmosphere."
  },
  {
    "root": "E",
    "name": "Em(maj7)",
    "type": "Minor Major 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      0,
      2,
      1,
      0,
      0,
      0
    ],
    "fingers": [
      0,
      2,
      1,
      0,
      0,
      0
    ],
    "tip": "The mysterious \"James Bond\" / Opeth dark chord with natural 7th over a minor triad."
  },
  {
    "root": "F",
    "name": "F5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (1st Fret Low E)",
        "f": [
          1,
          3,
          3,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Heavy, tight metal power chord right at the 1st fret. Slayer and Rammstein favorite."
      },
      {
        "label": "Pos 2 (8th Fret A-Root)",
        "f": [
          -1,
          8,
          10,
          10,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Punchy 8th fret A-string power chord."
      }
    ],
    "f": [
      1,
      3,
      3,
      -1,
      -1,
      -1
    ],
    "fingers": [
      1,
      3,
      4,
      0,
      0,
      0
    ],
    "tip": "Keep index firm on fret 1 of low E, ring on fret 3 of A, pinky on fret 3 of D."
  },
  {
    "root": "F",
    "name": "F5(add9)",
    "type": "Metal 9th Power Chord",
    "cat": "Power",
    "level": "Medium",
    "f": [
      1,
      3,
      5,
      -1,
      -1,
      -1
    ],
    "fingers": [
      1,
      2,
      4,
      0,
      0,
      0
    ],
    "tip": "Epic modern metal chord used in Swedish melodic death metal (In Flames, Dark Tranquillity)."
  },
  {
    "root": "F",
    "name": "F",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (1st Fret Barre)",
        "f": [
          1,
          3,
          3,
          2,
          1,
          1
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "Full 1st-fret barre chord."
      },
      {
        "label": "Pos 2 (8th Fret Barre)",
        "f": [
          -1,
          8,
          10,
          10,
          10,
          8
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "A-shape barre at fret 8."
      }
    ],
    "f": [
      1,
      3,
      3,
      2,
      1,
      1
    ],
    "fingers": [
      1,
      3,
      4,
      2,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      2,
      1,
      0
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      1,
      0
    ],
    "easyLabel": "Easy Fmaj7 (No Barre!)",
    "tip": "Barre chords tough? The Easy Shape (Fmaj7 stair-step) works in 95% of pop/rock songs!"
  },
  {
    "root": "F",
    "name": "Fm",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (1st Fret Barre)",
        "f": [
          1,
          3,
          3,
          1,
          1,
          1
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "Full 1st-fret minor barre."
      }
    ],
    "f": [
      1,
      3,
      3,
      1,
      1,
      1
    ],
    "fingers": [
      1,
      3,
      4,
      1,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      1,
      1,
      1
    ],
    "easyFingers": [
      0,
      0,
      3,
      1,
      1,
      1
    ],
    "easyLabel": "4-String Mini Fm",
    "tip": "Dark, melancholic minor barre chord."
  },
  {
    "root": "F",
    "name": "Fmaj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      -1,
      3,
      2,
      1,
      0
    ],
    "fingers": [
      0,
      0,
      3,
      2,
      1,
      0
    ],
    "tip": "A staple acoustic voicing that lets the high E string ring completely open."
  },
  {
    "root": "F",
    "name": "F7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Hard",
    "f": [
      1,
      3,
      1,
      2,
      1,
      1
    ],
    "fingers": [
      1,
      3,
      1,
      2,
      1,
      1
    ],
    "tip": "Punchy blues/funk dominant 7th barre chord."
  },
  {
    "root": "F",
    "name": "Fsus4",
    "type": "Suspended 4",
    "cat": "Suspended",
    "level": "Hard",
    "f": [
      1,
      3,
      3,
      3,
      1,
      1
    ],
    "fingers": [
      1,
      3,
      3,
      3,
      1,
      1
    ],
    "tip": "Dramatic suspended sound."
  },
  {
    "root": "F♯",
    "name": "F#5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret Low E)",
        "f": [
          2,
          4,
          4,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Pantera, Megadeth, and Soundgarden groove powerhouse!"
      },
      {
        "label": "Pos 2 (9th Fret A-Root)",
        "f": [
          -1,
          9,
          11,
          11,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "High register F# power chord."
      }
    ],
    "f": [
      2,
      4,
      4,
      -1,
      -1,
      -1
    ],
    "fingers": [
      1,
      3,
      4,
      0,
      0,
      0
    ],
    "tip": "Heavy grunge & thrash metal groove chord on fret 2."
  },
  {
    "root": "F♯",
    "name": "F#m",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret Barre)",
        "f": [
          2,
          4,
          4,
          2,
          2,
          2
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "Standard 2nd-fret minor barre."
      },
      {
        "label": "Pos 2 (9th Fret Barre)",
        "f": [
          -1,
          9,
          11,
          11,
          10,
          9
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "A-minor shape at fret 9."
      }
    ],
    "f": [
      2,
      4,
      4,
      2,
      2,
      2
    ],
    "fingers": [
      1,
      3,
      4,
      1,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      2,
      2,
      2
    ],
    "easyFingers": [
      0,
      0,
      3,
      1,
      1,
      1
    ],
    "easyLabel": "4-String Mini F#m",
    "tip": "2nd fret barre or play the top 4 strings for an easy change."
  },
  {
    "root": "F♯",
    "name": "F#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "f": [
      2,
      4,
      4,
      3,
      2,
      2
    ],
    "fingers": [
      1,
      3,
      4,
      2,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      3,
      2,
      2
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      1,
      1
    ],
    "easyLabel": "Mini F# Major",
    "tip": "Bright major barre chord rooted on F#."
  },
  {
    "root": "F♯",
    "name": "F#m7b5",
    "type": "Half-Diminished",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      2,
      -1,
      2,
      2,
      1,
      -1
    ],
    "fingers": [
      1,
      0,
      2,
      3,
      1,
      0
    ],
    "tip": "Essential minor 7 flat 5 chord for metal lead cadences into B7 and Em."
  },
  {
    "root": "G",
    "name": "G5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (3rd Fret Low E)",
        "f": [
          3,
          5,
          5,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Tight 3rd fret rock/metal power chord."
      },
      {
        "label": "Pos 2 (AC/DC Open G5)",
        "f": [
          3,
          -1,
          0,
          0,
          3,
          3
        ],
        "fingers": [
          2,
          0,
          0,
          0,
          3,
          4
        ],
        "tip": "The massive Malcolm Young open G5 power chord without the 3rd!"
      },
      {
        "label": "Pos 3 (10th Fret A-Root)",
        "f": [
          -1,
          10,
          12,
          12,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Punchy 10th fret A-string root."
      }
    ],
    "f": [
      3,
      5,
      5,
      -1,
      -1,
      -1
    ],
    "fingers": [
      1,
      3,
      4,
      0,
      0,
      0
    ],
    "tip": "The quintessential hard rock & metal rhythm chord."
  },
  {
    "root": "G",
    "name": "G",
    "type": "Major",
    "cat": "Major",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Standard Open)",
        "f": [
          3,
          2,
          0,
          0,
          0,
          3
        ],
        "fingers": [
          2,
          1,
          0,
          0,
          0,
          3
        ],
        "tip": "The universal 3-finger folk/rock G major."
      },
      {
        "label": "Pos 2 (Rock G with D on 2nd str)",
        "f": [
          3,
          2,
          0,
          0,
          3,
          3
        ],
        "fingers": [
          2,
          1,
          0,
          0,
          3,
          4
        ],
        "tip": "Big, bright 4-finger rock G chord."
      },
      {
        "label": "Pos 3 (3rd Fret Barre)",
        "f": [
          3,
          5,
          5,
          4,
          3,
          3
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "Full 6-string E-shape barre chord."
      }
    ],
    "f": [
      3,
      2,
      0,
      0,
      0,
      3
    ],
    "fingers": [
      2,
      1,
      0,
      0,
      0,
      3
    ],
    "tip": "The classic foundation chord of guitar. Keep your fingers arched high."
  },
  {
    "root": "G",
    "name": "Gm",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (3rd Fret Barre)",
        "f": [
          3,
          5,
          5,
          3,
          3,
          3
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "Full 3rd fret minor barre chord."
      },
      {
        "label": "Pos 2 (10th Fret Barre)",
        "f": [
          -1,
          10,
          12,
          12,
          11,
          10
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "A-minor shape at fret 10."
      }
    ],
    "f": [
      3,
      5,
      5,
      3,
      3,
      3
    ],
    "fingers": [
      1,
      3,
      4,
      1,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      5,
      3,
      3,
      3
    ],
    "easyFingers": [
      0,
      0,
      3,
      1,
      1,
      1
    ],
    "easyLabel": "4-String Mini Gm",
    "tip": "3rd fret barre minor or 4-string compact voicing."
  },
  {
    "root": "G",
    "name": "G7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      3,
      2,
      0,
      0,
      0,
      1
    ],
    "fingers": [
      3,
      2,
      0,
      0,
      0,
      1
    ],
    "tip": "Classic dominant 7th chord. Resolves naturally to C major."
  },
  {
    "root": "G",
    "name": "Gmaj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      3,
      2,
      0,
      0,
      0,
      2
    ],
    "fingers": [
      2,
      1,
      0,
      0,
      0,
      3
    ],
    "tip": "Lush major 7th chord with F# on the high E string."
  },
  {
    "root": "G",
    "name": "Gm7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Hard",
    "f": [
      3,
      5,
      3,
      3,
      3,
      3
    ],
    "fingers": [
      1,
      3,
      1,
      1,
      1,
      1
    ],
    "tip": "Warm minor 7th barre at the 3rd fret."
  },
  {
    "root": "G",
    "name": "Gsus4",
    "type": "Suspended 4",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      3,
      2,
      0,
      0,
      1,
      3
    ],
    "fingers": [
      3,
      2,
      0,
      0,
      1,
      4
    ],
    "tip": "Suspended 4th with C on the B string."
  },
  {
    "root": "G",
    "name": "Gsus2",
    "type": "Suspended 2",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      3,
      0,
      0,
      0,
      3,
      3
    ],
    "fingers": [
      1,
      0,
      0,
      0,
      3,
      4
    ],
    "tip": "Dreamy open suspended 2nd."
  },
  {
    "root": "G",
    "name": "Gadd9",
    "type": "Add 9th",
    "cat": "Extended",
    "level": "Easy",
    "f": [
      3,
      2,
      0,
      2,
      0,
      3
    ],
    "fingers": [
      2,
      1,
      0,
      3,
      0,
      4
    ],
    "tip": "Sparkling modern acoustic pop voicing."
  },
  {
    "root": "G",
    "name": "G13",
    "type": "Dominant 13th",
    "cat": "Extended",
    "level": "Medium",
    "f": [
      3,
      -1,
      3,
      4,
      5,
      -1
    ],
    "fingers": [
      1,
      0,
      2,
      3,
      4,
      0
    ],
    "tip": "The quintessential jazzy dominant 13th voicing used in funk and big band."
  },
  {
    "root": "G♯",
    "name": "G#5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (4th Fret Low E)",
        "f": [
          4,
          6,
          6,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Heavy 4th fret power chord. Dark, crushing metal tone."
      },
      {
        "label": "Pos 2 (11th Fret A-Root)",
        "f": [
          -1,
          11,
          13,
          13,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "11th fret high attack power chord."
      }
    ],
    "f": [
      4,
      6,
      6,
      -1,
      -1,
      -1
    ],
    "fingers": [
      1,
      3,
      4,
      0,
      0,
      0
    ],
    "tip": "Essential chord in drop tunings and doom metal."
  },
  {
    "root": "G♯",
    "name": "G#m",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (4th Fret Barre)",
        "f": [
          4,
          6,
          6,
          4,
          4,
          4
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "4th fret minor barre chord."
      }
    ],
    "f": [
      4,
      6,
      6,
      4,
      4,
      4
    ],
    "fingers": [
      1,
      3,
      4,
      1,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      4,
      4,
      4
    ],
    "easyFingers": [
      0,
      0,
      3,
      1,
      1,
      1
    ],
    "easyLabel": "4-String Mini G#m",
    "tip": "Gloomy, expressive minor chord."
  },
  {
    "root": "G♯",
    "name": "G#dim7",
    "type": "Diminished 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      -1,
      6,
      7,
      6,
      7
    ],
    "fingers": [
      0,
      0,
      1,
      3,
      2,
      4
    ],
    "tip": "Tension-packed diminished 7th for metal solos and resolving into A minor."
  },
  {
    "root": "A",
    "name": "A5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open A)",
        "f": [
          -1,
          0,
          2,
          2,
          -1,
          -1
        ],
        "fingers": [
          0,
          0,
          1,
          2,
          0,
          0
        ],
        "tip": "Classic open A power chord. The backbone of AC/DC, Led Zeppelin, and Judas Priest!"
      },
      {
        "label": "Pos 2 (5th Fret Low E)",
        "f": [
          5,
          7,
          7,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Heavy 5th-fret low E power chord for crushing palm-muted metal riffs."
      },
      {
        "label": "Pos 3 (12th Fret A-Root)",
        "f": [
          -1,
          12,
          14,
          14,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Screaming 12th fret power chord."
      }
    ],
    "f": [
      -1,
      0,
      2,
      2,
      -1,
      -1
    ],
    "fingers": [
      0,
      0,
      1,
      2,
      0,
      0
    ],
    "tip": "Barre fret 2 of D and G strings with one finger or use Index + Middle."
  },
  {
    "root": "A",
    "name": "A5(add9)",
    "type": "Prog Metal 9th Power",
    "cat": "Power",
    "level": "Medium",
    "f": [
      5,
      7,
      7,
      9,
      -1,
      -1
    ],
    "fingers": [
      1,
      2,
      3,
      4,
      0,
      0
    ],
    "tip": "Epic modern metal 9th power chord used in prog metal and post-rock."
  },
  {
    "root": "A",
    "name": "Am",
    "type": "Minor",
    "cat": "Minor",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open)",
        "f": [
          -1,
          0,
          2,
          2,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          2,
          3,
          1,
          0
        ],
        "tip": "Classic open A-minor. Middle and Ring on fret 2, Index on fret 1."
      },
      {
        "label": "Pos 2 (5th Fret Barre)",
        "f": [
          5,
          7,
          7,
          5,
          5,
          5
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "E-minor shape barre at the 5th fret. Full, punchy rock minor sound."
      },
      {
        "label": "Pos 3 (7th Fret Triad)",
        "f": [
          -1,
          -1,
          7,
          9,
          10,
          8
        ],
        "fingers": [
          0,
          0,
          1,
          3,
          4,
          2
        ],
        "tip": "D-minor shape rooted on the 4th string (D string at fret 7)."
      },
      {
        "label": "Pos 4 (12th Fret Octave)",
        "f": [
          -1,
          12,
          14,
          14,
          13,
          12
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "A-minor shape one full octave up. Sparkling high register."
      }
    ],
    "f": [
      -1,
      0,
      2,
      2,
      1,
      0
    ],
    "fingers": [
      0,
      0,
      2,
      3,
      1,
      0
    ],
    "tip": "Same finger shape as E Major, just moved one string down toward the floor."
  },
  {
    "root": "A",
    "name": "A",
    "type": "Major",
    "cat": "Major",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open)",
        "f": [
          -1,
          0,
          2,
          2,
          2,
          0
        ],
        "fingers": [
          0,
          0,
          1,
          2,
          3,
          0
        ],
        "tip": "All 3 fingers share fret 2. Strum 5 strings from the open A."
      },
      {
        "label": "Pos 2 (5th Fret Barre)",
        "f": [
          5,
          7,
          7,
          6,
          5,
          5
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "E-shape barre at the 5th fret. Standard rhythm rock chord."
      },
      {
        "label": "Pos 3 (7th Fret D-Shape)",
        "f": [
          -1,
          -1,
          7,
          9,
          10,
          9
        ],
        "fingers": [
          0,
          0,
          1,
          2,
          4,
          3
        ],
        "tip": "D-shape chord rooted on fret 7 of the D string."
      }
    ],
    "f": [
      -1,
      0,
      2,
      2,
      2,
      0
    ],
    "fingers": [
      0,
      0,
      1,
      2,
      3,
      0
    ],
    "tip": "Angle your fingers slightly so all three fit comfortably inside the 2nd fret."
  },
  {
    "root": "A",
    "name": "Am11",
    "type": "Minor 11th",
    "cat": "Extended",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open Lush)",
        "f": [
          -1,
          0,
          0,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          0,
          0,
          0,
          1,
          0
        ],
        "tip": "Just 1 finger on fret 1 of the B string with all open strings ringing!"
      },
      {
        "label": "Pos 2 (5th Fret Jazz)",
        "f": [
          5,
          -1,
          5,
          5,
          3,
          -1
        ],
        "fingers": [
          1,
          0,
          2,
          3,
          4,
          0
        ],
        "tip": "Sophisticated neo-soul and jazz voicing."
      }
    ],
    "f": [
      -1,
      0,
      0,
      0,
      1,
      0
    ],
    "fingers": [
      0,
      0,
      0,
      0,
      1,
      0
    ],
    "tip": "Super lush open Am11! Just ONE finger on fret 1 of the B string with open strings!"
  },
  {
    "root": "A",
    "name": "A7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      0,
      2,
      0,
      2,
      0
    ],
    "fingers": [
      0,
      0,
      2,
      0,
      3,
      0
    ],
    "tip": "Blues staple with the open G string ringing right through the middle."
  },
  {
    "root": "A",
    "name": "Amaj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      0,
      2,
      1,
      2,
      0
    ],
    "fingers": [
      0,
      0,
      2,
      1,
      3,
      0
    ],
    "tip": "Indie and dream-pop favorite with a warm, floating texture."
  },
  {
    "root": "A",
    "name": "Am7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      0,
      2,
      0,
      1,
      0
    ],
    "fingers": [
      0,
      0,
      2,
      0,
      1,
      0
    ],
    "tip": "Only 2 fingers! Take an Am chord and lift off your Ring finger."
  },
  {
    "root": "A",
    "name": "Aadd9",
    "type": "Add 9th",
    "cat": "Extended",
    "level": "Easy",
    "f": [
      -1,
      0,
      2,
      4,
      2,
      0
    ],
    "fingers": [
      0,
      0,
      1,
      3,
      2,
      0
    ],
    "tip": "Contemporary acoustic pop voicing with a sparkling 9th."
  },
  {
    "root": "A",
    "name": "Asus2",
    "type": "Suspended 2",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      -1,
      0,
      2,
      2,
      0,
      0
    ],
    "fingers": [
      0,
      0,
      2,
      3,
      0,
      0
    ],
    "tip": "Dreamy open sound. Two fingers on fret 2, letting B and e strings ring."
  },
  {
    "root": "A",
    "name": "Asus4",
    "type": "Suspended 4",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      -1,
      0,
      2,
      2,
      3,
      0
    ],
    "fingers": [
      0,
      0,
      1,
      2,
      4,
      0
    ],
    "tip": "Pinky pushes to fret 3 of the B string for instant tension."
  },
  {
    "root": "A",
    "name": "Adim7",
    "type": "Diminished 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      0,
      1,
      2,
      1,
      -1
    ],
    "fingers": [
      0,
      0,
      1,
      3,
      2,
      0
    ],
    "tip": "Dissonant metal diminished chord with open A bass note."
  },
  {
    "root": "A",
    "name": "Aaug",
    "type": "Augmented",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      0,
      3,
      2,
      2,
      1
    ],
    "fingers": [
      0,
      0,
      4,
      2,
      3,
      1
    ],
    "tip": "Augmented 5th creates a sharp chromatic pulling sensation."
  },
  {
    "root": "A",
    "name": "Am(maj7)",
    "type": "Minor Major 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      0,
      2,
      1,
      1,
      0
    ],
    "fingers": [
      0,
      0,
      3,
      1,
      2,
      0
    ],
    "tip": "Tense minor chord with natural G# note."
  },
  {
    "root": "B♭",
    "name": "Bb5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (1st Fret A-Root)",
        "f": [
          -1,
          1,
          3,
          3,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Heavy 1st fret A-string power chord."
      },
      {
        "label": "Pos 2 (6th Fret Low E)",
        "f": [
          6,
          8,
          8,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Massive 6th fret low E power chord."
      }
    ],
    "f": [
      -1,
      1,
      3,
      3,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Used heavily in down-tuned metal and doom riffs."
  },
  {
    "root": "B♭",
    "name": "Bb",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (1st Fret Barre)",
        "f": [
          -1,
          1,
          3,
          3,
          3,
          1
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "A-shape barre chord on fret 1."
      }
    ],
    "f": [
      -1,
      1,
      3,
      3,
      3,
      1
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      1,
      3,
      3,
      -1,
      -1
    ],
    "easyFingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "easyLabel": "Power Bb",
    "tip": "1st fret A-shape barre or 3-string power chord."
  },
  {
    "root": "B♭",
    "name": "Bbm",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "f": [
      -1,
      1,
      3,
      3,
      2,
      1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      3,
      2,
      1
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      2,
      1
    ],
    "easyLabel": "Mini Bbm",
    "tip": "1st fret minor barre chord."
  },
  {
    "root": "B",
    "name": "B5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret A-Root)",
        "f": [
          -1,
          2,
          4,
          4,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Heavy metal classic! Ozzy Osbourne (Crazy Train) & Iron Maiden staple."
      },
      {
        "label": "Pos 2 (7th Fret Low E)",
        "f": [
          7,
          9,
          9,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "7th fret powerhouse for thick low-end crunch."
      }
    ],
    "f": [
      -1,
      2,
      4,
      4,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Lock your wrist and dig into the 2nd fret of the A string."
  },
  {
    "root": "B",
    "name": "B",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret Barre)",
        "f": [
          -1,
          2,
          4,
          4,
          4,
          2
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "Standard 2nd-fret A-shape barre."
      },
      {
        "label": "Pos 2 (7th Fret Barre)",
        "f": [
          7,
          9,
          9,
          8,
          7,
          7
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "E-shape barre at fret 7."
      }
    ],
    "f": [
      -1,
      2,
      4,
      4,
      4,
      2
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      2,
      4,
      4,
      0,
      0
    ],
    "easyFingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "easyLabel": "Open Badd11 (No Barre!)",
    "tip": "Barre tough on fret 2? Play Badd11 with open high B and e strings—super lush and easy!"
  },
  {
    "root": "B",
    "name": "Bm",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret Barre)",
        "f": [
          -1,
          2,
          4,
          4,
          3,
          2
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "Standard 2nd fret 5-string barre."
      },
      {
        "label": "Pos 2 (7th Fret Barre)",
        "f": [
          7,
          9,
          9,
          7,
          7,
          7
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "E-minor shape barre at fret 7."
      }
    ],
    "f": [
      -1,
      2,
      4,
      4,
      3,
      2
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      2,
      1
    ],
    "easyF": [
      -1,
      2,
      0,
      2,
      3,
      0
    ],
    "easyFingers": [
      0,
      1,
      0,
      2,
      3,
      0
    ],
    "easyLabel": "Open Bm7 (No Barre!)",
    "tip": "Instead of wrestling with a 5-string barre, play the open Bm7 shape that sounds richer!"
  },
  {
    "root": "B",
    "name": "B7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      2,
      1,
      2,
      0,
      2
    ],
    "fingers": [
      0,
      2,
      1,
      3,
      0,
      4
    ],
    "tip": "Classic open blues dominant 7th chord. Essential turnaround chord into E."
  },
  {
    "root": "B",
    "name": "Bm11",
    "type": "Minor 11th",
    "cat": "Extended",
    "level": "Easy",
    "f": [
      -1,
      2,
      0,
      2,
      2,
      0
    ],
    "fingers": [
      0,
      1,
      0,
      2,
      3,
      0
    ],
    "tip": "Sweet, acoustic minor 11th with an open D and high e string."
  },
  {
    "root": "B",
    "name": "Bsus4",
    "type": "Suspended 4",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      -1,
      2,
      4,
      4,
      0,
      0
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Acoustic rock suspended chord with open top strings."
  },
  {
    "root": "B",
    "name": "Bdim7",
    "type": "Diminished 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      2,
      3,
      1,
      3,
      -1
    ],
    "fingers": [
      0,
      2,
      3,
      1,
      4,
      0
    ],
    "tip": "Classic neoclassical metal diminished shape."
  },
  {
    "root": "B",
    "name": "Bm7b5",
    "type": "Half-Diminished",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      2,
      3,
      2,
      3,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      2,
      4,
      0
    ],
    "tip": "Locrian mode half-diminished chord."
  },
  {
    "root": "C",
    "name": "C5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (3rd Fret A-Root)",
        "f": [
          -1,
          3,
          5,
          5,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Heavy, punchy 3rd fret power chord. Iron Maiden & Judas Priest favorite."
      },
      {
        "label": "Pos 2 (8th Fret Low E)",
        "f": [
          8,
          10,
          10,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Low, crushing 8th fret power chord."
      }
    ],
    "f": [
      -1,
      3,
      5,
      5,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Root on fret 3 of A string. Mute the low E and high strings with your index."
  },
  {
    "root": "C",
    "name": "C5(add9)",
    "type": "Prog Metal 9th Power",
    "cat": "Power",
    "level": "Medium",
    "f": [
      -1,
      3,
      5,
      7,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      2,
      4,
      0,
      0
    ],
    "tip": "Massive modern metal stretch voicing."
  },
  {
    "root": "C",
    "name": "C",
    "type": "Major",
    "cat": "Major",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open)",
        "f": [
          -1,
          3,
          2,
          0,
          1,
          0
        ],
        "fingers": [
          0,
          3,
          2,
          0,
          1,
          0
        ],
        "tip": "The classic open C major chord. Ring on 3, Middle on 2, Index on 1."
      },
      {
        "label": "Pos 2 (3rd Fret Barre)",
        "f": [
          -1,
          3,
          5,
          5,
          5,
          3
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "A-shape barre chord at fret 3."
      },
      {
        "label": "Pos 3 (8th Fret Barre)",
        "f": [
          8,
          10,
          10,
          9,
          8,
          8
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "E-shape barre chord at fret 8."
      }
    ],
    "f": [
      -1,
      3,
      2,
      0,
      1,
      0
    ],
    "fingers": [
      0,
      3,
      2,
      0,
      1,
      0
    ],
    "tip": "Arch your index finger so the high E string can ring freely."
  },
  {
    "root": "C",
    "name": "Cm",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (3rd Fret Barre)",
        "f": [
          -1,
          3,
          5,
          5,
          4,
          3
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "A-minor shape barre chord at fret 3."
      },
      {
        "label": "Pos 2 (8th Fret Barre)",
        "f": [
          8,
          10,
          10,
          8,
          8,
          8
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "E-minor shape barre chord at fret 8."
      }
    ],
    "f": [
      -1,
      3,
      5,
      5,
      4,
      3
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      5,
      5,
      4,
      3
    ],
    "easyFingers": [
      0,
      0,
      2,
      3,
      4,
      1
    ],
    "easyLabel": "4-String Mini Cm",
    "tip": "Standard 5th-string barre chord, or play the top 4 strings for an easy change!"
  },
  {
    "root": "C",
    "name": "Cadd9",
    "type": "Add 9th",
    "cat": "Extended",
    "level": "Easy",
    "f": [
      -1,
      3,
      2,
      0,
      3,
      3
    ],
    "fingers": [
      0,
      2,
      1,
      0,
      3,
      4
    ],
    "tip": "Beloved pop/rock acoustic voicing that pairs smoothly with G and D."
  },
  {
    "root": "C",
    "name": "Cmaj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      3,
      2,
      0,
      0,
      0
    ],
    "fingers": [
      0,
      3,
      2,
      0,
      0,
      0
    ],
    "tip": "Soothing dream-pop chord. Just open C with your index lifted off."
  },
  {
    "root": "C",
    "name": "C7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      3,
      2,
      3,
      1,
      0
    ],
    "fingers": [
      0,
      3,
      2,
      4,
      1,
      0
    ],
    "tip": "Blues staple with pinky added on the 3rd fret of the G string."
  },
  {
    "root": "C",
    "name": "Cm7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Hard",
    "f": [
      -1,
      3,
      5,
      3,
      4,
      3
    ],
    "fingers": [
      0,
      1,
      3,
      1,
      2,
      1
    ],
    "tip": "Smooth minor 7th barre chord."
  },
  {
    "root": "C",
    "name": "Csus4",
    "type": "Suspended 4",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      -1,
      3,
      3,
      0,
      1,
      1
    ],
    "fingers": [
      0,
      3,
      4,
      0,
      1,
      1
    ],
    "tip": "Suspended chord with F on the 4th string."
  },
  {
    "root": "C",
    "name": "Csus2",
    "type": "Suspended 2",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      -1,
      3,
      0,
      0,
      1,
      0
    ],
    "fingers": [
      0,
      3,
      0,
      0,
      1,
      0
    ],
    "tip": "Open suspended 2nd with ringing open D string."
  },
  {
    "root": "C",
    "name": "Caug",
    "type": "Augmented",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      3,
      2,
      1,
      1,
      -1
    ],
    "fingers": [
      0,
      3,
      2,
      1,
      1,
      0
    ],
    "tip": "Sharp 5th (G#) creates strong harmonic pulling power."
  },
  {
    "root": "C♯",
    "name": "C#5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (4th Fret A-Root)",
        "f": [
          -1,
          4,
          6,
          6,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Heavy grunge & metal favorite. Black Sabbath & Alice in Chains staple."
      },
      {
        "label": "Pos 2 (9th Fret Low E)",
        "f": [
          9,
          11,
          11,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "9th fret low E power chord."
      }
    ],
    "f": [
      -1,
      4,
      6,
      6,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Essential chord in C# / Drop C metal tuning."
  },
  {
    "root": "C♯",
    "name": "C#m",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (4th Fret Barre)",
        "f": [
          -1,
          4,
          6,
          6,
          5,
          4
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "4th fret A-minor shape barre."
      }
    ],
    "f": [
      -1,
      4,
      6,
      6,
      5,
      4
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      6,
      5,
      4
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      2,
      1
    ],
    "easyLabel": "Mini C#m",
    "tip": "4th fret minor barre or compact top-4 voicing."
  },
  {
    "root": "C♯",
    "name": "C#dim7",
    "type": "Diminished 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "f": [
      -1,
      4,
      5,
      3,
      5,
      -1
    ],
    "fingers": [
      0,
      2,
      3,
      1,
      4,
      0
    ],
    "tip": "Tense neoclassical diminished chord resolving to D minor."
  },
  {
    "root": "D",
    "name": "D5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open D-Root)",
        "f": [
          -1,
          -1,
          0,
          2,
          3,
          -1
        ],
        "fingers": [
          0,
          0,
          0,
          1,
          2,
          0
        ],
        "tip": "Crisp open D power chord."
      },
      {
        "label": "Pos 2 (5th Fret A-Root)",
        "f": [
          -1,
          5,
          7,
          7,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "The standard metal 5th-fret D power chord. Chugged in thousands of metal tracks!"
      },
      {
        "label": "Pos 3 (10th Fret Low E)",
        "f": [
          10,
          12,
          12,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Heavy 10th fret low E power chord."
      }
    ],
    "f": [
      -1,
      5,
      7,
      7,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Keep your palm firm near the bridge saddles for tight metal chugs."
  },
  {
    "root": "D",
    "name": "D5(add9)",
    "type": "Prog Metal 9th Power",
    "cat": "Power",
    "level": "Medium",
    "f": [
      -1,
      5,
      7,
      9,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      2,
      4,
      0,
      0
    ],
    "tip": "Massive open-sounding prog metal power chord (Dream Theater / Tool)."
  },
  {
    "root": "D",
    "name": "D",
    "type": "Major",
    "cat": "Major",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open)",
        "f": [
          -1,
          -1,
          0,
          2,
          3,
          2
        ],
        "fingers": [
          0,
          0,
          0,
          1,
          3,
          2
        ],
        "tip": "Triangle shape on the highest 3 strings. Strum from the open D."
      },
      {
        "label": "Pos 2 (5th Fret A-Shape)",
        "f": [
          -1,
          5,
          7,
          7,
          7,
          5
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "A-shape barre at fret 5."
      }
    ],
    "f": [
      -1,
      -1,
      0,
      2,
      3,
      2
    ],
    "fingers": [
      0,
      0,
      0,
      1,
      3,
      2
    ],
    "tip": "Strum top 4 strings only. Mute low E and A with your thumb."
  },
  {
    "root": "D",
    "name": "Dm",
    "type": "Minor",
    "cat": "Minor",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (Open)",
        "f": [
          -1,
          -1,
          0,
          2,
          3,
          1
        ],
        "fingers": [
          0,
          0,
          0,
          2,
          3,
          1
        ],
        "tip": "Mournful open minor chord. Index on fret 1 of high E."
      },
      {
        "label": "Pos 2 (5th Fret Barre)",
        "f": [
          -1,
          5,
          7,
          7,
          6,
          5
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "5th fret minor barre chord."
      }
    ],
    "f": [
      -1,
      -1,
      0,
      2,
      3,
      1
    ],
    "fingers": [
      0,
      0,
      0,
      2,
      3,
      1
    ],
    "tip": "Sad and beautiful acoustic minor voicing."
  },
  {
    "root": "D",
    "name": "D7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      -1,
      0,
      2,
      1,
      2
    ],
    "fingers": [
      0,
      0,
      0,
      2,
      1,
      3
    ],
    "tip": "Inverted triangle open blues chord."
  },
  {
    "root": "D",
    "name": "Dmaj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      -1,
      0,
      2,
      2,
      2
    ],
    "fingers": [
      0,
      0,
      0,
      1,
      1,
      1
    ],
    "tip": "Barre top 3 strings at fret 2 for a lush major 7th."
  },
  {
    "root": "D",
    "name": "Dm7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Easy",
    "f": [
      -1,
      -1,
      0,
      2,
      1,
      1
    ],
    "fingers": [
      0,
      0,
      0,
      2,
      1,
      1
    ],
    "tip": "Index barres strings 1 & 2 at fret 1."
  },
  {
    "root": "D",
    "name": "Dsus2",
    "type": "Suspended 2",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      -1,
      -1,
      0,
      2,
      3,
      0
    ],
    "fingers": [
      0,
      0,
      0,
      1,
      2,
      0
    ],
    "tip": "Lift off finger 2 on the high E string for a sparkling open sound."
  },
  {
    "root": "D",
    "name": "Dsus4",
    "type": "Suspended 4",
    "cat": "Suspended",
    "level": "Easy",
    "f": [
      -1,
      -1,
      0,
      2,
      3,
      3
    ],
    "fingers": [
      0,
      0,
      0,
      1,
      2,
      4
    ],
    "tip": "Pinky added on fret 3 of high E creates immediate tension."
  },
  {
    "root": "D",
    "name": "Dm11",
    "type": "Minor 11th",
    "cat": "Extended",
    "level": "Easy",
    "f": [
      -1,
      -1,
      0,
      0,
      1,
      1
    ],
    "fingers": [
      0,
      0,
      0,
      0,
      1,
      1
    ],
    "tip": "Dreamy neo-soul and math-rock open minor 11th."
  },
  {
    "root": "D♯",
    "name": "Eb5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (6th Fret A-Root)",
        "f": [
          -1,
          6,
          8,
          8,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Heavy Eb power chord. The tuning of Slayer, Hendrix, and Stevie Ray Vaughan!"
      },
      {
        "label": "Pos 2 (11th Fret Low E)",
        "f": [
          11,
          13,
          13,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "11th fret powerhouse."
      }
    ],
    "f": [
      -1,
      6,
      8,
      8,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Essential chord in Eb standard / half-step down tuning."
  },
  {
    "root": "D♯",
    "name": "Eb",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "f": [
      -1,
      6,
      8,
      8,
      8,
      6
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      8,
      8,
      8,
      6
    ],
    "easyFingers": [
      0,
      0,
      2,
      3,
      4,
      1
    ],
    "easyLabel": "Mini Eb",
    "tip": "6th fret A-shape barre chord."
  },
  {
    "root": "D♯",
    "name": "Ebm",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "f": [
      -1,
      6,
      8,
      8,
      7,
      6
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      8,
      8,
      7,
      6
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      2,
      1
    ],
    "easyLabel": "Mini Ebm",
    "tip": "6th fret minor barre chord."
  },
  {
    "root": "C♯",
    "name": "C#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (4th Fret A-Shape)",
        "f": [
          -1,
          4,
          6,
          6,
          6,
          4
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "Barre fret 4 with index finger and barre strings 4, 3, 2 at fret 6 with ring or pinky."
      },
      {
        "label": "Pos 2 (9th Fret E-Shape)",
        "f": [
          9,
          11,
          11,
          10,
          9,
          9
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "Classic 9th fret E-shape major barre chord. Huge, punchy sound."
      }
    ],
    "f": [
      -1,
      4,
      6,
      6,
      6,
      4
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      6,
      6,
      4
    ],
    "easyFingers": [
      0,
      0,
      2,
      3,
      4,
      1
    ],
    "easyLabel": "Mini C# Major",
    "tip": "Standard 4th fret major barre or easy 4-string top voicing."
  },
  {
    "root": "C♯",
    "name": "C#7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret A7-Shape)",
        "f": [
          -1,
          4,
          6,
          4,
          6,
          4
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          4,
          1
        ],
        "tip": "Classic bluesy 7th chord based on the A7 shape at fret 4."
      },
      {
        "label": "Pos 2 (9th Fret E7-Shape)",
        "f": [
          9,
          11,
          9,
          10,
          9,
          9
        ],
        "fingers": [
          1,
          3,
          1,
          2,
          1,
          1
        ],
        "tip": "9th fret low E dominant 7th chord. Great for funk and blues."
      }
    ],
    "f": [
      -1,
      4,
      6,
      4,
      6,
      4
    ],
    "fingers": [
      0,
      1,
      3,
      1,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      4,
      2,
      4
    ],
    "easyFingers": [
      0,
      0,
      2,
      3,
      1,
      4
    ],
    "easyLabel": "Open Feel C#7",
    "tip": "Blues dominant 7th resolving smoothly to F# major or F#m."
  },
  {
    "root": "C♯",
    "name": "C#maj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret Amaj7 Shape)",
        "f": [
          -1,
          4,
          6,
          5,
          6,
          4
        ],
        "fingers": [
          0,
          1,
          3,
          2,
          4,
          1
        ],
        "tip": "Lush, dreamy major 7th chord. Essential for neo-soul, jazz, and indie pop."
      },
      {
        "label": "Pos 2 (9th Fret)",
        "f": [
          9,
          -1,
          10,
          10,
          9,
          -1
        ],
        "fingers": [
          1,
          0,
          3,
          4,
          2,
          0
        ],
        "tip": "Jazz four-note shell voicing with root on low E."
      }
    ],
    "f": [
      -1,
      4,
      6,
      5,
      6,
      4
    ],
    "fingers": [
      0,
      1,
      3,
      2,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      5,
      6,
      4
    ],
    "easyFingers": [
      0,
      0,
      2,
      1,
      3,
      1
    ],
    "easyLabel": "Mini C#maj7",
    "tip": "Warm, jazzy and sparkling. Curve fingers to keep the high e ringing."
  },
  {
    "root": "C♯",
    "name": "C#m7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret Am7 Shape)",
        "f": [
          -1,
          4,
          6,
          4,
          5,
          4
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          2,
          1
        ],
        "tip": "Relaxed, mellow minor 7th. Ubiquitous in R&B, lo-fi, and acoustic ballads."
      },
      {
        "label": "Pos 2 (9th Fret Em7 Shape)",
        "f": [
          9,
          11,
          9,
          9,
          9,
          9
        ],
        "fingers": [
          1,
          3,
          1,
          1,
          1,
          1
        ],
        "tip": "9th fret full barre minor 7th. Great for funky rhythmic chops."
      }
    ],
    "f": [
      -1,
      4,
      6,
      4,
      5,
      4
    ],
    "fingers": [
      0,
      1,
      3,
      1,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      4,
      5,
      4
    ],
    "easyFingers": [
      0,
      0,
      3,
      1,
      2,
      1
    ],
    "easyLabel": "Easy 4-String C#m7",
    "tip": "Effortless to play and sounds modern and soulful."
  },
  {
    "root": "C♯",
    "name": "C#sus4",
    "type": "Suspended 4th",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret)",
        "f": [
          -1,
          4,
          6,
          6,
          7,
          4
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "Tense, unresolved suspended chord waiting to resolve to C# major."
      }
    ],
    "f": [
      -1,
      4,
      6,
      6,
      7,
      4
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      6,
      7,
      4
    ],
    "easyFingers": [
      0,
      0,
      2,
      3,
      4,
      1
    ],
    "easyLabel": "Mini C#sus4",
    "tip": "Pinky holds fret 7 on the B string. Resolves into C# major or C#m."
  },
  {
    "root": "C♯",
    "name": "C#sus2",
    "type": "Suspended 2nd",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret)",
        "f": [
          -1,
          4,
          6,
          6,
          4,
          4
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          1,
          1
        ],
        "tip": "Open, modern ambient sound. Commonly used in post-rock and modern worship."
      }
    ],
    "f": [
      -1,
      4,
      6,
      6,
      4,
      4
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      6,
      4,
      4
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      1,
      1
    ],
    "easyLabel": "Mini C#sus2",
    "tip": "Barre strings 1 and 2 at fret 4 for that signature shimmer."
  },
  {
    "root": "C♯",
    "name": "C#add9",
    "type": "Add 9",
    "cat": "Extended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret)",
        "f": [
          -1,
          4,
          6,
          6,
          4,
          4
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          1,
          1
        ],
        "tip": "Glistening acoustic voicing with the added 9th (D#)."
      },
      {
        "label": "Pos 2 (Open Voicing)",
        "f": [
          -1,
          4,
          3,
          1,
          4,
          1
        ],
        "fingers": [
          0,
          3,
          2,
          1,
          4,
          1
        ],
        "tip": "Sparkling wide-stretch add9 voicing."
      }
    ],
    "f": [
      -1,
      4,
      6,
      6,
      4,
      4
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      6,
      4,
      4
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      1,
      1
    ],
    "easyLabel": "Mini C#add9",
    "tip": "Sweet, reflective tone popular in modern fingerstyle guitar."
  },
  {
    "root": "C♯",
    "name": "C#m9",
    "type": "Minor 9th",
    "cat": "Extended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (Neo-Soul)",
        "f": [
          -1,
          4,
          2,
          4,
          4,
          -1
        ],
        "fingers": [
          0,
          2,
          1,
          3,
          4,
          0
        ],
        "tip": "The quintessential modern neo-soul & R&B chord shape."
      }
    ],
    "f": [
      -1,
      4,
      2,
      4,
      4,
      -1
    ],
    "fingers": [
      0,
      2,
      1,
      3,
      4,
      0
    ],
    "easyF": [
      -1,
      -1,
      2,
      4,
      4,
      -1
    ],
    "easyFingers": [
      0,
      0,
      1,
      2,
      3,
      0
    ],
    "easyLabel": "Top-3 C#m9",
    "tip": "Mute the low E and high e strings with the sides of your fingers."
  },
  {
    "root": "C♯",
    "name": "C#m11",
    "type": "Minor 11th",
    "cat": "Extended",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (One Finger Barre)",
        "f": [
          -1,
          4,
          4,
          4,
          4,
          4
        ],
        "fingers": [
          0,
          1,
          1,
          1,
          1,
          1
        ],
        "tip": "Flat index finger across strings 5 to 1 at fret 4."
      }
    ],
    "f": [
      -1,
      4,
      4,
      4,
      4,
      4
    ],
    "fingers": [
      0,
      1,
      1,
      1,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      4,
      4,
      4
    ],
    "easyFingers": [
      0,
      0,
      1,
      1,
      1,
      1
    ],
    "easyLabel": "Mini C#m11",
    "tip": "Ethereal, open sound with one simple flat finger barre."
  },
  {
    "root": "D♯",
    "name": "D#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (6th Fret A-Shape)",
        "f": [
          -1,
          6,
          8,
          8,
          8,
          6
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "Barre fret 6 with index finger and strings 4, 3, 2 at fret 8."
      },
      {
        "label": "Pos 2 (11th Fret Low E)",
        "f": [
          11,
          13,
          13,
          12,
          11,
          11
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "11th fret E-shape barre chord. Punchy and bright."
      }
    ],
    "f": [
      -1,
      6,
      8,
      8,
      8,
      6
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      5,
      3,
      4,
      3
    ],
    "easyFingers": [
      0,
      0,
      3,
      1,
      2,
      1
    ],
    "easyLabel": "Easy Mini D# / Eb",
    "tip": "Also known as Eb Major. Essential in Horn keys, Pop, and Hendrix tuning."
  },
  {
    "root": "D♯",
    "name": "D#m",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (6th Fret Am Shape)",
        "f": [
          -1,
          6,
          8,
          8,
          7,
          6
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "Am shape barre at fret 6. Sad, deep minor harmony."
      },
      {
        "label": "Pos 2 (11th Fret Em Shape)",
        "f": [
          11,
          13,
          13,
          11,
          11,
          11
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "11th fret low E minor barre chord."
      }
    ],
    "f": [
      -1,
      6,
      8,
      8,
      7,
      6
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      3,
      4,
      2
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      4,
      1
    ],
    "easyLabel": "Compact D#m / Ebm",
    "tip": "Also known as Ebm. The relative minor of F# major."
  },
  {
    "root": "D♯",
    "name": "D#5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (6th Fret A-Root)",
        "f": [
          -1,
          6,
          8,
          8,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "Heavy rock & metal staple on the 6th fret."
      },
      {
        "label": "Pos 2 (11th Fret Low E)",
        "f": [
          11,
          13,
          13,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "Crushing 11th fret low E power chord."
      }
    ],
    "f": [
      -1,
      6,
      8,
      8,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Also known as Eb5. Standard in Green Day, Weezer, and Guns N' Roses."
  },
  {
    "root": "D♯",
    "name": "D#7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (6th Fret A7 Shape)",
        "f": [
          -1,
          6,
          8,
          6,
          8,
          6
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          4,
          1
        ],
        "tip": "6th fret dominant 7th barre. Bluesy and rich."
      }
    ],
    "f": [
      -1,
      6,
      8,
      6,
      8,
      6
    ],
    "fingers": [
      0,
      1,
      3,
      1,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      1,
      3,
      2,
      3
    ],
    "easyFingers": [
      0,
      0,
      1,
      3,
      2,
      4
    ],
    "easyLabel": "Low D#7 / Eb7",
    "tip": "Also known as Eb7. Resolves strongly into G# or Ab major."
  },
  {
    "root": "D♯",
    "name": "D#maj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (6th Fret Amaj7 Shape)",
        "f": [
          -1,
          6,
          8,
          7,
          8,
          6
        ],
        "fingers": [
          0,
          1,
          3,
          2,
          4,
          1
        ],
        "tip": "Dreamy, sophisticated jazz & soul major 7th."
      }
    ],
    "f": [
      -1,
      6,
      8,
      7,
      8,
      6
    ],
    "fingers": [
      0,
      1,
      3,
      2,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      1,
      3,
      3,
      3
    ],
    "easyFingers": [
      0,
      0,
      1,
      3,
      3,
      3
    ],
    "easyLabel": "Low D#maj7 / Ebmaj7",
    "tip": "Also known as Ebmaj7. Velvety, lush jazz voicing."
  },
  {
    "root": "D♯",
    "name": "D#m7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (6th Fret Am7 Shape)",
        "f": [
          -1,
          6,
          8,
          6,
          7,
          6
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          2,
          1
        ],
        "tip": "Silky, mellow minor 7th. Ubiquitous in R&B and lo-fi."
      }
    ],
    "f": [
      -1,
      6,
      8,
      6,
      7,
      6
    ],
    "fingers": [
      0,
      1,
      3,
      1,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      3,
      4,
      2
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      4,
      1
    ],
    "easyLabel": "Mini D#m7",
    "tip": "Also known as Ebm7. Smooth, modern soul feel."
  },
  {
    "root": "D♯",
    "name": "D#sus4",
    "type": "Suspended 4th",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (6th Fret)",
        "f": [
          -1,
          6,
          8,
          8,
          9,
          6
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "Suspended tension resolving to D# / Eb major."
      }
    ],
    "f": [
      -1,
      6,
      8,
      8,
      9,
      6
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      8,
      8,
      9,
      6
    ],
    "easyFingers": [
      0,
      0,
      2,
      3,
      4,
      1
    ],
    "easyLabel": "Mini D#sus4",
    "tip": "Tense anthemic chord before resolving."
  },
  {
    "root": "D♯",
    "name": "D#sus2",
    "type": "Suspended 2nd",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (6th Fret)",
        "f": [
          -1,
          6,
          8,
          8,
          6,
          6
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          1,
          1
        ],
        "tip": "Spacious, open modern voicing."
      }
    ],
    "f": [
      -1,
      6,
      8,
      8,
      6,
      6
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      8,
      8,
      6,
      6
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      1,
      1
    ],
    "easyLabel": "Mini D#sus2",
    "tip": "Also known as Ebsus2. Open, atmospheric sound."
  },
  {
    "root": "D♯",
    "name": "D#dim7",
    "type": "Diminished 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (1st Fret)",
        "f": [
          -1,
          -1,
          1,
          2,
          1,
          2
        ],
        "fingers": [
          0,
          0,
          1,
          3,
          2,
          4
        ],
        "tip": "Compact diminished grip resolving up to E minor."
      }
    ],
    "f": [
      -1,
      -1,
      1,
      2,
      1,
      2
    ],
    "fingers": [
      0,
      0,
      1,
      3,
      2,
      4
    ],
    "tip": "Classic passing chord connecting D and Em."
  },
  {
    "root": "F♯",
    "name": "F#7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret E7 Shape)",
        "f": [
          2,
          4,
          2,
          3,
          2,
          2
        ],
        "fingers": [
          1,
          3,
          1,
          2,
          1,
          1
        ],
        "tip": "Standard 2nd fret dominant 7th barre. Gritty blues and funk tone."
      },
      {
        "label": "Pos 2 (9th Fret A7 Shape)",
        "f": [
          -1,
          9,
          11,
          9,
          11,
          9
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          4,
          1
        ],
        "tip": "9th fret A-shape dominant 7th chord."
      }
    ],
    "f": [
      2,
      4,
      2,
      3,
      2,
      2
    ],
    "fingers": [
      1,
      3,
      1,
      2,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      3,
      2,
      0
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      1,
      0
    ],
    "easyLabel": "Open Top F#7",
    "tip": "Crucial blues turnaround chord resolving into B major or Bm."
  },
  {
    "root": "F♯",
    "name": "F#maj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret)",
        "f": [
          2,
          4,
          3,
          3,
          2,
          2
        ],
        "fingers": [
          1,
          4,
          2,
          3,
          1,
          1
        ],
        "tip": "Sumptuous, warm major 7th barre on the 2nd fret."
      },
      {
        "label": "Pos 2 (9th Fret Amaj7 Shape)",
        "f": [
          -1,
          9,
          11,
          10,
          11,
          9
        ],
        "fingers": [
          0,
          1,
          3,
          2,
          4,
          1
        ],
        "tip": "9th fret A-shape major 7th chord."
      }
    ],
    "f": [
      2,
      4,
      3,
      3,
      2,
      2
    ],
    "fingers": [
      1,
      4,
      2,
      3,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      3,
      2,
      1
    ],
    "easyFingers": [
      0,
      0,
      4,
      3,
      2,
      1
    ],
    "easyLabel": "Mini F#maj7",
    "tip": "Lush, jazzy major 7th chord. Perfect for bossa nova and neo-soul."
  },
  {
    "root": "F♯",
    "name": "F#m7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret Em7 Shape)",
        "f": [
          2,
          4,
          2,
          2,
          2,
          2
        ],
        "fingers": [
          1,
          3,
          1,
          1,
          1,
          1
        ],
        "tip": "Easy full barre chord with only two fingers needed."
      },
      {
        "label": "Pos 2 (9th Fret Am7 Shape)",
        "f": [
          -1,
          9,
          11,
          9,
          10,
          9
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          2,
          1
        ],
        "tip": "9th fret A-string minor 7th voicing."
      }
    ],
    "f": [
      2,
      4,
      2,
      2,
      2,
      2
    ],
    "fingers": [
      1,
      3,
      1,
      1,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      2,
      2,
      2,
      2
    ],
    "easyFingers": [
      0,
      0,
      1,
      1,
      1,
      1
    ],
    "easyLabel": "One-Finger Mini F#m7",
    "tip": "Lay index finger flat across strings 4-1 at fret 2. Super easy!"
  },
  {
    "root": "F♯",
    "name": "F#sus4",
    "type": "Suspended 4th",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret)",
        "f": [
          2,
          4,
          4,
          4,
          2,
          2
        ],
        "fingers": [
          1,
          2,
          3,
          4,
          1,
          1
        ],
        "tip": "Powerful 2nd fret suspended chord resolving to F# major."
      }
    ],
    "f": [
      2,
      4,
      4,
      4,
      2,
      2
    ],
    "fingers": [
      1,
      2,
      3,
      4,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      4,
      2,
      2
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      1,
      1
    ],
    "easyLabel": "Mini F#sus4",
    "tip": "Resolves dramatically into F# major or F#m."
  },
  {
    "root": "F♯",
    "name": "F#sus2",
    "type": "Suspended 2nd",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (Open Shimmer)",
        "f": [
          -1,
          -1,
          4,
          6,
          7,
          4
        ],
        "fingers": [
          0,
          0,
          1,
          2,
          4,
          1
        ],
        "tip": "Shimmering, open voicing favored by progressive rock guitarists."
      }
    ],
    "f": [
      -1,
      -1,
      4,
      6,
      7,
      4
    ],
    "fingers": [
      0,
      0,
      1,
      2,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      6,
      7,
      4
    ],
    "easyFingers": [
      0,
      0,
      1,
      2,
      4,
      1
    ],
    "easyLabel": "Modern F#sus2",
    "tip": "Airy, cinematic suspension."
  },
  {
    "root": "F♯",
    "name": "F#add9",
    "type": "Add 9",
    "cat": "Extended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret)",
        "f": [
          2,
          4,
          4,
          3,
          2,
          4
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          4
        ],
        "tip": "F# major barre with the pinky reaching for the high G# at fret 4."
      }
    ],
    "f": [
      2,
      4,
      4,
      3,
      2,
      4
    ],
    "fingers": [
      1,
      3,
      4,
      2,
      1,
      4
    ],
    "easyF": [
      -1,
      -1,
      4,
      3,
      2,
      4
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      1,
      4
    ],
    "easyLabel": "Mini F#add9",
    "tip": "Sparkling, rich high extension."
  },
  {
    "root": "F♯",
    "name": "F#dim7",
    "type": "Diminished 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret)",
        "f": [
          -1,
          -1,
          4,
          5,
          4,
          5
        ],
        "fingers": [
          0,
          0,
          1,
          3,
          2,
          4
        ],
        "tip": "Classic symmetrical diminished 7th shape."
      }
    ],
    "f": [
      -1,
      -1,
      4,
      5,
      4,
      5
    ],
    "fingers": [
      0,
      0,
      1,
      3,
      2,
      4
    ],
    "tip": "High tension passing chord resolving straight to G major or Gm."
  },
  {
    "root": "F♯",
    "name": "F#9",
    "type": "Dominant 9th",
    "cat": "Extended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (9th Fret Funk Shape)",
        "f": [
          -1,
          9,
          8,
          9,
          9,
          9
        ],
        "fingers": [
          0,
          2,
          1,
          3,
          3,
          3
        ],
        "tip": "The famous James Brown / funk 9th chord on the 9th fret."
      }
    ],
    "f": [
      -1,
      9,
      8,
      9,
      9,
      9
    ],
    "fingers": [
      0,
      2,
      1,
      3,
      3,
      3
    ],
    "easyF": [
      -1,
      -1,
      8,
      9,
      9,
      9
    ],
    "easyFingers": [
      0,
      0,
      1,
      2,
      2,
      2
    ],
    "easyLabel": "Mini F#9 Funk",
    "tip": "Essential funk rhythm chord! Chop with short staccato strums."
  },
  {
    "root": "G♯",
    "name": "G#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (4th Fret E-Shape Barre)",
        "f": [
          4,
          6,
          6,
          5,
          4,
          4
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "Full 4th fret E-shape major barre chord. Strong, resonant, and punchy."
      },
      {
        "label": "Pos 2 (11th Fret A-Shape Barre)",
        "f": [
          -1,
          11,
          13,
          13,
          13,
          11
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "11th fret high register major barre chord."
      }
    ],
    "f": [
      4,
      6,
      6,
      5,
      4,
      4
    ],
    "fingers": [
      1,
      3,
      4,
      2,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      5,
      4,
      4
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      1,
      1
    ],
    "easyLabel": "Mini G# / Ab Major",
    "tip": "Also known as Ab Major. Great power and resonance on fret 4."
  },
  {
    "root": "G♯",
    "name": "G#7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret E7 Shape)",
        "f": [
          4,
          6,
          4,
          5,
          4,
          4
        ],
        "fingers": [
          1,
          3,
          1,
          2,
          1,
          1
        ],
        "tip": "Dominant 7th barre on fret 4. Gritty blues and jazz sound."
      },
      {
        "label": "Pos 2 (11th Fret A7 Shape)",
        "f": [
          -1,
          11,
          13,
          11,
          13,
          11
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          4,
          1
        ],
        "tip": "11th fret A-shape dominant 7th."
      }
    ],
    "f": [
      4,
      6,
      4,
      5,
      4,
      4
    ],
    "fingers": [
      1,
      3,
      1,
      2,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      5,
      4,
      4
    ],
    "easyFingers": [
      0,
      0,
      1,
      2,
      1,
      1
    ],
    "easyLabel": "Mini G#7",
    "tip": "Resolves with strong dominant pull to C# major or C#m."
  },
  {
    "root": "G♯",
    "name": "G#maj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret Jazz Voicing)",
        "f": [
          4,
          -1,
          5,
          5,
          4,
          -1
        ],
        "fingers": [
          1,
          0,
          3,
          4,
          2,
          0
        ],
        "tip": "Classic jazz 4-note major 7th shell voicing."
      },
      {
        "label": "Pos 2 (11th Fret Amaj7 Shape)",
        "f": [
          -1,
          11,
          13,
          12,
          13,
          11
        ],
        "fingers": [
          0,
          1,
          3,
          2,
          4,
          1
        ],
        "tip": "11th fret silky smooth major 7th."
      }
    ],
    "f": [
      4,
      -1,
      5,
      5,
      4,
      -1
    ],
    "fingers": [
      1,
      0,
      3,
      4,
      2,
      0
    ],
    "easyF": [
      -1,
      -1,
      6,
      5,
      4,
      3
    ],
    "easyFingers": [
      0,
      0,
      4,
      3,
      2,
      1
    ],
    "easyLabel": "Mini G#maj7 / Abmaj7",
    "tip": "Lush, dreamy harmony. Mute the A and high e strings with your fingers."
  },
  {
    "root": "G♯",
    "name": "G#m7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret Em7 Shape)",
        "f": [
          4,
          6,
          4,
          4,
          4,
          4
        ],
        "fingers": [
          1,
          3,
          1,
          1,
          1,
          1
        ],
        "tip": "4th fret minor 7th barre. Requires only two active fingers."
      },
      {
        "label": "Pos 2 (11th Fret Am7 Shape)",
        "f": [
          -1,
          11,
          13,
          11,
          12,
          11
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          2,
          1
        ],
        "tip": "11th fret A-string minor 7th voicing."
      }
    ],
    "f": [
      4,
      6,
      4,
      4,
      4,
      4
    ],
    "fingers": [
      1,
      3,
      1,
      1,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      4,
      4,
      4,
      4
    ],
    "easyFingers": [
      0,
      0,
      1,
      1,
      1,
      1
    ],
    "easyLabel": "One-Finger Mini G#m7",
    "tip": "Barre strings 4-1 at fret 4 with one flat finger! Incredibly easy and smooth."
  },
  {
    "root": "G♯",
    "name": "G#sus4",
    "type": "Suspended 4th",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret)",
        "f": [
          4,
          6,
          6,
          6,
          4,
          4
        ],
        "fingers": [
          1,
          2,
          3,
          4,
          1,
          1
        ],
        "tip": "Big 4th fret suspended chord with immense resonance."
      }
    ],
    "f": [
      4,
      6,
      6,
      6,
      4,
      4
    ],
    "fingers": [
      1,
      2,
      3,
      4,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      6,
      4,
      4
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      1,
      1
    ],
    "easyLabel": "Mini G#sus4",
    "tip": "High anticipation chord resolving straight into G# major or G#m."
  },
  {
    "root": "G♯",
    "name": "G#sus2",
    "type": "Suspended 2nd",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (6th Fret Modern)",
        "f": [
          -1,
          -1,
          6,
          8,
          9,
          6
        ],
        "fingers": [
          0,
          0,
          1,
          2,
          4,
          1
        ],
        "tip": "Modern ambient voicing with open interval sparkle."
      }
    ],
    "f": [
      -1,
      -1,
      6,
      8,
      9,
      6
    ],
    "fingers": [
      0,
      0,
      1,
      2,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      6,
      8,
      9,
      6
    ],
    "easyFingers": [
      0,
      0,
      1,
      2,
      4,
      1
    ],
    "easyLabel": "Modern G#sus2",
    "tip": "Glistening suspended 2nd for modern atmospheric progressions."
  },
  {
    "root": "G♯",
    "name": "G#add9",
    "type": "Add 9",
    "cat": "Extended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (4th Fret)",
        "f": [
          4,
          6,
          6,
          5,
          4,
          6
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          4
        ],
        "tip": "4th fret barre with the high pinky grabbing the added 9th (A#)."
      }
    ],
    "f": [
      4,
      6,
      6,
      5,
      4,
      6
    ],
    "fingers": [
      1,
      3,
      4,
      2,
      1,
      4
    ],
    "easyF": [
      -1,
      -1,
      6,
      5,
      4,
      6
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      1,
      4
    ],
    "easyLabel": "Mini G#add9",
    "tip": "Sparkling pop and acoustic ballad favorite."
  },
  {
    "root": "G♯",
    "name": "G#m9",
    "type": "Minor 9th",
    "cat": "Extended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (Neo-Soul)",
        "f": [
          4,
          6,
          4,
          4,
          4,
          6
        ],
        "fingers": [
          1,
          3,
          1,
          1,
          1,
          4
        ],
        "tip": "4th fret minor 9th voicing with high pinky extension."
      }
    ],
    "f": [
      4,
      6,
      4,
      4,
      4,
      6
    ],
    "fingers": [
      1,
      3,
      1,
      1,
      1,
      4
    ],
    "easyF": [
      -1,
      -1,
      4,
      4,
      4,
      6
    ],
    "easyFingers": [
      0,
      0,
      1,
      1,
      1,
      4
    ],
    "easyLabel": "Mini G#m9",
    "tip": "Deep, expressive neo-soul minor 9th."
  },
  {
    "root": "A♯",
    "name": "A#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (1st Fret A-Shape)",
        "f": [
          -1,
          1,
          3,
          3,
          3,
          1
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "1st fret A-shape barre chord. Also known as Bb major."
      },
      {
        "label": "Pos 2 (6th Fret E-Shape)",
        "f": [
          6,
          8,
          8,
          7,
          6,
          6
        ],
        "fingers": [
          1,
          3,
          4,
          2,
          1,
          1
        ],
        "tip": "6th fret low E major barre chord. Huge rock resonance."
      }
    ],
    "f": [
      -1,
      1,
      3,
      3,
      3,
      1
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      3,
      3,
      1
    ],
    "easyFingers": [
      0,
      0,
      2,
      3,
      4,
      1
    ],
    "easyLabel": "Mini A# / Bb Major",
    "tip": "Also known as Bb Major. Extremely common in pop, rock, and jazz."
  },
  {
    "root": "A♯",
    "name": "A#m",
    "type": "Minor",
    "cat": "Minor",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (1st Fret Am-Shape)",
        "f": [
          -1,
          1,
          3,
          3,
          2,
          1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          2,
          1
        ],
        "tip": "1st fret minor barre chord. Also known as Bbm."
      },
      {
        "label": "Pos 2 (6th Fret Em-Shape)",
        "f": [
          6,
          8,
          8,
          6,
          6,
          6
        ],
        "fingers": [
          1,
          3,
          4,
          1,
          1,
          1
        ],
        "tip": "6th fret low E minor barre chord."
      }
    ],
    "f": [
      -1,
      1,
      3,
      3,
      2,
      1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      3,
      2,
      1
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      2,
      1
    ],
    "easyLabel": "Mini A#m / Bbm",
    "tip": "Also known as Bbm. Deep, melancholic minor tone."
  },
  {
    "root": "A♯",
    "name": "A#5",
    "type": "Power Chord",
    "cat": "Power",
    "level": "Easy",
    "positions": [
      {
        "label": "Pos 1 (1st Fret A-Root)",
        "f": [
          -1,
          1,
          3,
          3,
          -1,
          -1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          0,
          0
        ],
        "tip": "1st fret A-string power chord. Tight, heavy sound."
      },
      {
        "label": "Pos 2 (6th Fret Low E)",
        "f": [
          6,
          8,
          8,
          -1,
          -1,
          -1
        ],
        "fingers": [
          1,
          3,
          4,
          0,
          0,
          0
        ],
        "tip": "6th fret low E power chord. Massive low-end crunch."
      }
    ],
    "f": [
      -1,
      1,
      3,
      3,
      -1,
      -1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      0,
      0
    ],
    "tip": "Also known as Bb5. Used in punk rock, grunge, and metal."
  },
  {
    "root": "A♯",
    "name": "A#7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (1st Fret A7 Shape)",
        "f": [
          -1,
          1,
          3,
          1,
          3,
          1
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          4,
          1
        ],
        "tip": "1st fret dominant 7th barre. Also known as Bb7."
      },
      {
        "label": "Pos 2 (6th Fret E7 Shape)",
        "f": [
          6,
          8,
          6,
          7,
          6,
          6
        ],
        "fingers": [
          1,
          3,
          1,
          2,
          1,
          1
        ],
        "tip": "6th fret dominant 7th chord. Classic blues & jazz."
      }
    ],
    "f": [
      -1,
      1,
      3,
      1,
      3,
      1
    ],
    "fingers": [
      0,
      1,
      3,
      1,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      1,
      3,
      1
    ],
    "easyFingers": [
      0,
      0,
      3,
      1,
      4,
      1
    ],
    "easyLabel": "Mini A#7 / Bb7",
    "tip": "Also known as Bb7. Primary blues chord in the key of Eb."
  },
  {
    "root": "A♯",
    "name": "A#maj7",
    "type": "Major 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (1st Fret Amaj7 Shape)",
        "f": [
          -1,
          1,
          3,
          2,
          3,
          1
        ],
        "fingers": [
          0,
          1,
          3,
          2,
          4,
          1
        ],
        "tip": "1st fret major 7th chord. Also known as Bbmaj7."
      },
      {
        "label": "Pos 2 (6th Fret)",
        "f": [
          6,
          -1,
          7,
          7,
          6,
          -1
        ],
        "fingers": [
          1,
          0,
          3,
          4,
          2,
          0
        ],
        "tip": "Jazz 4-note shell voicing on fret 6."
      }
    ],
    "f": [
      -1,
      1,
      3,
      2,
      3,
      1
    ],
    "fingers": [
      0,
      1,
      3,
      2,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      2,
      3,
      1
    ],
    "easyFingers": [
      0,
      0,
      3,
      2,
      4,
      1
    ],
    "easyLabel": "Mini A#maj7 / Bbmaj7",
    "tip": "Also known as Bbmaj7. Dreamy, lush, and nostalgic."
  },
  {
    "root": "A♯",
    "name": "A#m7",
    "type": "Minor 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (1st Fret Am7 Shape)",
        "f": [
          -1,
          1,
          3,
          1,
          2,
          1
        ],
        "fingers": [
          0,
          1,
          3,
          1,
          2,
          1
        ],
        "tip": "1st fret minor 7th chord. Also known as Bbm7."
      },
      {
        "label": "Pos 2 (6th Fret Em7 Shape)",
        "f": [
          6,
          8,
          6,
          6,
          6,
          6
        ],
        "fingers": [
          1,
          3,
          1,
          1,
          1,
          1
        ],
        "tip": "6th fret minor 7th barre. Two fingers only."
      }
    ],
    "f": [
      -1,
      1,
      3,
      1,
      2,
      1
    ],
    "fingers": [
      0,
      1,
      3,
      1,
      2,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      1,
      2,
      1
    ],
    "easyFingers": [
      0,
      0,
      3,
      1,
      2,
      1
    ],
    "easyLabel": "Mini A#m7 / Bbm7",
    "tip": "Also known as Bbm7. Classic smooth neo-soul and R&B chord."
  },
  {
    "root": "A♯",
    "name": "A#sus4",
    "type": "Suspended 4th",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (1st Fret)",
        "f": [
          -1,
          1,
          3,
          3,
          4,
          1
        ],
        "fingers": [
          0,
          1,
          2,
          3,
          4,
          1
        ],
        "tip": "Suspended chord on fret 1 resolving to A# / Bb major."
      }
    ],
    "f": [
      -1,
      1,
      3,
      3,
      4,
      1
    ],
    "fingers": [
      0,
      1,
      2,
      3,
      4,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      3,
      4,
      1
    ],
    "easyFingers": [
      0,
      0,
      2,
      3,
      4,
      1
    ],
    "easyLabel": "Mini A#sus4 / Bbsus4",
    "tip": "Also known as Bbsus4. Big, anthemic pop tension."
  },
  {
    "root": "A♯",
    "name": "A#sus2",
    "type": "Suspended 2nd",
    "cat": "Suspended",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (1st Fret)",
        "f": [
          -1,
          1,
          3,
          3,
          1,
          1
        ],
        "fingers": [
          0,
          1,
          3,
          4,
          1,
          1
        ],
        "tip": "Open, ringing suspension on the 1st fret."
      }
    ],
    "f": [
      -1,
      1,
      3,
      3,
      1,
      1
    ],
    "fingers": [
      0,
      1,
      3,
      4,
      1,
      1
    ],
    "easyF": [
      -1,
      -1,
      3,
      3,
      1,
      1
    ],
    "easyFingers": [
      0,
      0,
      3,
      4,
      1,
      1
    ],
    "easyLabel": "Mini A#sus2 / Bbsus2",
    "tip": "Also known as Bbsus2. Atmospheric and glistening."
  },
  {
    "root": "A♯",
    "name": "A#dim7",
    "type": "Diminished 7th",
    "cat": "Dim / Aug",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (1st Fret)",
        "f": [
          -1,
          1,
          2,
          0,
          2,
          0
        ],
        "fingers": [
          0,
          1,
          2,
          0,
          3,
          0
        ],
        "tip": "Open-string diminished 7th resolving into B minor."
      }
    ],
    "f": [
      -1,
      1,
      2,
      0,
      2,
      0
    ],
    "fingers": [
      0,
      1,
      2,
      0,
      3,
      0
    ],
    "tip": "Also known as Bbdim7. Leading-tone diminished resolving to B."
  }
];
