# scripts/add_sharp_chords.py
import json, sys

with open('js/chords-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('chordDatabase = [')
end_idx = content.rfind('];')
if idx == -1 or end_idx == -1:
    print("Could not find chordDatabase in js/chords-data.js")
    sys.exit(1)

existing_data = json.loads(content[idx+len('chordDatabase = '):end_idx+1])
existing_names = {c['name'] for c in existing_data}
print(f"Existing chords: {len(existing_data)}")

new_chords = [
  # =========================================================
  # C# CHORDS
  # =========================================================
  {
    "root": "C♯",
    "name": "C#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (4th Fret A-Shape)",
        "f": [-1, 4, 6, 6, 6, 4],
        "fingers": [0, 1, 2, 3, 4, 1],
        "tip": "Barre fret 4 with index finger and barre strings 4, 3, 2 at fret 6 with ring or pinky."
      },
      {
        "label": "Pos 2 (9th Fret E-Shape)",
        "f": [9, 11, 11, 10, 9, 9],
        "fingers": [1, 3, 4, 2, 1, 1],
        "tip": "Classic 9th fret E-shape major barre chord. Huge, punchy sound."
      }
    ],
    "f": [-1, 4, 6, 6, 6, 4],
    "fingers": [0, 1, 2, 3, 4, 1],
    "easyF": [-1, -1, 6, 6, 6, 4],
    "easyFingers": [0, 0, 2, 3, 4, 1],
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
        "f": [-1, 4, 6, 4, 6, 4],
        "fingers": [0, 1, 3, 1, 4, 1],
        "tip": "Classic bluesy 7th chord based on the A7 shape at fret 4."
      },
      {
        "label": "Pos 2 (9th Fret E7-Shape)",
        "f": [9, 11, 9, 10, 9, 9],
        "fingers": [1, 3, 1, 2, 1, 1],
        "tip": "9th fret low E dominant 7th chord. Great for funk and blues."
      }
    ],
    "f": [-1, 4, 6, 4, 6, 4],
    "fingers": [0, 1, 3, 1, 4, 1],
    "easyF": [-1, -1, 3, 4, 2, 4],
    "easyFingers": [0, 0, 2, 3, 1, 4],
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
        "f": [-1, 4, 6, 5, 6, 4],
        "fingers": [0, 1, 3, 2, 4, 1],
        "tip": "Lush, dreamy major 7th chord. Essential for neo-soul, jazz, and indie pop."
      },
      {
        "label": "Pos 2 (9th Fret)",
        "f": [9, -1, 10, 10, 9, -1],
        "fingers": [1, 0, 3, 4, 2, 0],
        "tip": "Jazz four-note shell voicing with root on low E."
      }
    ],
    "f": [-1, 4, 6, 5, 6, 4],
    "fingers": [0, 1, 3, 2, 4, 1],
    "easyF": [-1, -1, 6, 5, 6, 4],
    "easyFingers": [0, 0, 2, 1, 3, 1],
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
        "f": [-1, 4, 6, 4, 5, 4],
        "fingers": [0, 1, 3, 1, 2, 1],
        "tip": "Relaxed, mellow minor 7th. Ubiquitous in R&B, lo-fi, and acoustic ballads."
      },
      {
        "label": "Pos 2 (9th Fret Em7 Shape)",
        "f": [9, 11, 9, 9, 9, 9],
        "fingers": [1, 3, 1, 1, 1, 1],
        "tip": "9th fret full barre minor 7th. Great for funky rhythmic chops."
      }
    ],
    "f": [-1, 4, 6, 4, 5, 4],
    "fingers": [0, 1, 3, 1, 2, 1],
    "easyF": [-1, -1, 6, 4, 5, 4],
    "easyFingers": [0, 0, 3, 1, 2, 1],
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
        "f": [-1, 4, 6, 6, 7, 4],
        "fingers": [0, 1, 2, 3, 4, 1],
        "tip": "Tense, unresolved suspended chord waiting to resolve to C# major."
      }
    ],
    "f": [-1, 4, 6, 6, 7, 4],
    "fingers": [0, 1, 2, 3, 4, 1],
    "easyF": [-1, -1, 6, 6, 7, 4],
    "easyFingers": [0, 0, 2, 3, 4, 1],
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
        "f": [-1, 4, 6, 6, 4, 4],
        "fingers": [0, 1, 3, 4, 1, 1],
        "tip": "Open, modern ambient sound. Commonly used in post-rock and modern worship."
      }
    ],
    "f": [-1, 4, 6, 6, 4, 4],
    "fingers": [0, 1, 3, 4, 1, 1],
    "easyF": [-1, -1, 6, 6, 4, 4],
    "easyFingers": [0, 0, 3, 4, 1, 1],
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
        "f": [-1, 4, 6, 6, 4, 4],
        "fingers": [0, 1, 3, 4, 1, 1],
        "tip": "Glistening acoustic voicing with the added 9th (D#)."
      },
      {
        "label": "Pos 2 (Open Voicing)",
        "f": [-1, 4, 3, 1, 4, 1],
        "fingers": [0, 3, 2, 1, 4, 1],
        "tip": "Sparkling wide-stretch add9 voicing."
      }
    ],
    "f": [-1, 4, 6, 6, 4, 4],
    "fingers": [0, 1, 3, 4, 1, 1],
    "easyF": [-1, -1, 6, 6, 4, 4],
    "easyFingers": [0, 0, 3, 4, 1, 1],
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
        "f": [-1, 4, 2, 4, 4, -1],
        "fingers": [0, 2, 1, 3, 4, 0],
        "tip": "The quintessential modern neo-soul & R&B chord shape."
      }
    ],
    "f": [-1, 4, 2, 4, 4, -1],
    "fingers": [0, 2, 1, 3, 4, 0],
    "easyF": [-1, -1, 2, 4, 4, -1],
    "easyFingers": [0, 0, 1, 2, 3, 0],
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
        "f": [-1, 4, 4, 4, 4, 4],
        "fingers": [0, 1, 1, 1, 1, 1],
        "tip": "Flat index finger across strings 5 to 1 at fret 4."
      }
    ],
    "f": [-1, 4, 4, 4, 4, 4],
    "fingers": [0, 1, 1, 1, 1, 1],
    "easyF": [-1, -1, 4, 4, 4, 4],
    "easyFingers": [0, 0, 1, 1, 1, 1],
    "easyLabel": "Mini C#m11",
    "tip": "Ethereal, open sound with one simple flat finger barre."
  },

  # =========================================================
  # D# / Eb CHORDS
  # =========================================================
  {
    "root": "D♯",
    "name": "D#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (6th Fret A-Shape)",
        "f": [-1, 6, 8, 8, 8, 6],
        "fingers": [0, 1, 2, 3, 4, 1],
        "tip": "Barre fret 6 with index finger and strings 4, 3, 2 at fret 8."
      },
      {
        "label": "Pos 2 (11th Fret Low E)",
        "f": [11, 13, 13, 12, 11, 11],
        "fingers": [1, 3, 4, 2, 1, 1],
        "tip": "11th fret E-shape barre chord. Punchy and bright."
      }
    ],
    "f": [-1, 6, 8, 8, 8, 6],
    "fingers": [0, 1, 2, 3, 4, 1],
    "easyF": [-1, -1, 5, 3, 4, 3],
    "easyFingers": [0, 0, 3, 1, 2, 1],
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
        "f": [-1, 6, 8, 8, 7, 6],
        "fingers": [0, 1, 3, 4, 2, 1],
        "tip": "Am shape barre at fret 6. Sad, deep minor harmony."
      },
      {
        "label": "Pos 2 (11th Fret Em Shape)",
        "f": [11, 13, 13, 11, 11, 11],
        "fingers": [1, 3, 4, 1, 1, 1],
        "tip": "11th fret low E minor barre chord."
      }
    ],
    "f": [-1, 6, 8, 8, 7, 6],
    "fingers": [0, 1, 3, 4, 2, 1],
    "easyF": [-1, -1, 4, 3, 4, 2],
    "easyFingers": [0, 0, 3, 2, 4, 1],
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
        "f": [-1, 6, 8, 8, -1, -1],
        "fingers": [0, 1, 3, 4, 0, 0],
        "tip": "Heavy rock & metal staple on the 6th fret."
      },
      {
        "label": "Pos 2 (11th Fret Low E)",
        "f": [11, 13, 13, -1, -1, -1],
        "fingers": [1, 3, 4, 0, 0, 0],
        "tip": "Crushing 11th fret low E power chord."
      }
    ],
    "f": [-1, 6, 8, 8, -1, -1],
    "fingers": [0, 1, 3, 4, 0, 0],
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
        "f": [-1, 6, 8, 6, 8, 6],
        "fingers": [0, 1, 3, 1, 4, 1],
        "tip": "6th fret dominant 7th barre. Bluesy and rich."
      }
    ],
    "f": [-1, 6, 8, 6, 8, 6],
    "fingers": [0, 1, 3, 1, 4, 1],
    "easyF": [-1, -1, 1, 3, 2, 3],
    "easyFingers": [0, 0, 1, 3, 2, 4],
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
        "f": [-1, 6, 8, 7, 8, 6],
        "fingers": [0, 1, 3, 2, 4, 1],
        "tip": "Dreamy, sophisticated jazz & soul major 7th."
      }
    ],
    "f": [-1, 6, 8, 7, 8, 6],
    "fingers": [0, 1, 3, 2, 4, 1],
    "easyF": [-1, -1, 1, 3, 3, 3],
    "easyFingers": [0, 0, 1, 3, 3, 3],
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
        "f": [-1, 6, 8, 6, 7, 6],
        "fingers": [0, 1, 3, 1, 2, 1],
        "tip": "Silky, mellow minor 7th. Ubiquitous in R&B and lo-fi."
      }
    ],
    "f": [-1, 6, 8, 6, 7, 6],
    "fingers": [0, 1, 3, 1, 2, 1],
    "easyF": [-1, -1, 4, 3, 4, 2],
    "easyFingers": [0, 0, 3, 2, 4, 1],
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
        "f": [-1, 6, 8, 8, 9, 6],
        "fingers": [0, 1, 2, 3, 4, 1],
        "tip": "Suspended tension resolving to D# / Eb major."
      }
    ],
    "f": [-1, 6, 8, 8, 9, 6],
    "fingers": [0, 1, 2, 3, 4, 1],
    "easyF": [-1, -1, 8, 8, 9, 6],
    "easyFingers": [0, 0, 2, 3, 4, 1],
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
        "f": [-1, 6, 8, 8, 6, 6],
        "fingers": [0, 1, 3, 4, 1, 1],
        "tip": "Spacious, open modern voicing."
      }
    ],
    "f": [-1, 6, 8, 8, 6, 6],
    "fingers": [0, 1, 3, 4, 1, 1],
    "easyF": [-1, -1, 8, 8, 6, 6],
    "easyFingers": [0, 0, 3, 4, 1, 1],
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
        "f": [-1, -1, 1, 2, 1, 2],
        "fingers": [0, 0, 1, 3, 2, 4],
        "tip": "Compact diminished grip resolving up to E minor."
      }
    ],
    "f": [-1, -1, 1, 2, 1, 2],
    "fingers": [0, 0, 1, 3, 2, 4],
    "tip": "Classic passing chord connecting D and Em."
  },

  # =========================================================
  # F# / Gb CHORDS
  # =========================================================
  {
    "root": "F♯",
    "name": "F#7",
    "type": "Dominant 7th",
    "cat": "7th",
    "level": "Medium",
    "positions": [
      {
        "label": "Pos 1 (2nd Fret E7 Shape)",
        "f": [2, 4, 2, 3, 2, 2],
        "fingers": [1, 3, 1, 2, 1, 1],
        "tip": "Standard 2nd fret dominant 7th barre. Gritty blues and funk tone."
      },
      {
        "label": "Pos 2 (9th Fret A7 Shape)",
        "f": [-1, 9, 11, 9, 11, 9],
        "fingers": [0, 1, 3, 1, 4, 1],
        "tip": "9th fret A-shape dominant 7th chord."
      }
    ],
    "f": [2, 4, 2, 3, 2, 2],
    "fingers": [1, 3, 1, 2, 1, 1],
    "easyF": [-1, -1, 4, 3, 2, 0],
    "easyFingers": [0, 0, 3, 2, 1, 0],
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
        "f": [2, 4, 3, 3, 2, 2],
        "fingers": [1, 4, 2, 3, 1, 1],
        "tip": "Sumptuous, warm major 7th barre on the 2nd fret."
      },
      {
        "label": "Pos 2 (9th Fret Amaj7 Shape)",
        "f": [-1, 9, 11, 10, 11, 9],
        "fingers": [0, 1, 3, 2, 4, 1],
        "tip": "9th fret A-shape major 7th chord."
      }
    ],
    "f": [2, 4, 3, 3, 2, 2],
    "fingers": [1, 4, 2, 3, 1, 1],
    "easyF": [-1, -1, 4, 3, 2, 1],
    "easyFingers": [0, 0, 4, 3, 2, 1],
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
        "f": [2, 4, 2, 2, 2, 2],
        "fingers": [1, 3, 1, 1, 1, 1],
        "tip": "Easy full barre chord with only two fingers needed."
      },
      {
        "label": "Pos 2 (9th Fret Am7 Shape)",
        "f": [-1, 9, 11, 9, 10, 9],
        "fingers": [0, 1, 3, 1, 2, 1],
        "tip": "9th fret A-string minor 7th voicing."
      }
    ],
    "f": [2, 4, 2, 2, 2, 2],
    "fingers": [1, 3, 1, 1, 1, 1],
    "easyF": [-1, -1, 2, 2, 2, 2],
    "easyFingers": [0, 0, 1, 1, 1, 1],
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
        "f": [2, 4, 4, 4, 2, 2],
        "fingers": [1, 2, 3, 4, 1, 1],
        "tip": "Powerful 2nd fret suspended chord resolving to F# major."
      }
    ],
    "f": [2, 4, 4, 4, 2, 2],
    "fingers": [1, 2, 3, 4, 1, 1],
    "easyF": [-1, -1, 4, 4, 2, 2],
    "easyFingers": [0, 0, 3, 4, 1, 1],
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
        "f": [-1, -1, 4, 6, 7, 4],
        "fingers": [0, 0, 1, 2, 4, 1],
        "tip": "Shimmering, open voicing favored by progressive rock guitarists."
      }
    ],
    "f": [-1, -1, 4, 6, 7, 4],
    "fingers": [0, 0, 1, 2, 4, 1],
    "easyF": [-1, -1, 4, 6, 7, 4],
    "easyFingers": [0, 0, 1, 2, 4, 1],
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
        "f": [2, 4, 4, 3, 2, 4],
        "fingers": [1, 3, 4, 2, 1, 4],
        "tip": "F# major barre with the pinky reaching for the high G# at fret 4."
      }
    ],
    "f": [2, 4, 4, 3, 2, 4],
    "fingers": [1, 3, 4, 2, 1, 4],
    "easyF": [-1, -1, 4, 3, 2, 4],
    "easyFingers": [0, 0, 3, 2, 1, 4],
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
        "f": [-1, -1, 4, 5, 4, 5],
        "fingers": [0, 0, 1, 3, 2, 4],
        "tip": "Classic symmetrical diminished 7th shape."
      }
    ],
    "f": [-1, -1, 4, 5, 4, 5],
    "fingers": [0, 0, 1, 3, 2, 4],
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
        "f": [-1, 9, 8, 9, 9, 9],
        "fingers": [0, 2, 1, 3, 3, 3],
        "tip": "The famous James Brown / funk 9th chord on the 9th fret."
      }
    ],
    "f": [-1, 9, 8, 9, 9, 9],
    "fingers": [0, 2, 1, 3, 3, 3],
    "easyF": [-1, -1, 8, 9, 9, 9],
    "easyFingers": [0, 0, 1, 2, 2, 2],
    "easyLabel": "Mini F#9 Funk",
    "tip": "Essential funk rhythm chord! Chop with short staccato strums."
  },

  # =========================================================
  # G# / Ab CHORDS
  # =========================================================
  {
    "root": "G♯",
    "name": "G#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (4th Fret E-Shape Barre)",
        "f": [4, 6, 6, 5, 4, 4],
        "fingers": [1, 3, 4, 2, 1, 1],
        "tip": "Full 4th fret E-shape major barre chord. Strong, resonant, and punchy."
      },
      {
        "label": "Pos 2 (11th Fret A-Shape Barre)",
        "f": [-1, 11, 13, 13, 13, 11],
        "fingers": [0, 1, 2, 3, 4, 1],
        "tip": "11th fret high register major barre chord."
      }
    ],
    "f": [4, 6, 6, 5, 4, 4],
    "fingers": [1, 3, 4, 2, 1, 1],
    "easyF": [-1, -1, 6, 5, 4, 4],
    "easyFingers": [0, 0, 3, 2, 1, 1],
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
        "f": [4, 6, 4, 5, 4, 4],
        "fingers": [1, 3, 1, 2, 1, 1],
        "tip": "Dominant 7th barre on fret 4. Gritty blues and jazz sound."
      },
      {
        "label": "Pos 2 (11th Fret A7 Shape)",
        "f": [-1, 11, 13, 11, 13, 11],
        "fingers": [0, 1, 3, 1, 4, 1],
        "tip": "11th fret A-shape dominant 7th."
      }
    ],
    "f": [4, 6, 4, 5, 4, 4],
    "fingers": [1, 3, 1, 2, 1, 1],
    "easyF": [-1, -1, 4, 5, 4, 4],
    "easyFingers": [0, 0, 1, 2, 1, 1],
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
        "f": [4, -1, 5, 5, 4, -1],
        "fingers": [1, 0, 3, 4, 2, 0],
        "tip": "Classic jazz 4-note major 7th shell voicing."
      },
      {
        "label": "Pos 2 (11th Fret Amaj7 Shape)",
        "f": [-1, 11, 13, 12, 13, 11],
        "fingers": [0, 1, 3, 2, 4, 1],
        "tip": "11th fret silky smooth major 7th."
      }
    ],
    "f": [4, -1, 5, 5, 4, -1],
    "fingers": [1, 0, 3, 4, 2, 0],
    "easyF": [-1, -1, 6, 5, 4, 3],
    "easyFingers": [0, 0, 4, 3, 2, 1],
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
        "f": [4, 6, 4, 4, 4, 4],
        "fingers": [1, 3, 1, 1, 1, 1],
        "tip": "4th fret minor 7th barre. Requires only two active fingers."
      },
      {
        "label": "Pos 2 (11th Fret Am7 Shape)",
        "f": [-1, 11, 13, 11, 12, 11],
        "fingers": [0, 1, 3, 1, 2, 1],
        "tip": "11th fret A-string minor 7th voicing."
      }
    ],
    "f": [4, 6, 4, 4, 4, 4],
    "fingers": [1, 3, 1, 1, 1, 1],
    "easyF": [-1, -1, 4, 4, 4, 4],
    "easyFingers": [0, 0, 1, 1, 1, 1],
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
        "f": [4, 6, 6, 6, 4, 4],
        "fingers": [1, 2, 3, 4, 1, 1],
        "tip": "Big 4th fret suspended chord with immense resonance."
      }
    ],
    "f": [4, 6, 6, 6, 4, 4],
    "fingers": [1, 2, 3, 4, 1, 1],
    "easyF": [-1, -1, 6, 6, 4, 4],
    "easyFingers": [0, 0, 3, 4, 1, 1],
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
        "f": [-1, -1, 6, 8, 9, 6],
        "fingers": [0, 0, 1, 2, 4, 1],
        "tip": "Modern ambient voicing with open interval sparkle."
      }
    ],
    "f": [-1, -1, 6, 8, 9, 6],
    "fingers": [0, 0, 1, 2, 4, 1],
    "easyF": [-1, -1, 6, 8, 9, 6],
    "easyFingers": [0, 0, 1, 2, 4, 1],
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
        "f": [4, 6, 6, 5, 4, 6],
        "fingers": [1, 3, 4, 2, 1, 4],
        "tip": "4th fret barre with the high pinky grabbing the added 9th (A#)."
      }
    ],
    "f": [4, 6, 6, 5, 4, 6],
    "fingers": [1, 3, 4, 2, 1, 4],
    "easyF": [-1, -1, 6, 5, 4, 6],
    "easyFingers": [0, 0, 3, 2, 1, 4],
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
        "f": [4, 6, 4, 4, 4, 6],
        "fingers": [1, 3, 1, 1, 1, 4],
        "tip": "4th fret minor 9th voicing with high pinky extension."
      }
    ],
    "f": [4, 6, 4, 4, 4, 6],
    "fingers": [1, 3, 1, 1, 1, 4],
    "easyF": [-1, -1, 4, 4, 4, 6],
    "easyFingers": [0, 0, 1, 1, 1, 4],
    "easyLabel": "Mini G#m9",
    "tip": "Deep, expressive neo-soul minor 9th."
  },

  # =========================================================
  # A# / Bb CHORDS
  # =========================================================
  {
    "root": "A♯",
    "name": "A#",
    "type": "Major",
    "cat": "Major",
    "level": "Hard",
    "positions": [
      {
        "label": "Pos 1 (1st Fret A-Shape)",
        "f": [-1, 1, 3, 3, 3, 1],
        "fingers": [0, 1, 2, 3, 4, 1],
        "tip": "1st fret A-shape barre chord. Also known as Bb major."
      },
      {
        "label": "Pos 2 (6th Fret E-Shape)",
        "f": [6, 8, 8, 7, 6, 6],
        "fingers": [1, 3, 4, 2, 1, 1],
        "tip": "6th fret low E major barre chord. Huge rock resonance."
      }
    ],
    "f": [-1, 1, 3, 3, 3, 1],
    "fingers": [0, 1, 2, 3, 4, 1],
    "easyF": [-1, -1, 3, 3, 3, 1],
    "easyFingers": [0, 0, 2, 3, 4, 1],
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
        "f": [-1, 1, 3, 3, 2, 1],
        "fingers": [0, 1, 3, 4, 2, 1],
        "tip": "1st fret minor barre chord. Also known as Bbm."
      },
      {
        "label": "Pos 2 (6th Fret Em-Shape)",
        "f": [6, 8, 8, 6, 6, 6],
        "fingers": [1, 3, 4, 1, 1, 1],
        "tip": "6th fret low E minor barre chord."
      }
    ],
    "f": [-1, 1, 3, 3, 2, 1],
    "fingers": [0, 1, 3, 4, 2, 1],
    "easyF": [-1, -1, 3, 3, 2, 1],
    "easyFingers": [0, 0, 3, 4, 2, 1],
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
        "f": [-1, 1, 3, 3, -1, -1],
        "fingers": [0, 1, 3, 4, 0, 0],
        "tip": "1st fret A-string power chord. Tight, heavy sound."
      },
      {
        "label": "Pos 2 (6th Fret Low E)",
        "f": [6, 8, 8, -1, -1, -1],
        "fingers": [1, 3, 4, 0, 0, 0],
        "tip": "6th fret low E power chord. Massive low-end crunch."
      }
    ],
    "f": [-1, 1, 3, 3, -1, -1],
    "fingers": [0, 1, 3, 4, 0, 0],
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
        "f": [-1, 1, 3, 1, 3, 1],
        "fingers": [0, 1, 3, 1, 4, 1],
        "tip": "1st fret dominant 7th barre. Also known as Bb7."
      },
      {
        "label": "Pos 2 (6th Fret E7 Shape)",
        "f": [6, 8, 6, 7, 6, 6],
        "fingers": [1, 3, 1, 2, 1, 1],
        "tip": "6th fret dominant 7th chord. Classic blues & jazz."
      }
    ],
    "f": [-1, 1, 3, 1, 3, 1],
    "fingers": [0, 1, 3, 1, 4, 1],
    "easyF": [-1, -1, 3, 1, 3, 1],
    "easyFingers": [0, 0, 3, 1, 4, 1],
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
        "f": [-1, 1, 3, 2, 3, 1],
        "fingers": [0, 1, 3, 2, 4, 1],
        "tip": "1st fret major 7th chord. Also known as Bbmaj7."
      },
      {
        "label": "Pos 2 (6th Fret)",
        "f": [6, -1, 7, 7, 6, -1],
        "fingers": [1, 0, 3, 4, 2, 0],
        "tip": "Jazz 4-note shell voicing on fret 6."
      }
    ],
    "f": [-1, 1, 3, 2, 3, 1],
    "fingers": [0, 1, 3, 2, 4, 1],
    "easyF": [-1, -1, 3, 2, 3, 1],
    "easyFingers": [0, 0, 3, 2, 4, 1],
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
        "f": [-1, 1, 3, 1, 2, 1],
        "fingers": [0, 1, 3, 1, 2, 1],
        "tip": "1st fret minor 7th chord. Also known as Bbm7."
      },
      {
        "label": "Pos 2 (6th Fret Em7 Shape)",
        "f": [6, 8, 6, 6, 6, 6],
        "fingers": [1, 3, 1, 1, 1, 1],
        "tip": "6th fret minor 7th barre. Two fingers only."
      }
    ],
    "f": [-1, 1, 3, 1, 2, 1],
    "fingers": [0, 1, 3, 1, 2, 1],
    "easyF": [-1, -1, 3, 1, 2, 1],
    "easyFingers": [0, 0, 3, 1, 2, 1],
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
        "f": [-1, 1, 3, 3, 4, 1],
        "fingers": [0, 1, 2, 3, 4, 1],
        "tip": "Suspended chord on fret 1 resolving to A# / Bb major."
      }
    ],
    "f": [-1, 1, 3, 3, 4, 1],
    "fingers": [0, 1, 2, 3, 4, 1],
    "easyF": [-1, -1, 3, 3, 4, 1],
    "easyFingers": [0, 0, 2, 3, 4, 1],
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
        "f": [-1, 1, 3, 3, 1, 1],
        "fingers": [0, 1, 3, 4, 1, 1],
        "tip": "Open, ringing suspension on the 1st fret."
      }
    ],
    "f": [-1, 1, 3, 3, 1, 1],
    "fingers": [0, 1, 3, 4, 1, 1],
    "easyF": [-1, -1, 3, 3, 1, 1],
    "easyFingers": [0, 0, 3, 4, 1, 1],
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
        "f": [-1, 1, 2, 0, 2, 0],
        "fingers": [0, 1, 2, 0, 3, 0],
        "tip": "Open-string diminished 7th resolving into B minor."
      }
    ],
    "f": [-1, 1, 2, 0, 2, 0],
    "fingers": [0, 1, 2, 0, 3, 0],
    "tip": "Also known as Bbdim7. Leading-tone diminished resolving to B."
  }
]

# Filter out any that might already exist by name
to_add = [c for c in new_chords if c['name'] not in existing_names]
print(f"Adding {len(to_add)} new sharp chords...")

combined = existing_data + to_add
print(f"Total chords after update: {len(combined)}")

# Format JSON nicely
new_json_str = json.dumps(combined, indent=2, ensure_ascii=False)

new_content = content[:idx] + 'chordDatabase = ' + new_json_str + ';\n' + content[end_idx+2:]
with open('js/chords-data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated js/chords-data.js successfully!")
