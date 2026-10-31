/* -------------------------------------------------------------
   4. SIMPLIFIED & COMPLETE SCALES & MODES DATABASE
------------------------------------------------------------- */
const SCALE_DATABASE = [
  // --- 1. PENTATONICS & BLUES (THE ESSENTIALS) ---
  {
    category: 'pentatonic',
    id: 'minor-pentatonic',
    name: 'Minor Pentatonic',
    sub: 'The #1 Guitar Scale in the World',
    intervals: [0, 3, 5, 7, 10],
    formula: '1 - ♭3 - 4 - 5 - ♭7',
    flavorInterval: 3,
    flavorName: 'Minor 3rd (♭3)',
    mood: 'Raw, powerful, rock, pop and blues staple. 5 notes that are virtually impossible to hit wrong!',
    vamp: 'Am – Dm – Em (or any standard 12-bar rock/blues track)',
    practiceSteps: [
      'Start on the 6th string and pick down-up-down-up through Box 1.',
      'Turn ON the continuous Ambient Drone above in your key and improvise.',
      'Pick any 3 notes and bend the G or B string slightly for instant blues emotion.'
    ]
  },
  {
    category: 'pentatonic',
    id: 'blues-scale',
    name: 'The Blues Scale',
    sub: 'Minor Pentatonic + The ♭5 "Blue Note"',
    intervals: [0, 3, 5, 6, 7, 10],
    formula: '1 - ♭3 - 4 - ♭5 - 5 - ♭7',
    flavorInterval: 6,
    flavorName: 'Blue Note (♭5)',
    isBlueScale: true,
    mood: 'Gritty, dirty, expressive blues tone. The cyan ♭5 adds instant attitude and feeling!',
    vamp: 'A7 – D7 – E7 (Classic Blues Shuffle)',
    practiceSteps: [
      'Locate the glowing cyan ♭5 Blue Note on the fretboard.',
      'Never hold the ♭5 forever—slide or bend through it to the 5th (E).',
      'Play with strong pick attack and wide finger vibrato on the root.'
    ]
  },
  {
    category: 'pentatonic',
    id: 'major-pentatonic',
    name: 'Major Pentatonic',
    sub: 'Sweet, Uplifting & Soulful',
    intervals: [0, 2, 4, 7, 9],
    formula: '1 - 2 - 3 - 5 - 6',
    flavorInterval: 4,
    flavorName: 'Major 3rd (3)',
    mood: 'Bright, sweet, southern rock, country and R&B (B.B. King, Allman Brothers, Eric Clapton).',
    vamp: 'A – D – E (Uplifting I – IV – V progression)',
    practiceSteps: [
      'Compare this directly to Minor Pentatonic to hear the warm, happy difference.',
      'Focus on the 3rd and 6th degrees for a sweet singing solo tone.',
      'Slide up into the Major 3rd on the G string for classic southern rock flavor.'
    ]
  },

  // --- 2. THE 7 MODES (PLAIN ENGLISH MOODS) ---
  {
    category: 'modes',
    id: 'dorian',
    name: 'Dorian Mode',
    sub: 'Soulful & Jazzy Minor (Carlos Santana)',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    formula: '1 - 2 - ♭3 - 4 - 5 - ♮6 - ♭7',
    flavorInterval: 9,
    flavorName: 'Natural 6th (♮6)',
    mood: 'Smooth, sophisticated minor that never sounds sad. Carlos Santana (Oye Como Va), Daft Punk, Pink Floyd.',
    vamp: 'Am7 – D7 or Dm7 – G (i – IV)',
    practiceSteps: [
      'The Natural 6th (violet dot) is your target note. Land on it over the D7 chord.',
      'Compare to Aeolian (Natural Minor): Dorian has a brighter, funkier energy.',
      'Keep a steady groove going with the metronome or ambient drone.'
    ]
  },
  {
    category: 'modes',
    id: 'mixolydian',
    name: 'Mixolydian Mode',
    sub: 'Classic Southern Rock (AC/DC, Grateful Dead)',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    formula: '1 - 2 - 3 - 4 - 5 - 6 - ♭7',
    flavorInterval: 10,
    flavorName: 'Flat 7th (♭7)',
    mood: 'Major scale with a relaxed, bluesy edge. Sweet Home Alabama, Norwegian Wood, Southern Rock.',
    vamp: 'A – G – D (I – ♭VII – IV)',
    practiceSteps: [
      'Target the Flat 7th (♭7) to immediately signal the classic rock sound.',
      'Play over dominant 7th chords (A7, D7, G7).',
      'Alternate between Pentatonic blues licks and Mixolydian runs.'
    ]
  },
  {
    category: 'modes',
    id: 'aeolian',
    name: 'Aeolian (Natural Minor)',
    sub: 'Classic Melancholic Ballad Sound',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    formula: '1 - 2 - ♭3 - 4 - 5 - ♭6 - ♭7',
    flavorInterval: 8,
    flavorName: 'Flat 6th (♭6)',
    mood: 'Emotional, sad, dramatic rock ballad sound. Stairway to Heaven, Gary Moore, heavy rock.',
    vamp: 'Am – F – G (i – ♭VI – ♭VII)',
    practiceSteps: [
      'The Flat 6th (♭6) provides that weeping, poignant minor drama.',
      'Bend the ♭7 up a whole step to resolve home to the root note.',
      'Use sustained notes and wide finger vibrato for maximum feeling.'
    ]
  },
  {
    category: 'modes',
    id: 'ionian',
    name: 'Ionian (Major Scale)',
    sub: 'Bright, Triumphant & Resolved',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: '1 - 2 - 3 - 4 - 5 - 6 - 7',
    flavorInterval: 11,
    flavorName: 'Major 7th (7)',
    mood: 'The foundation of Western harmony. Bright, triumphant, and fully resolved.',
    vamp: 'C – F – G (I – IV – V)',
    practiceSteps: [
      'Notice the half-step pull between the 7th and the Root.',
      'Practice singing the note names as you pick each fret.',
      'Use as a benchmark to compare all other modal colors against.'
    ]
  },
  {
    category: 'modes',
    id: 'phrygian',
    name: 'Phrygian Mode',
    sub: 'Spanish Flamenco & Dark Thrash Metal',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    formula: '1 - ♭2 - ♭3 - 4 - 5 - ♭6 - ♭7',
    flavorInterval: 1,
    flavorName: 'Flat 2nd (♭2)',
    mood: 'Dark, exotic, aggressive tension. Metallica, Slayer, Tool, and Spanish Flamenco.',
    vamp: 'Em – F or Am – B♭ (i – ♭II)',
    practiceSteps: [
      'Hammer-on and pull-off rapidly between the Root and ♭2 for an exotic Spanish trill.',
      'Heavy chugging on the Low E string with palm muting.',
      'Let the tension build before resolving back to the root.'
    ]
  },
  {
    category: 'modes',
    id: 'lydian',
    name: 'Lydian Mode',
    sub: 'Dreamy Sci-Fi & Space Rock (Steve Vai)',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    formula: '1 - 2 - 3 - ♯4 - 5 - 6 - 7',
    flavorInterval: 6,
    flavorName: 'Sharp 4th (♯4)',
    mood: 'Mystical, floating, futuristic space vibe. Steve Vai, Joe Satriani, The Simpsons theme.',
    vamp: 'C – D/C or F – G (I – II)',
    practiceSteps: [
      'The Sharp 4th (♯4) creates a buoyant, floating lift without any sadness.',
      'Hold the ♯4 note against a major chord drone to feel its ethereal magic.',
      'Use volume swells or delay effects to enhance the space atmosphere.'
    ]
  },
  {
    category: 'modes',
    id: 'locrian',
    name: 'Locrian Mode',
    sub: 'Tense, Unstable & Horror Score',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    formula: '1 - ♭2 - ♭3 - 4 - ♭5 - ♭6 - ♭7',
    flavorInterval: 6,
    flavorName: 'Flat 5th (♭5)',
    mood: 'Highly unstable, eerie, dissonant tritone harmony. Film scores and technical metal.',
    vamp: 'Bdim – C (diminished tension)',
    practiceSteps: [
      'Treat it as a tension builder that urgently wants to resolve.',
      'Use the ♭5 and ♭2 intervals to create creepy, cinematic guitar riffs.',
      'Play over half-diminished chords (m7♭5).'
    ]
  },

  // --- 3. TECHNIQUE & SPEED WARMUP ---
  {
    category: 'technique',
    id: '3nps',
    name: '3-Notes-Per-String (3NPS)',
    sub: 'Speed Picking & Shred Patterns',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: '3 Notes on Every String',
    flavorInterval: 0,
    flavorName: 'Symmetrical 3NPS',
    is3NPS: true,
    mood: 'Uniform 3-note groupings per string allow lightning-fast alternate picking, sweeping, and legato.',
    vamp: 'Use with Metronome Speed Ladder',
    practiceSteps: [
      'Pick 3 notes per string without changing your right-hand picking pattern.',
      'Use fingers 1-2-4 or 1-3-4 depending on whole/half step intervals.',
      'Turn on the Speed Ladder in the Metronome tab to ramp up BPM smoothly.'
    ]
  },
  {
    category: 'technique',
    id: 'chromatic',
    name: 'Chromatic Spider Scale',
    sub: 'Daily Finger Coordination Warmup',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    formula: 'All 12 Semitones (1 - 2 - 3 - 4)',
    flavorInterval: 0,
    flavorName: 'Fingers 1-2-3-4',
    isChromatic: true,
    mood: 'Not used for melody, but the gold-standard exercise for finger independence and synchronizing both hands.',
    vamp: 'Use with Metronome at 60–100 BPM',
    practiceSteps: [
      'Place one finger per fret: Index(1), Middle(2), Ring(3), Pinky(4).',
      'Strict alternate picking: Down-Up-Down-Up across all 6 strings.',
      'Do this for 3 minutes before every practice session.'
    ]
  }
];