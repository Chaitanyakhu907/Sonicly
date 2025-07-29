import React from "react";
import { AudioFile } from "../../hooks/useFileManager";

interface Song {
  id: number | string;
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  duration: string;
  albumArt?: string;
}

interface PlaylistItemProps {
  song: Song | AudioFile;
  index: number;
  onClick?: () => void;
  onRemove?: () => void;
  isPlaying?: boolean;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({
  song,
  index,
  onClick,
  onRemove,
  isPlaying,
}) => {
  const isAudioFile = "file" in song;
  const hasAlbumArt = isAudioFile && song.albumArt;

  return (
    <div
      className={`flex items-center px-3 md:px-5 py-2.5 transition-colors group cursor-pointer rounded-lg ${
        isPlaying ? "bg-blue-600/20" : "hover:bg-white/5"
      }`}
      onClick={onClick}
    >
      {/* Mobile Layout */}
      <div className="flex md:hidden items-center gap-3 w-full">
        {/* Track Number/Play Icon + Album Art */}
        <div className="flex items-center gap-3">
          <div
            className={`text-xs font-bold w-4 text-center ${
              isPlaying ? "text-blue-400" : "text-white"
            }`}
          >
            {isPlaying ? (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-blue-400"
              >
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            ) : (
              <span className="text-[10px]">{index}</span>
            )}
          </div>
          {hasAlbumArt ? (
            <img
              src={song.albumArt}
              alt={`${song.title} album cover`}
              className="w-[40px] h-[40px] rounded-[2px] flex-shrink-0 object-cover"
            />
          ) : (
            <div className="w-[40px] h-[40px] rounded-[2px] flex-shrink-0 bg-gray-700 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-400"
              >
                <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A3,3 0 0,0 7,16A3,3 0 0,0 10,19A3,3 0 0,0 13,16V7H17V5H12V3Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className={`font-gothic text-sm font-semibold leading-[18px] truncate ${
              isPlaying ? "text-blue-400" : "text-white"
            }`}
          >
            {song.title}
          </span>
          <span className="text-[#B3B3B3] font-gothic text-xs font-normal leading-[16px] truncate">
            {song.artist}
          </span>
        </div>

        {/* Duration and Remove */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="text-[#B3B3B3] font-gothic text-xs font-medium">
            {song.duration}
          </span>
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Remove this song?")) {
                  onRemove();
                }
              }}
              className="text-red-400 hover:text-red-300 p-1"
              title="Remove song"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center w-full">
        {/* Track Number and Album Art */}
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`text-xs font-bold w-4 text-right ${
              isPlaying ? "text-blue-400" : "text-white"
            }`}
          >
            {isPlaying ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-blue-400"
              >
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            ) : (
              <span>{index}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Album Art */}
            {hasAlbumArt ? (
              <img
                src={song.albumArt}
                alt={`${song.title} album cover`}
                className="w-[34px] h-[34px] rounded-[2px] flex-shrink-0 object-cover"
              />
            ) : (
              <div className="w-[34px] h-[34px] rounded-[2px] flex-shrink-0 bg-gray-700 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-gray-400"
                >
                  <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A3,3 0 0,0 7,16A3,3 0 0,0 10,19A3,3 0 0,0 13,16V7H17V5H12V3Z" />
                </svg>
              </div>
            )}

            {/* Song Info */}
            <div className="flex flex-col">
              <span
                className={`font-gothic text-sm font-semibold leading-[21px] truncate max-w-[200px] ${
                  isPlaying ? "text-blue-400" : "text-white"
                }`}
              >
                {song.title}
              </span>
              <span className="text-[#B3B3B3] font-gothic text-xs font-normal leading-[21px] truncate max-w-[300px]">
                {song.artist}
              </span>
            </div>
          </div>
        </div>

        {/* Album, Date, Duration */}
        <div className="flex items-center flex-1">
          <span className="text-[#B3B3B3] font-gothic text-xs font-normal leading-[21px] flex-1 truncate max-w-[200px]">
            {song.album}
          </span>
          <span className="text-[#B3B3B3] font-gothic text-xs font-medium leading-[21px] flex-1">
            {song.dateAdded}
          </span>
          <div className="w-[120px] flex justify-end items-center gap-2">
            {/* Duration */}
            <span className="text-[#B3B3B3] font-gothic text-xs font-medium leading-[21px]">
              {song.duration}
            </span>
            {/* Remove Button */}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Remove this song from playlist?")) {
                    onRemove();
                  }
                }}
                className="text-red-400 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove song"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
