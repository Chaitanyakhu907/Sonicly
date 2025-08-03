import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Settings,
  Globe,
  Music
} from "lucide-react";
import { youtubeApiService } from "@/lib/youtubeApi";
import { toast } from "sonner";

interface ApiKeyConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured: () => void;
}

const ApiKeyConfiguration: React.FC<ApiKeyConfigurationProps> = ({
  isOpen,
  onClose,
  onConfigured
}) => {
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [rapidApiKey, setRapidApiKey] = useState('');
  const [customBackendUrl, setCustomBackendUrl] = useState('');
  const [selectedService, setSelectedService] = useState<'rapidapi' | 'custom' | 'demo'>('demo');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Load saved configuration
    const savedYouTubeKey = localStorage.getItem('youtube_api_key');
    const savedRapidKey = localStorage.getItem('rapidapi_key');
    const savedBackendUrl = localStorage.getItem('custom_backend_url');
    const savedService = localStorage.getItem('audio_extraction_service') as any;

    if (savedYouTubeKey) setYoutubeApiKey(savedYouTubeKey);
    if (savedRapidKey) setRapidApiKey(savedRapidKey);
    if (savedBackendUrl) setCustomBackendUrl(savedBackendUrl);
    if (savedService) setSelectedService(savedService);
  }, []);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');

    try {
      // Configure the service
      youtubeApiService.setConfig({
        apiKey: youtubeApiKey,
        audioExtractionService: selectedService
      });

      // Test YouTube API
      const testResults = await youtubeApiService.searchVideos('test music', 1);
      
      if (testResults.length > 0) {
        setConnectionStatus('success');
        toast.success("Connection successful!", {
          description: "YouTube API is working properly"
        });
      } else {
        setConnectionStatus('error');
        toast.error("Connection failed", {
          description: "Unable to fetch data from YouTube API"
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error("Connection failed", {
        description: "Please check your API keys and try again"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveConfiguration = () => {
    // Save to localStorage
    if (youtubeApiKey) localStorage.setItem('youtube_api_key', youtubeApiKey);
    if (rapidApiKey) localStorage.setItem('rapidapi_key', rapidApiKey);
    if (customBackendUrl) localStorage.setItem('custom_backend_url', customBackendUrl);
    localStorage.setItem('audio_extraction_service', selectedService);

    // Configure the service
    youtubeApiService.setConfig({
      apiKey: youtubeApiKey,
      audioExtractionService: selectedService
    });

    // Set environment variables (for this session)
    if (typeof window !== 'undefined') {
      (window as any).process = (window as any).process || {};
      (window as any).process.env = (window as any).process.env || {};
      (window as any).process.env.REACT_APP_YOUTUBE_API_KEY = youtubeApiKey;
      (window as any).process.env.REACT_APP_RAPIDAPI_KEY = rapidApiKey;
      (window as any).process.env.REACT_APP_BACKEND_URL = customBackendUrl;
    }

    toast.success("Configuration saved!", {
      description: "API keys have been configured successfully"
    });

    onConfigured();
  };

  const openYouTubeApiConsole = () => {
    window.open('https://console.developers.google.com/apis/credentials', '_blank');
  };

  const openRapidApiDashboard = () => {
    window.open('https://rapidapi.com/ytjar/api/youtube-mp36/', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Key className="h-6 w-6 text-blue-500" />
            Configure YouTube API for Real Music Streaming
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Configure API keys to stream real music from YouTube. Without API keys, the app will use demo audio tones.
            </AlertDescription>
          </Alert>

          {/* Service Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Choose Audio Extraction Service
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Demo Mode */}
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedService === 'demo' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedService('demo')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Music className="h-4 w-4" />
                    Demo Mode
                    <Badge variant="secondary">Free</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-2">
                    Uses generated audio tones. No API keys required.
                  </p>
                  <div className="text-xs text-green-600">✓ No setup required</div>
                  <div className="text-xs text-yellow-600">⚠ Demo audio only</div>
                </CardContent>
              </Card>

              {/* RapidAPI */}
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedService === 'rapidapi' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedService('rapidapi')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4" />
                    RapidAPI
                    <Badge variant="outline">Recommended</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-2">
                    Third-party API for YouTube audio extraction.
                  </p>
                  <div className="text-xs text-green-600">✓ Easy setup</div>
                  <div className="text-xs text-green-600">✓ Real audio streams</div>
                  <div className="text-xs text-yellow-600">⚠ Rate limited</div>
                </CardContent>
              </Card>

              {/* Custom Backend */}
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedService === 'custom' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedService('custom')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    Custom Backend
                    <Badge variant="outline">Advanced</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-2">
                    Your own backend service with yt-dlp or similar.
                  </p>
                  <div className="text-xs text-green-600">✓ No rate limits</div>
                  <div className="text-xs text-green-600">✓ Full control</div>
                  <div className="text-xs text-yellow-600">⚠ Requires setup</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* YouTube Data API Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">YouTube Data API v3</Label>
              <Button variant="outline" size="sm" onClick={openYouTubeApiConsole}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Get API Key
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube-api-key">API Key</Label>
              <Input
                id="youtube-api-key"
                type="password"
                placeholder="Enter your YouTube Data API v3 key"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Required for searching and fetching video metadata from YouTube.
              </p>
            </div>
          </div>

          {/* RapidAPI Configuration */}
          {selectedService === 'rapidapi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">RapidAPI Configuration</Label>
                <Button variant="outline" size="sm" onClick={openRapidApiDashboard}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get RapidAPI Key
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rapidapi-key">RapidAPI Key</Label>
                <Input
                  id="rapidapi-key"
                  type="password"
                  placeholder="Enter your RapidAPI key"
                  value={rapidApiKey}
                  onChange={(e) => setRapidApiKey(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Required for extracting audio streams from YouTube videos.
                </p>
              </div>
            </div>
          )}

          {/* Custom Backend Configuration */}
          {selectedService === 'custom' && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Custom Backend Service</Label>
              
              <div className="space-y-2">
                <Label htmlFor="backend-url">Backend URL</Label>
                <Input
                  id="backend-url"
                  type="url"
                  placeholder="http://localhost:3001"
                  value={customBackendUrl}
                  onChange={(e) => setCustomBackendUrl(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  URL of your backend service that handles YouTube audio extraction.
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your backend should have an endpoint: <code>GET /api/youtube/audio/:videoId</code> that returns audio stream URLs.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Test Connection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Test Configuration</Label>
              <div className="flex items-center gap-2">
                {connectionStatus === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {connectionStatus === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <Button 
                  onClick={testConnection}
                  disabled={isTestingConnection || !youtubeApiKey}
                  variant="outline"
                >
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </div>

            {connectionStatus === 'success' && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="text-green-700">
                  Connection successful! YouTube API is working properly.
                </AlertDescription>
              </Alert>
            )}

            {connectionStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connection failed. Please check your API keys and try again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedService('demo')}>
                Skip & Use Demo
              </Button>
              <Button 
                onClick={saveConfiguration}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyConfiguration;
