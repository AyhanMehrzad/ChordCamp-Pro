const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\SurfaceGO1', 'Desktop');
const shortcutPath = path.join(desktopPath, 'ChordCamp Pro.lnk');
const projectDir = 'c:\\Users\\SurfaceGO1\\Desktop\\ChordCamp-Pro';
const exePath = path.join(projectDir, 'ChordCamp.exe');
const iconPath = path.join(projectDir, 'assets', 'ChordCamp.ico');

const vbsScript = [
  'Set oWS = WScript.CreateObject("WScript.Shell")',
  `sLinkFile = "${shortcutPath.replace(/\\/g, '\\\\')}"`,
  'Set oLink = oWS.CreateShortcut(sLinkFile)',
  `oLink.TargetPath = "${exePath.replace(/\\/g, '\\\\')}"`,
  `oLink.WorkingDirectory = "${projectDir.replace(/\\/g, '\\\\')}"`,
  `oLink.IconLocation = "${iconPath.replace(/\\/g, '\\\\')}, 0"`,
  'oLink.Description = "ChordCamp Pro - Interactive Guitar Playground"',
  'oLink.Save'
].join('\r\n');

const tempVbs = path.join(__dirname, 'temp_shortcut.vbs');
fs.writeFileSync(tempVbs, vbsScript);
execSync(`cscript //nologo "${tempVbs}"`);
fs.unlinkSync(tempVbs);

console.log('Windows Desktop shortcut created at:', shortcutPath);
