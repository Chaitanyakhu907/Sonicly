import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Settings, CreditCard, LogOut, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileDropdownProps {
  className?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ className }) => {
  const { currentUser, logout, users, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  // Detect if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        portalRef.current &&
        !portalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 300); // Increased delay for better UX
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen); // Always allow click toggle for better mobile/desktop consistency
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      action: () => {
        navigate("/profile");
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => {
        navigate("/settings");
        setIsOpen(false);
      },
    },
    {
      icon: CreditCard,
      label: "Account",
      action: () => {
        navigate("/account");
        setIsOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => {
        navigate("/help");
        setIsOpen(false);
      },
    },
  ];

  // Add logout menu item
  const logoutItem = {
    icon: LogOut,
    label: "Log Out",
    action: () => {
      logout();
      navigate("/login");
      setIsOpen(false);
    },
    variant: "destructive" as const,
  };

  if (!currentUser) {
    return null;
  }

  // Check if avatar is a URL (from OAuth providers like Google) or just text/emoji
  const isAvatarUrl = currentUser.avatar && (currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('https'));
  const userInitials = !isAvatarUrl ?
    (currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()) :
    currentUser.name.slice(0, 2).toUpperCase();
  const userName = currentUser.name;
  const userEmail = currentUser.email;

  return (
    <div
      ref={dropdownRef}
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Avatar */}
      <div
        className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onClick={handleClick}
      >
        {isAvatarUrl ? (
          <img
            src={currentUser.avatar}
            alt={userName}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div
          className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm md:text-lg ${isAvatarUrl ? 'hidden' : ''}`}
        >
          {userInitials}
        </div>
      </div>

      {/* Dropdown Menu - Portal */}
      {isOpen && createPortal(
        <div
          ref={portalRef}
          className="fixed w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            zIndex: 2147483647,
            right: '1rem',
            top: '4.5rem',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-white/20 dark:border-gray-700 bg-white/10 dark:bg-gray-750/50 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              {isAvatarUrl ? (
                <img
                  src={currentUser.avatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.textContent = userInitials;
                  }}
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/50"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>



        {/* Logout */}
        <div className="border-t border-white/20 dark:border-gray-700 py-1">
          <button
            onClick={logoutItem.action}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-red-500 dark:text-red-400 hover:bg-red-50/20 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Log Out</span>
          </button>
        </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProfileDropdown;
