@echo off
title ChordCamp Pro - Standalone System Application
setlocal

set DIR=%~dp0

:: 1. Launch standalone native Windows executable
if exist "%DIR%ChordCamp.exe" (
    start "" "%DIR%ChordCamp.exe"
    exit /b 0
)

:: 2. Fallback to native python desktop runner
where.exe python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" python "%DIR%launcher\desktop_app.py"
    exit /b 0
)

:: 3. Direct file launch if executable is missing
echo Launching ChordCamp Pro...
start "" "%DIR%index.html"
exit /b 0
