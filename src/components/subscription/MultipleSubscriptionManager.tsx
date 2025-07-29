import React, { useState } from "react";
import {
  Crown,
  CreditCard,
  Calendar,
  ChevronDown,
  ArrowLeftRight,
  Settings,
  Pause,
  Play,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Subscription {
  id: string;
  planName: string;
  planType: "premium" | "family" | "student";
  price: number;
  currency: string;
  interval: "month" | "year";
  status: "active" | "paused" | "cancelled";
  nextBilling: string;
  isDefault: boolean;
  features: string[];
  startDate: string;
  paymentMethod: {
    type: "card" | "upi";
    last4?: string;
    upiId?: string;
  };
}

interface MultipleSubscriptionManagerProps {
  subscriptions: Subscription[];
  onSwitchPrimary: (subscriptionId: string) => void;
  onPauseSubscription: (subscriptionId: string) => void;
  onCancelSubscription: (subscriptionId: string) => void;
  onManagePayment: (subscriptionId: string) => void;
}

export const MultipleSubscriptionManager: React.FC<
  MultipleSubscriptionManagerProps
> = ({
  subscriptions,
  onSwitchPrimary,
  onPauseSubscription,
  onCancelSubscription,
  onManagePayment,
}) => {
  const [selectedSubscription, setSelectedSubscription] = useState<string>(
    subscriptions.find((s) => s.isDefault)?.id || subscriptions[0]?.id || "",
  );
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [pendingSwitchId, setPendingSwitchId] = useState<string>("");

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active",
  );
  const primarySubscription = subscriptions.find((s) => s.isDefault);
  const selectedSub = subscriptions.find((s) => s.id === selectedSubscription);

  const getStatusColor = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "paused":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "family":
        return "👨‍👩‍👧‍👦";
      case "student":
        return "🎓";
      default:
        return "👑";
    }
  };

  const handleSwitchPrimary = (subscriptionId: string) => {
    setPendingSwitchId(subscriptionId);
    setShowSwitchDialog(true);
  };

  const confirmSwitchPrimary = () => {
    onSwitchPrimary(pendingSwitchId);
    setShowSwitchDialog(false);
    setPendingSwitchId("");
    setSelectedSubscription(pendingSwitchId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateTotalCost = () => {
    return activeSubscriptions.reduce((total, sub) => {
      const monthlyRate = sub.interval === "year" ? sub.price / 12 : sub.price;
      return total + monthlyRate;
    }, 0);
  };

  if (subscriptions.length <= 1) {
    return null; // Don't show if user has only one or no subscriptions
  }

  return (
    <div className="space-y-6">
      {/* Multiple Plans Alert */}
      <Card className="bg-blue-500/10 backdrop-blur-lg border-blue-500/20 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="font-semibold text-blue-400">
                Multiple Active Plans
              </h4>
              <p className="text-sm text-gray-300">
                You have {activeSubscriptions.length} active subscriptions.
                Total monthly cost: ₹{calculateTotalCost().toFixed(0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selector */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              Manage Subscriptions
            </span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {activeSubscriptions.length} Active
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Switch between your plans or manage individual subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-white">
              Currently Viewing:
            </label>
            <Select
              value={selectedSubscription}
              onValueChange={setSelectedSubscription}
            >
              <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {subscriptions.map((sub) => (
                  <SelectItem
                    key={sub.id}
                    value={sub.id}
                    className="text-white"
                  >
                    <div className="flex items-center gap-2">
                      <span>{getPlanIcon(sub.planType)}</span>
                      <span>
                        {sub.planName} ({sub.currency}
                        {sub.price}/{sub.interval})
                      </span>
                      {sub.isDefault && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Subscription Details */}
          {selectedSub && (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getPlanIcon(selectedSub.planType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">
                        {selectedSub.planName}
                      </h3>
                      <Badge className={getStatusColor(selectedSub.status)}>
                        {selectedSub.status.charAt(0).toUpperCase() +
                          selectedSub.status.slice(1)}
                      </Badge>
                      {selectedSub.isDefault && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Primary Plan
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {selectedSub.currency}
                      {selectedSub.price}/{selectedSub.interval}
                    </p>
                    <p className="text-sm text-gray-400">
                      Next billing: {formatDate(selectedSub.nextBilling)}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Settings className="w-4 h-4" />
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    {!selectedSub.isDefault && (
                      <DropdownMenuItem
                        onClick={() => handleSwitchPrimary(selectedSub.id)}
                        className="text-white hover:bg-gray-700"
                      >
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Set as Primary
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onManagePayment(selectedSub.id)}
                      className="text-white hover:bg-gray-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Method
                    </DropdownMenuItem>
                    {selectedSub.status === "active" && (
                      <DropdownMenuItem
                        onClick={() => onPauseSubscription(selectedSub.id)}
                        className="text-yellow-400 hover:bg-yellow-900/20"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Plan
                      </DropdownMenuItem>
                    )}
                    {selectedSub.status === "paused" && (
                      <DropdownMenuItem
                        onClick={() => onPauseSubscription(selectedSub.id)}
                        className="text-green-400 hover:bg-green-900/20"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume Plan
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onCancelSubscription(selectedSub.id)}
                      className="text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel Plan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Plan Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Plan Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {selectedSub.features.slice(0, 6).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {selectedSub.paymentMethod.type === "card"
                      ? `Card ****${selectedSub.paymentMethod.last4}`
                      : `UPI: ${selectedSub.paymentMethod.upiId}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Switch Primary Plan Dialog */}
      <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-blue-400" />
              Switch Primary Plan
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              This will make the selected plan your primary subscription
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-2">
                What happens when you switch?
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• This plan becomes your primary subscription</li>
                <li>• Default billing and features will use this plan</li>
                <li>• Other plans remain active but secondary</li>
                <li>• You can switch back anytime</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSwitchDialog(false)}
                className="flex-1 text-white border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSwitchPrimary}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Switch Primary Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
