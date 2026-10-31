# 🎸 ChordCamp Pro — Interactive Guitar Playground & Offline Studio

> **100% Offline • Zero Dependencies • Windows .exe • Linux Launcher • Android .apk & PWA**

ChordCamp Pro is a high-performance, offline guitar practice workstation and chord playground featuring real-time **Karplus-Strong physical modeling audio synthesis**, 90+ chords (including 17 heavy metal power chords), CAGED fretboard voicings, dynamic capo transposition, full scales and modes with soloing zones, interactive practice drills, and a precision metronome.

---

## ⚡ Quick Start: How to Run

### 🪟 Windows (.exe)
1. **Option 1 (Native Executable - Recommended)**:
   - Double-click **[`ChordCamp.exe`](ChordCamp.exe)**.
   - Launches in a dedicated borderless desktop app window with no browser URL bar or clutter.
2. **Option 2 (Batch Launcher)**:
   - Double-click **[`launch-windows.bat`](launch-windows.bat)**.
3. **Option 3 (Direct File)**:
   - Double-click **[`index.html`](index.html)** in any web browser.

---

### 🐧 Linux (.sh & .desktop)
1. **Option 1 (One-Click Bash Launcher)**:
   - Open terminal in this folder and run:
     ```bash
     chmod +x chordcamp.sh
     ./chordcamp.sh
     ```
   - Automatically detects Chromium, Google Chrome, Brave, Edge, or Firefox and launches in dedicated desktop app window mode.
2. **Option 2 (Desktop App Menu)**:
   - Copy the desktop shortcut to your local applications directory:
     ```bash
     cp chordcamp.desktop ~/.local/share/applications/
     ```
   - ChordCamp Pro will now appear directly in your Ubuntu / Debian / Fedora / Arch / Mint application launcher!

---

### 📱 Android (.apk & 1-Tap Offline App)
You have two easy ways to use ChordCamp Pro on your Android phone or tablet:

#### 1. Instant 1-Tap Offline Install (PWA — Recommended)
1. Transfer this folder to your phone or host it on your local Wi-Fi / GitHub Pages.
2. Open `index.html` in **Google Chrome** on your Android device.
3. Tap the **Three Dots (⋮)** menu at top-right and select **"Install app"** or **"Add to Home screen"**.
4. ChordCamp Pro will install directly onto your home screen with the custom guitar app icon. It runs **full-screen without browser bars** and works **100% offline** (powered by the built-in `sw.js` cache).

#### 2. Building / Downloading the `.apk`
- **Automatic GitHub Build**:
  - When you push this repository to GitHub, the included **GitHub Actions CI/CD Workflow** (`.github/workflows/build-apk.yml`) automatically compiles the Android `.apk` on GitHub's cloud runners and attaches `chordcamp-debug.apk` to your GitHub Releases and Actions Artifacts for instant download!
- **Local APK Compilation (via Capacitor & Android Studio)**:
  ```bash
  # 1. Install dependencies
  npm install

  # 2. Add Android platform & sync web assets
  npx cap add android
  npx cap sync android

  # 3. Open in Android Studio or build via Gradle
  cd android
  ./gradlew assembleDebug
  ```
  The compiled APK will be located at:
  `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔒 100% Offline Capability: How It Works

- **Zero Cloud Reliance**: There are no external CDNs, fonts, or tracking scripts. Everything is completely self-contained in local files.
- **Physical Modeling Audio Engine**: Sound is synthesized live in client memory using Web Audio API and the **Karplus-Strong string algorithm**, eliminating the need for bulky external audio files or downloads.
- **Offline Cache**: Includes a native Service Worker (`sw.js`) that caches all code, styles, and assets on first run for airplane mode practice.

---

## 📁 Clean Separated Architecture

The codebase has been completely separated into clean, modular files for easy maintenance:

```text
ChordCamp-Pro/
├── index.html                   # Clean semantic HTML layout
├── ChordCamp.exe                # Native Windows GUI offline executable
├── launch-windows.bat           # Windows quick batch launcher
├── chordcamp.sh                 # Linux shell launcher (dedicated app mode)
├── chordcamp.desktop            # Linux FreeDesktop shortcut
├── manifest.json                # Web App Manifest for mobile installation
├── sw.js                        # Offline caching Service Worker
├── package.json                 # Project scripts and Capacitor setup
├── capacitor.config.json        # Android mobile configuration
├── .gitignore                   # Git ignore patterns
│
├── css/
│   └── styles.css               # 100% fluid responsive styling (PC & Mobile)
│
├── js/
│   ├── chords-data.js           # 90+ chords database, power chords, caged shapes
│   ├── scales-data.js           # Complete scales & modes, soloing box 1
│   ├── audio.js                 # Karplus-Strong physical modeling guitar synth
│   ├── chords.js                # Chord playground, dynamic SVG diagrams, sheet modal
│   ├── fretboard.js             # SVG fretboard engine & soloing zone highlight
│   ├── drills.js                # Transition coach, note hunter, ear training
│   ├── metronome.js             # Pro metronome engine, rhythm patterns & pulse bulbs
│   └── app.js                   # Navigation hubs, capo engine, filter pills, boot
│
├── assets/
│   ├── logo.svg                 # High-resolution vector logo
│   ├── icon-192.png             # Android standard launcher icon
│   └── icon-512.png             # High-res splash & store icon
│
└── .github/
    └── workflows/
        └── build-apk.yml        # Automated GitHub Actions APK build workflow
```

---

## 🎸 Core Features

1. **Chord Playground (90 Chords)**:
   - **Metal Power Chords**: `E5`, `F5`, `F#5`, `G5`, `G#5`, `A5`, `Bb5`, `B5`, `C5`, `C#5`, `D5`, `Eb5`, plus 9th power chords (`E5(add9)`, `A5(add9)`, `D5(add9)`) and drop voicings.
   - **All 12 Roots**: `E`, `A`, `D`, `G`, `B`, `C`, `F`, `F♯`, `C♯`, `G♯`, `D♯`, `B♭`.
   - **Quality Filters**: Power, Major, Minor, 7th, Dim / Aug, Suspended, Extended.
   - **Slide-Up Modal**: Tap any chord card to smoothly slide up an enlarged view with interactive strings and CAGED fretboard positions.
2. **Dynamic Capo Transposition**:
   - Transpose chords dynamically up to fret 7 with sounding name calculation.
3. **Scales & Modes Studio**:
   - Pentatonics, Blues, Major Modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian), Harmonic/Melodic Minor, and Chromatic scales.
   - **Soloing Zone (Box 1)** toggle for targeted fretboard practice.
4. **Practice Drills**:
   - 60-Second Speed Chord Transition Coach.
   - Fretboard Blind Note Hunter.
   - Chord & Interval Ear Training Quiz.
5. **Pro Metronome Studio**:
   - 30 to 280 BPM with tap tempo, rhythm subdivisions (quarter, 8ths, triplets, 16ths), visual beat bulbs, and practice speed ladder.

---

## 🚀 Pushing to Your GitHub Repository

To upload this repository to your personal GitHub account:

1. Create a new repository on [GitHub](https://github.com/new) named `ChordCamp-Pro` (leave "Initialize with README" unchecked).
2. Open terminal in `C:\Users\SurfaceGO1\Desktop\ChordCamp-Pro` and run:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ChordCamp-Pro.git
   git branch -M main
   git push -u origin main
   ```
3. Once pushed:
   - Go to your repository on GitHub and click the **Actions** tab to view the automated `.apk` build in progress!
   - Under **Releases** or **Actions Artifacts**, download your compiled Android `.apk` directly to your phone.

---

## 📄 License
MIT License. Free to use, customize, and share offline!
