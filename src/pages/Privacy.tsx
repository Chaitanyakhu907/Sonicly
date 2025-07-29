import React, { useState } from "react";
import {
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Users,
  Globe,
  Lock,
  AlertTriangle,
  Download,
  Trash2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useOfflineStorage } from "@/lib/offlineStorage";

const Privacy = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useOfflineStorage();
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "friends", // public, friends, private
    showActivity: true,
    showPlaylists: true,
    allowDiscovery: true,
    analytics: settings.privacy.analytics,
    crashReports: settings.privacy.crashReports,
    personalizedAds: settings.privacy.personalizedAds,
    locationTracking: false,
    dataCollection: true,
    shareWithPartners: false,
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }));

    // Update app settings for known privacy settings
    if (["analytics", "crashReports", "personalizedAds"].includes(key)) {
      updateSettings({
        privacy: {
          ...settings.privacy,
          [key]: value as boolean,
        },
      });
    }
  };

  const handleDownloadData = () => {
    const userData = {
      profile: JSON.parse(localStorage.getItem("sonicly_profile") || "{}"),
      settings: JSON.parse(localStorage.getItem("sonicly_settings") || "{}"),
      account: JSON.parse(localStorage.getItem("sonicly_account") || "{}"),
      privacy: privacySettings,
      exportDate: new Date().toISOString(),
    };

    const dataBlob = new Blob([JSON.stringify(userData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sonicly-privacy-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setShowDataDialog(false);
    alert("📥 Your privacy data has been downloaded!");
  };

  const handleDeleteAllData = () => {
    localStorage.clear();
    setShowDeleteDialog(false);
    alert("🗑️ All your data has been permanently deleted!");
    navigate("/");
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="w-4 h-4 text-green-400" />;
      case "friends":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "private":
        return <Lock className="w-4 h-4 text-red-400" />;
      default:
        return <Eye className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/account")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Privacy Settings</h1>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Secure
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Privacy */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Profile Privacy
            </CardTitle>
            <CardDescription className="text-gray-300">
              Control who can see your profile and activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getVisibilityIcon(privacySettings.profileVisibility)}
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-gray-400">
                    Who can see your basic profile information
                  </p>
                </div>
              </div>
              <Select
                value={privacySettings.profileVisibility}
                onValueChange={(value) =>
                  handleSettingChange("profileVisibility", value)
                }
              >
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="public" className="text-white">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-400" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="friends" className="text-white">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Friends
                    </div>
                  </SelectItem>
                  <SelectItem value="private" className="text-white">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-400" />
                      Private
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Activity Status</p>
                <p className="text-sm text-gray-400">
                  Let others see when you're online and what you're listening to
                </p>
              </div>
              <Switch
                checked={privacySettings.showActivity}
                onCheckedChange={(checked) =>
                  handleSettingChange("showActivity", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Playlists</p>
                <p className="text-sm text-gray-400">
                  Allow others to see your public playlists
                </p>
              </div>
              <Switch
                checked={privacySettings.showPlaylists}
                onCheckedChange={(checked) =>
                  handleSettingChange("showPlaylists", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Discovery</p>
                <p className="text-sm text-gray-400">
                  Let other users find you by email or username
                </p>
              </div>
              <Switch
                checked={privacySettings.allowDiscovery}
                onCheckedChange={(checked) =>
                  handleSettingChange("allowDiscovery", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Analytics */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Data & Analytics
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage how your data is collected and used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics & Performance</p>
                <p className="text-sm text-gray-400">
                  Help improve Sonicly by sharing usage analytics
                </p>
              </div>
              <Switch
                checked={privacySettings.analytics}
                onCheckedChange={(checked) =>
                  handleSettingChange("analytics", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Crash Reports</p>
                <p className="text-sm text-gray-400">
                  Automatically send crash reports to help fix bugs
                </p>
              </div>
              <Switch
                checked={privacySettings.crashReports}
                onCheckedChange={(checked) =>
                  handleSettingChange("crashReports", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Personalized Ads</p>
                <p className="text-sm text-gray-400">
                  Show ads based on your music preferences
                </p>
              </div>
              <Switch
                checked={privacySettings.personalizedAds}
                onCheckedChange={(checked) =>
                  handleSettingChange("personalizedAds", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location Tracking</p>
                <p className="text-sm text-gray-400">
                  Use location for local music recommendations
                </p>
              </div>
              <Switch
                checked={privacySettings.locationTracking}
                onCheckedChange={(checked) =>
                  handleSettingChange("locationTracking", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Rights */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Your Data Rights
            </CardTitle>
            <CardDescription className="text-gray-300">
              Download or delete your personal data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-2">
                Download Your Data
              </h4>
              <p className="text-sm text-gray-300 mb-3">
                Get a copy of all your data including profile, playlists, and
                privacy settings.
              </p>
              <Button
                onClick={() => setShowDataDialog(true)}
                variant="outline"
                className="text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Request Data Export
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Delete All Data
              </h4>
              <p className="text-sm text-gray-300 mb-3">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="outline"
                className="text-red-400 border-red-400/20 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Export Dialog */}
      <Dialog open={showDataDialog} onOpenChange={setShowDataDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-400" />
              Download Your Data
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              We'll prepare a JSON file containing all your data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-2">
                What's included:
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Profile information and preferences</li>
                <li>• Privacy and security settings</li>
                <li>• Account and subscription details</li>
                <li>• Usage statistics and activity</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDataDialog(false)}
                className="flex-1 text-white border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDownloadData}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Download Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Data Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Delete All Data
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              This will permanently delete your account and all data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <h4 className="font-semibold text-red-400 mb-2">
                This will delete:
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Your profile and personal information</li>
                <li>• All playlists and music preferences</li>
                <li>• Account and subscription data</li>
                <li>• Usage history and activity logs</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 text-white border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAllData}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete Forever
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Privacy;
