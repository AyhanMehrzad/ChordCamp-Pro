@echo off
title ChordCamp Pro - Quick Installer
color 0A
setlocal

echo ==============================================================
echo    CHORDCAMP PRO — QUICK WINDOWS INSTALLER
echo ==============================================================
echo.

set "DIR=%~dp0"
set "TARGET=%DIR%ChordCamp.exe"
set "ICON=%DIR%assets\ChordCamp.ico"
set "DESKTOP=%USERPROFILE%\Desktop\ChordCamp Pro.lnk"
set "STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\ChordCamp Pro.lnk"

echo [1/3] Verifying ChordCamp Pro files...
if not exist "%TARGET%" (
    echo [ERROR] ChordCamp.exe not found in %DIR%
    pause
    exit /b 1
)

echo [2/3] Creating Windows Desktop Shortcut...
cscript //nologo //e:VBScript - "%TARGET%" "%DIR%" "%ICON%" "%DESKTOP%" << "EOF"
Set oWS = WScript.CreateObject("WScript.Shell")
Set oLink = oWS.CreateShortcut(WScript.Arguments(3))
oLink.TargetPath = WScript.Arguments(0)
oLink.WorkingDirectory = WScript.Arguments(1)
oLink.IconLocation = WScript.Arguments(2) & ", 0"
oLink.Description = "ChordCamp Pro - Interactive Guitar Playground"
oLink.Save
EOF

echo [3/3] Creating Start Menu Shortcut...
cscript //nologo //e:VBScript - "%TARGET%" "%DIR%" "%ICON%" "%STARTMENU%" << "EOF"
Set oWS = WScript.CreateObject("WScript.Shell")
Set oLink = oWS.CreateShortcut(WScript.Arguments(3))
oLink.TargetPath = WScript.Arguments(0)
oLink.WorkingDirectory = WScript.Arguments(1)
oLink.IconLocation = WScript.Arguments(2) & ", 0"
oLink.Description = "ChordCamp Pro - Interactive Guitar Playground"
oLink.Save
EOF

echo.
echo ==============================================================
echo  SUCCESS! ChordCamp Pro desktop shortcut has been created.
echo  You can now launch ChordCamp Pro from your Desktop or Start Menu!
echo ==============================================================
echo.
set /p LAUNCH="Would you like to launch ChordCamp Pro now? (Y/N): "
if /i "%LAUNCH%"=="Y" (
    start "" "%TARGET%"
)

exit /b 0
