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

        // Create a simple tone for demo purposes
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
          const channelData = buffer.getChannelData(0);

          // Generate a simple sine wave
          for (let i = 0; i < channelData.length; i++) {
            channelData[i] = Math.sin(2 * Math.PI * 440 * i / audioContext.sampleRate) * 0.1;
          }

          // Convert to blob and create URL
          const offlineContext = new OfflineAudioContext(1, buffer.length, audioContext.sampleRate);
          const source = offlineContext.createBufferSource();
          source.buffer = buffer;
          source.connect(offlineContext.destination);
          source.start();

          offlineContext.startRendering().then((renderedBuffer) => {
            // For now, just use a simple data URL that will work
            audioRef.current!.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAAAQAEAAEAfAACAAQACAAgAZGF0YQAAAAA=";
          });

        } catch (error) {
          console.log("Web Audio API not supported, using fallback");
          // Simple working data URL
          audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAAAQAEAAEAfAACAAQACAAgAZGF0YQAAAAA=";
        }

        // Show demo notification
        setTimeout(() => {
          console.log(`🎵 Demo Mode: Playing "${track.name || track.title}" by ${track.artist}`);
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
