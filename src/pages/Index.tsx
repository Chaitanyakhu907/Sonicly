import React, { useState } from "react";
import Header from "@/components/MusicPlayer/Header";
import PlaylistTable from "@/components/MusicPlayer/PlaylistTable";
import PlayerControls from "@/components/MusicPlayer/PlayerControls";
import DiscoverySection from "@/components/MusicPlayer/DiscoverySection";
import { useFileManager } from "../hooks/useFileManager";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { UpgradePlans } from "@/components/subscription/UpgradePlans";
import { useSubscriptionData } from "@/lib/subscriptionData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { currentTheme } = useTheme();
  const { currentUser } = useAuth();
  const { subscriptions } = useSubscriptionData();
  const [showUpgradePlans, setShowUpgradePlans] = useState(false);

  // Check if user has any active premium subscription
  const hasActivePremium = subscriptions.some(
    (sub) =>
      sub.status === "active" &&
      (sub.planType === "premium" || sub.planType === "family"),
  );
  const {
    audioFiles,
    addFiles,
    removeFile,
    scanDeviceForMusic,
    isProcessing,
    isInIframe,
  } = useFileManager();
  const audioPlayer = useAudioPlayer();

  const handleFilesSelected = (files: FileList) => {
    addFiles(files);
  };

  const handleScanDevice = async () => {
    try {
      const count = await scanDeviceForMusic();
      alert(
        `🎵 Success! Found and added ${count} music files to your playlist.`,
      );
    } catch (error: any) {
      // Show user-friendly error message
      const message =
        error.message ||
        "Failed to scan device. Please try manual file selection.";
      alert(`❌ ${message}`);
    }
  };

  const handleRemoveTrack = (id: string) => {
    removeFile(id);
  };

  const handleTrackSelect = (track: any) => {
    // All tracks are now local audio files
    audioPlayer.loadTrack(track);
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-all duration-500"
      style={{
        background: currentTheme.colors.background,
        color: currentTheme.colors.text,
      }}
    >
      {/* Modern Header with glassmorphism */}
      <div
        className="backdrop-blur-lg border-b"
        style={{
          background: currentTheme.colors.glassBg,
          borderColor: currentTheme.colors.border,
        }}
      >
        <Header />
      </div>

      {/* Main Content Area with modern layout */}
      <div className="flex-1 px-4 md:px-8 pb-32 md:pb-40 mt-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
              }}
            >
              Welcome back, {currentUser?.name.split(" ")[0] || "User"}! 🎵
            </h1>
            <p
              className="text-lg"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {!hasActivePremium
                ? "Enjoying the free experience? Upgrade for unlimited music!"
                : "Ready to discover your next favorite song?"}
            </p>

            {/* Free User Upgrade Prompt */}
            {!hasActivePremium && (
              <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-1">
                      🎵 Unlock Premium Features
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      No ads • Unlimited downloads • High quality audio
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowUpgradePlans(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="discover" className="w-full">
            <TabsList
              className="grid w-full grid-cols-2 mb-8 backdrop-blur-lg border"
              style={{
                background: currentTheme.colors.surface + "aa",
                borderColor: currentTheme.colors.border,
              }}
            >
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                🎵 Discover Music
              </TabsTrigger>
              <TabsTrigger
                value="mymusic"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                📁 My Music
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover">
              <DiscoverySection
                onTrackSelect={handleTrackSelect}
                currentTrack={audioPlayer.currentTrack}
                theme={currentTheme}
              />
            </TabsContent>

            <TabsContent value="mymusic">
              <div
                className="backdrop-blur-lg rounded-2xl p-6 shadow-2xl border transition-all duration-300"
                style={{
                  background: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <PlaylistTable
                  audioFiles={audioFiles}
                  onFilesSelected={handleFilesSelected}
                  onScanDevice={handleScanDevice}
                  onRemoveTrack={handleRemoveTrack}
                  isProcessing={isProcessing}
                  isInIframe={isInIframe()}
                  onTrackSelect={handleTrackSelect}
                  currentTrack={audioPlayer.currentTrack}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modern Player Controls - Fixed at bottom with glassmorphism */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t transition-all duration-300"
        style={{
          background: currentTheme.colors.glassBg,
          borderColor: currentTheme.colors.border,
        }}
      >
        <PlayerControls
          currentTrack={audioPlayer.currentTrack}
          isPlaying={audioPlayer.isPlaying}
          currentTime={audioPlayer.currentTime}
          duration={audioPlayer.duration}
          volume={audioPlayer.volume}
          onPlayPause={audioPlayer.togglePlayPause}
          onSeek={audioPlayer.seek}
          onVolumeChange={audioPlayer.setVolume}
          onSkipForward={audioPlayer.skipForward}
          onSkipBackward={audioPlayer.skipBackward}
        />
      </div>

      {/* Upgrade Plans Modal */}
      <UpgradePlans
        isOpen={showUpgradePlans}
        onClose={() => setShowUpgradePlans(false)}
        currentPlan={hasActivePremium ? "premium" : "free"}
      />
    </div>
  );
};

export default Index;
