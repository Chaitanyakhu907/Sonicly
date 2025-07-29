import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  plan: "free" | "premium" | "family";
  favoriteGenres: string[];
  stats: {
    songsPlayed: number;
    favorites: number;
    hoursListened: number;
    streakDays: number;
  };
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  socialLogin: (
    provider: "google" | "microsoft",
    userData: any,
  ) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock user database
const mockUsers: User[] = [
  {
    id: "user_1",
    name: "Chaitanya Khubele",
    email: "chaitanya@sonicly.app",
    avatar: "🎵",
    bio: "Music enthusiast | Love discovering new genres | Currently obsessed with lo-fi beats",
    location: "Mumbai, India",
    joinDate: "2023-01-15",
    plan: "premium",
    favoriteGenres: ["Electronic", "Jazz", "Lo-fi", "Classical"],
    stats: {
      songsPlayed: 2847,
      favorites: 342,
      hoursListened: 156,
      streakDays: 23,
    },
  },
  {
    id: "user_2",
    name: "Rahul Sharma",
    email: "rahul@sonicly.app",
    avatar: "🎧",
    bio: "Bollywood music lover | DJ in the weekends | Always hunting for the next beat drop",
    location: "Delhi, India",
    joinDate: "2023-03-20",
    plan: "family",
    favoriteGenres: ["Bollywood", "Hip-Hop", "EDM", "Pop"],
    stats: {
      songsPlayed: 4521,
      favorites: 678,
      hoursListened: 289,
      streakDays: 45,
    },
  },
  {
    id: "user_3",
    name: "Priya Patel",
    email: "priya@sonicly.app",
    avatar: "🎤",
    bio: "Singer-songwriter | Classical music trained | Loves indie and acoustic vibes",
    location: "Bangalore, India",
    joinDate: "2023-06-10",
    plan: "free",
    favoriteGenres: ["Classical", "Indie", "Acoustic", "Folk"],
    stats: {
      songsPlayed: 1234,
      favorites: 156,
      hoursListened: 78,
      streakDays: 12,
    },
  },
  {
    id: "user_4",
    name: "Arjun Kumar",
    email: "arjun@sonicly.app",
    avatar: "🎸",
    bio: "Rock music fanatic | Guitar player | Weekend concert goer",
    location: "Chennai, India",
    joinDate: "2023-08-05",
    plan: "premium",
    favoriteGenres: ["Rock", "Metal", "Alternative", "Punk"],
    stats: {
      songsPlayed: 3456,
      favorites: 445,
      hoursListened: 198,
      streakDays: 31,
    },
  },
  {
    id: "user_5",
    name: "Neha Singh",
    email: "neha@sonicly.app",
    avatar: "🎹",
    bio: "Piano teacher | Jazz enthusiast | Loves smooth melodies and complex harmonies",
    location: "Pune, India",
    joinDate: "2023-09-12",
    plan: "family",
    favoriteGenres: ["Jazz", "Blues", "Fusion", "Contemporary"],
    stats: {
      songsPlayed: 1987,
      favorites: 234,
      hoursListened: 134,
      streakDays: 18,
    },
  },
];

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);

  // Load user from localStorage on mount
  useEffect(() => {
    // Load all users from storage
    const savedUsers = localStorage.getItem("sonicly_all_users");
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        setAllUsers(parsedUsers);

        // Load current user
        const savedUserId = localStorage.getItem("sonicly_current_user");
        if (savedUserId) {
          const user = parsedUsers.find((u: User) => u.id === savedUserId);
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            // Invalid user ID, clear it
            localStorage.removeItem("sonicly_current_user");
          }
        }
      } catch (error) {
        console.error("Failed to load users from storage:", error);
        setAllUsers(mockUsers);
      }
    } else {
      // First time, save default users
      localStorage.setItem("sonicly_all_users", JSON.stringify(mockUsers));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user by email (password is ignored for demo)
    const user = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("sonicly_current_user", user.id);
      localStorage.setItem("sonicly_all_users", JSON.stringify(allUsers));

      // Clear previous user data to avoid conflicts
      const keysToRemove = [
        "sonicly_profile",
        "sonicly_settings",
        "sonicly_account",
        "sonicly_subscriptions",
        "sonicly_payment_methods",
        "sonicly_billing_history",
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      return true;
    }

    return false;
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if user already exists
    const existingUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user with clean free plan - no premium features
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      avatar: name.charAt(0).toUpperCase(),
      bio: "New music lover | Just joined Sonicly",
      location: "India",
      joinDate: new Date().toISOString().split("T")[0],
      plan: "free", // Always start with free
      favoriteGenres: [],
      stats: {
        songsPlayed: 0,
        favorites: 0,
        hoursListened: 0,
        streakDays: 0,
      },
    };

    // Add to users list
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem("sonicly_all_users", JSON.stringify(updatedUsers));

    // Clear any existing subscription/payment data for clean start
    const userDataKeys = [
      `sonicly_subscriptions_${newUser.id}`,
      `sonicly_payment_methods_${newUser.id}`,
      `sonicly_billing_history_${newUser.id}`,
    ];
    userDataKeys.forEach((key) => localStorage.removeItem(key));

    // Login the new user
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("sonicly_current_user", newUser.id);

    return true;
  };

  const socialLogin = async (
    provider: "google" | "microsoft",
    userData: any,
  ): Promise<boolean> => {
    const { name, email, picture } = userData;

    // Check if user already exists
    let user = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      // Create new user from social login with clean free account
      user = {
        id: `user_${provider}_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        avatar: picture || name.charAt(0).toUpperCase(),
        bio: `Music lover | Joined via ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        location: "India",
        joinDate: new Date().toISOString().split("T")[0],
        plan: "free", // Always start with free - no premium
        favoriteGenres: [],
        stats: {
          songsPlayed: 0,
          favorites: 0,
          hoursListened: 0,
          streakDays: 0,
        },
      };

      // Add to users list
      const updatedUsers = [...allUsers, user];
      setAllUsers(updatedUsers);
      localStorage.setItem("sonicly_all_users", JSON.stringify(updatedUsers));

      // Clear any existing subscription/payment data for clean start
      const userDataKeys = [
        `sonicly_subscriptions_${user.id}`,
        `sonicly_payment_methods_${user.id}`,
        `sonicly_billing_history_${user.id}`,
      ];
      userDataKeys.forEach((key) => localStorage.removeItem(key));
    }

    // Login the user
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("sonicly_current_user", user.id);

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("sonicly_current_user");

    // Clear all user-specific data
    const keysToRemove = [
      "sonicly_profile",
      "sonicly_settings",
      "sonicly_account",
      "sonicly_subscriptions",
      "sonicly_payment_methods",
      "sonicly_billing_history",
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("sonicly_current_user", user.id);

      // Clear previous user data including user-specific subscription data
      const keysToRemove = [
        "sonicly_profile",
        "sonicly_settings",
        "sonicly_account",
        "sonicly_subscriptions",
        "sonicly_payment_methods",
        "sonicly_billing_history",
        // Also clear user-specific data
        `sonicly_subscriptions_${userId}`,
        `sonicly_payment_methods_${userId}`,
        `sonicly_billing_history_${userId}`,
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // For new users (non-demo users), ensure they start with completely clean data
      const existingDemoUsers = [
        "user_1",
        "user_2",
        "user_3",
        "user_4",
        "user_5",
      ];
      if (!existingDemoUsers.includes(userId)) {
        // New user - ensure clean state
        const userSpecificKeys = [
          `sonicly_subscriptions_${userId}`,
          `sonicly_payment_methods_${userId}`,
          `sonicly_billing_history_${userId}`,
        ];
        userSpecificKeys.forEach((key) => localStorage.removeItem(key));
      }

      // Force page reload to reinitialize all data
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users: allUsers,
        login,
        signUp,
        socialLogin,
        logout,
        switchUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
