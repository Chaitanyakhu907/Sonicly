// Offline storage utilities for real-time profile and settings management

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  favoriteGenres: string[];
  avatar?: string;
  stats: {
    songsPlayed: number;
    favorites: number;
    hoursListened: number;
    streakDays: number;
  };
  recentActivity: {
    song: string;
    artist: string;
    genre: string;
    timestamp: number;
  }[];
}

export interface AppSettings {
  appearance: {
    darkMode: boolean;
    theme: "purple" | "blue" | "green" | "orange";
  };
  audio: {
    masterVolume: number;
    autoPlay: boolean;
    audioQuality: "low" | "medium" | "high" | "lossless";
    equalizer: {
      bass: number;
      mid: number;
      treble: number;
      enabled: boolean;
    };
    crossfade: boolean;
    gaplessPlayback: boolean;
  };
  notifications: {
    pushNotifications: boolean;
    emailUpdates: boolean;
    soundEffects: boolean;
  };
  keyboard: {
    spacebar: boolean; // Play/pause
    arrowKeys: boolean; // Navigation
    volumeKeys: boolean; // Volume control
    shortcuts: Record<string, string>;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
    personalizedAds: boolean;
  };
}

export interface AccountInfo {
  subscription: {
    plan: "free" | "premium" | "family";
    status: "active" | "cancelled" | "expired";
    nextBilling?: string;
    price?: string;
    features: string[];
  };
  paymentMethods: {
    type: string;
    last4?: string;
    id?: string;
    brand?: string;
    isDefault: boolean;
  }[];
  usage: {
    storageUsed: number;
    storageLimit: number;
    downloadsThisMonth: number;
    downloadLimit: number;
  };
}

// Default data
const defaultProfile: UserProfile = {
  name: "Chaitanya Khubele",
  email: "chaitanya@sonicly.app",
  bio: "Music enthusiast | Love discovering new genres | Currently obsessed with lo-fi beats",
  location: "Mumbai, India",
  favoriteGenres: ["Electronic", "Jazz", "Lo-fi", "Classical"],
  stats: {
    songsPlayed: 2847,
    favorites: 342,
    hoursListened: 156,
    streakDays: 23,
  },
  recentActivity: [
    {
      song: "Midnight City",
      artist: "M83",
      genre: "Electronic",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      song: "Take Five",
      artist: "Dave Brubeck",
      genre: "Jazz",
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
    },
    {
      song: "River Flows in You",
      artist: "Yiruma",
      genre: "Classical",
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      song: "Coffee for Your Head",
      artist: "Powfu",
      genre: "Lo-fi",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
  ],
};

const defaultSettings: AppSettings = {
  appearance: {
    darkMode: true,
    theme: "purple",
  },
  audio: {
    masterVolume: 75,
    autoPlay: true,
    audioQuality: "high",
    equalizer: {
      bass: 0,
      mid: 0,
      treble: 0,
      enabled: false,
    },
    crossfade: false,
    gaplessPlayback: true,
  },
  notifications: {
    pushNotifications: true,
    emailUpdates: false,
    soundEffects: true,
  },
  keyboard: {
    spacebar: true,
    arrowKeys: true,
    volumeKeys: true,
    shortcuts: {
      space: "play-pause",
      arrowleft: "previous",
      arrowright: "next",
      arrowup: "volume-up",
      arrowdown: "volume-down",
    },
  },
  privacy: {
    analytics: true,
    crashReports: true,
    personalizedAds: false,
  },
};

const defaultAccount: AccountInfo = {
  subscription: {
    plan: "premium",
    status: "active",
    nextBilling: "March 15, 2024",
    price: "₹199/month",
    features: [
      "Unlimited song downloads",
      "High quality audio (320kbps)",
      "No advertisements",
      "Offline listening",
      "Premium playlists",
    ],
  },
  paymentMethods: [
    { type: "Credit Card", last4: "4567", brand: "Visa", isDefault: true },
    { type: "UPI", id: "chaitanya@paytm", isDefault: false },
  ],
  usage: {
    storageUsed: 2.4,
    storageLimit: 10,
    downloadsThisMonth: 45,
    downloadLimit: 100,
  },
};

// Storage keys
const STORAGE_KEYS = {
  PROFILE: "sonicly_profile",
  SETTINGS: "sonicly_settings",
  ACCOUNT: "sonicly_account",
} as const;

// Utility functions
export const storage = {
  // Profile management
  getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      // Trigger custom event for real-time updates
      window.dispatchEvent(
        new CustomEvent("profileUpdated", { detail: profile }),
      );
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  },

  updateProfile(updates: Partial<UserProfile>): void {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    this.saveProfile(updated);
  },

  // Settings management
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored
        ? { ...defaultSettings, ...JSON.parse(stored) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      window.dispatchEvent(
        new CustomEvent("settingsUpdated", { detail: settings }),
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  },

  updateSettings(updates: Partial<AppSettings>): void {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    this.saveSettings(updated);
  },

  // Account management
  getAccount(): AccountInfo {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
      return stored ? JSON.parse(stored) : defaultAccount;
    } catch {
      return defaultAccount;
    }
  },

  saveAccount(account: AccountInfo): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(account));
      window.dispatchEvent(
        new CustomEvent("accountUpdated", { detail: account }),
      );
    } catch (error) {
      console.error("Failed to save account:", error);
    }
  },

  updateAccount(updates: Partial<AccountInfo>): void {
    const current = this.getAccount();
    const updated = { ...current, ...updates };
    this.saveAccount(updated);
  },

  // Clear all data
  clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      window.dispatchEvent(new CustomEvent("dataCleared"));
    } catch (error) {
      console.error("Failed to clear data:", error);
    }
  },

  // Add listening activity
  addActivity(song: string, artist: string, genre: string): void {
    const profile = this.getProfile();
    const newActivity = {
      song,
      artist,
      genre,
      timestamp: Date.now(),
    };

    profile.recentActivity = [
      newActivity,
      ...profile.recentActivity.slice(0, 9),
    ];
    profile.stats.songsPlayed += 1;

    this.saveProfile(profile);
  },

  // Update listening stats
  updateStats(updates: Partial<UserProfile["stats"]>): void {
    const profile = this.getProfile();
    profile.stats = { ...profile.stats, ...updates };
    this.saveProfile(profile);
  },
};

// React hook for real-time updates
export const useOfflineStorage = () => {
  const [profile, setProfile] = React.useState<UserProfile>(
    storage.getProfile(),
  );
  const [settings, setSettings] = React.useState<AppSettings>(
    storage.getSettings(),
  );
  const [account, setAccount] = React.useState<AccountInfo>(
    storage.getAccount(),
  );

  React.useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      setProfile(event.detail);
    };

    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings(event.detail);
    };

    const handleAccountUpdate = (event: CustomEvent) => {
      setAccount(event.detail);
    };

    const handleDataCleared = () => {
      setProfile(storage.getProfile());
      setSettings(storage.getSettings());
      setAccount(storage.getAccount());
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate as EventListener,
    );
    window.addEventListener(
      "settingsUpdated",
      handleSettingsUpdate as EventListener,
    );
    window.addEventListener(
      "accountUpdated",
      handleAccountUpdate as EventListener,
    );
    window.addEventListener("dataCleared", handleDataCleared);

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate as EventListener,
      );
      window.removeEventListener(
        "settingsUpdated",
        handleSettingsUpdate as EventListener,
      );
      window.removeEventListener(
        "accountUpdated",
        handleAccountUpdate as EventListener,
      );
      window.removeEventListener("dataCleared", handleDataCleared);
    };
  }, []);

  return {
    profile,
    settings,
    account,
    updateProfile: (updates: Partial<UserProfile>) =>
      storage.updateProfile(updates),
    updateSettings: (updates: Partial<AppSettings>) =>
      storage.updateSettings(updates),
    updateAccount: (updates: Partial<AccountInfo>) =>
      storage.updateAccount(updates),
    addActivity: (song: string, artist: string, genre: string) =>
      storage.addActivity(song, artist, genre),
    updateStats: (updates: Partial<UserProfile["stats"]>) =>
      storage.updateStats(updates),
    clearAll: () => storage.clearAll(),
  };
};

// Import React for the hook
import React from "react";
