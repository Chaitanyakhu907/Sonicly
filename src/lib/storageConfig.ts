// Storage configuration - easily switch between localStorage and server storage

export type StorageMode = "localStorage" | "server";

// Configuration
export const STORAGE_CONFIG = {
  // Change this to switch storage modes
  mode: "localStorage" as StorageMode, // Change to 'server' to use the local server

  // Server configuration
  serverUrl: "http://localhost:3001/api",

  // Storage keys for localStorage mode
  localStorageKeys: {
    users: "sonicly_all_users",
    currentUser: "sonicly_current_user",
    subscriptions: "sonicly_subscriptions",
    paymentMethods: "sonicly_payment_methods",
    billingHistory: "sonicly_billing_history",
  },
};

// Helper function to get the appropriate subscription service
export const getSubscriptionService = async () => {
  if (STORAGE_CONFIG.mode === "server") {
    const { serverSubscriptionDataService } = await import(
      "./serverSubscriptionData"
    );
    return serverSubscriptionDataService;
  } else {
    const { subscriptionDataService } = await import("./subscriptionData");
    return subscriptionDataService;
  }
};

// Helper function to get the appropriate subscription hook
export const useSubscriptionService = () => {
  if (STORAGE_CONFIG.mode === "server") {
    const { useServerSubscriptionData } = require("./serverSubscriptionData");
    return useServerSubscriptionData();
  } else {
    const { useSubscriptionData } = require("./subscriptionData");
    return useSubscriptionData();
  }
};

// Function to migrate data from localStorage to server
export const migrateToServer = async (userId: string) => {
  try {
    // Get data from localStorage
    const subscriptions = JSON.parse(
      localStorage.getItem(`sonicly_subscriptions_${userId}`) || "[]",
    );
    const paymentMethods = JSON.parse(
      localStorage.getItem(`sonicly_payment_methods_${userId}`) || "[]",
    );
    const billingHistory = JSON.parse(
      localStorage.getItem(`sonicly_billing_history_${userId}`) || "[]",
    );

    // Import server service
    const { apiService } = await import("./apiService");

    // Upload data to server
    if (subscriptions.length > 0) {
      for (const sub of subscriptions) {
        await apiService.addSubscription(userId, sub);
      }
    }

    if (paymentMethods.length > 0) {
      for (const payment of paymentMethods) {
        await apiService.addPaymentMethod(userId, payment);
      }
    }

    if (billingHistory.length > 0) {
      for (const billing of billingHistory) {
        await apiService.addBillingRecord(userId, billing);
      }
    }

    console.log("✅ Data migration to server completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Data migration failed:", error);
    return false;
  }
};

// Function to check server connectivity
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const { apiService } = await import("./apiService");
    return await apiService.isServerOnline();
  } catch (error) {
    return false;
  }
};
