import React, { useState, useEffect } from "react";
import { Play, Heart, MoreHorizontal, Shuffle, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { youtubeService, YouTubeTrack } from "@/lib/youtubeService";
import { userPreferencesService } from "@/lib/userPreferences";
import UserPreferencesModal from "./UserPreferencesModal";
import { cn } from "@/lib/utils";

interface DiscoverySectionProps {
  onTrackSelect: (track: any) => void;
  currentTrack: any;
  theme: any;
}

const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  onTrackSelect,
  currentTrack,
  theme
}) => {
  const [popularTracks, setPopularTracks] = useState<YouTubeTrack[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<YouTubeTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [userPreferences, setUserPreferences] = useState(userPreferencesService.getPreferences());

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      try {
        const [popular, trending] = await Promise.all([
          youtubeService.getPopularTracks(userPreferences.languages, userPreferences.genres),
          youtubeService.getTrendingTracks(userPreferences.languages, userPreferences.genres)
        ]);
        setPopularTracks(popular);
        setTrendingTracks(trending);
      } catch (error) {
        console.error("Failed to load tracks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();

    // Show preferences modal if user hasn't completed setup
    if (userPreferencesService.needsSetup()) {
      setShowPreferencesModal(true);
    }
  }, [userPreferences]);

  const handlePreferencesComplete = (newPreferences: any) => {
    setUserPreferences(newPreferences);
    setShowPreferencesModal(false);
  };

  const handleTrackPlay = (track: YouTubeTrack) => {
    const audioFile = youtubeService.convertToAudioFile(track);
    onTrackSelect(audioFile);
  };

  const TrackCard = ({ track, size = "large" }: { track: YouTubeTrack; size?: "large" | "small" }) => (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-105 border-0 shadow-lg hover:shadow-xl",
        size === "large" ? "w-48" : "w-40"
      )}
      style={{ 
        background: `linear-gradient(135deg, ${theme.colors.surface}aa, ${theme.colors.surface}ee)`,
        backdropFilter: "blur(10px)"
      }}
      onMouseEnter={() => setHoveredTrack(track.id)}
      onMouseLeave={() => setHoveredTrack(null)}
      onClick={() => handleTrackPlay(track)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={track.thumbnail} 
            alt={track.title}
            className={cn(
              "w-full object-cover rounded-t-lg",
              size === "large" ? "h-48" : "h-40"
            )}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          
          {/* Play button overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg",
            hoveredTrack === track.id && "opacity-100"
          )}>
            <Button
              size="icon"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full h-12 w-12 shadow-lg"
            >
              <Play className="h-5 w-5 fill-current" />
            </Button>
          </div>

          {/* Duration badge */}
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 bg-black/70 text-white border-0"
          >
            <Clock className="h-3 w-3 mr-1" />
            {track.duration}
          </Badge>
        </div>
        
        <div className="p-4">
          <h3 
            className="font-semibold text-sm mb-1 truncate"
            style={{ color: theme.colors.text }}
          >
            {track.title}
          </h3>
          <p 
            className="text-xs truncate"
            style={{ color: theme.colors.textSecondary }}
          >
            {track.artist}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const TrackRow = ({ track, index }: { track: YouTubeTrack; index: number }) => (
    <div 
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group cursor-pointer"
      onClick={() => handleTrackPlay(track)}
      onMouseEnter={() => setHoveredTrack(track.id)}
      onMouseLeave={() => setHoveredTrack(null)}
    >
      <div className="flex-shrink-0 w-8 text-center">
        {hoveredTrack === track.id ? (
          <Play className="h-4 w-4 mx-auto" style={{ color: theme.colors.primary }} />
        ) : (
          <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
            {index + 1}
          </span>
        )}
      </div>
      
      <div className="flex-shrink-0">
        <img 
          src={track.thumbnail} 
          alt={track.title}
          className="w-12 h-12 rounded object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <p 
          className="font-medium text-sm truncate"
          style={{ color: theme.colors.text }}
        >
          {track.title}
        </p>
        <p 
          className="text-xs truncate"
          style={{ color: theme.colors.textSecondary }}
        >
          {track.artist}
        </p>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Heart className="h-4 w-4" />
        </Button>
        <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
          {track.duration}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="w-48 border-0">
          <CardContent className="p-0">
            <Skeleton className="w-full h-48 rounded-t-lg" />
            <div className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header with gradient text */}
      <div className="text-center">
        <h1 
          className="text-4xl font-bold mb-2 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
          }}
        >
          🎵 Discover Music
        </h1>
        <p 
          className="text-lg"
          style={{ color: theme.colors.textSecondary }}
        >
          Stream the hottest tracks from YouTube without ads
        </p>
      </div>

      {/* Popular This Week */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold"
            style={{ color: theme.colors.text }}
          >
            🔥 Popular This Week
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-500 hover:text-purple-400 hover:bg-purple-500/10"
              onClick={() => setShowPreferencesModal(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Button>
            <Button
              variant="ghost"
              className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle Play
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            popularTracks.slice(0, 5).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))
          )}
        </div>
      </section>

      {/* Trending Now */}
      <section>
        <h2 
          className="text-2xl font-bold mb-6"
          style={{ color: theme.colors.text }}
        >
          📈 Trending Now
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart-style list */}
          <div 
            className="backdrop-blur-lg rounded-2xl p-6 border"
            style={{
              background: theme.colors.surface + "aa",
              borderColor: theme.colors.border
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: theme.colors.text }}
            >
              Top Tracks
            </h3>
            <div className="space-y-2">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="w-8 h-4" />
                    <Skeleton className="w-12 h-12 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                trendingTracks.map((track, index) => (
                  <TrackRow key={track.id} track={track} index={index} />
                ))
              )}
            </div>
          </div>

          {/* Featured cards */}
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="border-0">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-40 rounded-t-lg" />
                    <div className="p-4">
                      <Skeleton className="h-3 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              trendingTracks.slice(0, 4).map((track) => (
                <TrackCard key={track.id} track={track} size="small" />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverySection;
