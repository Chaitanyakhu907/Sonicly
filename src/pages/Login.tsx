import React, { useState } from "react";
import {
  Music,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signUp, socialLogin, users } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let success = false;

      if (isSignUp) {
        if (!name.trim()) {
          setError("Please enter your full name.");
          setIsLoading(false);
          return;
        }
        success = await signUp(name, email, password);
      } else {
        success = await login(email, password);
      }

      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(
          isSignUp
            ? "Sign up failed. Please try again."
            : "Invalid email or password. Please try again.",
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          (isSignUp
            ? "Sign up failed. Please try again."
            : "Login failed. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "microsoft") => {
    setIsLoading(true);
    setError("");

    try {
      // Dynamic import to avoid bundle size issues
      const { handleOAuthLogin } = await import("@/lib/oauth");

      const userData = await handleOAuthLogin(provider);
      const success = await socialLogin(provider, userData);

      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      // Check for configuration errors
      if (err.message.includes("Client ID not configured")) {
        setError(
          `${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not configured. Please contact the administrator.`,
        );
      } else if (err.message.includes("popup")) {
        setError(
          "Popup was blocked. Please allow popups for this site and try again.",
        );
      } else {
        setError(
          err.message ||
            `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please try again.`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fcb96d7e6a3bf4d53b47ab3e31ce2e4c0%2F392a3e68778d4a8191c95c37b7ef0216?format=webp&width=80"
              alt="Sonicly Logo"
              className="w-12 h-12 rounded-full"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sonicly
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Sound. Your Zone.
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Stream unlimited music, discover new artists, and create your
            perfect playlists.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              🎵 Unlimited Streaming
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              🎧 High Quality Audio
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              📱 Offline Downloads
            </Badge>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <LogIn className="w-6 h-6" />
                {isSignUp ? "Join Sonicly" : "Welcome Back"}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {isSignUp
                  ? "Create your free Sonicly account"
                  : "Sign in to your Sonicly account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      {isSignUp ? "Create Free Account" : "Sign In"}
                    </>
                  )}
                </Button>
              </form>

              {/* Social Login */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="text-sm text-gray-400">
                    Or continue with
                  </span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
                  >
                    <div className="w-4 h-4 bg-white rounded text-red-500 flex items-center justify-center text-xs font-bold">
                      G
                    </div>
                    Google
                  </Button>
                  <Button
                    onClick={() => handleSocialLogin("microsoft")}
                    disabled={isLoading}
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
                  >
                    <div className="w-4 h-4 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                      M
                    </div>
                    Microsoft
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-gray-400">
                <p>
                  {isSignUp
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                      setEmail("");
                      setPassword("");
                      setName("");
                    }}
                    className="text-purple-400 hover:underline font-medium"
                  >
                    {isSignUp ? "Sign in" : "Sign up for free"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
