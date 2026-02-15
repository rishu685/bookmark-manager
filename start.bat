@echo off
REM Bookmark Manager Startup Script for Windows
REM This script installs dependencies and starts both backend and frontend servers

echo 🚀 Starting Bookmark Manager...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🎯 Starting servers...
echo.
echo 📚 Backend API will run on: http://localhost:3001
echo 🌐 Frontend app will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both servers concurrently
npm start