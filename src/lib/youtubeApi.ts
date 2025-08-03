// YouTube API integration for real audio streaming

export interface YouTubeApiConfig {
  apiKey: string;
  baseUrl: string;
  audioExtractionService?: string;
}

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  viewCount?: string;
}

export interface YouTubeAudioStream {
  url: string;
  quality: string;
  format: string;
  itag: number;
}

class YouTubeApiService {
  private static instance: YouTubeApiService;
  private config: YouTubeApiConfig;

  constructor() {
    // Default configuration - user can override with their API key
    // Handle browser environment where process.env might not be available
    const getEnvVar = (key: string, defaultValue: string = '') => {
      if (typeof window !== 'undefined') {
        // Browser environment - check localStorage first, then window.env
        const stored = localStorage.getItem(key.toLowerCase().replace('react_app_', ''));
        if (stored) return stored;

        // Check if environment variables were set on window object
        const windowEnv = (window as any).process?.env?.[key];
        if (windowEnv) return windowEnv;
      }

      // Node.js environment or build-time environment variables
      try {
        return process?.env?.[key] || defaultValue;
      } catch {
        return defaultValue;
      }
    };

    this.config = {
      apiKey: getEnvVar('REACT_APP_YOUTUBE_API_KEY', ''),
      baseUrl: 'https://www.googleapis.com/youtube/v3',
      audioExtractionService: getEnvVar('REACT_APP_AUDIO_EXTRACTION_SERVICE', 'demo') as any
    };
  }

  static getInstance(): YouTubeApiService {
    if (!YouTubeApiService.instance) {
      YouTubeApiService.instance = new YouTubeApiService();
    }
    return YouTubeApiService.instance;
  }

  // Set API configuration
  setConfig(config: Partial<YouTubeApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Helper method to safely get environment variables
  private getEnvVar(key: string, defaultValue: string = ''): string {
    if (typeof window !== 'undefined') {
      // Browser environment - check localStorage first
      const storageKey = key.toLowerCase().replace('react_app_', '').replace(/_/g, '_');
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;

      // Check if environment variables were set on window object
      const windowEnv = (window as any).process?.env?.[key];
      if (windowEnv) return windowEnv;
    }

    // Node.js environment or build-time environment variables
    try {
      return (globalThis as any).process?.env?.[key] || defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // Search for videos using YouTube Data API v3
  async searchVideos(query: string, maxResults: number = 20): Promise<YouTubeSearchResult[]> {
    if (!this.config.apiKey) {
      console.warn('YouTube API key not configured, using mock data');
      return this.getMockSearchResults(query);
    }

    try {
      const searchUrl = `${this.config.baseUrl}/search`;
      const params = new URLSearchParams({
        key: this.config.apiKey,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: maxResults.toString(),
        videoCategoryId: '10', // Music category
        order: 'relevance'
      });

      const response = await fetch(`${searchUrl}?${params}`);

      if (!response.ok) {
        // Get error details from response
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = errorData.error?.message || errorData.message || '';
        } catch {
          // If we can't parse error response, continue with basic error
        }

        // Provide specific guidance for common errors
        if (response.status === 403) {
          const diagnosis = this.diagnose403Error(errorDetails);
          throw new Error(`YouTube API Error (403): ${diagnosis}`);
        } else if (response.status === 400) {
          throw new Error(`YouTube API Error (400): Invalid request. Check your API key format and query parameters.`);
        } else if (response.status === 429) {
          throw new Error(`YouTube API Error (429): Quota exceeded. You've reached your daily API limit.`);
        } else {
          throw new Error(`YouTube API Error (${response.status}): ${response.statusText}${errorDetails ? ' - ' + errorDetails : ''}`);
        }
      }

      const data = await response.json();

      // Validate response structure
      if (!data || !Array.isArray(data.items)) {
        console.warn('Invalid YouTube search response structure:', data);
        throw new Error('Invalid search response structure');
      }

      // Filter out items without proper video IDs
      const validItems = data.items.filter((item: any) => item.id?.videoId);

      if (validItems.length === 0) {
        console.warn('No valid video items found in search results');
        return [];
      }

      // Get video details including duration
      const videoIds = validItems.map((item: any) => item.id.videoId).join(',');
      const videoDetails = await this.getVideoDetails(videoIds);

      return validItems.map((item: any, index: number) => ({
        videoId: item.id.videoId,
        title: item.snippet?.title || 'Unknown Title',
        channelTitle: item.snippet?.channelTitle || 'Unknown Artist',
        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
        duration: videoDetails[index]?.duration || '0:00',
        publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
        viewCount: videoDetails[index]?.viewCount || '0'
      }));

    } catch (error) {
      console.error('YouTube search error:', error);
      return this.getMockSearchResults(query);
    }
  }

  // Get video details including duration
  private async getVideoDetails(videoIds: string): Promise<any[]> {
    if (!this.config.apiKey) return [];

    try {
      const detailsUrl = `${this.config.baseUrl}/videos`;
      const params = new URLSearchParams({
        key: this.config.apiKey,
        id: videoIds,
        part: 'contentDetails,statistics'
      });

      const response = await fetch(`${detailsUrl}?${params}`);

      if (!response.ok) {
        console.warn(`YouTube video details API error: ${response.status}`);
        return [];
      }

      const data = await response.json();

      // Validate response structure
      if (!data || !Array.isArray(data.items)) {
        console.warn('Invalid video details response structure:', data);
        return [];
      }

      return data.items.map((item: any) => ({
        duration: this.formatDuration(item.contentDetails?.duration || 'PT0S'),
        viewCount: item.statistics?.viewCount || '0'
      }));

    } catch (error) {
      console.error('Error getting video details:', error);
      return [];
    }
  }

  // Extract audio stream URL from YouTube video
  async getAudioStream(videoId: string): Promise<YouTubeAudioStream | null> {
    try {
      // Option 1: RapidAPI YouTube to MP3 converter
      if (this.config.audioExtractionService === 'rapidapi') {
        return await this.getRapidApiAudioStream(videoId);
      }
      
      // Option 2: Custom backend service
      if (this.config.audioExtractionService === 'custom') {
        return await this.getCustomAudioStream(videoId);
      }

      // Option 3: Client-side extraction (limited due to CORS)
      return await this.getClientSideAudioStream(videoId);

    } catch (error) {
      console.error('Audio extraction error:', error);
      return null;
    }
  }

  // RapidAPI YouTube to MP3 service
  private async getRapidApiAudioStream(videoId: string): Promise<YouTubeAudioStream | null> {
    // Safely get RapidAPI key
    const rapidApiKey = this.getEnvVar('REACT_APP_RAPIDAPI_KEY') || localStorage.getItem('rapidapi_key');

    if (!rapidApiKey) {
      console.warn('RapidAPI key not configured');
      return null;
    }

    try {
      const response = await fetch('https://youtube-mp36.p.rapidapi.com/dl', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        },
        params: {
          id: videoId
        } as any
      });

      const data = await response.json();
      
      if (data.link) {
        return {
          url: data.link,
          quality: 'medium',
          format: 'mp3',
          itag: 140
        };
      }

      return null;
    } catch (error) {
      console.error('RapidAPI extraction error:', error);
      return null;
    }
  }

  // Custom backend service for audio extraction
  private async getCustomAudioStream(videoId: string): Promise<YouTubeAudioStream | null> {
    const backendUrl = this.getEnvVar('REACT_APP_BACKEND_URL') || localStorage.getItem('custom_backend_url') || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${backendUrl}/api/youtube/audio/${videoId}`);
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Custom backend extraction error:', error);
      return null;
    }
  }

  // Client-side extraction (limited, for demo purposes)
  private async getClientSideAudioStream(videoId: string): Promise<YouTubeAudioStream | null> {
    console.warn('Client-side extraction is limited due to CORS policies');
    
    // This would require a proxy or CORS-enabled service
    // For now, return null to fall back to demo audio
    return null;
  }

  // Get trending music videos
  async getTrendingMusic(regionCode: string = 'IN'): Promise<YouTubeSearchResult[]> {
    if (!this.config.apiKey) {
      return this.getMockTrendingResults();
    }

    try {
      const trendingUrl = `${this.config.baseUrl}/videos`;
      const params = new URLSearchParams({
        key: this.config.apiKey,
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        videoCategoryId: '10', // Music
        regionCode: regionCode,
        maxResults: '20'
      });

      const response = await fetch(`${trendingUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response structure
      if (!data || !Array.isArray(data.items)) {
        console.warn('Invalid YouTube API response structure:', data);
        throw new Error('Invalid API response structure');
      }

      return data.items.map((item: any) => ({
        videoId: item.id,
        title: item.snippet?.title || 'Unknown Title',
        channelTitle: item.snippet?.channelTitle || 'Unknown Artist',
        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
        duration: this.formatDuration(item.contentDetails?.duration || 'PT0S'),
        publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
        viewCount: item.statistics?.viewCount || '0'
      }));

    } catch (error) {
      console.error('Error getting trending music:', error);
      return this.getMockTrendingResults();
    }
  }

  // Format ISO 8601 duration to MM:SS
  private formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    const totalMinutes = hours * 60 + minutes;
    
    if (totalMinutes >= 60) {
      const displayHours = Math.floor(totalMinutes / 60);
      const displayMinutes = totalMinutes % 60;
      return `${displayHours}:${displayMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Mock data fallbacks
  private getMockSearchResults(query: string): YouTubeSearchResult[] {
    // Return our existing Indian music catalog as search results
    return [
      {
        videoId: 's7mDJHGfNVg',
        title: 'Kesariya',
        channelTitle: 'Arijit Singh',
        thumbnail: 'https://i.ytimg.com/vi/s7mDJHGfNVg/maxresdefault.jpg',
        duration: '4:28',
        publishedAt: '2022-07-17T12:00:00Z'
      },
      {
        videoId: 'IJq0yyWug1k',
        title: 'Tum Hi Ho',
        channelTitle: 'Arijit Singh',
        thumbnail: 'https://i.ytimg.com/vi/IJq0yyWug1k/maxresdefault.jpg',
        duration: '4:22',
        publishedAt: '2013-04-08T12:00:00Z'
      }
    ];
  }

  private getMockTrendingResults(): YouTubeSearchResult[] {
    return this.getMockSearchResults('trending');
  }
}

export const youtubeApiService = YouTubeApiService.getInstance();
