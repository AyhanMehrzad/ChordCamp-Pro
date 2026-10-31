#!/usr/bin/env bash
# ==============================================================================
# ChordCamp Pro - Linux Uninstaller
# ==============================================================================

set -e

APP_DIR="$HOME/.local/share/applications"
BIN_DIR="$HOME/.local/bin"
ICON_DIR_512="$HOME/.local/share/icons/hicolor/512x512/apps"
ICON_DIR_SVG="$HOME/.local/share/icons/hicolor/scalable/apps"

echo "========================================================"
echo "  🎸 CHORDCAMP PRO - LINUX UNINSTALLER"
echo "========================================================"
echo ""

rm -f "$APP_DIR/chordcamp-pro.desktop"
rm -f "$BIN_DIR/chordcamp"
rm -f "$ICON_DIR_512/chordcamp.png"
rm -f "$ICON_DIR_SVG/chordcamp.svg"

command -v update-desktop-database &> /dev/null && update-desktop-database "$APP_DIR" 2>/dev/null || true

echo "[DONE] ChordCamp Pro has been removed from your Linux application menu."
echo "Note: Your project directory and files were preserved."
echo ""
