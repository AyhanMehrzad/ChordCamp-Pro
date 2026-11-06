# scripts/configure_android.py
"""
ChordCamp Pro — Android Audio & Permissions Configuration Engine (Python)
Configures AndroidManifest.xml with microphone audio recording permissions
and ensures WebView media capture compatibility for Capacitor APK builds.
"""

import os
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MANIFEST_PATH = os.path.join(ROOT_DIR, 'android', 'app', 'src', 'main', 'AndroidManifest.xml')

def configure_android_manifest():
    print("--- Configuring Android Permissions for Guitar Tuner ---")
    if not os.path.exists(MANIFEST_PATH):
        print(f"[Notice] Android manifest not found at {MANIFEST_PATH}. (Will run during Capacitor build)")
        return

    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        manifest = f.read()

    permissions = [
        '<uses-permission android:name="android.permission.RECORD_AUDIO" />',
        '<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />',
        '<uses-permission android:name="android.permission.INTERNET" />',
        '<uses-feature android:name="android.hardware.microphone" android:required="false" />'
    ]

    modified = False
    for perm in permissions:
        match = re.search(r'android:name="([^"]+)"', perm)
        if match:
            perm_name = match.group(1)
            if perm_name not in manifest:
                print(f"  + Adding Android permission: {perm_name}")
                manifest = manifest.replace('<application', f'    {perm}\n    <application', 1)
                modified = True
            else:
                print(f"  ✓ Android permission already present: {perm_name}")

    if modified:
        with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
            f.write(manifest)
        print("✓ AndroidManifest.xml updated successfully with microphone permissions!")
    else:
        print("✓ AndroidManifest.xml is already up to date with all microphone permissions.")

if __name__ == '__main__':
    configure_android_manifest()
