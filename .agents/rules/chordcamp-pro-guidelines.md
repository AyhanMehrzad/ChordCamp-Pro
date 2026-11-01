# ChordCamp Pro Architecture & Engineering Standards

## 1. Codebase Minimalism & Anti-Bloat
- Maintain lowest lines of code possible with clean, idiomatic vanilla JS / Web APIs.
- Avoid bulky third-party dependencies when native Web Audio API, Canvas, or lightweight standard modules suffice.
- Remove redundant boilerplate, unused dependencies, and dead assets.

## 2. Mandatory Feature & Necessity Consultation
- Before implementing non-essential or heavy features, always present a plan to the user detailing:
  1. Necessity assessment: Is it critical to the user's practice workflow?
  2. Performance impact: CPU usage, RAM footprint, and audio latency.
  3. Device compatibility: Supported Android chipsets and desktop operating systems.
- Let the user decide whether to proceed, trim, or make it an optional toggle.

## 3. Real Native Desktop & Mobile Packaging
- Windows/Linux: Provide a standalone desktop window with isolated user profile (no browser address bar/tabs) and native packaging.
- Windows Installer: Professional setup with an optional "Launch on Windows Startup" registry hook (`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`) and an in-app settings toggle.
- Android: 100% feature parity (tuner, effects, drills, tabs) using Capacitor with low-latency audio permissions (`RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`).

## 4. Audio & DSP Performance Standards
- Audio worklets, Web Audio graphs, and pitch detection (Autocorrelation / MPM) must target sub-15ms round-trip latency.
- Practice Drill "Listener" (pitch validation) must always be optional and disabled by default so it never blocks beginners.
- For TONE3000 / NAM models: provide an instant Web DSP engine (<5ms latency, <2% CPU) alongside NAM Wasm (filtered for Feather/Nano models) to prevent audio stuttering on budget mobile ARM CPUs.

## 5. Non-Destructive Versioning
- Version 1.0 remains intact, fully stable, and runnable.
- New major modules (tuner, studio rig, tab flow, practice notebook) are designed modularly before final merge.
