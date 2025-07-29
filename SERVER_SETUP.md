# 🖥️ Sonicly Local Server Setup

Your computer can now work as a cloud server for the Sonicly app! No expensive cloud services needed.

## 🎯 What You Get

- ✅ **Local Data Storage**: All user data stored on your computer
- ✅ **No Cloud Costs**: Zero monthly subscription fees
- ✅ **Full Control**: Complete control over your data
- ✅ **Privacy**: Data never leaves your computer
- ✅ **Backup Ready**: Easy to backup and restore
- ✅ **Offline Support**: Works even when internet is down

## 📁 What's Created

```
server/
├── server.js          # Main server file
├── package.json       # Dependencies
├── install.sh         # Linux/Mac installer
├── install.bat        # Windows installer
├── README.md          # Server documentation
└── data/              # Your data storage (created automatically)
    ├── users.json
    ├── subscriptions.json
    ├── payments.json
    └── billing.json
```

## 🚀 Setup Steps

### Step 1: Install Server Dependencies

Choose your operating system:

**Windows:**

```cmd
cd server
install.bat
```

**Linux/Mac:**

```bash
cd server
chmod +x install.sh
./install.sh
```

**Manual:**

```bash
cd server
npm install
```

### Step 2: Start the Server

**Start Server:**

```bash
cd server
npm start
```

**Development Mode (auto-restart):**

```bash
cd server
npm run dev
```

You should see:

```
🚀 Sonicly Server is running on http://localhost:3001
📁 Data directory: /path/to/server/data
🔗 Health check: http://localhost:3001/api/health
💻 Frontend URL: http://localhost:8080
```

### Step 3: Switch Frontend to Use Server

Edit `src/lib/storageConfig.ts`:

```typescript
export const STORAGE_CONFIG = {
  mode: "server" as StorageMode, // Change from 'localStorage' to 'server'
  // ... rest of config
};
```

### Step 4: Restart Frontend

```bash
npm run dev
```

## ✅ Verify Setup

1. **Check Server Status:**
   Visit: http://localhost:3001/api/health

2. **Test Frontend Connection:**
   - Login to the app
   - Add a subscription or payment method
   - Check `server/data/` directory for new files

## 🔄 Migration from localStorage

If you already have data in localStorage, it will automatically be used as fallback when the server is offline. To migrate existing data to the server:

1. Ensure server is running
2. Login with existing user
3. Data will be automatically synced

## 💾 Data Location

All your data is stored in:

```
server/data/
├── users.json         # User profiles and settings
├── subscriptions.json # Premium plans and subscriptions
├── payments.json      # Payment methods (cards, UPI)
└── billing.json       # Billing history and invoices
```

## 🔒 Security Features

- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ JSON parsing limits
- ✅ Local-only access (not exposed to internet)

## 📊 Benefits Over Cloud

| Feature        | Local Server     | Cloud Service          |
| -------------- | ---------------- | ---------------------- |
| Monthly Cost   | $0               | $50-200+               |
| Data Privacy   | 100% Private     | Shared with provider   |
| Offline Access | ✅ Yes           | ❌ No                  |
| Data Control   | Full control     | Limited                |
| Setup Time     | 5 minutes        | Hours of configuration |
| Backup         | Simple file copy | Complex procedures     |

## 🛠 Advanced Configuration

### Change Server Port

Edit `server/.env`:

```env
PORT=8000
```

### Add External Access

To access from other devices on your network, edit `server/server.js` CORS settings:

```javascript
origin: ["http://localhost:8080", "http://YOUR_IP:8080"];
```

### Auto-Start Server

**Windows (using Task Scheduler):**

1. Open Task Scheduler
2. Create Basic Task
3. Set program: `node`
4. Set arguments: `/path/to/server/server.js`

**Linux/Mac (using systemd or launchd):**
Create a service file to auto-start the server on boot.

## 🔧 Troubleshooting

### Server Won't Start

```bash
# Check if Node.js is installed
node --version

# Check if port is available
netstat -an | grep 3001

# Check for errors
cd server && npm start
```

### Frontend Can't Connect

1. Verify server is running: http://localhost:3001/api/health
2. Check `storageConfig.ts` mode is set to `'server'`
3. Restart frontend: `npm run dev`

### Data Not Saving

1. Check file permissions: `ls -la server/data/`
2. Check disk space: `df -h`
3. Check server logs for errors

## 📈 Monitoring Your Server

### View Data Files

```bash
# Check subscription data
cat server/data/subscriptions.json | python -m json.tool

# Check billing history
cat server/data/billing.json | python -m json.tool

# Monitor file sizes
du -sh server/data/*
```

### Server Health

Visit: http://localhost:3001/api/health

Response should be:

```json
{
  "status": "OK",
  "message": "Sonicly Server is running!",
  "timestamp": "2025-01-22T10:30:00.000Z",
  "port": 3001
}
```

## 🎉 You're All Set!

Your computer is now a powerful cloud server for Sonicly! You can:

- ✅ Store unlimited user data
- ✅ Save money on cloud costs
- ✅ Keep your data private
- ✅ Backup easily
- ✅ Work offline

**Server URL:** http://localhost:3001
**Frontend URL:** http://localhost:8080
**Data Location:** `server/data/`

## 🆘 Need Help?

1. Check `server/README.md` for detailed documentation
2. Review server logs for error messages
3. Ensure all prerequisites are installed
4. Verify file permissions and disk space

Enjoy your personal Sonicly cloud server! 🎵
