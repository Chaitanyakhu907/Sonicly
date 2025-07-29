@echo off
echo 🚀 Installing Sonicly Server...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first:
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

:: Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🎉 Installation complete!
    echo.
    echo To start the server, run:
    echo    npm start
    echo.
    echo For development with auto-restart:
    echo    npm run dev
    echo.
    echo Server will run on: http://localhost:3001
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

pause
