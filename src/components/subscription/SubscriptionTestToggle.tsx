import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, User, Settings, RefreshCw, Database } from "lucide-react";

interface SubscriptionTestToggleProps {
  hasMultipleActive: boolean;
  onToggle: () => void;
  onRefreshData?: () => void;
  onResetData?: () => void;
}

export const SubscriptionTestToggle: React.FC<SubscriptionTestToggleProps> = ({
  hasMultipleActive,
  onToggle,
  onRefreshData,
  onResetData,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover trigger */}
      <div className="relative">
        <div
          className={`transition-all duration-300 ${isHovered ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2 pointer-events-none"}`}
        >
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-lg border border-gray-600 p-4 mb-2 min-w-64">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Demo Controls
              </Badge>
            </div>

            <div className="space-y-2">
              <Button
                onClick={onToggle}
                size="sm"
                variant="outline"
                className="w-full text-white border-white/20 hover:bg-white/10 flex items-center gap-2 justify-start"
              >
                {hasMultipleActive ? (
                  <>
                    <User className="w-4 h-4" />
                    Switch to Single Plan
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Switch to Multiple Plans
                  </>
                )}
              </Button>

              {onRefreshData && (
                <Button
                  onClick={onRefreshData}
                  size="sm"
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10 flex items-center gap-2 justify-start"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Payment Data
                </Button>
              )}

              {onResetData && (
                <Button
                  onClick={onResetData}
                  size="sm"
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10 flex items-center gap-2 justify-start"
                >
                  <Database className="w-4 h-4" />
                  Reset All Data
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Always visible trigger button */}
        <div className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center border border-gray-600 transition-colors cursor-pointer">
          <Settings className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};
