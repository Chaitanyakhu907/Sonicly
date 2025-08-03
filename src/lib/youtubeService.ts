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
}

// Mock data for popular tracks (in production, this would come from YouTube API)
const mockPopularTracks: YouTubeTrack[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    thumbnail: "https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg",
    duration: "3:20",
    videoId: "4NRXx6U8ABQ",
    url: "https://www.youtube.com/watch?v=4NRXx6U8ABQ"
  },
  {
    id: "2", 
    title: "Shape of You",
    artist: "Ed Sheeran",
    thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg",
    duration: "3:53",
    videoId: "JGwWNGJdvx8",
    url: "https://www.youtube.com/watch?v=JGwWNGJdvx8"
  },
  {
    id: "3",
    title: "Bad Habits",
    artist: "Ed Sheeran", 
    thumbnail: "https://i.ytimg.com/vi/orJSJGHjBLI/maxresdefault.jpg",
    duration: "3:51",
    videoId: "orJSJGHjBLI",
    url: "https://www.youtube.com/watch?v=orJSJGHjBLI"
  },
  {
    id: "4",
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    thumbnail: "https://i.ytimg.com/vi/kTJczUoc26U/maxresdefault.jpg", 
    duration: "2:21",
    videoId: "kTJczUoc26U",
    url: "https://www.youtube.com/watch?v=kTJczUoc26U"
  },
  {
    id: "5",
    title: "Heat Waves",
    artist: "Glass Animals",
    thumbnail: "https://i.ytimg.com/vi/mRD0-GxqHVo/maxresdefault.jpg",
    duration: "3:58", 
    videoId: "mRD0-GxqHVo",
    url: "https://www.youtube.com/watch?v=mRD0-GxqHVo"
  },
  {
    id: "6",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    thumbnail: "https://i.ytimg.com/vi/gNi_6U5Pm_o/maxresdefault.jpg",
    duration: "2:58",
    videoId: "gNi_6U5Pm_o", 
    url: "https://www.youtube.com/watch?v=gNi_6U5Pm_o"
  },
  {
    id: "7",
    title: "Industry Baby",
    artist: "Lil Nas X, Jack Harlow",
    thumbnail: "https://i.ytimg.com/vi/UTHLKHL_whs/maxresdefault.jpg",
    duration: "3:32",
    videoId: "UTHLKHL_whs",
    url: "https://www.youtube.com/watch?v=UTHLKHL_whs"
  },
  {
    id: "8",
    title: "Levitating",
    artist: "Dua Lipa",
    thumbnail: "https://i.ytimg.com/vi/TUVcZfQe-Kw/maxresdefault.jpg",
    duration: "3:23",
    videoId: "TUVcZfQe-Kw",
    url: "https://www.youtube.com/watch?v=TUVcZfQe-Kw"
  },
  {
    id: "9",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    thumbnail: "https://i.ytimg.com/vi/E07s5ZYygMg/maxresdefault.jpg",
    duration: "2:54",
    videoId: "E07s5ZYygMg",
    url: "https://www.youtube.com/watch?v=E07s5ZYygMg"
  },
  {
    id: "10",
    title: "Peaches",
    artist: "Justin Bieber ft. Daniel Caesar, Giveon",
    thumbnail: "https://i.ytimg.com/vi/tQ0yjYUFKAE/maxresdefault.jpg",
    duration: "3:18",
    videoId: "tQ0yjYUFKAE",
    url: "https://www.youtube.com/watch?v=tQ0yjYUFKAE"
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

  async getPopularTracks(): Promise<YouTubeTrack[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPopularTracks;
  }

  async getTrendingTracks(): Promise<YouTubeTrack[]> {
    // Return shuffled popular tracks for trending
    const tracks = [...mockPopularTracks];
    return tracks.sort(() => Math.random() - 0.5).slice(0, 6);
  }

  async searchTracks(query: string): Promise<YouTubeTrack[]> {
    // Simple mock search - filter by title or artist
    const filteredTracks = mockPopularTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return filteredTracks;
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
