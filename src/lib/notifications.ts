// Enhanced notification system for Sonicly

export interface NotificationOptions {
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  emoji?: string;
  action?: {
    label: string;
    callback: () => void;
  };
}

export class NotificationManager {
  private static instance: NotificationManager;
  private notifications: NotificationOptions[] = [];

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Enhanced alert with emoji and styling
  show(options: NotificationOptions): void {
    const { title, message, type = "info", emoji, action } = options;

    const emojiMap = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    const finalEmoji = emoji || emojiMap[type];
    let fullMessage = `${finalEmoji} ${title}\n\n${message}`;

    if (action) {
      fullMessage += `\n\n[${action.label}]`;
    }

    // For now, use enhanced alert (in real app, would use toast library)
    const result = confirm(fullMessage);

    if (result && action) {
      action.callback();
    }
  }

  // Quick notification methods
  success(
    title: string,
    message: string,
    action?: NotificationOptions["action"],
  ): void {
    this.show({ title, message, type: "success", action });
  }

  error(
    title: string,
    message: string,
    action?: NotificationOptions["action"],
  ): void {
    this.show({ title, message, type: "error", action });
  }

  warning(
    title: string,
    message: string,
    action?: NotificationOptions["action"],
  ): void {
    this.show({ title, message, type: "warning", action });
  }

  info(
    title: string,
    message: string,
    action?: NotificationOptions["action"],
  ): void {
    this.show({ title, message, type: "info", action });
  }

  // Music-specific notifications
  nowPlaying(songName: string, artist: string): void {
    this.show({
      title: "Now Playing",
      message: `${songName}\nby ${artist}`,
      emoji: "🎵",
      type: "info",
    });
  }

  playlistUpdated(action: string, count?: number): void {
    const messages = {
      added: `${count} song${count !== 1 ? "s" : ""} added to playlist`,
      removed: "Song removed from playlist",
      cleared: "Playlist cleared",
      shuffled: "Playlist shuffled",
    };

    this.show({
      title: "Playlist Updated",
      message: messages[action as keyof typeof messages] || action,
      emoji: "📝",
      type: "success",
    });
  }

  settingsChanged(setting: string): void {
    this.show({
      title: "Settings Updated",
      message: `${setting} has been changed`,
      emoji: "⚙️",
      type: "success",
    });
  }
}

// Export singleton instance
export const notify = NotificationManager.getInstance();

// Enhanced demo functions for buttons
export const demoFunctions = {
  createPlaylist: () => {
    notify.show({
      title: "Create Playlist",
      message: "Choose a name for your new playlist:",
      emoji: "🎵",
      type: "info",
      action: {
        label: 'Create "My Favorites"',
        callback: () => {
          notify.success(
            "Playlist Created",
            '"My Favorites" playlist created successfully!',
          );
        },
      },
    });
  },

  shuffleMode: () => {
    notify.show({
      title: "Shuffle Mode",
      message: "Shuffle mode activated! Your music will play in random order.",
      emoji: "🔀",
      type: "success",
    });
  },

  repeatMode: () => {
    const modes = ["Off", "Repeat All", "Repeat One"];
    const currentMode = modes[Math.floor(Math.random() * modes.length)];
    notify.show({
      title: "Repeat Mode",
      message: `Repeat mode: ${currentMode}`,
      emoji: "🔁",
      type: "info",
    });
  },

  downloadMusic: () => {
    notify.show({
      title: "Download Music",
      message: "This feature requires Premium subscription.",
      emoji: "📥",
      type: "warning",
      action: {
        label: "Upgrade to Premium",
        callback: () => {
          notify.info("Premium Upgrade", "Redirecting to subscription page...");
        },
      },
    });
  },

  shareMusic: () => {
    notify.show({
      title: "Share Music",
      message: "Share your favorite tracks with friends!",
      emoji: "📤",
      type: "info",
      action: {
        label: "Copy Share Link",
        callback: () => {
          navigator.clipboard?.writeText(
            "https://sonicly.app/share/playlist123",
          );
          notify.success("Link Copied", "Share link copied to clipboard!");
        },
      },
    });
  },

  addToFavorites: () => {
    notify.success(
      "Added to Favorites",
      "Song added to your favorites playlist!",
    );
  },

  removeFromFavorites: () => {
    notify.warning(
      "Removed from Favorites",
      "Song removed from your favorites.",
    );
  },

  voiceControl: () => {
    notify.show({
      title: "Voice Control",
      message: 'Say "Play music" or "Next song" to control playback.',
      emoji: "🎤",
      type: "info",
      action: {
        label: "Start Listening",
        callback: () => {
          notify.info(
            "Voice Control Active",
            "Listening for voice commands...",
          );
        },
      },
    });
  },

  sleepTimer: () => {
    const times = ["15 minutes", "30 minutes", "1 hour", "2 hours"];
    const selectedTime = times[Math.floor(Math.random() * times.length)];
    notify.show({
      title: "Sleep Timer",
      message: `Music will stop playing after ${selectedTime}`,
      emoji: "😴",
      type: "success",
    });
  },

  crossfade: () => {
    notify.success(
      "Crossfade Enabled",
      "Songs will blend smoothly into each other.",
    );
  },

  visualizer: () => {
    notify.show({
      title: "Audio Visualizer",
      message: "Choose your visualization style:",
      emoji: "🌈",
      type: "info",
      action: {
        label: "Enable Spectrum Analyzer",
        callback: () => {
          notify.success(
            "Visualizer Active",
            "Spectrum analyzer is now displaying!",
          );
        },
      },
    });
  },
};
