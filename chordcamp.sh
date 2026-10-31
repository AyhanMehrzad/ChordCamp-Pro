#!/usr/bin/env bash
# ==============================================================================
# ChordCamp Pro - Offline Linux Launcher
# Launches ChordCamp in dedicated desktop app mode (Chromium/Chrome/Brave/Firefox)
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
TARGET="file://${DIR}/index.html"

echo "🎸 Launching ChordCamp Pro offline..."

# 1. Try launching in dedicated app-window mode (no browser address bar/tabs)
if command -v google-chrome &> /dev/null; then
    google-chrome --app="$TARGET" --enable-features=OverlayScrollbar &
elif command -v chromium &> /dev/null; then
    chromium --app="$TARGET" --enable-features=OverlayScrollbar &
elif command -v chromium-browser &> /dev/null; then
    chromium-browser --app="$TARGET" --enable-features=OverlayScrollbar &
elif command -v brave-browser &> /dev/null; then
    brave-browser --app="$TARGET" &
elif command -v msedge &> /dev/null; then
    msedge --app="$TARGET" &
# 2. Fallback to standard xdg-open or default browser
elif command -v xdg-open &> /dev/null; then
    xdg-open "$TARGET" &
elif command -v firefox &> /dev/null; then
    firefox "$TARGET" &
elif command -v sensible-browser &> /dev/null; then
    sensible-browser "$TARGET" &
else
    echo "⚠️ Could not find a supported browser automatically."
    echo "Please open ${TARGET} manually in your favorite web browser."
fi

exit 0
