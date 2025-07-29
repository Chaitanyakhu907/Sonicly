import React, { useState } from "react";
import {
  ArrowLeft,
  Crown,
  CreditCard,
  Check,
  X,
  Calendar,
  Download,
  AlertCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOfflineStorage } from "@/lib/offlineStorage";
import { PaymentSelectionModal } from "./PaymentSelectionModal";
import { useSubscriptionData } from "@/lib/subscriptionData";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
  current?: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  invoice_url?: string;
  plan: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "₹",
    interval: "month",
    features: [
      "Basic music streaming",
      "Limited song downloads (10/month)",
      "Standard audio quality",
      "Ads between songs",
      "Basic playlists",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 199,
    currency: "₹",
    interval: "month",
    popular: true,
    current: true,
    features: [
      "Unlimited music streaming",
      "Unlimited song downloads",
      "High quality audio (320kbps)",
      "No advertisements",
      "Offline listening",
      "Premium playlists",
      "AI-powered recommendations",
    ],
  },
  {
    id: "family",
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
    ],
  },
  {
    id: "premium_yearly",
    name: "Premium (Yearly)",
    price: 1990,
    currency: "₹",
    interval: "year",
    features: [
      "Everything in Premium",
      "2 months free (17% savings)",
      "Priority customer support",
      "Early access to new features",
    ],
  },
];

// billingHistory is already defined from the hook above

export const SubscriptionPortal: React.FC<SubscriptionPortalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, updateProfile } = useOfflineStorage();
  const { subscriptions, billingHistory, refresh, service } =
    useSubscriptionData();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [planToUpgrade, setPlanToUpgrade] = useState<Plan | null>(null);

  // Check if user has any active subscriptions
  const hasActiveSubscription = subscriptions.some(
    (sub) => sub.status === "active",
  );
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active",
  );

  const handlePlanChange = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    if (plan.id === "free") {
      // Handle downgrade to free plan
      setSelectedPlan(planId);
      setIsChangingPlan(true);

      setTimeout(() => {
        // Cancel all active subscriptions to downgrade to free
        const activeSubscriptions = subscriptions.filter(
          (sub) => sub.status === "active",
        );
        activeSubscriptions.forEach((sub) => {
          service.updateSubscription(sub.id, { status: "cancelled" });
        });

        // Add billing record for cancellation
        if (activeSubscriptions.length > 0) {
          service.addBillingRecord({
            amount: 0,
            currency: "₹",
            status: "paid",
            plan: "Plan Cancellation",
            paymentMethod: "System",
          });
        }

        refresh(); // Refresh the UI
        setIsChangingPlan(false);
        setSelectedPlan(null);
        toast({
          title: "Plan Changed!",
          description: `Successfully downgraded to ${plan.name} plan!`,
        });
      }, 2000);
    } else {
      // Handle upgrade - show payment modal
      setPlanToUpgrade(plan);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    if (!planToUpgrade) return;

    setIsChangingPlan(true);
    setTimeout(() => {
      // Cancel existing active subscriptions
      const activeSubscriptions = subscriptions.filter(
        (sub) => sub.status === "active",
      );
      activeSubscriptions.forEach((sub) => {
        service.updateSubscription(sub.id, { status: "cancelled" });
      });

      // Add new subscription
      const newSubscription = service.addSubscription({
        planName: planToUpgrade.name,
        planType: planToUpgrade.id.includes("family") ? "family" : "premium",
        price: planToUpgrade.price,
        currency: planToUpgrade.currency,
        interval: planToUpgrade.interval,
        status: "active",
        isDefault: true,
        features: planToUpgrade.features,
        paymentMethod: {
          type: "card",
          last4: "4242",
          brand: "Visa",
        },
      });

      // Add billing record for the new subscription
      service.addBillingRecord({
        amount: planToUpgrade.price,
        currency: planToUpgrade.currency,
        status: "paid",
        plan: planToUpgrade.name,
        paymentMethod: "Visa ****4242",
      });

      refresh(); // Refresh the UI
      setIsChangingPlan(false);
      setPlanToUpgrade(null);
      toast({
        title: "Upgrade Complete!",
        description: `Successfully upgraded to ${planToUpgrade.name} plan!`,
      });
    }, 1000);
  };

  const handleCancelSubscription = () => {
    // Cancel all active subscriptions
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "active",
    );
    activeSubscriptions.forEach((sub) => {
      service.updateSubscription(sub.id, { status: "cancelled" });
    });

    // Add billing record for cancellation
    if (activeSubscriptions.length > 0) {
      service.addBillingRecord({
        amount: 0,
        currency: "₹",
        status: "paid",
        plan: "Subscription Cancellation",
        paymentMethod: "System",
      });
    }

    refresh(); // Refresh the UI
    setShowCancelDialog(false);
    toast({
      title: "Subscription Cancelled",
      description: "We're sad to see you go! Your premium access will continue until your current billing period ends.",
      variant: "destructive",
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice ${invoiceId} is being downloaded...`,
    });
    // In a real app, this would download the actual invoice
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: BillingHistory["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-gray-900 pb-4 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  Subscription Portal
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Manage your Sonicly subscription and billing
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-purple-600"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="data-[state=active]:bg-purple-600"
              >
                Change Plan
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-purple-600"
              >
                Billing History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Current Plan */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Current Plan</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your active subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasActiveSubscription && activeSubscription ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {activeSubscription.planName}
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Active
                          </Badge>
                        </h3>
                        <p className="text-gray-400">
                          {activeSubscription.currency}
                          {activeSubscription.price}/
                          {activeSubscription.interval}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Next billing: {activeSubscription.nextBilling}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelDialog(true)}
                          className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                        >
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          Free Plan
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                            Active
                          </Badge>
                        </h3>
                        <p className="text-gray-400">₹0/month</p>
                        <p className="text-sm text-gray-500 mt-1">
                          No billing required
                        </p>
                      </div>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const premiumPlan = plans.find(
                              (p) => p.id === "premium",
                            );
                            if (premiumPlan) {
                              setPlanToUpgrade(premiumPlan);
                              setShowPaymentModal(true);
                            }
                          }}
                          className="text-purple-400 border-purple-400/20 hover:bg-purple-400/10"
                        >
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold text-white mb-3">
                      {hasActiveSubscription
                        ? "Plan Benefits:"
                        : "Free Plan Features:"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(hasActiveSubscription
                        ? activeSubscription?.features
                        : plans.find((p) => p.id === "free")?.features || []
                      ).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-gray-300"
                        >
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        847
                      </div>
                      <div className="text-sm text-gray-400">Songs Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">45</div>
                      <div className="text-sm text-gray-400">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        156h
                      </div>
                      <div className="text-sm text-gray-400">
                        Listening Time
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => {
                  const isCurrentPlan = hasActiveSubscription
                    ? activeSubscription?.planType === plan.id ||
                      activeSubscription?.planName
                        .toLowerCase()
                        .includes(plan.name.toLowerCase())
                    : plan.id === "free";

                  return (
                    <Card
                      key={plan.id}
                      className={`bg-white/5 border-white/20 relative ${
                        plan.popular ? "ring-2 ring-purple-500" : ""
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-4 bg-purple-600 text-white">
                          Most Popular
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          {plan.name}
                          {isCurrentPlan && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Current
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="text-2xl font-bold text-white">
                          {plan.currency}
                          {plan.price}
                          <span className="text-sm text-gray-400">
                            /{plan.interval}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-4">
                          {plan.features.slice(0, 4).map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-gray-300 text-sm"
                            >
                              <Check className="w-4 h-4 text-green-400" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 4 && (
                            <li className="text-gray-500 text-sm">
                              +{plan.features.length - 4} more features
                            </li>
                          )}
                        </ul>
                        <Button
                          onClick={() => handlePlanChange(plan.id)}
                          disabled={isCurrentPlan || isChangingPlan}
                          className={`w-full ${
                            isCurrentPlan
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {isCurrentPlan
                            ? "Current Plan"
                            : isChangingPlan && selectedPlan === plan.id
                              ? "Switching..."
                              : plan.id === "free"
                                ? "Downgrade"
                                : "Upgrade"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-6">
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Billing History</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your payment history and invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {billingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {billingHistory.map((bill) => (
                        <div
                          key={bill.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-purple-600/20">
                              <CreditCard className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {bill.plan}
                              </div>
                              <div className="text-sm text-gray-400 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {formatDate(bill.date)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-medium text-white">
                                {bill.currency}
                                {bill.amount}
                              </div>
                              <Badge className={getStatusColor(bill.status)}>
                                {bill.status.charAt(0).toUpperCase() +
                                  bill.status.slice(1)}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(bill.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-4 rounded-full bg-gray-600/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        No Billing History
                      </h3>
                      <p className="text-gray-400 mb-4">
                        You haven't made any payments yet. Upgrade to a premium
                        plan to start your billing history.
                      </p>
                      <Button
                        onClick={() => {
                          const premiumPlan = plans.find(
                            (p) => p.id === "premium",
                          );
                          if (premiumPlan) {
                            setPlanToUpgrade(premiumPlan);
                            setShowPaymentModal(true);
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to cancel your premium subscription?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <h4 className="font-semibold text-red-400 mb-2">
                You'll lose access to:
              </h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Unlimited music downloads</li>
                <li>• High quality audio streaming</li>
                <li>• Ad-free listening experience</li>
                <li>• Offline music access</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 text-white border-white/20 hover:bg-white/10"
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Selection Modal */}
      {planToUpgrade && (
        <PaymentSelectionModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPlanToUpgrade(null);
          }}
          planName={planToUpgrade.name}
          planPrice={planToUpgrade.price}
          currency={planToUpgrade.currency}
          interval={planToUpgrade.interval}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};
