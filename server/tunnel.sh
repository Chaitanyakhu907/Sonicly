#!/bin/bash

echo "🌐 Setting up tunnel to access your local server globally..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Installing ngrok..."
    
    # Detect OS and install ngrok
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
        echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
        sudo apt update && sudo apt install ngrok
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # Mac OS
        if command -v brew &> /dev/null; then
            brew install ngrok/ngrok/ngrok
        else
            echo "Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    else
        echo "Please install ngrok manually from: https://ngrok.com/download"
        exit 1
    fi
fi

# Check if server is running
if ! curl -s http://localhost:3001/api/health > /dev/null; then
    echo "❌ Local server is not running. Please start it first:"
    echo "   cd server && npm start"
    exit 1
fi

echo "✅ Local server is running"

# Start ngrok tunnel
echo "🚀 Starting global tunnel..."
echo "📝 Sign up for free at: https://dashboard.ngrok.com/signup"
echo "🔑 Get your auth token at: https://dashboard.ngrok.com/get-started/your-authtoken"
echo ""
echo "If this is your first time, run: ngrok config add-authtoken YOUR_TOKEN"
echo ""
echo "🌐 Creating public tunnel to your local server..."

# Start tunnel
ngrok http 3001

echo "✅ Tunnel created! Your server is now accessible worldwide."
echo "📋 Copy the HTTPS URL and update your frontend API configuration."
