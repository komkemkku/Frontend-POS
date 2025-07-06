@echo off
echo 🚀 Auto-Deploy for Frontend POS
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0auto-deploy.ps1"
echo.
pause
