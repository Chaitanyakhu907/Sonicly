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

        // Use a base64 encoded short audio clip for demo
        const demoAudioUrl = "data:audio/mp3;base64,//NQxAASCVIIAUEQAD/JARhgfp5/mP/xCD47ffTn/6P2/tAI4fef//6gCMH3//6gAjB9//+oAIwff//qACMH3//6gAjB9//+oALB8H1//////TYxAwP+vSq//ygwNOLdF3T3Ppz/wZfDUXVUAAAAA4fBNWRyh5JyHdF3T3Ppz/wZe/DUXVj///xSBgf9e//zgwNDHzk/f6P6H9//tAR4fef/+oADQ9/++oDYxMH3//6gAw3ff///KDA049036f//DUXZcAAAAA4fB9WRyh5L7HdF3T3Ppz/wZf/DUXVkf//8UgYH/Xv/84MDQx85P3+j+h/f/7QEeH3n//qAA0Pf/vqA2MTB9//+oAMN33//yAAA";
        audioRef.current.src = demoAudioUrl;

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
