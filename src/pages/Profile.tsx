import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Camera,
  Music,
  Heart,
  Clock,
  TrendingUp,
  Award,
  Edit3,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useOfflineStorage } from "@/lib/offlineStorage";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const { profile, updateProfile } = useOfflineStorage();
  const { currentUser } = useAuth();

  const [editedProfile, setEditedProfile] = useState({
    ...profile,
    name: currentUser?.name || profile.name,
    email: currentUser?.email || profile.email,
  });

  // Update editedProfile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditedProfile(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  const stats = [
    {
      label: "Songs Played",
      value: profile.stats.songsPlayed.toLocaleString(),
      icon: Music,
    },
    {
      label: "Favorites",
      value: profile.stats.favorites.toLocaleString(),
      icon: Heart,
    },
    {
      label: "Hours Listened",
      value: profile.stats.hoursListened.toLocaleString(),
      icon: Clock,
    },
    {
      label: "Streak Days",
      value: profile.stats.streakDays.toString(),
      icon: Award,
    },
  ];

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const handleSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleAddGenre = () => {
    if (
      newGenre.trim() &&
      !editedProfile.favoriteGenres.includes(newGenre.trim())
    ) {
      setEditedProfile({
        ...editedProfile,
        favoriteGenres: [...editedProfile.favoriteGenres, newGenre.trim()],
      });
      setNewGenre("");
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setEditedProfile({
      ...editedProfile,
      favoriteGenres: editedProfile.favoriteGenres.filter(
        (genre) => genre !== genreToRemove,
      ),
    });
  };

  // Update editedProfile when profile changes
  React.useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleAvatarChange = () => {
    const options = [
      "🎵",
      "🎶",
      "🎤",
      "🎧",
      "🎸",
      "🎹",
      "🥁",
      "🎺",
      "🎷",
      "🎻",
      "⭐",
      "💫",
      "✨",
      "🌟",
      "🎯",
      "🔥",
      "💎",
      "🚀",
      "⚡",
      "🌈",
    ];
    const randomEmoji = options[Math.floor(Math.random() * options.length)];

    alert(
      `📸 Avatar Update!\n\nNew avatar emoji: ${randomEmoji}\n\n(In a real app, this would open camera/gallery picker)`,
    );

    // In a real app, you'd update the avatar
    // updateProfile({ avatar: selectedImageUrl });
  };

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
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Offline Mode
        </Badge>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditedProfile(profile); // Reset changes
              }}
              className="text-white border-white/20 hover:bg-white/10"
            >
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-4xl">
                  {currentUser?.name ? currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase() : "CK"}
                </div>
                {isEditing && (
                  <Button
                    size="icon"
                    onClick={handleAvatarChange}
                    className="absolute bottom-0 right-0 rounded-full bg-white/20 hover:bg-white/30"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={editedProfile.name}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          name: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white text-2xl font-bold"
                      placeholder="Your name"
                    />
                    <Input
                      value={editedProfile.location}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          location: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Location"
                    />
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          bio: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">{currentUser?.name || profile.name}</h2>
                    <p className="text-gray-300">{profile.location}</p>
                    <p className="text-gray-400 max-w-lg">{profile.bio}</p>
                  </div>
                )}

                {/* Favorite Genres */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Favorite Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing
                      ? editedProfile.favoriteGenres
                      : profile.favoriteGenres
                    ).map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="bg-white/20 text-white hover:bg-white/30 flex items-center gap-1"
                      >
                        {genre}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveGenre(genre)}
                            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <Input
                          value={newGenre}
                          onChange={(e) => setNewGenre(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddGenre()
                          }
                          placeholder="Add genre"
                          className="bg-white/10 border-white/20 text-white text-sm w-24"
                        />
                        <Button
                          size="sm"
                          onClick={handleAddGenre}
                          className="bg-purple-600 hover:bg-purple-700 p-1"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="bg-white/10 backdrop-blur-lg border-white/20 text-white"
              >
                <CardContent className="p-4 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your latest listening sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.recentActivity.length > 0 ? (
                profile.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.song}</p>
                        <p className="text-sm text-gray-400">
                          {activity.artist} • {activity.genre}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity yet</p>
                  <p className="text-sm">
                    Start playing some music to see your history!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
