# Sonicly Local Server

This is a local server for the Sonicly music app that stores user data on your computer instead of expensive cloud services.

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

#### On Linux/Mac:

```bash
chmod +x install.sh
./install.sh
```

#### On Windows:

```cmd
install.bat
```

#### Manual Installation:

```bash
npm install
```

### Starting the Server

#### Production Mode:

```bash
npm start
```

#### Development Mode (with auto-restart):

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📁 Data Storage

All user data is stored locally in the `server/data/` directory:

- `users.json` - User profiles and settings
- `subscriptions.json` - User subscription data
- `payments.json` - Payment method information
- `billing.json` - Billing history records

## 🔧 Configuration

### Port Configuration

By default, the server runs on port 3001. To change this:

1. Create a `.env` file in the server directory:

```env
PORT=3001
```

2. Or set the environment variable:

```bash
PORT=8000 npm start
```

### CORS Configuration

The server allows connections from:

- `http://localhost:8080` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `http://127.0.0.1:8080`

To add more origins, edit the CORS configuration in `server.js`.

## 🌐 API Endpoints

### Health Check

- `GET /api/health` - Check if server is running

### User Management

- `GET /api/users/:userId` - Get user data
- `POST /api/users/:userId` - Save user data

### Subscriptions

- `GET /api/subscriptions/:userId` - Get user subscriptions
- `POST /api/subscriptions/:userId` - Add new subscription
- `PUT /api/subscriptions/:userId/:subscriptionId` - Update subscription

### Payment Methods

- `GET /api/payments/:userId` - Get payment methods
- `POST /api/payments/:userId` - Add payment method
- `DELETE /api/payments/:userId/:paymentId` - Remove payment method

### Billing History

- `GET /api/billing/:userId` - Get billing history
- `POST /api/billing/:userId` - Add billing record

## 🔐 Security Features

- Helmet.js for security headers
- CORS protection
- JSON body parsing with size limits
- Input validation and sanitization

## 🚨 Troubleshooting

### Server Won't Start

1. Check if Node.js is installed: `node --version`
2. Check if port 3001 is available
3. Check the console for error messages

### Frontend Can't Connect

1. Ensure server is running on port 3001
2. Check CORS configuration
3. Verify the frontend API URL is correct

### Data Not Saving

1. Check file permissions in the `data/` directory
2. Ensure sufficient disk space
3. Check server logs for errors

## 💾 Backup and Restore

### Backup Data

Copy the entire `server/data/` directory to a safe location:

```bash
cp -r server/data/ /path/to/backup/
```

### Restore Data

Replace the `server/data/` directory with your backup:

```bash
rm -rf server/data/
cp -r /path/to/backup/data/ server/
```

## 🔄 Data Migration

If you want to migrate from localStorage to server:

1. Start the server
2. The frontend will automatically detect and use the server
3. Existing localStorage data will be used as fallback when server is offline

## 🎯 Performance

The server is optimized for local use:

- File-based storage (no database required)
- Automatic JSON parsing and validation
- Memory-efficient request handling
- Graceful error handling

## 📊 Monitoring

### Server Status

Visit `http://localhost:3001/api/health` to check server status.

### Data Size

Monitor the size of files in the `data/` directory to ensure they don't grow too large.

## 🛠 Development

### Adding New Endpoints

1. Add the route in `server.js`
2. Implement the corresponding function in `src/lib/apiService.ts`
3. Update the frontend service to use the new endpoint

### Database Migration

If you want to upgrade to a real database later:

1. Install database driver (MongoDB, PostgreSQL, etc.)
2. Create migration scripts to move data from JSON files
3. Update the server endpoints to use database queries

## 📝 License

This server is part of the Sonicly project and follows the same license terms.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Ensure all prerequisites are installed
4. Check file permissions and disk space

## 🔄 Updates

To update the server:

1. Backup your data directory
2. Replace server files with new version
3. Run `npm install` to update dependencies
4. Restart the server
