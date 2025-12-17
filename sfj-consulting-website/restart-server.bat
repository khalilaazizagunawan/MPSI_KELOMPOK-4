@echo off
echo ==========================================
echo   SFJ Consulting - Restarting Server
echo ==========================================
cd /d "%~dp0"
call npm run pm2:restart
echo.
echo Server restarted!
echo.
pause
