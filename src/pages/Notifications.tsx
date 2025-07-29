import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Music,
  Crown,
  Users,
  TrendingUp,
  MoreVertical,
  Check,
  Trash2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: "music" | "premium" | "social" | "trending" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "music",
      title: "New Weekly Discovery",
      message:
        "Your personalized playlist is ready with 30 new songs based on your taste",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
      read: false,
      actionable: true,
      action: {
        label: "Listen Now",
        callback: () => navigate("/"),
      },
    },
    {
      id: "2",
      type: "premium",
      title: "Premium Offer",
      message:
        "Get 50% off your first 3 months of Sonicly Premium. Limited time offer!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionable: true,
      action: {
        label: "Upgrade Now",
        callback: () => navigate("/account"),
      },
    },
    {
      id: "3",
      type: "social",
      title: "Friend Activity",
      message: "Rahul shared a playlist 'Chill Vibes' with you",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      actionable: true,
      action: {
        label: "View Playlist",
        callback: () => navigate("/"),
      },
    },
    {
      id: "4",
      type: "trending",
      title: "Trending Alert",
      message: "Lo-fi Hip Hop is trending in your area. Discover new artists!",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
    },
    {
      id: "5",
      type: "system",
      title: "Download Complete",
      message: "45 songs downloaded for offline listening",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
    },
    {
      id: "6",
      type: "music",
      title: "New Release Alert",
      message: "Taylor Swift just released a new album. Listen now!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      actionable: true,
      action: {
        label: "Play Album",
        callback: () => navigate("/"),
      },
    },
  ]);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "music":
        return <Music className="w-5 h-5 text-purple-400" />;
      case "premium":
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case "social":
        return <Users className="w-5 h-5 text-blue-400" />;
      case "trending":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-white border-white/20 hover:bg-white/10"
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllNotifications}
            className="text-red-400 border-red-400/20 hover:bg-red-400/10"
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto p-6">
        {notifications.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
              <p className="text-gray-400">
                You're all caught up! We'll notify you when something new
                happens.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-white/10 backdrop-blur-lg border-white/20 text-white transition-all hover:bg-white/15 ${
                  !notification.read ? "ring-2 ring-purple-500/50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-white/10">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.actionable && notification.action && (
                              <Button
                                size="sm"
                                onClick={notification.action.callback}
                                className="bg-purple-600 hover:bg-purple-700 text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-white hover:bg-white/10"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            {!notification.read && (
                              <DropdownMenuItem
                                onClick={() => markAsRead(notification.id)}
                                className="text-white hover:bg-gray-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Mark as Read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
