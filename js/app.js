/* -------------------------------------------------------------
   11. HUB NAVIGATION & BOOT
------------------------------------------------------------- */
function switchHub(hubId) {
  document.querySelectorAll('.hub-view').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`hub-${hubId}`);
  if (targetView) targetView.classList.add('active');

  document.querySelectorAll('.hub-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.hub === hubId);
  });

  document.querySelectorAll('.dock-hub-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.dock === hubId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
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
});