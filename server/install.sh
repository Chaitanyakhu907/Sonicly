#!/bin/bash

echo "🚀 Installing Sonicly Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Installation complete!"
    echo ""
    echo "To start the server, run:"
    echo "   npm start"
    echo ""
    echo "For development with auto-restart:"
    echo "   npm run dev"
    echo ""
    echo "Server will run on: http://localhost:3001"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
