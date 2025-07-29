import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Music,
  Play,
  MoreVertical,
  Edit,
  Trash2,
  Share,
  Download,
  Heart,
  Clock,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Playlist {
  id: string;
  name: string;
  description: string;
  songCount: number;
  duration: string;
  coverImage?: string;
  isPublic: boolean;
  isLiked: boolean;
  createdAt: Date;
  lastModified: Date;
}

const Playlists = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: "1",
      name: "My Favorites",
      description: "My most loved songs of all time",
      songCount: 42,
      duration: "2h 34m",
      isPublic: false,
      isLiked: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: "Workout Beats",
      description: "High energy songs for gym sessions",
      songCount: 28,
      duration: "1h 45m",
      isPublic: true,
      isLiked: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Chill Vibes",
      description: "Relaxing music for peaceful moments",
      songCount: 67,
      duration: "4h 12m",
      isPublic: true,
      isLiked: true,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      name: "Road Trip Mix",
      description: "Perfect songs for long drives",
      songCount: 35,
      duration: "2h 18m",
      isPublic: false,
      isLiked: false,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    isPublic: false,
  });

  const handleCreatePlaylist = () => {
    if (!newPlaylist.name.trim()) return;

    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylist.name,
      description: newPlaylist.description,
      songCount: 0,
      duration: "0m",
      isPublic: newPlaylist.isPublic,
      isLiked: false,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    setPlaylists((prev) => [playlist, ...prev]);
    setNewPlaylist({ name: "", description: "", isPublic: false });
    setShowCreateModal(false);
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setNewPlaylist({
      name: playlist.name,
      description: playlist.description,
      isPublic: playlist.isPublic,
    });
    setShowCreateModal(true);
  };

  const handleUpdatePlaylist = () => {
    if (!editingPlaylist || !newPlaylist.name.trim()) return;

    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === editingPlaylist.id
          ? {
              ...p,
              name: newPlaylist.name,
              description: newPlaylist.description,
              isPublic: newPlaylist.isPublic,
              lastModified: new Date(),
            }
          : p,
      ),
    );

    setEditingPlaylist(null);
    setNewPlaylist({ name: "", description: "", isPublic: false });
    setShowCreateModal(false);
  };

  const handleDeletePlaylist = (id: string) => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleLike = (id: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isLiked: !p.isLiked } : p)),
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingPlaylist(null);
    setNewPlaylist({ name: "", description: "", isPublic: false });
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
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">My Playlists</h1>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {playlists.length} playlists
            </Badge>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </Button>
      </div>

      {/* Playlists Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {playlists.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="text-center py-12">
              <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Playlists Yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first playlist to organize your favorite songs
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Playlist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all group"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate mb-1">
                        {playlist.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-sm line-clamp-2">
                        {playlist.description || "No description"}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem
                          onClick={() => handleEditPlaylist(playlist)}
                          className="text-white hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            alert("Share functionality coming soon!")
                          }
                          className="text-white hover:bg-gray-700"
                        >
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            alert("Download functionality coming soon!")
                          }
                          className="text-white hover:bg-gray-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeletePlaylist(playlist.id)}
                          className="text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{playlist.songCount} songs</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {playlist.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {playlist.isPublic && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate("/")}
                        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        Play
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleLike(playlist.id)}
                        className={`${
                          playlist.isLiked
                            ? "text-red-400 hover:text-red-300"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            playlist.isLiked ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(playlist.lastModified)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Playlist Modal */}
      <Dialog open={showCreateModal} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingPlaylist ? "Edit Playlist" : "Create New Playlist"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingPlaylist
                ? "Update your playlist details"
                : "Give your playlist a name and description"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Playlist Name
              </label>
              <Input
                placeholder="Enter playlist name"
                value={newPlaylist.name}
                onChange={(e) =>
                  setNewPlaylist((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Description (Optional)
              </label>
              <Textarea
                placeholder="What's this playlist about?"
                value={newPlaylist.description}
                onChange={(e) =>
                  setNewPlaylist((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="bg-white/10 border-white/20 text-white"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newPlaylist.isPublic}
                onChange={(e) =>
                  setNewPlaylist((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded"
              />
              <label htmlFor="isPublic" className="text-sm text-white">
                Make this playlist public
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="flex-1 text-white border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist
                }
                disabled={!newPlaylist.name.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {editingPlaylist ? "Update" : "Create"} Playlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Playlists;
