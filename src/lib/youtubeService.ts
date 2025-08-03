// YouTube Music API service for fetching popular songs
// Note: This is a demo implementation. In production, you'd need proper YouTube API keys and handling

export interface YouTubeTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
  url: string;
  genre?: string;
  language?: string;
}

// Mock data with Indian music content (in production, this would come from YouTube API)
const indianPopularTracks: YouTubeTrack[] = [
  // Bollywood Hits
  {
    id: "1",
    title: "Kesariya",
    artist: "Arijit Singh",
    thumbnail: "https://i.ytimg.com/vi/s7mDJHGfNVg/maxresdefault.jpg",
    duration: "4:28",
    videoId: "s7mDJHGfNVg",
    url: "https://www.youtube.com/watch?v=s7mDJHGfNVg",
    genre: "bollywood",
    language: "hi"
  },
  {
    id: "2",
    title: "Agar Tum Saath Ho",
    artist: "Arijit Singh, Alka Yagnik",
    thumbnail: "https://i.ytimg.com/vi/sK7riqg2mr4/maxresdefault.jpg",
    duration: "5:41",
    videoId: "sK7riqg2mr4",
    url: "https://www.youtube.com/watch?v=sK7riqg2mr4",
    genre: "bollywood",
    language: "hi"
  },
  {
    id: "3",
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal, Asees Kaur",
    thumbnail: "https://i.ytimg.com/vi/wC0xpOEnL4Y/maxresdefault.jpg",
    duration: "3:23",
    videoId: "wC0xpOEnL4Y",
    url: "https://www.youtube.com/watch?v=wC0xpOEnL4Y",
    genre: "bollywood",
    language: "hi"
  },
  {
    id: "4",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    thumbnail: "https://i.ytimg.com/vi/IJq0yyWug1k/maxresdefault.jpg",
    duration: "4:22",
    videoId: "IJq0yyWug1k",
    url: "https://www.youtube.com/watch?v=IJq0yyWug1k",
    genre: "bollywood",
    language: "hi"
  },
  {
    id: "5",
    title: "Ve Kamleya",
    artist: "Arijit Singh, Shreya Ghoshal",
    thumbnail: "https://i.ytimg.com/vi/CdKaAPNH-bU/maxresdefault.jpg",
    duration: "4:15",
    videoId: "CdKaAPNH-bU",
    url: "https://www.youtube.com/watch?v=CdKaAPNH-bU",
    genre: "bollywood",
    language: "hi"
  },
  // Tamil Hits
  {
    id: "6",
    title: "Vachindamma",
    artist: "Sid Sriram",
    thumbnail: "https://i.ytimg.com/vi/Jw_tbP7y1vA/maxresdefault.jpg",
    duration: "3:45",
    videoId: "Jw_tbP7y1vA",
    url: "https://www.youtube.com/watch?v=Jw_tbP7y1vA",
    genre: "folk",
    language: "ta"
  },
  {
    id: "7",
    title: "Rowdy Baby",
    artist: "Dhanush, Dhee",
    thumbnail: "https://i.ytimg.com/vi/x6Q7c9RyMzk/maxresdefault.jpg",
    duration: "4:08",
    videoId: "x6Q7c9RyMzk",
    url: "https://www.youtube.com/watch?v=x6Q7c9RyMzk",
    genre: "folk",
    language: "ta"
  },
  // Punjabi Hits
  {
    id: "8",
    title: "295",
    artist: "Sidhu Moose Wala",
    thumbnail: "https://i.ytimg.com/vi/OLpeX4RRo28/maxresdefault.jpg",
    duration: "4:10",
    videoId: "OLpeX4RRo28",
    url: "https://www.youtube.com/watch?v=OLpeX4RRo28",
    genre: "folk",
    language: "pa"
  },
  {
    id: "9",
    title: "Brown Munde",
    artist: "AP Dhillon, Gurinder Gill",
    thumbnail: "https://i.ytimg.com/vi/VNs_cCtdbPc/maxresdefault.jpg",
    duration: "2:57",
    videoId: "VNs_cCtdbPc",
    url: "https://www.youtube.com/watch?v=VNs_cCtdbPc",
    genre: "folk",
    language: "pa"
  },
  // International Hits
  {
    id: "10",
    title: "Blinding Lights",
    artist: "The Weeknd",
    thumbnail: "https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg",
    duration: "3:20",
    videoId: "4NRXx6U8ABQ",
    url: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
    genre: "pop",
    language: "en"
  },
  {
    id: "11",
    title: "Shape of You",
    artist: "Ed Sheeran",
    thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg",
    duration: "3:53",
    videoId: "JGwWNGJdvx8",
    url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    genre: "pop",
    language: "en"
  },
  // K-Pop
  {
    id: "12",
    title: "Dynamite",
    artist: "BTS",
    thumbnail: "https://i.ytimg.com/vi/gdZLi9oWNZg/maxresdefault.jpg",
    duration: "3:19",
    videoId: "gdZLi9oWNZg",
    url: "https://www.youtube.com/watch?v=gdZLi9oWNZg",
    genre: "kpop",
    language: "ko"
  },
  // Classical/Devotional
  {
    id: "13",
    title: "Hanuman Chalisa",
    artist: "Hariharan",
    thumbnail: "https://i.ytimg.com/vi/3EGm9l_kM6w/maxresdefault.jpg",
    duration: "7:45",
    videoId: "3EGm9l_kM6w",
    url: "https://www.youtube.com/watch?v=3EGm9l_kM6w",
    genre: "devotional",
    language: "hi"
  },
  {
    id: "14",
    title: "Vande Mataram",
    artist: "A.R. Rahman",
    thumbnail: "https://i.ytimg.com/vi/HJmLr6Hka-c/maxresdefault.jpg",
    duration: "5:15",
    videoId: "HJmLr6Hka-c",
    url: "https://www.youtube.com/watch?v=HJmLr6Hka-c",
    genre: "devotional",
    language: "hi"
  },
  {
    id: "15",
    title: "Jai Ho",
    artist: "A.R. Rahman",
    thumbnail: "https://i.ytimg.com/vi/YR12Z8f1Dh8/maxresdefault.jpg",
    duration: "5:09",
    videoId: "YR12Z8f1Dh8",
    url: "https://www.youtube.com/watch?v=YR12Z8f1Dh8",
    genre: "bollywood",
    language: "hi"
  }
];

export class YouTubeService {
  private static instance: YouTubeService;

  static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  private filterTracksByPreferences(tracks: YouTubeTrack[], languages?: string[], genres?: string[]): YouTubeTrack[] {
    if (!languages && !genres) return tracks;

    return tracks.filter(track => {
      const languageMatch = !languages || languages.includes(track.language || 'en');
      const genreMatch = !genres || genres.includes(track.genre || 'pop');
      return languageMatch || genreMatch; // Show if either language or genre matches
    });
  }

  async getPopularTracks(userLanguages?: string[], userGenres?: string[]): Promise<YouTubeTrack[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const filtered = this.filterTracksByPreferences(indianPopularTracks, userLanguages, userGenres);

    // If no matches, return some popular tracks anyway
    if (filtered.length === 0) {
      return indianPopularTracks.slice(0, 10);
    }

    return filtered;
  }

  async getTrendingTracks(userLanguages?: string[], userGenres?: string[]): Promise<YouTubeTrack[]> {
    // Get tracks based on preferences first
    const baseTracksPromise = this.getPopularTracks(userLanguages, userGenres);
    const baseTracks = await baseTracksPromise;

    // Return shuffled tracks for trending, prioritizing user preferences
    const shuffled = [...baseTracks];
    return shuffled.sort(() => Math.random() - 0.5).slice(0, 6);
  }

  async getTracksByGenre(genre: string): Promise<YouTubeTrack[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return indianPopularTracks.filter(track => track.genre === genre);
  }

  async getTracksByLanguage(language: string): Promise<YouTubeTrack[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return indianPopularTracks.filter(track => track.language === language);
  }

  async searchTracks(query: string, userLanguages?: string[], userGenres?: string[]): Promise<YouTubeTrack[]> {
    // Simple mock search - filter by title or artist
    const baseResults = indianPopularTracks.filter(track =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    );

    // Apply user preference filtering
    const filtered = this.filterTracksByPreferences(baseResults, userLanguages, userGenres);

    await new Promise(resolve => setTimeout(resolve, 300));
    return filtered;
  }

  // Get the audio stream URL (in production, you'd use youtube-dl or similar)
  getAudioStreamUrl(videoId: string): string {
    // For demo purposes, we'll return working demo audio URLs
    // In production, you'd need to extract the actual audio stream from YouTube
    const demoAudioUrls = [
      "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      "https://file-examples.com/storage/fe936a63ad66a0ecbb2b85c/2017/11/file_example_MP3_700KB.mp3",
      "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
      "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
      "https://samplelib.com/lib/preview/mp3/sample-9s.mp3"
    ];

    // Return a random demo audio URL based on video ID
    const index = parseInt(videoId.slice(-1), 36) % demoAudioUrls.length;
    return demoAudioUrls[index];
  }

  // Convert YouTube track to AudioFile format for the player
  convertToAudioFile(track: YouTubeTrack): any {
    return {
      id: track.id,
      name: track.title,
      artist: track.artist,
      album: "YouTube Music",
      duration: track.duration,
      url: this.getAudioStreamUrl(track.videoId),
      thumbnail: track.thumbnail,
      isYouTube: true,
      videoId: track.videoId
    };
  }
}

export const youtubeService = YouTubeService.getInstance();
