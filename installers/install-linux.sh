#!/usr/bin/env bash
# ==============================================================================
# ChordCamp Pro - Automated Linux Installer (100% Offline)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
APP_NAME="ChordCamp Pro"
BIN_DIR="$HOME/.local/bin"
APP_DIR="$HOME/.local/share/applications"
ICON_DIR_512="$HOME/.local/share/icons/hicolor/512x512/apps"
ICON_DIR_SVG="$HOME/.local/share/icons/hicolor/scalable/apps"

echo "========================================================"
echo "  🎸 CHORDCAMP PRO - LINUX INSTALLER (100% OFFLINE)"
echo "========================================================"
echo ""

# 1. Create directories
echo "📁 [1/4] Preparing directories..."
mkdir -p "$BIN_DIR"
mkdir -p "$APP_DIR"
mkdir -p "$ICON_DIR_512"
mkdir -p "$ICON_DIR_SVG"

# 2. Make launcher executable
echo "⚙️  [2/4] Setting execution permissions..."
chmod +x "$DIR/chordcamp.sh"

# 3. Install icons
echo "🎨 [3/4] Installing application icons..."
if [ -f "$DIR/assets/icon-512.png" ]; then
    cp "$DIR/assets/icon-512.png" "$ICON_DIR_512/chordcamp.png"
fi
if [ -f "$DIR/assets/logo.svg" ]; then
    cp "$DIR/assets/logo.svg" "$ICON_DIR_SVG/chordcamp.svg"
fi

# 4. Create Desktop Entry in ~/.local/share/applications/
echo "🖥️  [4/4] Creating application launcher..."
cat <<EOF > "$APP_DIR/chordcamp-pro.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=ChordCamp Pro
GenericName=Guitar Chord Playground
Comment=Interactive offline guitar chords, scales, drills, and pro metronome
Exec="$DIR/chordcamp.sh"
Path=$DIR
Icon=chordcamp
Terminal=false
Categories=AudioVideo;Audio;Music;Education;
StartupNotify=true
Keywords=guitar;chords;scales;tuner;metronome;metal;caged;
EOF

chmod +x "$APP_DIR/chordcamp-pro.desktop"

# Create symlink in ~/.local/bin if directory is in PATH
ln -sf "$DIR/chordcamp.sh" "$BIN_DIR/chordcamp"

# Update desktop & icon caches if available
command -v update-desktop-database &> /dev/null && update-desktop-database "$APP_DIR" 2>/dev/null || true
command -v gtk-update-icon-cache &> /dev/null && gtk-update-icon-cache -f -t "$HOME/.local/share/icons/hicolor" 2>/dev/null || true

echo ""
echo "========================================================"
echo "  🎉 INSTALLATION COMPLETE!"
echo "  ChordCamp Pro is now installed in your application menu."
echo "  You can also launch it from any terminal by typing: chordcamp"
echo "========================================================"
echo ""

read -p "Would you like to launch ChordCamp Pro now? [Y/n]: " LAUNCH
LAUNCH=${LAUNCH:-Y}
if [[ "$LAUNCH" =~ ^[Yy]$ ]]; then
    "$DIR/chordcamp.sh" &
fi
