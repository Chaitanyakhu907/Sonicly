import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Volume2,
  Shield,
  Bell,
  Keyboard,
  Sliders,
  Palette,
  Music,
  Headphones,
  Zap,
  Eye,
  RotateCcw,
  Download,
  Upload,
  Monitor,
  Smartphone,
  Waves,
  Disc,
  Radio,
  Speaker,
  Equalizer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useOfflineStorage, storage } from "@/lib/offlineStorage";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useOfflineStorage();
  const { currentTheme, setTheme, toggleDarkMode, availableThemes } =
    useTheme();

  // Destructure settings for easier access
  const { appearance, audio, notifications, keyboard, privacy } = settings;

  const handleVolumeChange = (value: number[]) => {
    updateSettings({
      audio: { ...audio, masterVolume: value[0] },
    });
  };

  const handleEqualizerChange = (
    type: "bass" | "mid" | "treble",
    value: number[],
  ) => {
    updateSettings({
      audio: {
        ...audio,
        equalizer: { ...audio.equalizer, [type]: value[0] },
      },
    });
  };

  const handleKeyboardShortcutToggle = (
    key: keyof typeof keyboard,
    value: boolean,
  ) => {
    updateSettings({
      keyboard: { ...keyboard, [key]: value },
    });
  };

  // Equalizer presets
  const equalizerPresets = {
    flat: { bass: 0, mid: 0, treble: 0 },
    rock: { bass: 4, mid: -2, treble: 3 },
    jazz: { bass: 2, mid: 1, treble: 2 },
    classical: { bass: -1, mid: 2, treble: 3 },
    electronic: { bass: 5, mid: -1, treble: 4 },
    hiphop: { bass: 6, mid: 1, treble: 2 },
    vocal: { bass: -2, mid: 4, treble: 2 },
    bass_boost: { bass: 8, mid: 0, treble: 0 },
  };

  const applyEqualizerPreset = (preset: keyof typeof equalizerPresets) => {
    const presetValues = equalizerPresets[preset];
    updateSettings({
      audio: {
        ...audio,
        equalizer: { ...audio.equalizer, ...presetValues },
      },
    });
  };

  // Group themes by category
  const themeCategories = {
    dark: Object.entries(availableThemes)
      .filter(([key]) => key.startsWith("dark_"))
      .map(([key, theme]) => ({ key, ...theme })),
    light: Object.entries(availableThemes)
      .filter(([key]) => key.startsWith("light_"))
      .map(([key, theme]) => ({ key, ...theme })),
    vibrant: Object.entries(availableThemes)
      .filter(([key]) => !key.startsWith("dark_") && !key.startsWith("light_"))
      .map(([key, theme]) => ({ key, ...theme })),
  };

  // Advanced audio settings
  const audioFormats = ["MP3", "FLAC", "AAC", "OGG", "WAV"];
  const sampleRates = ["44.1 kHz", "48 kHz", "96 kHz", "192 kHz"];
  const bitDepths = ["16-bit", "24-bit", "32-bit"];

  // Export/Import settings
  const exportSettings = () => {
    const settingsBlob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(settingsBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sonicly-settings.json";
    a.click();
    URL.revokeObjectURL(url);
    alert("⬇️ Settings exported successfully!");
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          updateSettings(importedSettings);
          alert("⬆️ Settings imported successfully!");
        } catch (error) {
          alert("❌ Invalid settings file!");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetAll = () => {
    const confirmReset = confirm(
      "⚠️ This will reset all settings to default values. Are you sure?",
    );
    if (confirmReset) {
      storage.clearAll();
      alert("🔄 All settings have been reset to defaults!");
      window.location.reload();
    }
  };

  const handleBackupData = () => {
    const allData = {
      settings,
      profile: JSON.parse(localStorage.getItem("sonicly_profile") || "{}"),
      account: JSON.parse(localStorage.getItem("sonicly_account") || "{}"),
      timestamp: new Date().toISOString(),
    };
    const backupBlob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(backupBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sonicly-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("💾 Complete data backup created!");
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!keyboard.spacebar && event.code === "Space") return;
      if (
        !keyboard.arrowKeys &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)
      )
        return;

      // Prevent default for handled keys
      if (
        ["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
          event.code,
        )
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keyboard]);

  return (
    <div
      className="min-h-screen transition-all duration-500"
      style={{ background: currentTheme.colors.background }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 backdrop-blur-lg border-b"
        style={{
          background: currentTheme.colors.glassBg,
          borderColor: currentTheme.colors.border,
        }}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-white/20"
            style={{ color: currentTheme.colors.text }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1
            className="text-2xl font-bold"
            style={{ color: currentTheme.colors.text }}
          >
            Settings
          </h1>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Offline Mode
        </Badge>
      </div>

      {/* Content with Tabs */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-lg border border-white/20">
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-white/20"
            >
              <Palette className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="audio"
              className="data-[state=active]:bg-white/20"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Audio</span>
            </TabsTrigger>
            <TabsTrigger
              value="equalizer"
              className="data-[state=active]:bg-white/20"
            >
              <Sliders className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Equalizer</span>
            </TabsTrigger>
            <TabsTrigger
              value="controls"
              className="data-[state=active]:bg-white/20"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Controls</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-white/20"
            >
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-white/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme Customization
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Customize how Sonicly looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={currentTheme.isDark}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="font-medium">Current Theme</p>
                    <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-white/20"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                          }}
                        />
                        <div>
                          <p className="font-medium text-white">
                            {currentTheme.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {currentTheme.isDark ? "Dark Theme" : "Light Theme"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dark Themes */}
                  <div className="space-y-3">
                    <p className="font-medium">Dark Themes</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {themeCategories.dark.map((theme) => (
                        <button
                          key={theme.key}
                          onClick={() => setTheme(theme.key)}
                          className={`relative p-3 rounded-lg transition-all ${
                            currentTheme.name === theme.name
                              ? "ring-2 ring-white scale-105"
                              : "hover:scale-102"
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                          }}
                        >
                          <div className="text-white font-medium text-sm">
                            {theme.name}
                          </div>
                          {currentTheme.name === theme.name && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Light Themes */}
                  <div className="space-y-3">
                    <p className="font-medium">Light Themes</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {themeCategories.light.map((theme) => (
                        <button
                          key={theme.key}
                          onClick={() => setTheme(theme.key)}
                          className={`relative p-3 rounded-lg transition-all border ${
                            currentTheme.name === theme.name
                              ? "ring-2 ring-blue-500 scale-105"
                              : "hover:scale-102 border-gray-300"
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20)`,
                            color: theme.colors.text,
                          }}
                        >
                          <div className="font-medium text-sm">
                            {theme.name}
                          </div>
                          {currentTheme.name === theme.name && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vibrant Themes */}
                  <div className="space-y-3">
                    <p className="font-medium">Vibrant Themes</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {themeCategories.vibrant.map((theme) => (
                        <button
                          key={theme.key}
                          onClick={() => setTheme(theme.key)}
                          className={`relative p-3 rounded-lg transition-all ${
                            currentTheme.name === theme.name
                              ? "ring-2 ring-yellow-500 scale-105"
                              : "hover:scale-102"
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                          }}
                        >
                          <div className="text-white font-medium text-sm">
                            {theme.name}
                          </div>
                          {currentTheme.name === theme.name && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Visual Effects</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Glassmorphism Effects</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Animated Backgrounds</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Smooth Transitions</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Audio Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure your audio experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Master Volume</p>
                    <span className="text-sm text-gray-400">
                      {audio.masterVolume}%
                    </span>
                  </div>
                  <Slider
                    value={[audio.masterVolume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Auto Play</p>
                        <p className="text-xs text-gray-400">
                          Continue to next song
                        </p>
                      </div>
                      <Switch
                        checked={audio.autoPlay}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            audio: { ...audio, autoPlay: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Crossfade</p>
                        <p className="text-xs text-gray-400">
                          Smooth transitions
                        </p>
                      </div>
                      <Switch
                        checked={audio.crossfade}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            audio: { ...audio, crossfade: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Gapless Playback</p>
                        <p className="text-xs text-gray-400">
                          No gaps between tracks
                        </p>
                      </div>
                      <Switch
                        checked={audio.gaplessPlayback}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            audio: { ...audio, gaplessPlayback: checked },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="font-medium">Audio Quality</p>
                      <Select
                        value={audio.audioQuality}
                        onValueChange={(value) =>
                          updateSettings({
                            audio: { ...audio, audioQuality: value as any },
                          })
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (96 kbps)</SelectItem>
                          <SelectItem value="medium">
                            Medium (160 kbps)
                          </SelectItem>
                          <SelectItem value="high">High (320 kbps)</SelectItem>
                          <SelectItem value="lossless">Lossless</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Supported Formats</p>
                      <div className="flex flex-wrap gap-2">
                        {audioFormats.map((format) => (
                          <Badge
                            key={format}
                            variant="outline"
                            className="text-white border-white/20"
                          >
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equalizer Tab */}
          <TabsContent value="equalizer" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  Advanced Equalizer
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Fine-tune your audio with presets and custom settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Enable Equalizer</p>
                    <p className="text-sm text-gray-400">
                      Adjust frequency levels for optimal sound
                    </p>
                  </div>
                  <Switch
                    checked={audio.equalizer.enabled}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        audio: {
                          ...audio,
                          equalizer: { ...audio.equalizer, enabled: checked },
                        },
                      })
                    }
                  />
                </div>

                {audio.equalizer.enabled && (
                  <>
                    <div className="space-y-4">
                      <p className="font-medium">Equalizer Presets</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(equalizerPresets).map(
                          ([key, preset]) => (
                            <Button
                              key={key}
                              variant="outline"
                              size="sm"
                              onClick={() => applyEqualizerPreset(key as any)}
                              className="text-white border-white/20 hover:bg-white/10 capitalize"
                            >
                              {key.replace("_", " ")}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-medium">Manual Adjustment</p>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Bass</p>
                            <span className="text-xs text-gray-400">
                              {audio.equalizer.bass > 0 ? "+" : ""}
                              {audio.equalizer.bass}dB
                            </span>
                          </div>
                          <Slider
                            value={[audio.equalizer.bass]}
                            onValueChange={(value) =>
                              handleEqualizerChange("bass", value)
                            }
                            min={-10}
                            max={10}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Mid</p>
                            <span className="text-xs text-gray-400">
                              {audio.equalizer.mid > 0 ? "+" : ""}
                              {audio.equalizer.mid}dB
                            </span>
                          </div>
                          <Slider
                            value={[audio.equalizer.mid]}
                            onValueChange={(value) =>
                              handleEqualizerChange("mid", value)
                            }
                            min={-10}
                            max={10}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Treble</p>
                            <span className="text-xs text-gray-400">
                              {audio.equalizer.treble > 0 ? "+" : ""}
                              {audio.equalizer.treble}dB
                            </span>
                          </div>
                          <Slider
                            value={[audio.equalizer.treble]}
                            onValueChange={(value) =>
                              handleEqualizerChange("treble", value)
                            }
                            min={-10}
                            max={10}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-medium">Audio Enhancements</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Bass Boost</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Virtual Surround</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Vocal Enhancement</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Noise Reduction</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  Keyboard & Controls
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Customize keyboard shortcuts and controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Spacebar Play/Pause</p>
                      <p className="text-sm text-gray-400">
                        Press spacebar to play or pause
                      </p>
                    </div>
                    <Switch
                      checked={keyboard.spacebar}
                      onCheckedChange={(checked) =>
                        handleKeyboardShortcutToggle("spacebar", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Arrow Key Navigation</p>
                      <p className="text-sm text-gray-400">
                        Left/Right for prev/next, Up/Down for volume
                      </p>
                    </div>
                    <Switch
                      checked={keyboard.arrowKeys}
                      onCheckedChange={(checked) =>
                        handleKeyboardShortcutToggle("arrowKeys", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Volume Keys</p>
                      <p className="text-sm text-gray-400">
                        Use volume up/down keys
                      </p>
                    </div>
                    <Switch
                      checked={keyboard.volumeKeys}
                      onCheckedChange={(checked) =>
                        handleKeyboardShortcutToggle("volumeKeys", checked)
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h4 className="font-medium mb-3">Active Shortcuts:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {keyboard.spacebar && (
                      <div className="flex items-center justify-between text-sm p-2 bg-white/5 rounded">
                        <span>Play/Pause</span>
                        <Badge
                          variant="outline"
                          className="text-white border-white/20"
                        >
                          Space
                        </Badge>
                      </div>
                    )}
                    {keyboard.arrowKeys && (
                      <>
                        <div className="flex items-center justify-between text-sm p-2 bg-white/5 rounded">
                          <span>Previous</span>
                          <Badge
                            variant="outline"
                            className="text-white border-white/20"
                          >
                            ←
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 bg-white/5 rounded">
                          <span>Next</span>
                          <Badge
                            variant="outline"
                            className="text-white border-white/20"
                          >
                            →
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 bg-white/5 rounded">
                          <span>Volume Up</span>
                          <Badge
                            variant="outline"
                            className="text-white border-white/20"
                          >
                            ↑
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 bg-white/5 rounded">
                          <span>Volume Down</span>
                          <Badge
                            variant="outline"
                            className="text-white border-white/20"
                          >
                            ↓
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Additional Controls</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mouse Wheel Volume</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Click to Seek</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Gesture Controls</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Double-click Fullscreen</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications & Alerts
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage notification preferences and sound alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-400">
                        Get notified about new releases and updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          notifications: {
                            ...notifications,
                            pushNotifications: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Email Updates</p>
                      <p className="text-sm text-gray-400">
                        Receive weekly music recommendations
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          notifications: {
                            ...notifications,
                            emailUpdates: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Sound Effects</p>
                      <p className="text-sm text-gray-400">
                        Play sounds for UI interactions
                      </p>
                    </div>
                    <Switch
                      checked={notifications.soundEffects}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          notifications: {
                            ...notifications,
                            soundEffects: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Now Playing Notifications</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show on Lock Screen</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Album Art</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progress Bar</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Control Buttons</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Performance, privacy, and data management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="font-medium">Privacy & Data</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Analytics</p>
                        <p className="text-xs text-gray-400">
                          Help improve Sonicly with usage data
                        </p>
                      </div>
                      <Switch
                        checked={privacy.analytics}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            privacy: { ...privacy, analytics: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Crash Reports</p>
                        <p className="text-xs text-gray-400">
                          Send crash reports to help fix bugs
                        </p>
                      </div>
                      <Switch
                        checked={privacy.crashReports}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            privacy: { ...privacy, crashReports: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Performance</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hardware Acceleration</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Background Processing</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Memory Optimization</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Preload Next Track</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Data Management</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={exportSettings}
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Settings
                    </Button>
                    <label className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSettings}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        className="w-full text-white border-white/20 hover:bg-white/10"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Settings
                      </Button>
                    </label>
                    <Button
                      variant="outline"
                      onClick={handleResetAll}
                      className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleBackupData}
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Backup Data
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Developer Options</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Debug Mode</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Console Logging</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Performance Monitor</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audio Analysis</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
