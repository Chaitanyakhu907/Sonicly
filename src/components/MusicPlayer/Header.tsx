import React from "react";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "@/components/ProfileDropdown";
import { demoFunctions, notify } from "@/lib/notifications";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  const handleAddPlaylistClick = () => {
    navigate("/playlists");
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 transition-all-smooth">
      {/* Left section */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Sonicly App Logo */}
        <div className="flex items-center justify-center w-8 h-8 md:w-11 md:h-11">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fcb96d7e6a3bf4d53b47ab3e31ce2e4c0%2F392a3e68778d4a8191c95c37b7ef0216?format=webp&width=200"
            alt="Sonicly Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Center section */}
      <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center">
        {/* Playlist Add Icon */}
        <button
          onClick={handleAddPlaylistClick}
          className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
          title="Create New Playlist"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </button>

        {/* Sonicly Title */}
        <h2 className="font-roboto text-lg md:text-[22px] font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
          Sonicly
        </h2>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Notification Icon */}
        <button
          onClick={handleNotificationClick}
          className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-110"
          title="Notifications"
        >
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
          {/* Notification dot */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </button>

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
