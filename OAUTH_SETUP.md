# OAuth Setup Guide for Sonicly

This guide will help you set up real Google and Microsoft OAuth authentication for your Sonicly app.

## Prerequisites

- A Google Developer account
- A Microsoft Azure account
- Access to your app's environment variables

## Google OAuth Setup

### 1. Create a Google OAuth App

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen if not already done
6. Select "Web application" as the application type
7. Add authorized JavaScript origins:
   - `http://localhost:8080` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
8. Add authorized redirect URIs:
   - `http://localhost:8080` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)

### 2. Get Your Google Client ID

1. After creating the OAuth client, copy the "Client ID"
2. It should look like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
3. Update your `.env` file:
   ```
   VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id.apps.googleusercontent.com
   ```

## Microsoft OAuth Setup

### 1. Create a Microsoft Azure App

1. Go to the [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Enter your app name (e.g., "Sonicly")
5. Select "Accounts in any organizational directory and personal Microsoft accounts"
6. Add redirect URI:
   - Type: "Single-page application (SPA)"
   - URI: `http://localhost:8080` (for development)
   - Add your production domain as well

### 2. Configure App Permissions

1. In your app registration, go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Choose "Delegated permissions"
5. Add these permissions:
   - `openid`
   - `profile` 
   - `email`
6. Click "Grant admin consent" (if you're an admin)

### 3. Get Your Microsoft Client ID

1. In your app registration overview, copy the "Application (client) ID"
2. It should look like: `12345678-1234-1234-1234-123456789abc`
3. Update your `.env` file:
   ```
   VITE_MICROSOFT_CLIENT_ID=your_actual_microsoft_client_id
   ```

## Final Configuration

Update your `.env` file with both OAuth client IDs:

```env
# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id.apps.googleusercontent.com
VITE_MICROSOFT_CLIENT_ID=your_actual_microsoft_client_id

# Other existing configuration...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RmYwfQrCneZTZl0uVG1uiZFfU2Y2BxW2NAqnMdMujotYQ22d0nGYkS8Mi57qk5Y5zkHLVNoTxHuHhd62Cdbi7xD00fYlG1HqP
VITE_APP_NAME=Sonicly
VITE_APP_URL=http://localhost:8080
```

## Testing OAuth

1. Restart your development server after updating environment variables
2. Go to the login page
3. Click "Google" or "Microsoft" buttons
4. You should be redirected to the respective OAuth providers
5. After successful authentication, you'll be logged into Sonicly with a free account

## Important Notes

- **Free Account Policy**: New users who sign up via OAuth will automatically get free accounts
- **No Premium for Free**: The app is configured to NOT show premium features as active for free users
- **Upgrade Path**: Users can upgrade to premium plans through the account page after logging in
- **Security**: Never commit your actual OAuth client IDs to version control
- **Production**: Make sure to update redirect URIs for your production domain

## Troubleshooting

### Common Issues

1. **"Client ID not configured" error**: Make sure your environment variables are set correctly and restart the dev server
2. **"Popup was blocked" error**: Users need to allow popups for your domain
3. **"Unauthorized" error**: Check that your redirect URIs are correctly configured in both Google and Microsoft consoles
4. **OAuth popup doesn't open**: Check browser console for JavaScript errors

### Debug Mode

The app will show helpful error messages for OAuth configuration issues. If you see configuration errors, double-check your environment variables and OAuth app settings.

## Need Help?

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
