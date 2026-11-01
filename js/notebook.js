/* -------------------------------------------------------------
   CHORDCAMP PRO — NOTION-STYLE PRACTICE NOTEBOOK
   Clean, offline practice logbook with instant auto-save
------------------------------------------------------------- */

const NOTEBOOK_KEY = 'chordcamp_practice_notebook';

const PRACTICE_TEMPLATES = {
  warmup: `# 🎸 Daily 20-Minute Routine
- [ ] 00:00 - 05:00: Chromatic Spider 1-2-3-4 across all 6 strings
- [ ] 05:00 - 10:00: Am Pentatonic Box 1 & Box 2 Alternate Picking @ 80 BPM
- [ ] 10:00 - 15:00: Clean 60s Chord Switching (C ➔ G ➔ Am ➔ F)
- [ ] 15:00 - 20:00: Free Improvisation over A Minor Jamming Drone

## Notes & Bottlenecks:
- Watch 3rd finger ring relaxation on the F barre chord.
`,
  bpm: `# ⚡ BPM Speed Tracker
| Date | Exercise | Starting BPM | Target BPM | Clean Achieved |
|---|---|---|---|---|
| ${new Date().toISOString().split('T')[0]} | Major Scale 3NPS | 75 | 110 | 90 BPM |
| ${new Date().toISOString().split('T')[0]} | Dm to G7 Transition | 60 | 90 | 75 BPM |

## Goals for Tomorrow:
- Push alternate picking cleanly at 95 BPM without tension.
`,
  song: `# 🎶 Song & Riff Idea
- **Tuning**: Standard E A D G B E (Capo 2)
- **Progression**: [Am] - [Fmaj7] - [C] - [G/B]
- **Time Signature**: 4/4 @ 92 BPM
- **Amp Tone**: Crunch Tube Preamp (Gain 45, Delay 250ms)

## Strumming Pattern:
D - D U - U D - D U
`
};

function initNotebook() {
  const pad = document.getElementById('practiceNotebookPad');
  if (!pad) return;

  const saved = localStorage.getItem(NOTEBOOK_KEY);
  if (saved) {
    pad.value = saved;
  } else {
    pad.value = PRACTICE_TEMPLATES.warmup;
  }

  pad.addEventListener('input', () => {
    localStorage.setItem(NOTEBOOK_KEY, pad.value);
    updateNotebookWordCount();
  });

  updateNotebookWordCount();
}

function updateNotebookWordCount() {
  const pad = document.getElementById('practiceNotebookPad');
  const countEl = document.getElementById('notebookWordCount');
  if (!pad || !countEl) return;
  const words = pad.value.trim() ? pad.value.trim().split(/\s+/).length : 0;
  countEl.textContent = `${words} words`;
}

function insertPracticeTemplate(type) {
  const pad = document.getElementById('practiceNotebookPad');
  if (!pad) return;
  const tmpl = PRACTICE_TEMPLATES[type];
  if (!tmpl) return;

  if (pad.value.trim() && !confirm('Replace current notebook with this template? (Make sure to save your notes first)')) {
    return;
  }

  pad.value = tmpl;
  localStorage.setItem(NOTEBOOK_KEY, pad.value);
  updateNotebookWordCount();
  toast(`📝 Inserted ${type} template!`);
}

function exportNotebookText() {
  const pad = document.getElementById('practiceNotebookPad');
  if (!pad || !pad.value.trim()) {
    toast('Notebook is empty');
    return;
  }
  const blob = new Blob([pad.value], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ChordCamp-Practice-Notes-${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
  toast('💾 Practice notes downloaded!');
}
