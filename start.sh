#!/bin/bash

# Bookmark Manager Startup Script
# This script installs dependencies and starts both backend and frontend servers

echo "🚀 Starting Bookmark Manager..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🎯 Starting servers..."
echo ""
echo "📚 Backend API will run on: http://localhost:3001"
echo "🌐 Frontend app will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm start