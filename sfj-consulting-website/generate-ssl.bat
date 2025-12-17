@echo off
echo ==========================================
echo   Generate Self-Signed SSL Certificate
echo ==========================================
echo.

cd /d "%~dp0"

echo Generating SSL certificate using Node.js...
echo This will create a self-signed certificate for development.
echo.

node generate-ssl.js

if exist "ssl\key.pem" (
    echo.
    echo ==========================================
    echo   SSL Certificate Generated Successfully!
    echo ==========================================
    echo.
    echo Certificate: ssl\cert.pem
    echo Private Key: ssl\key.pem
    echo.
    echo Server will now use HTTPS.
    echo Restart server with: npm run pm2:restart
    echo.
) else (
    echo.
    echo ==========================================
    echo   ERROR: Certificate generation failed!
    echo ==========================================
    echo.
    echo Please check the error message above.
    echo.
)

pause

