import React, { useState } from "react";
import {
  Crown,
  Check,
  X,
  Zap,
  Users,
  Music,
  Download,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentSelectionModal } from "./PaymentSelectionModal";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  popular?: boolean;
  savings?: string;
  features: string[];
  limitations?: string[];
  icon: React.ReactNode;
  color: string;
}

const upgradePlans: Plan[] = [
  {
    id: "premium_monthly",
    name: "Premium",
    price: 199,
    currency: "₹",
    interval: "month",
    popular: true,
    features: [
      "Unlimited music streaming",
      "High quality audio (320kbps)",
      "No advertisements",
      "Offline downloads (unlimited)",
      "Premium playlists",
      "AI-powered recommendations",
      "Skip unlimited songs",
      "Exclusive releases",
    ],
    icon: <Crown className="w-6 h-6" />,
    color: "purple",
  },
  {
    id: "premium_yearly",
    name: "Premium Yearly",
    price: 1990,
    currency: "₹",
    interval: "year",
    savings: "Save 17%",
    features: [
      "Everything in Premium",
      "2 months free",
      "Priority customer support",
      "Early access to new features",
      "Exclusive member events",
      "Advanced audio settings",
    ],
    icon: <Star className="w-6 h-6" />,
    color: "gold",
  },
  {
    id: "family_monthly",
    name: "Family",
    price: 299,
    currency: "₹",
    interval: "month",
    features: [
      "Everything in Premium",
      "Up to 6 family members",
      "Individual profiles",
      "Parental controls",
      "Family mix playlists",
      "Shared favorites",
      "Kids-safe mode",
      "Usage monitoring",
    ],
    icon: <Users className="w-6 h-6" />,
    color: "blue",
  },
];

const freeFeatures = [
  "Basic music streaming",
  "Limited song skips (5/hour)",
  "Standard audio quality",
  "Advertisements",
  "Limited downloads (10/month)",
  "Basic playlists",
];

const freeLimitations = [
  "Ads between songs",
  "Limited offline downloads",
  "Lower audio quality",
  "Skip restrictions",
  "No exclusive content",
];

interface UpgradePlansProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

export const UpgradePlans: React.FC<UpgradePlansProps> = ({
  isOpen,
  onClose,
  currentPlan = "free",
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    onClose();
    toast({
      title: `Welcome to ${selectedPlan?.name}!`,
      description: "Your premium features are now active.",
    });
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "purple":
        return {
          bg: "bg-purple-500/20",
          text: "text-purple-400",
          border: "border-purple-500/30",
          button: "bg-purple-600 hover:bg-purple-700",
        };
      case "gold":
        return {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          border: "border-yellow-500/30",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "blue":
        return {
          bg: "bg-blue-500/20",
          text: "text-blue-400",
          border: "border-blue-500/30",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          text: "text-gray-400",
          border: "border-gray-500/30",
          button: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  return (
    <>
      <Dialog open={isOpen && !showPaymentModal} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                Upgrade Your Experience
              </div>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center text-lg">
              Unlock premium features and take your music experience to the next
              level
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {/* Current Plan - Free */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Your Current Plan
              </h3>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-300">
                    <Music className="w-5 h-5" />
                    Free Plan
                    <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                      Current
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold text-white">
                    ₹0<span className="text-sm text-gray-400">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-400 mb-2">
                        ✓ What you get:
                      </h4>
                      <ul className="space-y-1">
                        {freeFeatures.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-300"
                          >
                            <Check className="w-3 h-3 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-400 mb-2">
                        ✗ Limitations:
                      </h4>
                      <ul className="space-y-1">
                        {freeLimitations.map((limitation, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-400"
                          >
                            <X className="w-3 h-3 text-red-400" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upgrade Plans */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Choose Your Upgrade
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upgradePlans.map((plan) => {
                  const colors = getColorClasses(plan.color);
                  return (
                    <Card
                      key={plan.id}
                      className={`bg-white/5 border-white/20 relative ${
                        plan.popular ? "ring-2 ring-purple-500" : ""
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                          Most Popular
                        </Badge>
                      )}
                      {plan.savings && (
                        <Badge className="absolute -top-3 right-4 bg-green-600 text-white">
                          {plan.savings}
                        </Badge>
                      )}
                      <CardHeader className="text-center">
                        <div
                          className={`w-12 h-12 mx-auto rounded-full ${colors.bg} flex items-center justify-center ${colors.text} mb-2`}
                        >
                          {plan.icon}
                        </div>
                        <CardTitle className="text-white">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-3xl font-bold text-white">
                          {plan.currency}
                          {plan.price}
                          <span className="text-sm text-gray-400">
                            /{plan.interval}
                          </span>
                        </CardDescription>
                        {plan.interval === "year" && (
                          <p className="text-sm text-gray-400">
                            ≈ ₹{Math.round(plan.price / 12)}/month
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {plan.features.slice(0, 6).map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm text-gray-300"
                            >
                              <Check className="w-4 h-4 text-green-400" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 6 && (
                            <li className="text-gray-500 text-sm">
                              +{plan.features.length - 6} more features
                            </li>
                          )}
                        </ul>
                        <Button
                          onClick={() => handleSelectPlan(plan)}
                          className={`w-full ${colors.button}`}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Upgrade Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Benefits Summary */}
            <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Why Upgrade to Premium?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
                    <Music className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-medium text-white">Unlimited Music</h4>
                  <p className="text-sm text-gray-400">
                    Stream millions of songs without limits
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                    <Download className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-medium text-white">Offline Downloads</h4>
                  <p className="text-sm text-gray-400">
                    Listen anywhere, even without internet
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                    <Crown className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-medium text-white">Premium Quality</h4>
                  <p className="text-sm text-gray-400">
                    320kbps audio and no advertisements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentSelectionModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          currency={selectedPlan.currency}
          interval={selectedPlan.interval}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};
