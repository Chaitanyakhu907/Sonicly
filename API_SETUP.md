# 🔑 API Setup Guide for Real YouTube Music Streaming

This guide will help you configure real YouTube music streaming instead of demo audio tones.

## 🎯 Quick Setup Options

### Option 1: In-App Configuration (Recommended)
1. Open the app and go to the **Discover Music** tab
2. Click the **"Setup API Keys"** button (blue, animated)
3. Follow the step-by-step configuration wizard
4. Test your connection directly in the app

### Option 2: Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in your API keys
3. Restart the application

## 🔧 Required APIs

### 1. YouTube Data API v3 (Required)
**Purpose**: Search videos, get metadata, trending music

**Setup Steps**:
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Create credentials → API Key
5. (Optional) Restrict API key to YouTube Data API v3

**Cost**: Free up to 10,000 requests/day

### 2. Audio Extraction Service (Choose One)

#### Option A: RapidAPI (Easiest)
**Purpose**: Extract audio streams from YouTube videos

**Setup Steps**:
1. Go to [RapidAPI YouTube MP3](https://rapidapi.com/ytjar/api/youtube-mp36/)
2. Subscribe to the free plan
3. Copy your RapidAPI key from the dashboard

**Cost**: Free plan available with limitations

#### Option B: Custom Backend (Advanced)
**Purpose**: Self-hosted audio extraction

**Requirements**:
- Node.js/Python backend server
- `yt-dlp` or `youtube-dl` installed
- CORS configured for your frontend domain

**Example Backend Endpoint**:
```javascript
// GET /api/youtube/audio/:videoId
app.get('/api/youtube/audio/:videoId', async (req, res) => {
  const { videoId } = req.params;
  
  // Use yt-dlp to extract audio URL
  const audioUrl = await extractAudioUrl(videoId);
  
  res.json({
    url: audioUrl,
    quality: 'medium',
    format: 'mp3',
    itag: 140
  });
});
```

#### Option C: Demo Mode (No Setup)
Uses generated audio tones instead of real music. No API keys required.

## 🚀 Testing Your Setup

### In-App Testing
1. Open **Discover Music** tab
2. Click **"Setup API Keys"**
3. Enter your API keys
4. Click **"Test Connection"**
5. Look for green checkmark ✅

### Manual Testing
1. Open browser developer tools
2. Check console for any API errors
3. Try playing a song from the discovery section
4. Verify real audio plays instead of demo tones

## 🌍 Regional Configuration

The app is configured for **India** by default:
- Shows trending music from India
- Prioritizes Indian languages and genres
- Uses `regionCode: 'IN'` for YouTube API calls

To change region, modify the `getTrendingMusic` call in `youtubeApi.ts`.

## 🔍 Troubleshooting

### Common Issues

**"Connection failed" error**:
- Verify API keys are correct
- Check API quotas haven't been exceeded
- Ensure APIs are enabled in Google Cloud Console

**"CORS error" with RapidAPI**:
- RapidAPI should handle CORS automatically
- Try refreshing the page
- Check if you're subscribed to the API

**"No audio playing"**:
- Check browser console for errors
- Verify audio extraction service is working
- Try different videos/songs

**API quota exceeded**:
- YouTube API: 10,000 requests/day limit
- RapidAPI: Check your plan limits
- Consider implementing caching

### Debug Mode
Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug_youtube_api', 'true');
```

## 📊 Cost Considerations

### Free Tier Limits
- **YouTube Data API**: 10,000 requests/day
- **RapidAPI**: Usually 100-500 requests/month
- **Custom Backend**: Only server hosting costs

### Optimization Tips
- Cache search results
- Implement request throttling  
- Use trending endpoints efficiently
- Store popular tracks locally

## 🛠 Production Deployment

### Environment Variables
Set these in your hosting platform:
```bash
REACT_APP_YOUTUBE_API_KEY=your_key
REACT_APP_RAPIDAPI_KEY=your_key
REACT_APP_AUDIO_EXTRACTION_SERVICE=rapidapi
```

### Security Considerations
- Never commit API keys to git
- Use environment variables in production
- Consider API key rotation
- Monitor usage and costs
- Implement rate limiting

### Hosting Platforms
- **Vercel**: Add env vars in project settings
- **Netlify**: Add in site settings → environment variables
- **AWS/Azure**: Use their secret management services

## 📈 Monitoring & Analytics

Track API usage:
- YouTube API quota in Google Cloud Console
- RapidAPI usage in RapidAPI dashboard
- Set up alerts for quota limits
- Monitor error rates and response times

## 🎵 Supported Features

With real API configuration:
- ✅ Real YouTube music search
- ✅ Trending music by region
- ✅ High-quality audio streams
- ✅ Accurate metadata (duration, views)
- ✅ Fresh content discovery
- ✅ Multiple audio qualities

Without API (Demo mode):
- ✅ UI and navigation
- ✅ Generated audio tones
- ✅ Cached track metadata
- ✅ User preferences
- ❌ Real music streaming

## 💡 Tips for Indian Users

- Set up with `regionCode: 'IN'` for trending Bollywood hits
- Configure languages: Hindi, Tamil, Telugu, Punjabi
- Popular genres: Bollywood, Classical, Devotional, Folk
- Artists: Arijit Singh, Shreya Ghoshal, A.R. Rahman

## 🆘 Need Help?

1. Check the in-app error messages first
2. Look at browser developer console
3. Verify all API keys are valid and active
4. Test with simple search queries first
5. Check API service status pages

The app provides comprehensive error handling and fallbacks, so it will work in demo mode even if APIs aren't configured perfectly!
