import { PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration for Microsoft OAuth
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export interface OAuthUserData {
  name: string;
  email: string;
  picture?: string;
}

// Google OAuth
export const initializeGoogleOAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google OAuth can only be used in browser environment'));
      return;
    }

    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait a bit for the library to fully initialize
      setTimeout(resolve, 100);
    };
    script.onerror = () => reject(new Error('Failed to load Google OAuth script'));
    document.head.appendChild(script);
  });
};

export const signInWithGoogle = (): Promise<OAuthUserData> => {
  return new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      reject(new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.'));
      return;
    }

    if (!window.google) {
      reject(new Error('Google OAuth not initialized'));
      return;
    }

    // Use OAuth2 popup flow instead of FedCM to avoid permissions issues
    window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: async (response: any) => {
        try {
          if (response.access_token) {
            // Fetch user info using the access token
            const userInfoResponse = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`
            );
            const userInfo = await userInfoResponse.json();

            const userData: OAuthUserData = {
              name: userInfo.name,
              email: userInfo.email,
              picture: userInfo.picture,
            };

            resolve(userData);
          } else {
            reject(new Error('No access token received from Google'));
          }
        } catch (error) {
          reject(new Error('Failed to fetch user information from Google'));
        }
      },
      error_callback: (error: any) => {
        reject(new Error('Google OAuth failed: ' + (error.type || 'Unknown error')));
      }
    }).requestAccessToken();
  });
};

// Microsoft OAuth
export const initializeMicrosoftOAuth = async (): Promise<void> => {
  try {
    await msalInstance.initialize();
  } catch (error) {
    throw new Error('Failed to initialize Microsoft OAuth');
  }
};

export const signInWithMicrosoft = async (): Promise<OAuthUserData> => {
  try {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;

    if (!clientId) {
      throw new Error('Microsoft Client ID not configured. Please set VITE_MICROSOFT_CLIENT_ID environment variable.');
    }

    const loginRequest = {
      scopes: ['openid', 'profile', 'email'],
      prompt: 'select_account',
    };

    const result = await msalInstance.loginPopup(loginRequest);

    if (result.account) {
      const userData: OAuthUserData = {
        name: result.account.name || 'Microsoft User',
        email: result.account.username,
        picture: undefined, // Microsoft doesn't provide profile picture in basic scope
      };

      return userData;
    } else {
      throw new Error('No account information received from Microsoft');
    }
  } catch (error: any) {
    if (error.name === 'BrowserAuthError' && error.errorCode === 'popup_window_error') {
      throw new Error('Popup was blocked. Please allow popups for this site and try again.');
    }
    throw new Error(error.message || 'Microsoft authentication failed');
  }
};

// Generic OAuth handler
export const handleOAuthLogin = async (provider: 'google' | 'microsoft'): Promise<OAuthUserData> => {
  try {
    switch (provider) {
      case 'google':
        await initializeGoogleOAuth();
        return await signInWithGoogle();
      case 'microsoft':
        await initializeMicrosoftOAuth();
        return await signInWithMicrosoft();
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  } catch (error: any) {
    throw new Error(error.message || `${provider} authentication failed`);
  }
};

// Type declarations for Google OAuth
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}
