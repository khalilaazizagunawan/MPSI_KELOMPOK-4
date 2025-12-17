@echo off
echo ==========================================
echo   SFJ Consulting - Starting Server
echo ==========================================
cd /d "%~dp0"
call npm run pm2:start
call npx pm2 save
echo.
echo ==========================================
echo Server started with PM2!
echo.
echo Server akan tetap berjalan meski terminal ditutup.
echo.
echo Untuk stop: double-click stop-server.bat
echo Untuk restart: double-click restart-server.bat
echo Untuk lihat logs: npm run pm2:logs
echo ==========================================
echo.
echo Membuka browser...
timeout /t 3 >nul
start http://localhost:3000
echo.
echo Browser sudah dibuka!
echo Terminal ini bisa ditutup sekarang.
echo.
pause
