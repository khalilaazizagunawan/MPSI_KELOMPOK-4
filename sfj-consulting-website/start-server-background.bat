@echo off
cd /d "%~dp0"
start "SFJ Server" cmd /k "node server.js"
echo Server started in new window!
echo You can close this window.
timeout /t 2
start http://localhost:3000

