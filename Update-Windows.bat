@echo off
setlocal
title ChordCamp Pro - Quick Updater
color 0A

echo ==============================================================
echo    CHORDCAMP PRO - 1-CLICK INSTANT UPDATER (NO REINSTALL)
echo ==============================================================
echo.

set "DIR=%~dp0"
set "APPDIR=%LOCALAPPDATA%\ChordCamp-Pro"
set "EXE=%DIR%ChordCamp.exe"
set "ICON=%DIR%assets\ChordCamp.ico"
set "DESKTOP=%USERPROFILE%\Desktop\ChordCamp Pro.lnk"
set "STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\ChordCamp Pro.lnk"

echo [1/3] Closing any running ChordCamp processes...
taskkill /F /IM ChordCamp.exe /T >nul 2>&1
ping 127.0.0.1 -n 2 >nul

echo [2/3] Updating application files...
if exist "%APPDIR%" (
    echo Updating installed files in %APPDIR%...
    copy /y "%DIR%index.html" "%APPDIR%\" >nul
    copy /y "%DIR%manifest.json" "%APPDIR%\" >nul
    copy /y "%DIR%sw.js" "%APPDIR%\" >nul
    if exist "%DIR%ChordCamp.exe" copy /y "%DIR%ChordCamp.exe" "%APPDIR%\" >nul
    if exist "%DIR%ChordCampSetup.exe" copy /y "%DIR%ChordCampSetup.exe" "%APPDIR%\" >nul
    xcopy "%DIR%css" "%APPDIR%\css" /y /s /i /q >nul
    xcopy "%DIR%js" "%APPDIR%\js" /y /s /i /q >nul
    xcopy "%DIR%assets" "%APPDIR%\assets" /y /s /i /q >nul
    set "TARGET=%APPDIR%\ChordCamp.exe"
    set "WORKDIR=%APPDIR%"
) else (
    echo Running in portable directory...
    set "TARGET=%DIR%ChordCamp.exe"
    set "WORKDIR=%DIR%"
)

echo [3/3] Refreshing Windows Desktop and Start Menu shortcuts...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; if (Test-Path '%DESKTOP%') { $s1 = $ws.CreateShortcut('%DESKTOP%'); $s1.TargetPath = '%TARGET%'; $s1.WorkingDirectory = '%WORKDIR%'; $s1.IconLocation = '%ICON%, 0'; $s1.Description = 'ChordCamp Pro - Interactive Guitar Playground'; $s1.Save() }; $s2 = $ws.CreateShortcut('%STARTMENU%'); $s2.TargetPath = '%TARGET%'; $s2.WorkingDirectory = '%WORKDIR%'; $s2.IconLocation = '%ICON%, 0'; $s2.Description = 'ChordCamp Pro - Interactive Guitar Playground'; $s2.Save()" >nul 2>&1

echo.
echo ==============================================================
echo  SUCCESS! ChordCamp Pro has been updated to the latest version!
echo  (133+ Chords, Studio Guitar Tuner, Visual Metronome)
echo  No need to uninstall or delete files!
echo ==============================================================
echo.

if exist "%TARGET%" (
    echo Launching updated ChordCamp Pro...
    start "" "%TARGET%"
)
exit /b 0
