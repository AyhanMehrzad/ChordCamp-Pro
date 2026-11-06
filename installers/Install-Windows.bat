@echo off
setlocal
title ChordCamp Pro - Quick Installer
color 0A

echo ==============================================================
echo    CHORDCAMP PRO - QUICK WINDOWS INSTALLER
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
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s1 = $ws.CreateShortcut('%DESKTOP%'); $s1.TargetPath = '%TARGET%'; $s1.WorkingDirectory = '%DIR%'; $s1.IconLocation = '%ICON%, 0'; $s1.Description = 'ChordCamp Pro - Interactive Guitar Playground'; $s1.Save()" >nul 2>&1

echo [3/3] Creating Start Menu Shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s2 = $ws.CreateShortcut('%STARTMENU%'); $s2.TargetPath = '%TARGET%'; $s2.WorkingDirectory = '%DIR%'; $s2.IconLocation = '%ICON%, 0'; $s2.Description = 'ChordCamp Pro - Interactive Guitar Playground'; $s2.Save()" >nul 2>&1

echo.
echo ==============================================================
echo  SUCCESS! ChordCamp Pro desktop shortcut has been created.
echo  You can now launch ChordCamp Pro from your Desktop or Start Menu!
echo ==============================================================
echo.
start "" "%TARGET%"
exit /b 0
