// scripts/configure-android.js
/**
 * ChordCamp Pro — Android Audio & Permissions Configuration Engine
 * Configures AndroidManifest.xml with microphone audio recording permissions
 * and ensures WebView media capture compatibility for Capacitor APK builds.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

console.log('--- Configuring Android Permissions for Guitar Tuner ---');

if (!fs.existsSync(manifestPath)) {
  console.log(`[Notice] Android manifest not found at ${manifestPath}. (Will run during Capacitor build)`);
  process.exit(0);
}

let manifest = fs.readFileSync(manifestPath, 'utf8');

const permissionsToAdd = [
  '    <uses-permission android:name="android.permission.RECORD_AUDIO" />',
  '    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />',
  '    <uses-permission android:name="android.permission.INTERNET" />',
  '    <uses-feature android:name="android.hardware.microphone" android:required="false" />'
];

let modified = false;

for (const perm of permissionsToAdd) {
  const match = perm.match(/android:name="([^"]+)"/);
  if (match) {
    const permName = match[1];
    if (!manifest.includes(permName)) {
      console.log(`  + Adding Android permission: ${permName}`);
      manifest = manifest.replace('<application', `${perm}\n    <application`);
      modified = true;
    } else {
      console.log(`  ✓ Android permission already present: ${permName}`);
    }
  }
}

if (modified) {
  fs.writeFileSync(manifestPath, manifest, 'utf8');
  console.log('✓ AndroidManifest.xml updated successfully with microphone permissions!');
} else {
  console.log('✓ AndroidManifest.xml is already up to date with all microphone permissions.');
}
