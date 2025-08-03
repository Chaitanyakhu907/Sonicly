// YouTube Music API service for fetching popular songs
// Integrates with real YouTube API when available, falls back to demo data

import { youtubeApiService } from "./youtubeApi";

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
    try {
      // Try to get real trending music from YouTube API
      const apiResults = await youtubeApiService.getTrendingMusic('IN');

      if (apiResults && apiResults.length > 0) {
        // Convert API results to our YouTubeTrack format
        const convertedTracks = apiResults.map(result => ({
          id: result.videoId,
          title: result.title,
          artist: result.channelTitle,
          thumbnail: result.thumbnail,
          duration: result.duration,
          videoId: result.videoId,
          url: `https://www.youtube.com/watch?v=${result.videoId}`,
          genre: this.inferGenre(result.title, result.channelTitle),
          language: this.inferLanguage(result.title, result.channelTitle)
        }));

        const filtered = this.filterTracksByPreferences(convertedTracks, userLanguages, userGenres);
        return filtered.length > 0 ? filtered : convertedTracks.slice(0, 10);
      }
    } catch (error) {
      console.log('YouTube API not available, using demo data:', error);
    }

    // Fallback to demo data
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = this.filterTracksByPreferences(indianPopularTracks, userLanguages, userGenres);
    return filtered.length > 0 ? filtered : indianPopularTracks.slice(0, 10);
  }

  async getTrendingTracks(userLanguages?: string[], userGenres?: string[]): Promise<YouTubeTrack[]> {
    try {
      // Get tracks based on preferences first
      const baseTracks = await this.getPopularTracks(userLanguages, userGenres);

      if (!baseTracks || baseTracks.length === 0) {
        console.warn('No base tracks available for trending');
        return indianPopularTracks.slice(0, 6);
      }

      // Return shuffled tracks for trending, prioritizing user preferences
      const shuffled = [...baseTracks];
      return shuffled.sort(() => Math.random() - 0.5).slice(0, 6);
    } catch (error) {
      console.error('Error getting trending tracks:', error);
      // Fallback to demo data
      return indianPopularTracks.slice(0, 6);
    }
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
    try {
      // Try real YouTube search first
      const apiResults = await youtubeApiService.searchVideos(query, 20);

      if (apiResults && apiResults.length > 0) {
        const convertedTracks = apiResults.map(result => ({
          id: result.videoId,
          title: result.title,
          artist: result.channelTitle,
          thumbnail: result.thumbnail,
          duration: result.duration,
          videoId: result.videoId,
          url: `https://www.youtube.com/watch?v=${result.videoId}`,
          genre: this.inferGenre(result.title, result.channelTitle),
          language: this.inferLanguage(result.title, result.channelTitle)
        }));

        const filtered = this.filterTracksByPreferences(convertedTracks, userLanguages, userGenres);
        return filtered;
      }
    } catch (error) {
      console.log('YouTube API search not available, using demo data:', error);
    }

    // Fallback to demo search
    const baseResults = indianPopularTracks.filter(track =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    );

    const filtered = this.filterTracksByPreferences(baseResults, userLanguages, userGenres);
    await new Promise(resolve => setTimeout(resolve, 300));
    return filtered;
  }

  // Helper method to infer genre from title and artist
  private inferGenre(title: string, artist: string): string {
    const text = `${title} ${artist}`.toLowerCase();

    if (text.includes('bollywood') || text.includes('hindi') || text.includes('arijit') || text.includes('shreya')) {
      return 'bollywood';
    }
    if (text.includes('classical') || text.includes('raag') || text.includes('carnatic')) {
      return 'classical';
    }
    if (text.includes('devotional') || text.includes('bhajan') || text.includes('hanuman') || text.includes('krishna')) {
      return 'devotional';
    }
    if (text.includes('folk') || text.includes('punjabi') || text.includes('bhangra')) {
      return 'folk';
    }
    if (text.includes('qawwali') || text.includes('sufi')) {
      return 'qawwali';
    }
    if (text.includes('kpop') || text.includes('bts') || text.includes('blackpink')) {
      return 'kpop';
    }

    return 'pop'; // Default
  }

  // Helper method to infer language from title and artist
  private inferLanguage(title: string, artist: string): string {
    const text = `${title} ${artist}`.toLowerCase();

    // Check for Hindi indicators
    if (text.includes('arijit') || text.includes('shreya') || text.includes('bollywood') ||
        text.includes('hindi') || /[\u0900-\u097F]/.test(title)) {
      return 'hi';
    }

    // Check for Tamil indicators
    if (text.includes('tamil') || text.includes('kollywood') || /[\u0B80-\u0BFF]/.test(title)) {
      return 'ta';
    }

    // Check for Telugu indicators
    if (text.includes('telugu') || text.includes('tollywood') || /[\u0C00-\u0C7F]/.test(title)) {
      return 'te';
    }

    // Check for Punjabi indicators
    if (text.includes('punjabi') || text.includes('bhangra') || text.includes('sidhu')) {
      return 'pa';
    }

    // Check for Korean
    if (text.includes('kpop') || text.includes('bts') || text.includes('korean')) {
      return 'ko';
    }

    return 'en'; // Default to English
  }

  // Get the audio stream URL (uses real API when available)
  async getAudioStreamUrl(videoId: string): Promise<string> {
    try {
      // Try to get real audio stream from configured service
      const audioStream = await youtubeApiService.getAudioStream(videoId);

      if (audioStream && audioStream.url) {
        return audioStream.url;
      }
    } catch (error) {
      console.log('Real audio extraction not available, using demo audio');
    }

    // Fallback to demo audio URLs
    const demoAudioUrls = [
      "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      "https://file-examples.com/storage/fe936a63ad66a0ecbb2b85c/2017/11/file_example_MP3_700KB.mp3",
      "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
      "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
      "https://samplelib.com/lib/preview/mp3/sample-9s.mp3"
    ];

    // Return a demo audio URL based on video ID
    const index = parseInt(videoId.slice(-1), 36) % demoAudioUrls.length;
    return demoAudioUrls[index];
  }

  // Convert YouTube track to AudioFile format for the player
  async convertToAudioFile(track: YouTubeTrack): Promise<any> {
    const audioUrl = await this.getAudioStreamUrl(track.videoId);

    return {
      id: track.id,
      name: track.title,
      artist: track.artist,
      album: "YouTube Music",
      duration: track.duration,
      url: audioUrl,
      thumbnail: track.thumbnail,
      isYouTube: true,
      videoId: track.videoId
    };
  }
}

export const youtubeService = YouTubeService.getInstance();
