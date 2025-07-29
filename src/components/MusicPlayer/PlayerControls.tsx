import React, { useState } from "react";
import { AudioFile } from "../../hooks/useFileManager";
import { Heart, Shuffle, Repeat, MoreHorizontal, Share2 } from "lucide-react";
import { demoFunctions, notify } from "@/lib/notifications";

interface PlayerControlsProps {
  currentTrack: AudioFile | any | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onSkipForward,
  onSkipBackward,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      demoFunctions.addToFavorites();
    } else {
      demoFunctions.removeFromFavorites();
    }
  };

  const handleShuffleToggle = () => {
    setIsShuffleOn(!isShuffleOn);
    if (!isShuffleOn) {
      demoFunctions.shuffleMode();
    } else {
      notify.info("Shuffle Off", "Playing songs in order");
    }
  };

  const handleRepeatToggle = () => {
    const newMode = (repeatMode + 1) % 3;
    setRepeatMode(newMode);
    demoFunctions.repeatMode();
  };

  const handleShareTrack = () => {
    demoFunctions.shareMusic();
  };

  const handleMoreOptions = () => {
    notify.show({
      title: "Track Options",
      message:
        "• Add to playlist\n• Download for offline\n• View artist page\n• Song information",
      emoji: "⚙️",
      type: "info",
    });
  };
  if (!currentTrack) {
    const handleDemoPlay = () => {
      notify.show({
        title: "Demo Mode",
        message: "Playing demo track: 'Sonicly Theme Song' by AI Composer",
        emoji: "🎵",
        type: "info",
        action: {
          label: "Add Real Music",
          callback: () => {
            notify.info(
              "Add Music",
              "Upload your music files to start enjoying Sonicly!",
            );
          },
        },
      });
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/70 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer"
              onClick={handleDemoPlay}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            </div>
            <p className="text-white text-sm md:text-base mb-2">
              Click to try demo music
            </p>
            <p className="text-gray-400 text-xs md:text-sm">
              Upload your songs to get started with Sonicly
            </p>
          </div>
        </div>
      </div>
    );
  }
  const hasAlbumArt = isAudioFile && currentTrack.albumArt;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Progress Bar - Top */}
        <div className="mb-4">
          <div
            className="w-full h-1 bg-white/20 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              onSeek(percent * duration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all group-hover:h-1.5"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Player Content */}
        <div className="flex items-center gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Album Art */}
            <div className="relative group">
              {hasAlbumArt ? (
                <img
                  src={currentTrack.albumArt}
                  alt={`${currentTrack.title} album cover`}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover shadow-lg"
                />
              ) : (
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A3,3 0 0,0 7,16A3,3 0 0,0 10,19A3,3 0 0,0 13,16V7H17V5H12V3Z" />
                  </svg>
                </div>
              )}
              {/* Pulse effect when playing */}
              {isPlaying && (
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 animate-pulse" />
              )}
            </div>

            {/* Track Details */}
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-white font-semibold text-sm md:text-base truncate">
                {currentTrack.title}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Like Button - Hidden on small screens */}
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors group">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-400 group-hover:text-red-400 transition-colors"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Shuffle */}
            <button
              onClick={handleShuffleToggle}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                isShuffleOn
                  ? "bg-green-500 text-white"
                  : "hover:bg-white/10 text-gray-400"
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Favorite */}
            <button
              onClick={handleFavoriteToggle}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                isFavorite ? "text-red-500" : "hover:bg-white/10 text-gray-400"
              }`}
              title="Add to Favorites"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Previous/Skip Backward */}
            <button
              onClick={onSkipBackward}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white md:w-6 md:h-6"
              >
                <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={onPlayPause}
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all active:scale-95 shadow-lg"
            >
              {isPlaying ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white md:w-6 md:h-6"
                >
                  <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white md:w-6 md:h-6 ml-1"
                >
                  <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
              )}
            </button>

            {/* Next/Skip Forward */}
            <button
              onClick={onSkipForward}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white md:w-6 md:h-6"
              >
                <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
              </svg>
            </button>
          </div>

          {/* Additional Controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Repeat */}
            <button
              onClick={handleRepeatToggle}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                repeatMode > 0
                  ? "bg-green-500 text-white"
                  : "hover:bg-white/10 text-gray-400"
              }`}
              title={`Repeat ${repeatMode === 0 ? "Off" : repeatMode === 1 ? "All" : "One"}`}
            >
              <Repeat className="w-4 h-4" />
              {repeatMode === 2 && (
                <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShareTrack}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-gray-400 transition-all"
              title="Share Track"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* More Options */}
            <button
              onClick={handleMoreOptions}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-gray-400 transition-all"
              title="More Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control - Desktop Only */}
          <div className="hidden lg:flex items-center gap-3 w-32">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-400"
            >
              <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
            <div
              className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                onVolumeChange(percent);
              }}
            >
              <div
                className="h-full bg-white rounded-full transition-all group-hover:h-1.5"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          {/* Mobile Volume Button */}
          <button className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-400"
            >
              <path d="M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
