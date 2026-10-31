@echo off
title ChordCamp Pro - Offline Launcher
setlocal

set DIR=%~dp0
set TARGET=file:///%DIR%index.html
set TARGET=%TARGET:\=/%

:: Check if native ChordCamp.exe exists
if exist "%DIR%ChordCamp.exe" (
    start "" "%DIR%ChordCamp.exe"
    exit /b 0
)

:: Otherwise launch via Chrome or Edge in dedicated app-window mode
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%TARGET%"
    exit /b 0
)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%TARGET%"
    exit /b 0
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%TARGET%"
    exit /b 0
)

:: Fallback to default browser
start "" "%TARGET%"
exit /b 0
