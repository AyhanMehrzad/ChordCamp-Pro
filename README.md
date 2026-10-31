# 🎸 ChordCamp Pro — Interactive Guitar Playground & Offline Studio

> **100% Offline • Zero Dependencies • Windows .exe & Installer • Linux One-Click Setup • Android 1-Tap & APK**

ChordCamp Pro is a high-performance, offline guitar practice workstation and chord playground featuring real-time **Karplus-Strong physical modeling audio synthesis**, 90+ chords (including 17 heavy metal power chords), CAGED fretboard voicings, dynamic capo transposition, full scales and modes with soloing zones, interactive practice drills, and a precision metronome.

---

## ⚡ Quick Start: Remade Installation Files

### 🪟 Windows (.exe & Installer)
1. **Automated Setup (Recommended)**:
   - Double-click **[`Install-Windows.bat`](Install-Windows.bat)**.
   - Automatically generates a **Desktop Shortcut** with the custom guitar pick icon and adds a Start Menu entry under `ChordCamp Pro`.
2. **Direct Executable**:
   - Double-click **[`ChordCamp.exe`](ChordCamp.exe)**.
   - Runs instantly in a dedicated borderless desktop app window with no browser URL bar or command prompt flash.
3. **Quick Batch Launcher**:
   - Double-click **[`launch-windows.bat`](launch-windows.bat)**.
4. **Uninstall**:
   - Run **[`Uninstall-Windows.bat`](Uninstall-Windows.bat)** anytime to remove desktop and start menu shortcuts cleanly.

---

### 🐧 Linux (One-Click Setup & Desktop Integration)
1. **Automated Installer (Recommended)**:
   - Open a terminal in this directory and run:
     ```bash
     chmod +x install-linux.sh
     ./install-linux.sh
     ```
   - Automatically installs high-res guitar icons, creates an application launcher in `~/.local/share/applications/chordcamp-pro.desktop` (so ChordCamp Pro shows up in your GNOME/KDE/XFCE application menu), and links the `chordcamp` command to your terminal!
2. **Instant Shell Launcher**:
   - Simply run:
     ```bash
     chmod +x chordcamp.sh
     ./chordcamp.sh
     ```
   - Automatically detects Google Chrome, Chromium, Brave, Edge, or Firefox and launches in dedicated app window mode.
3. **Uninstall**:
   - Run `./uninstall-linux.sh` to remove the application launcher and icons cleanly.

---

### 📱 Android (1-Tap Offline App & APK)

#### 1. Instant 1-Tap Offline Install (Recommended)
1. Transfer this folder to your Android device or open it in Chrome on your phone.
2. Open **[`install-android.html`](install-android.html)** (or `index.html`).
3. Tap the bright green **"Install App on Phone"** button (or tap Chrome's menu **⋮** ➔ **"Install app"** / **"Add to Home screen"**).
4. ChordCamp Pro installs directly into your Android app drawer with the guitar pick icon, launches full-screen without address bars, and functions **100% offline** via the built-in Service Worker cache.

#### 2. Android `.apk` Compilation (GitHub Actions CI/CD)
- **Automatic Cloud Build**:
  - Push this repository to your GitHub account.
  - The pre-configured **GitHub Actions Workflow** ([`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml)) automatically compiles `chordcamp-debug.apk` and `chordcamp-release.apk` on GitHub's Ubuntu runners and attaches them to your GitHub Releases and Actions Artifacts for instant download!
- **Local Gradle Build (Capacitor)**:
  ```bash
  npm install
  npx cap add android
  npx cap sync android
  cd android && ./gradlew assembleDebug
  ```

---

## 🔒 100% Offline Architecture: How It Works

- **Zero Cloud Reliance**: There are no external CDNs, Google Fonts, or tracking scripts. Everything is completely self-contained in local files.
- **Physical Modeling Audio Engine**: String plucks and resonant guitar tones are synthesized live in client memory using Web Audio API and the **Karplus-Strong algorithm**, eliminating the need for bulky external sample files or downloads.
- **Offline Cache**: Includes a native Service Worker (`sw.js`) that caches all code, styles, and assets on first run for airplane mode practice.

---

## 🎛️ Redesigned Floating Studio Dock

The bottom floating dock has been completely redesigned into a **balanced capsule dock**:
- **Zero Empty Gap on PC**: Replaced the previous stretched container with an auto-fitting, centered studio capsule with glassmorphism and glowing neon lime accents.
- **Grouped Controls**: Left-side navigation hubs (`🎸 Chords`, `🧪 Scales`, `⏱️ Drills`, `🥁 Beat`), sleek glowing separator, and right-side studio action buttons (`🥁 80 BPM`, `🎵 Drone`, `🔊 Play [Active Chord]`).
- **Responsive Mobile Layout**: Automatically transitions to a thumb-reachable edge-to-edge bar on mobile screens.

---

## 📁 Repository Structure

```text
ChordCamp-Pro/
├── index.html                   # Clean semantic HTML layout
├── ChordCamp.exe                # Native Windows GUI offline executable (with embedded icon)
├── Install-Windows.bat          # Automated Windows desktop & start menu installer
├── Uninstall-Windows.bat        # Windows shortcut cleaner
├── launch-windows.bat           # Windows quick batch launcher
├── chordcamp.sh                 # Linux shell launcher (dedicated app mode)
├── install-linux.sh             # Automated Linux installer (desktop menu & terminal command)
├── uninstall-linux.sh           # Linux uninstaller
├── chordcamp.desktop            # Linux FreeDesktop shortcut
├── install-android.html         # Android 1-tap mobile installer & PWA onboarding page
├── manifest.json                # Web App Manifest for mobile installation
├── sw.js                        # Offline caching Service Worker
├── package.json                 # Project scripts and Capacitor setup
├── capacitor.config.json        # Android mobile configuration
├── .gitignore                   # Clean Git ignore rules
│
├── installers/                  # Platform installer scripts grouped together
│   ├── Install-Windows.bat
│   ├── Uninstall-Windows.bat
│   ├── install-linux.sh
│   ├── uninstall-linux.sh
│   └── install-android.html
│
├── css/
│   └── styles.css               # 100% fluid responsive styling (PC & Mobile)
│
├── js/
│   ├── chords-data.js           # 90+ chords database, metal power chords, caged shapes
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
│   ├── ChordCamp.ico            # Windows application icon
│   ├── icon-192.png             # Android standard launcher icon
│   └── icon-512.png             # High-res splash & store icon
│
└── .github/
    └── workflows/
        └── build-apk.yml        # Automated GitHub Actions APK build workflow
```

---

## 🚀 Pushing to Your GitHub Repository

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ChordCamp-Pro.git
git push -u origin main
```
Once pushed, check the **Actions** tab on GitHub to see your Android `.apk` build automatically.
