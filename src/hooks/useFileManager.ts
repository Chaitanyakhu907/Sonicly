import { useState, useCallback } from "react";
import { parseBlob } from "music-metadata-browser";

export interface AudioFile {
  id: string;
  file?: File;
  url: string;
  title?: string;
  name?: string; // For backward compatibility
  artist: string;
  album: string;
  duration: number | string;
  albumArt?: string;
  thumbnail?: string;
  isYouTube?: boolean;
  videoId?: string;
}

export const useFileManager = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processAudioFile = async (file: File): Promise<AudioFile> => {
    const url = URL.createObjectURL(file);
    let title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    let artist = "Unknown Artist";
    let album = "Unknown Album";
    let duration = 0;
    let albumArt: string | undefined;

    try {
      const metadata = await parseBlob(file);

      if (metadata.common?.title) title = metadata.common.title;
      if (metadata.common?.artist) artist = metadata.common.artist;
      if (metadata.common?.album) album = metadata.common.album;
      if (metadata.format?.duration)
        duration = Math.round(metadata.format.duration);

      // Extract album art if available
      if (metadata.common?.picture && metadata.common.picture.length > 0) {
        try {
          const picture = metadata.common.picture[0];
          const blob = new Blob([picture.data], { type: picture.format });
          albumArt = URL.createObjectURL(blob);
          console.log("✅ Album art extracted for:", title);
        } catch (error) {
          console.warn("⚠️ Failed to extract album art for:", title, error);
        }
      } else {
        console.log("ℹ️ No album art found for:", title);
      }
    } catch (error) {
      console.warn("Could not extract metadata from file:", file.name, error);
    }

    return {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url,
      title,
      artist,
      album,
      duration,
      albumArt,
    };
  };

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setIsProcessing(true);
    const fileArray = Array.from(files);
    const audioFiles = fileArray.filter((file) =>
      file.type.startsWith("audio/"),
    );

    try {
      const processedFiles = await Promise.all(
        audioFiles.map((file) => processAudioFile(file)),
      );

      setAudioFiles((prev) => [...prev, ...processedFiles]);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setAudioFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
        if (fileToRemove.albumArt) {
          URL.revokeObjectURL(fileToRemove.albumArt);
        }
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // Check if we're in an iframe
  const isInIframe = useCallback(() => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }, []);

  const scanDeviceForMusic = useCallback(async () => {
    setIsProcessing(true);
    try {
      // Check if we're in an iframe
      if (isInIframe()) {
        throw new Error(
          "Auto-scan is not available in iframe mode due to browser security restrictions. Please use the manual file selection below.",
        );
      }

      // Check if File System Access API is supported
      if (!("showDirectoryPicker" in window)) {
        throw new Error(
          "Your browser does not support automatic folder scanning. Please use the manual file selection below.",
        );
      }

      // Check if we're in a secure context
      if (!window.isSecureContext) {
        throw new Error(
          "Auto-scan requires HTTPS. Please use the manual file selection below.",
        );
      }

      const dirHandle = await (window as any).showDirectoryPicker({
        mode: "read",
      });

      const audioFiles: File[] = [];

      // Recursive function to scan directories
      async function scanDirectory(dirHandle: any) {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === "file") {
            const file = await entry.getFile();
            if (
              file.type.startsWith("audio/") ||
              file.name.toLowerCase().endsWith(".mp3") ||
              file.name.toLowerCase().endsWith(".wav") ||
              file.name.toLowerCase().endsWith(".flac") ||
              file.name.toLowerCase().endsWith(".m4a")
            ) {
              audioFiles.push(file);
            }
          } else if (entry.kind === "directory") {
            await scanDirectory(entry);
          }
        }
      }

      await scanDirectory(dirHandle);

      if (audioFiles.length > 0) {
        await addFiles(audioFiles);
        return audioFiles.length;
      } else {
        throw new Error(
          "No audio files found in the selected directory. Please try selecting a different folder or use manual file selection.",
        );
      }
    } catch (error: any) {
      console.error("Error scanning device:", error);

      // Provide user-friendly error messages
      if (error.name === "SecurityError") {
        throw new Error(
          "Browser security prevents automatic scanning in this environment. Please use the manual file selection below.",
        );
      } else if (error.name === "AbortError") {
        throw new Error("Folder selection was cancelled.");
      } else if (error.message) {
        throw error;
      } else {
        throw new Error(
          "Failed to scan for music files. Please try manual file selection below.",
        );
      }
    } finally {
      setIsProcessing(false);
    }
  }, [addFiles, isInIframe]);

  const clearAllFiles = useCallback(() => {
    audioFiles.forEach((file) => {
      URL.revokeObjectURL(file.url);
      if (file.albumArt) {
        URL.revokeObjectURL(file.albumArt);
      }
    });
    setAudioFiles([]);
  }, [audioFiles]);

  return {
    audioFiles,
    addFiles,
    removeFile,
    clearAllFiles,
    scanDeviceForMusic,
    isProcessing,
    isInIframe,
  };
};
