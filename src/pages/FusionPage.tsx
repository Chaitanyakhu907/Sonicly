import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FusionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Fusion Page
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Welcome to the Fusion experience - where innovation meets elegance
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Create</CardTitle>
              <CardDescription className="text-slate-300">
                Build something amazing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Unleash your creativity with powerful tools and intuitive
                design.
              </p>
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Collaborate
              </CardTitle>
              <CardDescription className="text-slate-300">
                Work together seamlessly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Connect with your team and bring ideas to life together.
              </p>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                Join Team
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Innovate</CardTitle>
              <CardDescription className="text-slate-300">
                Push the boundaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Explore new possibilities with cutting-edge technology.
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Explore
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Showcase */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Fusion Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-violet-300">
                🚀 Lightning Fast
              </h3>
              <p className="text-slate-300">
                Experience blazing-fast performance with optimized code and
                modern architecture.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-pink-300">
                🎨 Beautiful Design
              </h3>
              <p className="text-slate-300">
                Enjoy a stunning interface crafted with attention to every
                detail.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-300">
                🔧 Powerful Tools
              </h3>
              <p className="text-slate-300">
                Access a comprehensive suite of tools to accomplish any task.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan-300">
                🌟 Modern Stack
              </h3>
              <p className="text-slate-300">
                Built with the latest technologies for reliability and
                scalability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FusionPage;
