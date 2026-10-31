const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.resolve(__dirname, '..');
const installerDir = path.join(projectDir, 'installer');
const payloadZip = path.join(installerDir, 'ChordCampPayload.zip');

if (!fs.existsSync(installerDir)) fs.mkdirSync(installerDir, { recursive: true });
if (fs.existsSync(payloadZip)) fs.unlinkSync(payloadZip);

// Prepare dist first
execSync('node scripts/prepare-dist.js', { cwd: projectDir, stdio: 'inherit' });

// Copy ChordCamp.exe, launch-windows.bat, install-windows.bat to dist
const distDir = path.join(projectDir, 'dist');
['ChordCamp.exe', 'launch-windows.bat', 'install-windows.bat'].forEach(f => {
  const src = path.join(projectDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, f));
  }
});

// Create zip using PowerShell Compress-Archive
console.log('Compressing payload into installer/ChordCampPayload.zip...');
const psCmd = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${payloadZip}' -Force"`;
execSync(psCmd, { stdio: 'inherit' });

console.log('Payload zip created successfully! Size:', fs.statSync(payloadZip).size, 'bytes');
