import { useState, useCallback, useEffect, useRef } from "react";
import { AudioFile } from "./useFileManager";

interface AudioPlayerState {
  currentTrack: AudioFile | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    const handleEnded = () => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
      }));
    };

    const handleError = (e: any) => {
      const target = e.target as HTMLAudioElement;
      let errorMessage = "Unknown audio error";

      if (target && target.error) {
        switch (target.error.code) {
          case target.error.MEDIA_ERR_ABORTED:
            errorMessage = "Audio loading was aborted";
            break;
          case target.error.MEDIA_ERR_NETWORK:
            errorMessage = "Network error occurred while loading audio";
            break;
          case target.error.MEDIA_ERR_DECODE:
            errorMessage = "Audio decoding error";
            break;
          case target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Audio format not supported";
            break;
          default:
            errorMessage = `Audio error code: ${target.error.code}`;
        }
      }

      console.error("Audio loading error:", errorMessage, "Source:", target?.src);

      setState((prev) => ({
        ...prev,
        isPlaying: false,
      }));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, []);

  const loadTrack = useCallback((track: AudioFile) => {
    if (audioRef.current) {
      // Handle YouTube tracks differently
      if (track.isYouTube) {
        console.log("Loading YouTube track:", track.name || track.title);

        // For YouTube tracks, we don't set an audio source to avoid loading errors
        // In production, this would connect to a YouTube audio extraction service
        audioRef.current.src = "";

        // Show demo notification using toast
        setTimeout(() => {
          // Import and use toast dynamically to avoid dependency issues
          import("@/hooks/use-toast").then(({ toast }) => {
            toast({
              title: `🎵 Now Playing: ${track.name || track.title}`,
              description: `by ${track.artist}\n\n�� Demo Mode: In production, this would stream from YouTube without ads!`,
              duration: 5000,
            });
          }).catch(() => {
            // Fallback to console if toast is not available
            console.log(`🎵 Now Playing: ${track.name || track.title} by ${track.artist} (Demo Mode)`);
          });
        }, 100);
      } else {
        // Regular local audio file
        audioRef.current.src = track.url;
      }

      setState((prev) => ({
        ...prev,
        currentTrack: track,
        isPlaying: false,
        currentTime: 0,
      }));
    }
  }, []);

  const play = useCallback(async () => {
    if (audioRef.current && state.currentTrack) {
      // Don't try to play YouTube tracks since they don't have audio sources
      if (state.currentTrack.isYouTube) {
        setState((prev) => ({ ...prev, isPlaying: true }));
        console.log("Demo: Playing YouTube track", state.currentTrack.name || state.currentTrack.title);
        return;
      }

      try {
        await audioRef.current.play();
        setState((prev) => ({ ...prev, isPlaying: true }));
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  }, [state.currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    } else if (state.currentTrack?.isYouTube) {
      // Handle YouTube track pause
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, [state.currentTrack]);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((prev) => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState((prev) => ({ ...prev, volume }));
    }
  }, []);

  const skipForward = useCallback(() => {
    const newTime = Math.min(state.currentTime + 10, state.duration);
    seek(newTime);
  }, [state.currentTime, state.duration, seek]);

  const skipBackward = useCallback(() => {
    const newTime = Math.max(state.currentTime - 10, 0);
    seek(newTime);
  }, [state.currentTime, seek]);

  return {
    ...state,
    loadTrack,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    skipForward,
    skipBackward,
  };
};
