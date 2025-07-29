import React, { createContext, useContext, useEffect, useState } from "react";
import { useOfflineStorage } from "@/lib/offlineStorage";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  gradient: string;
  glassBg: string;
  glassHover: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  isDark: boolean;
}

const themes: Record<string, Theme> = {
  // Dark Themes
  dark_purple: {
    name: "Dark Purple",
    isDark: true,
    colors: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
      accent: "#F59E0B",
      background:
        "linear-gradient(135deg, #1a0d33 0%, #0f1419 50%, #1a0d33 100%)",
      surface: "rgba(255, 255, 255, 0.05)",
      text: "#FFFFFF",
      textSecondary: "#D1D5DB",
      border: "rgba(255, 255, 255, 0.1)",
      gradient: "from-purple-900 via-slate-900 to-purple-900",
      glassBg: "rgba(255, 255, 255, 0.1)",
      glassHover: "rgba(255, 255, 255, 0.15)",
    },
  },
  dark_blue: {
    name: "Dark Ocean",
    isDark: true,
    colors: {
      primary: "#3B82F6",
      secondary: "#06B6D4",
      accent: "#10B981",
      background:
        "linear-gradient(135deg, #0c1e3d 0%, #0f1419 50%, #1e293b 100%)",
      surface: "rgba(255, 255, 255, 0.05)",
      text: "#FFFFFF",
      textSecondary: "#CBD5E1",
      border: "rgba(255, 255, 255, 0.1)",
      gradient: "from-blue-900 via-slate-900 to-slate-800",
      glassBg: "rgba(255, 255, 255, 0.1)",
      glassHover: "rgba(255, 255, 255, 0.15)",
    },
  },
  dark_green: {
    name: "Dark Forest",
    isDark: true,
    colors: {
      primary: "#10B981",
      secondary: "#F59E0B",
      accent: "#8B5CF6",
      background:
        "linear-gradient(135deg, #0d2818 0%, #0f1419 50%, #1a2e05 100%)",
      surface: "rgba(255, 255, 255, 0.05)",
      text: "#FFFFFF",
      textSecondary: "#D1FAE5",
      border: "rgba(255, 255, 255, 0.1)",
      gradient: "from-green-900 via-slate-900 to-emerald-900",
      glassBg: "rgba(255, 255, 255, 0.1)",
      glassHover: "rgba(255, 255, 255, 0.15)",
    },
  },
  dark_orange: {
    name: "Dark Sunset",
    isDark: true,
    colors: {
      primary: "#F97316",
      secondary: "#EF4444",
      accent: "#EC4899",
      background:
        "linear-gradient(135deg, #3d1a00 0%, #0f1419 50%, #2d1b00 100%)",
      surface: "rgba(255, 255, 255, 0.05)",
      text: "#FFFFFF",
      textSecondary: "#FED7AA",
      border: "rgba(255, 255, 255, 0.1)",
      gradient: "from-orange-900 via-slate-900 to-red-900",
      glassBg: "rgba(255, 255, 255, 0.1)",
      glassHover: "rgba(255, 255, 255, 0.15)",
    },
  },
  // Light Themes
  light_purple: {
    name: "Light Purple",
    isDark: false,
    colors: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
      accent: "#F59E0B",
      background:
        "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)",
      surface: "rgba(255, 255, 255, 0.8)",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "rgba(0, 0, 0, 0.1)",
      gradient: "from-purple-50 via-violet-50 to-purple-100",
      glassBg: "rgba(255, 255, 255, 0.7)",
      glassHover: "rgba(255, 255, 255, 0.9)",
    },
  },
  light_blue: {
    name: "Light Ocean",
    isDark: false,
    colors: {
      primary: "#3B82F6",
      secondary: "#06B6D4",
      accent: "#10B981",
      background:
        "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
      surface: "rgba(255, 255, 255, 0.8)",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "rgba(0, 0, 0, 0.1)",
      gradient: "from-blue-50 via-sky-50 to-cyan-100",
      glassBg: "rgba(255, 255, 255, 0.7)",
      glassHover: "rgba(255, 255, 255, 0.9)",
    },
  },
  // Vibrant Themes
  cyberpunk: {
    name: "Cyberpunk",
    isDark: true,
    colors: {
      primary: "#FF0080",
      secondary: "#00FFFF",
      accent: "#FFFF00",
      background:
        "linear-gradient(135deg, #000000 0%, #1a0033 50%, #330066 100%)",
      surface: "rgba(255, 0, 128, 0.1)",
      text: "#FFFFFF",
      textSecondary: "#FF00FF",
      border: "rgba(255, 0, 128, 0.3)",
      gradient: "from-black via-purple-900 to-pink-900",
      glassBg: "rgba(255, 0, 128, 0.15)",
      glassHover: "rgba(255, 0, 128, 0.25)",
    },
  },
  neon_green: {
    name: "Neon Matrix",
    isDark: true,
    colors: {
      primary: "#00FF41",
      secondary: "#008F11",
      accent: "#39FF14",
      background:
        "linear-gradient(135deg, #000000 0%, #001100 50%, #002200 100%)",
      surface: "rgba(0, 255, 65, 0.1)",
      text: "#00FF41",
      textSecondary: "#00CC33",
      border: "rgba(0, 255, 65, 0.3)",
      gradient: "from-black via-green-900 to-emerald-900",
      glassBg: "rgba(0, 255, 65, 0.1)",
      glassHover: "rgba(0, 255, 65, 0.2)",
    },
  },
  retro_wave: {
    name: "Retro Wave",
    isDark: true,
    colors: {
      primary: "#FF006E",
      secondary: "#FB5607",
      accent: "#FFBE0B",
      background:
        "linear-gradient(135deg, #2d1b69 0%, #11001c 50%, #3c096c 100%)",
      surface: "rgba(255, 0, 110, 0.1)",
      text: "#FFFFFF",
      textSecondary: "#FFB3E6",
      border: "rgba(255, 0, 110, 0.3)",
      gradient: "from-purple-900 via-pink-900 to-violet-900",
      glassBg: "rgba(255, 0, 110, 0.15)",
      glassHover: "rgba(255, 0, 110, 0.25)",
    },
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  toggleDarkMode: () => void;
  availableThemes: typeof themes;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings, updateSettings } = useOfflineStorage();
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.dark_purple);

  // Load theme from settings
  useEffect(() => {
    const themeName = settings.appearance.darkMode
      ? `dark_${settings.appearance.theme}`
      : `light_${settings.appearance.theme}`;

    const theme = themes[themeName] || themes.dark_purple;
    setCurrentTheme(theme);

    // Apply theme to document root
    applyThemeToDocument(theme);
  }, [settings.appearance.theme, settings.appearance.darkMode]);

  const applyThemeToDocument = (theme: Theme) => {
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty("--theme-primary", theme.colors.primary);
    root.style.setProperty("--theme-secondary", theme.colors.secondary);
    root.style.setProperty("--theme-accent", theme.colors.accent);
    root.style.setProperty("--theme-text", theme.colors.text);
    root.style.setProperty(
      "--theme-text-secondary",
      theme.colors.textSecondary,
    );
    root.style.setProperty("--theme-surface", theme.colors.surface);
    root.style.setProperty("--theme-border", theme.colors.border);
    root.style.setProperty("--theme-glass-bg", theme.colors.glassBg);
    root.style.setProperty("--theme-glass-hover", theme.colors.glassHover);

    // Apply background
    document.body.style.background = theme.colors.background;

    // Add/remove dark class
    if (theme.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const setTheme = (themeName: string) => {
    const theme = themes[themeName];
    if (!theme) return;

    setCurrentTheme(theme);

    // Update settings based on theme
    const isLight = themeName.startsWith("light_");
    const baseTheme = themeName.replace(/^(dark_|light_)/, "");

    updateSettings({
      appearance: {
        ...settings.appearance,
        darkMode: !isLight,
        theme: baseTheme as any,
      },
    });
  };

  const toggleDarkMode = () => {
    const baseTheme = settings.appearance.theme;
    const newThemeName = settings.appearance.darkMode
      ? `light_${baseTheme}`
      : `dark_${baseTheme}`;

    // Fallback to dark_purple if light version doesn't exist
    const finalTheme = themes[newThemeName] || themes.dark_purple;
    setTheme(
      Object.keys(themes).find((key) => themes[key] === finalTheme) ||
        "dark_purple",
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        toggleDarkMode,
        availableThemes: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
