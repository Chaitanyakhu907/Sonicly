@echo off
echo 🚀 Deploying Sonicly Server to Fly.io...

:: Check if flyctl is installed
flyctl version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ flyctl is not installed. Please install flyctl first:
    echo    Visit: https://fly.io/docs/flyctl/install/
    echo    Or run: iwr https://fly.io/install.ps1 -useb ^| iex
    pause
    exit /b 1
)

:: Login to Fly.io
echo 🔐 Logging in to Fly.io...
flyctl auth login

:: Create app if it doesn't exist
echo 📱 Setting up Sonicly Server app...
flyctl apps create sonicly-server --generate-name

:: Create volume for persistent data storage
echo 💾 Creating persistent volume for data...
flyctl volumes create sonicly_data --region iad --size 1

:: Deploy the server
echo 🚀 Deploying server...
flyctl deploy

:: Show app info
echo ✅ Deployment complete!
echo.
flyctl info
echo.
echo 🌐 Your server is now accessible worldwide!
flyctl apps list | findstr sonicly-server

echo.
echo 📝 Next steps:
echo 1. Update your frontend API URL to use the deployed server
echo 2. Test the connection from your app
echo 3. Your data will be persistent across deployments

pause
