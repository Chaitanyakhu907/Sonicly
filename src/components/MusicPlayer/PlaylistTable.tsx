import React from "react";
import { Clock } from "lucide-react";
import { PlaylistItem } from "./PlaylistItem";
import { AudioFile } from "../../hooks/useFileManager";
import { FileUpload } from "./FileUpload";

// No default songs - start with empty playlist

interface PlaylistTableProps {
  audioFiles: AudioFile[];
  onFilesSelected: (files: FileList) => void;
  onScanDevice: () => Promise<void>;
  onRemoveTrack: (id: string) => void;
  isProcessing: boolean;
  isInIframe: boolean;
  onTrackSelect: (track: AudioFile) => void;
  currentTrack?: AudioFile | null;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaylistTable: React.FC<PlaylistTableProps> = ({
  audioFiles,
  onFilesSelected,
  onScanDevice,
  onRemoveTrack,
  isProcessing,
  isInIframe,
  onTrackSelect,
  currentTrack,
}) => {
  // Convert local files to display format
  const localTracks = audioFiles.map((file) => ({
    ...file,
    dateAdded: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    duration: formatDuration(file.duration),
  }));

  // Only show local files - no default songs
  const displayTracks = localTracks;
  const hasLocalFiles = localTracks.length > 0;

  const handleAddMoreFiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "audio/*";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFilesSelected(files);
      }
    };
    input.click();
  };

  return (
    <div className="bg-black/46 border border-[#1E1E1E] rounded-[20px] md:rounded-[30px] p-3 md:p-6 max-h-[calc(100vh-200px)] overflow-hidden">
      {/* Auto-Scan Section */}
      {!hasLocalFiles && (
        <div className="mb-4 md:mb-6 p-4 md:p-6 bg-[#191919] rounded-[15px] md:rounded-[20px]">
          <h3 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">
            Add Your Music
          </h3>

          <div className="space-y-3 md:space-y-4">
            {/* Auto-Scan Button - Only show if not in iframe */}
            {!isInIframe && (
              <>
                <div className="text-center">
                  <button
                    onClick={onScanDevice}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 rounded-lg text-sm md:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing
                      ? "Scanning Device..."
                      : "🔍 Auto-Scan Device for Music"}
                  </button>
                </div>

                <div className="text-center text-gray-400 text-xs md:text-sm">
                  <p>Automatically finds all music files in a folder</p>
                  <p className="text-xs mt-1">
                    Click to select your music folder and scan automatically
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-3 md:pt-4">
                  <div className="text-center mb-3">
                    <span className="text-gray-400 text-xs">OR</span>
                  </div>
                </div>
              </>
            )}

            {/* Show iframe notice if in iframe */}
            {isInIframe && (
              <div className="text-center mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
                <div className="text-blue-300 text-xs md:text-sm">
                  <p>
                    💡 <strong>Note:</strong> Auto-scan is not available in this
                    environment
                  </p>
                  <p className="text-xs mt-1">
                    Please use manual file selection below to start
                  </p>
                </div>
              </div>
            )}

            {/* Manual Upload */}
            <FileUpload
              onFilesSelected={onFilesSelected}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}

      {/* Controls when files exist */}
      {hasLocalFiles && (
        <div className="mb-3 md:mb-4 px-3 md:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
            <h3 className="text-white text-base md:text-lg font-semibold">
              Your Music ({localTracks.length} songs)
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              {!isInIframe && (
                <button
                  onClick={onScanDevice}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-md text-xs md:text-sm transition-colors"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Scanning..." : "🔍 Scan More"}
                </button>
              )}
              <button
                onClick={handleAddMoreFiles}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-md text-xs md:text-sm transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Add Files"}
              </button>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to remove all songs?")) {
                  audioFiles.forEach((file) => onRemoveTrack(file.id));
                }
              }}
              className="text-red-400 hover:text-red-300 text-xs underline"
            >
              Clear All Songs
            </button>
          </div>
        </div>
      )}

      {/* Table Header - Desktop Only */}
      <div className="hidden md:flex items-center px-6 py-4 border-b border-[#2E2E2C] bg-[#191919] rounded-t-[30px] -mx-6 -mt-6 mb-4">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-white font-gothic text-sm font-light w-4">
            #
          </span>
          <span className="text-white font-gothic text-xs font-normal">
            Title
          </span>
        </div>
        <div className="flex items-center flex-1">
          <span className="text-white font-gothic text-xs font-normal flex-1">
            Album
          </span>
          <span className="text-white font-gothic text-xs font-light flex-1">
            Date added
          </span>
          <div className="w-[100px] flex justify-end">
            <Clock className="h-4 w-4 text-[#B3B3B3]" />
          </div>
        </div>
      </div>

      {/* Playlist Items */}
      <div className="playlist-scroll max-h-[calc(100vh-280px)] md:max-h-[calc(100vh-320px)] overflow-y-auto">
        {hasLocalFiles ? (
          displayTracks.map((track, index) => (
            <PlaylistItem
              key={track.id}
              song={track}
              index={index + 1}
              onClick={() => onTrackSelect(track)}
              onRemove={() => onRemoveTrack(track.id)}
              isPlaying={currentTrack && currentTrack.id === track.id}
            />
          ))
        ) : (
          /* Empty state when no files loaded */
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">🎵</div>
            <p className="text-gray-400 text-sm">Your playlist is empty</p>
            <p className="text-gray-500 text-xs mt-1">
              Add music files above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistTable;
