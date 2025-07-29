#!/bin/bash

echo "🚀 Deploying Sonicly Server to Fly.io..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Installing flyctl..."
    curl -L https://fly.io/install.sh | sh
    echo "✅ flyctl installed. Please restart your terminal and run this script again."
    exit 1
fi

# Login to Fly.io
echo "🔐 Logging in to Fly.io..."
flyctl auth login

# Create app if it doesn't exist
echo "📱 Setting up Sonicly Server app..."
flyctl apps create sonicly-server --generate-name

# Create volume for persistent data storage
echo "💾 Creating persistent volume for data..."
flyctl volumes create sonicly_data --region iad --size 1

# Deploy the server
echo "🚀 Deploying server..."
flyctl deploy

# Show app info
echo "✅ Deployment complete!"
echo ""
flyctl info
echo ""
echo "🌐 Your server is now accessible at:"
flyctl apps list | grep sonicly-server

echo ""
echo "🔗 API Health Check:"
echo "https://your-app-name.fly.dev/api/health"
echo ""
echo "📝 Next steps:"
echo "1. Update your frontend API URL to use the deployed server"
echo "2. Test the connection from your app"
echo "3. Your data will be persistent across deployments"
