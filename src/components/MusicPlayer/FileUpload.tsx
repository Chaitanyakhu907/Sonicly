import React, { useRef, useState } from "react";
import { Button } from "../ui/button";

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50/10"
            : "border-gray-600 hover:border-gray-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-3 md:space-y-4">
          <div className="mx-auto w-8 h-8 md:w-12 md:h-12 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm md:text-base">
              {isProcessing
                ? "Processing files..."
                : "Drag and drop your music files here"}
            </p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              or click the button below to browse
            </p>
          </div>
        </div>
      </div>

      {/* File Selection Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleFileSelect}
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 text-sm md:text-base"
        >
          {isProcessing ? "Processing..." : "Select Music Files"}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
