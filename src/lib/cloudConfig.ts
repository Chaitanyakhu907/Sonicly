// Cloud configuration for accessing server from anywhere

export const CLOUD_CONFIG = {
  // Set this to your deployed server URL
  serverUrl: "https://your-server-name.fly.dev/api", // Update this with your actual server URL

  // Fallback to localhost for development
  localServerUrl: "http://localhost:3001/api",

  // Auto-detect environment
  getApiUrl: () => {
    // If we're in production (deployed app), use cloud server
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return CLOUD_CONFIG.serverUrl;
    }
    // If we're in development, try local server first, then cloud
    return CLOUD_CONFIG.localServerUrl;
  },

  // Check if we should use cloud storage
  useCloudStorage: () => {
    // Use cloud storage if we're accessing from deployed URL
    return (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    );
  },
};

// Update API service to use cloud configuration
export const getApiBaseUrl = (): string => {
  if (CLOUD_CONFIG.useCloudStorage()) {
    return CLOUD_CONFIG.serverUrl;
  }
  return CLOUD_CONFIG.localServerUrl;
};
