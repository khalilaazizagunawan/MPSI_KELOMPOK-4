@echo off
echo ==========================================
echo   SFJ Consulting - Stopping Server
echo ==========================================
cd /d "%~dp0"
call npm run pm2:stop
call npm run pm2:delete
echo.
echo Server stopped!
echo.
pause
