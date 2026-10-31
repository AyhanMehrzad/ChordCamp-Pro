@echo off
title ChordCamp Pro - Windows Uninstaller
color 0C

echo ========================================================
echo   🎸 CHORDCAMP PRO - UNINSTALL SHORTCUTS
echo ========================================================
echo.

set "DESKTOP_SHORTCUT=%USERPROFILE%\Desktop\ChordCamp Pro.lnk"
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\ChordCamp Pro"

if exist "%DESKTOP_SHORTCUT%" (
    del /f /q "%DESKTOP_SHORTCUT%"
    echo [OK] Removed Desktop shortcut.
) else (
    echo [INFO] Desktop shortcut not found.
)

if exist "%START_MENU%" (
    rmdir /s /q "%START_MENU%"
    echo [OK] Removed Start Menu shortcuts.
) else (
    echo [INFO] Start Menu folder not found.
)

echo.
echo [DONE] ChordCamp Pro shortcuts have been removed.
echo Note: Your application project files in this folder were kept safe.
echo.
pause
exit /b 0
