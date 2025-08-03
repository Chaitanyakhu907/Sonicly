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
      console.error("Audio loading error:", e);
      setState((prev) => ({
        ...prev,
        isPlaying: false,
      }));

      // Try fallback audio for YouTube tracks
      if (audio.src.includes('youtube') || audio.src.includes('samplelib')) {
        console.log("Trying fallback audio...");
        audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAUCL+D1p+AMj0EIIrF7tiIJwwYaLDn5KhiGBA5lN7xwm8fAjB5w+/agTPeAyF2x/LaXgYQWKfh7LdGWAQgmKnhzxENlwU5kNq0zlYGEF6c1vmwY2hcGASX1U3LU2KFmWkH3U1fJUHNeTJ9VjFP0e1VzB9HpfFGLbpF0U1XfBdGpO1CZnFeSF2n4MdQ0ehY3h6leTNtLnNIWnPpQjGVW1wj1b2xNKnqZDGCOHqmjHJIgTW5t2IcVlPJr4vp1qgLdvEYYHYA";
      }
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

        // Use a working demo audio URL for YouTube tracks
        const demoAudioUrl = "https://samplelib.com/lib/preview/mp3/sample-15s.mp3";
        audioRef.current.src = demoAudioUrl;

        // Show demo notification
        setTimeout(() => {
          alert(`🎵 Demo Mode: Playing "${track.name || track.title}" by ${track.artist}\n\nNote: This is playing demo audio. In production, this would stream the actual song from YouTube without ads.`);
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
    }
  }, []);

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
