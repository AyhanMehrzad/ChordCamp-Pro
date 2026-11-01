# 🎸 ChordCamp Pro — Interactive Guitar Playground & Practice Studio

> **100% Offline • Zero Dependencies • Windows .exe & Installer • Linux Desktop Integration • Android 1-Tap & APK**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20Android%20%7C%20Web-brightgreen)](#-multi-platform-installation)
[![Offline](https://img.shields.io/badge/Offline-100%25%20Self--Contained-blue)](#-100-offline-architecture)

**ChordCamp Pro** is a high-performance, offline guitar practice workstation and chord playground. Built with a responsive dark-mode interface and real-time **Karplus-Strong physical modeling audio synthesis**, it features 90+ chords (including 17 heavy metal power chords), CAGED fretboard voicings, dynamic capo transposition, full scales and modes with soloing zones, interactive practice drills, and a precision metronome.

🌐 **Live Web Demo**: [https://ayhanmehrzad.github.io/ChordCamp-Pro/](https://ayhanmehrzad.github.io/ChordCamp-Pro/)

---

## ⚡ Core Features

- **🎸 90+ Interactive Chords**: Open chords, barre chords, 7ths, suspended, extended voicings, plus 17 dedicated heavy metal power chords.
- **✨ Dual Voicing Engine**: Instantly toggle between **Beginner Easy Shapes** (minimal finger stretching) and **Standard Barre/Open Shapes**.
- **📐 CAGED Neck Positions**: Explore inversions and multiple positions up the neck for any chord.
- **🔒 Dynamic Capo Transposition**: Transpose any chord in real time from Capo 0 to 7 with sounding chord calculations.
- **🧪 Scales & Modes Playground**: Pentatonics (Blues/Rock), 7 Musical Modes, and 3NPS speed shred patterns with an ambient jamming drone.
- **⏱️ Interactive Practice Drills**:
  - *60s Chord Switching Challenge*: Test transition speed with personal best tracking.
  - *Fretboard Blind Note Hunter*: Timed drill to identify note positions across all 6 strings.
  - *Modal Ear Trainer Quiz*: Guess musical modes by ear from synthesized cadences.
- **🥁 Visual Groove Metronome**: Sub-division beat bulbs, tap tempo, presets (60 to 120 BPM), and fine ±1/±5 adjustments.
- **🔊 Karplus-Strong Audio**: Pure physical string synthesis in client memory with zero external audio samples to download.

---

## 💻 Multi-Platform Installation

### 🪟 Windows (.exe & Setup Installer)

1. **Self-Extracting Setup Installer**:
   - Run **[`ChordCampSetup.exe`](ChordCampSetup.exe)**.
   - Installs ChordCamp Pro with custom guitar icons, creates **Desktop** and **Start Menu** shortcuts, and includes an uninstaller.
2. **Automated Batch Setup**:
   - Double-click **[`Install-Windows.bat`](Install-Windows.bat)** for instant shortcut creation.
3. **Direct Standalone Application**:
   - Double-click **[`ChordCamp.exe`](ChordCamp.exe)**.
   - Runs in a clean, dedicated borderless window with zero browser address bars or tabs.
4. **Quick Batch Launcher**:
   - Run **[`launch-windows.bat`](launch-windows.bat)**.
5. **Uninstall**:
   - Run **[`Uninstall-Windows.bat`](Uninstall-Windows.bat)** anytime to cleanly remove shortcuts.

---

### 🐧 Linux (One-Click Setup & Desktop Integration)

1. **Automated Desktop Installer**:
   ```bash
   chmod +x install-linux.sh
   ./install-linux.sh
   ```
   Installs high-resolution icons, registers the desktop entry in `~/.local/share/applications/chordcamp-pro.desktop` (so it appears in your GNOME/KDE/XFCE app menu), and symlinks the `chordcamp` terminal command.
2. **Instant Shell Launcher**:
   ```bash
   chmod +x chordcamp.sh
   ./chordcamp.sh
   ```
3. **Uninstall**:
   ```bash
   ./uninstall-linux.sh
   ```

---

### 📱 Android (1-Tap Offline Install & APK)

#### 1. Instant 1-Tap Offline Install (Recommended)
1. Open **[`https://ayhanmehrzad.github.io/ChordCamp-Pro/install-android.html`](https://ayhanmehrzad.github.io/ChordCamp-Pro/install-android.html)** on your phone using Chrome or Samsung Internet.
2. Tap **"Install on Android Phone"** (or Chrome menu `⋮` ➔ **"Add to Home screen" / "Install app"**).
3. ChordCamp Pro installs directly into your Android app drawer with its custom icon, launches full-screen without URL bars, and runs **100% offline**.

#### 2. Native Android `.apk` Build (GitHub Actions CI/CD)
- Pushing to GitHub triggers [`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml), which automatically compiles `chordcamp-debug.apk` and publishes it to GitHub Releases and Actions Artifacts for direct download.
- **Local Build with Capacitor**:
  ```bash
  npm install
  npx cap add android
  npx cap sync android
  cd android && ./gradlew assembleDebug
  ```

---

## 🔒 100% Offline Architecture

- **Zero Cloud Reliance**: No external CDNs, fonts, or tracking scripts. Everything runs locally.
- **Physical Modeling Engine**: Resonant string plucks are computed live in Web Audio using the Karplus-Strong algorithm, eliminating massive audio file downloads.
- **Offline Cache**: Powered by a lightweight Service Worker (`sw.js`) that caches code, styles, and assets on first launch.

---

## 🎛️ Balanced Thumb Dock

The bottom floating dock is designed for effortless one-handed control:
- **Left Navigation Hubs**: `🎸 Chords`, `🧪 Scales`, `⏱️ Drills`, `🥁 Beat`.
- **Center Capsule**: Glowing neon lime border with frosted glassmorphism.
- **Right Quick Actions**: `🥁 80 BPM` Metronome toggle, `🎵 Drone` modal jam toggle, and `🔊 Play` active chord strum.

---

## 📁 Repository Structure

```text
ChordCamp-Pro/
├── index.html                   # Core application interface
├── ChordCamp.exe                # Native Windows standalone executable
├── ChordCampSetup.exe           # Self-contained Windows installer
├── Install-Windows.bat          # Windows shortcut installer script
├── Uninstall-Windows.bat        # Windows shortcut cleaner
├── launch-windows.bat           # Windows quick batch launcher
├── chordcamp.sh                 # Linux shell launcher
├── install-linux.sh             # Linux desktop installer
├── uninstall-linux.sh           # Linux desktop uninstaller
├── chordcamp.desktop            # Linux desktop entry
├── install-android.html         # Android 1-tap mobile installer onboarding
├── manifest.json                # Web App Manifest
├── sw.js                        # Offline caching Service Worker
├── package.json                 # Scripts and Capacitor configuration
├── capacitor.config.json        # Capacitor Android configuration
│
├── installers/                  # Platform installer scripts
│   ├── Install-Windows.bat
│   ├── Uninstall-Windows.bat
│   ├── install-linux.sh
│   ├── uninstall-linux.sh
│   └── install-android.html
│
├── css/
│   └── styles.css               # Fluid responsive styling
│
├── js/
│   ├── chords-data.js           # 90+ chords, metal power chords, CAGED positions
│   ├── scales-data.js           # Complete scales & modes database
│   ├── audio.js                 # Karplus-Strong physical modeling guitar synth
│   ├── chords.js                # Chord playground & dynamic SVG generator
│   ├── fretboard.js             # SVG fretboard engine & soloing zones
│   ├── drills.js                # Practice drills implementation
│   ├── metronome.js             # Precision metronome engine
│   └── app.js                   # Hub navigation & boot orchestration
│
├── assets/
│   ├── logo.svg                 # High-resolution vector logo
│   ├── ChordCamp.ico            # Windows application icon
│   ├── icon-192.png             # Android standard launcher icon
│   └── icon-512.png             # High-res splash & store icon
│
└── .github/
    └── workflows/
        └── build-apk.yml        # Automated GitHub Actions APK build workflow
```

---

## 🌟 Support & Contributions

If you find ChordCamp Pro helpful for your guitar practice, consider giving it a ⭐ on GitHub!

Developed with passion by **Ayhan Mehrzad** & the open-source community.  
Licensed under the [MIT License](LICENSE).
