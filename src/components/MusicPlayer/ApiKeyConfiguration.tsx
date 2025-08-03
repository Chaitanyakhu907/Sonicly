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
import { cn } from "@/lib/utils";

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

  const testDemoMode = () => {
    setConnectionStatus('success');
    toast.success("🎵 Demo Mode Ready!", {
      description: "You can use the app with demo audio tones. No API key needed!"
    });
  };

  const testConnection = async () => {
    if (!youtubeApiKey.trim()) {
      toast.warning("⚠️ No API Key Entered", {
        description: "Enter your YouTube API key above, or use Demo Mode instead.",
        duration: 5000
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('testing');

    try {
      // Configure the service
      youtubeApiService.setConfig({
        apiKey: youtubeApiKey.trim(),
        audioExtractionService: selectedService
      });

      // Test YouTube API with a simple search
      const testResults = await youtubeApiService.searchVideos('music', 1);

      if (testResults && testResults.length > 0) {
        setConnectionStatus('success');
        toast.success("✅ Real YouTube API Connected!", {
          description: `Found ${testResults.length} result(s). You can now stream real music from YouTube!`
        });
      } else {
        setConnectionStatus('error');
        toast.error("❌ No results found", {
          description: "API connected but returned no results. Check your search parameters."
        });
      }
    } catch (error: any) {
      console.error('API test error:', error);
      setConnectionStatus('error');

      // Extract useful error message
      const errorMessage = error.message || error.toString();

      if (errorMessage.includes('403')) {
        toast.info("🔑 YouTube API Key Needed", {
          description: "This is normal! To stream real YouTube music, you need an API key. Or continue with Demo Mode for a full experience.",
          duration: 8000,
          action: {
            label: "Switch to Demo Mode",
            onClick: () => {
              setSelectedService('demo');
              testDemoMode();
            }
          }
        });
      } else if (errorMessage.includes('400')) {
        toast.error("❌ Invalid API Key Format", {
          description: "Check your API key format - it should be a 39-character string"
        });
      } else if (errorMessage.includes('429')) {
        toast.error("❌ Quota Exceeded", {
          description: "You've reached your daily API limit (10,000 requests). Try again tomorrow."
        });
      } else {
        toast.error("❌ Connection failed", {
          description: errorMessage.length > 100 ?
            "Please check your API key and try again" :
            errorMessage
        });
      }
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

    // Configuration is now handled through localStorage and the service's setConfig method

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
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Key className="h-6 w-6 text-blue-500" />
              Configure YouTube API for Real Music Streaming
            </DialogTitle>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedService('demo');
                testDemoMode();
                setTimeout(() => {
                  saveConfiguration();
                }, 500);
              }}
              className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
            >
              🎵 Quick Start Demo
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Alert */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Quick Start:</strong> You can use the app immediately in Demo Mode (no setup required), or configure YouTube API keys to stream real music.
            </AlertDescription>
          </Alert>

          {selectedService === 'demo' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Demo Mode Selected:</strong> The app will work with pleasant audio tones and a curated music catalog. Perfect for testing the interface!
              </AlertDescription>
            </Alert>
          )}

          {selectedService !== 'demo' && !youtubeApiKey && (
            <Alert className="border-orange-200 bg-orange-50">
              <Info className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Note:</strong> Testing without an API key will show a "403 error" - this is normal! You can either get a YouTube API key (instructions below) or use Demo Mode for immediate access.
              </AlertDescription>
            </Alert>
          )}

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
                <span className="text-purple-600 font-medium"> Leave blank to use Demo Mode.</span>
              </p>
            </div>

            {/* Setup Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Setup Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Go to Google Cloud Console</li>
                  <li>Enable "YouTube Data API v3"</li>
                  <li>Create credentials → API Key</li>
                  <li>Copy the API key here</li>
                  <li>Test the connection below</li>
                </ol>
              </AlertDescription>
            </Alert>
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

                {selectedService === 'demo' ? (
                  <Button
                    onClick={testDemoMode}
                    variant="outline"
                    className="bg-purple-50 hover:bg-purple-100"
                  >
                    ✓ Demo Mode Ready
                  </Button>
                ) : (
                  <Button
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    variant="outline"
                  >
                    {isTestingConnection ? 'Testing API...' : 'Test YouTube API'}
                  </Button>
                )}
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

            {connectionStatus === 'error' && selectedService !== 'demo' && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="space-y-2">
                    <p><strong>YouTube API Test Failed</strong> - This is expected without a valid API key.</p>
                    <p className="text-sm">To use real YouTube music, you need to:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Get a YouTube Data API v3 key from Google Cloud Console</li>
                      <li>Enable the YouTube Data API v3 service</li>
                      <li>Enter your API key above and test again</li>
                    </ul>
                    <p className="text-sm font-medium">Or simply use Demo Mode for immediate access!</p>
                  </div>
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
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedService('demo');
                  testDemoMode();
                }}
                className="bg-purple-50 hover:bg-purple-100 border-purple-200"
              >
                🎵 Use Demo Mode
              </Button>
              <Button
                onClick={saveConfiguration}
                className={cn(
                  selectedService === 'demo'
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {selectedService === 'demo' ? '🎵 Start Demo Mode' : '🔑 Save API Keys'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyConfiguration;
