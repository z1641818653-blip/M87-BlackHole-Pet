@echo off
setlocal
cd /d "%~dp0"

where node.exe >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found.
  echo Install Node.js from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

set "ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/"
call npm.cmd install --cache "%CD%\.npm-cache" --registry "https://registry.npmmirror.com"
if errorlevel 1 (
  echo.
  echo Electron installation failed. Check the network and run this file again.
  pause
  exit /b 1
)

call npm.cmd start
