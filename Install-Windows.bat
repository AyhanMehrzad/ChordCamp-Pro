@echo off
setlocal enabledelayedexpansion
title ChordCamp Pro - Windows Installer
color 0A

echo ========================================================
echo   🎸 CHORDCAMP PRO - WINDOWS INSTALLER (100%% OFFLINE)
echo ========================================================
echo.

set "INSTALL_DIR=%~dp0"
:: Remove trailing backslash if present
if "%INSTALL_DIR:~-1%"=="\" set "INSTALL_DIR=%INSTALL_DIR:~0,-1%"

set "EXE_PATH=%INSTALL_DIR%\ChordCamp.exe"
set "ICON_PATH=%INSTALL_DIR%\assets\ChordCamp.ico"
set "HTML_PATH=%INSTALL_DIR%\index.html"

echo [1/3] Verifying offline files...
if not exist "%EXE_PATH%" (
    echo [ERROR] ChordCamp.exe was not found in: %INSTALL_DIR%
    pause
    exit /b 1
)
if not exist "%HTML_PATH%" (
    echo [ERROR] index.html was not found in: %INSTALL_DIR%
    pause
    exit /b 1
)
echo [OK] All offline project files verified.
echo.

echo [2/3] Creating Desktop Shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $desktop = [Environment]::GetFolderPath('Desktop'); ^
   $shortcut = $ws.CreateShortcut(\"$desktop\ChordCamp Pro.lnk\"); ^
   $shortcut.TargetPath = '%EXE_PATH%'; ^
   $shortcut.WorkingDirectory = '%INSTALL_DIR%'; ^
   $shortcut.IconLocation = '%ICON_PATH%,0'; ^
   $shortcut.Description = 'ChordCamp Pro - Interactive Guitar Playground & Offline Practice Studio'; ^
   $shortcut.Save()"

if %ERRORLEVEL% EQU 0 (
    echo [OK] Desktop shortcut created: "ChordCamp Pro"
) else (
    echo [WARNING] Could not create Desktop shortcut automatically.
)
echo.

echo [3/3] Creating Start Menu Entry...
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\ChordCamp Pro"
if not exist "%START_MENU%" mkdir "%START_MENU%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $shortcut = $ws.CreateShortcut(\"%START_MENU%\ChordCamp Pro.lnk\"); ^
   $shortcut.TargetPath = '%EXE_PATH%'; ^
   $shortcut.WorkingDirectory = '%INSTALL_DIR%'; ^
   $shortcut.IconLocation = '%ICON_PATH%,0'; ^
   $shortcut.Description = 'ChordCamp Pro - Interactive Guitar Playground & Offline Practice Studio'; ^
   $shortcut.Save()"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $shortcut = $ws.CreateShortcut(\"%START_MENU%\Uninstall ChordCamp Pro.lnk\"); ^
   $shortcut.TargetPath = '%INSTALL_DIR%\Uninstall-Windows.bat'; ^
   $shortcut.WorkingDirectory = '%INSTALL_DIR%'; ^
   $shortcut.Description = 'Uninstall ChordCamp Pro shortcuts'; ^
   $shortcut.Save()"

if %ERRORLEVEL% EQU 0 (
    echo [OK] Start Menu entry created: Start ^> Programs ^> ChordCamp Pro
) else (
    echo [WARNING] Could not create Start Menu entry.
)
echo.

echo ========================================================
echo   🎉 INSTALLATION COMPLETE!
echo   ChordCamp Pro is now installed and ready to use offline.
echo ========================================================
echo.
set /p LAUNCH="Would you like to launch ChordCamp Pro now? (Y/N) [default: Y]: "
if /i "%LAUNCH%"=="" set LAUNCH=Y
if /i "%LAUNCH%"=="Y" (
    start "" "%EXE_PATH%"
)
exit /b 0
