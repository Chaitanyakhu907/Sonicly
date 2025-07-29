import React, { useState } from "react";
import {
  ArrowLeft,
  Crown,
  CreditCard,
  Shield,
  Globe,
  Download,
  Trash2,
  Plus,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AddPaymentMethod } from "@/components/payments/AddPaymentMethod";
import { mockPaymentMethods, type PaymentMethod } from "@/lib/stripe";
import { SubscriptionPortal } from "@/components/subscription/SubscriptionPortal";
import { MultipleSubscriptionManager } from "@/components/subscription/MultipleSubscriptionManager";
import { SubscriptionTestToggle } from "@/components/subscription/SubscriptionTestToggle";
import { useSubscriptionData } from "@/lib/subscriptionData";

const Account = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [language, setLanguage] = useState("en");
  const [userEmail, setUserEmail] = useState(currentUser?.email || "");
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showSubscriptionPortal, setShowSubscriptionPortal] = useState(false);

  // Dynamic subscription data
  const {
    subscriptions: userSubscriptions,
    paymentMethods: dynamicPaymentMethods,
    billingHistory: dynamicBillingHistory,
    refresh: refreshSubscriptionData,
    service: subscriptionService,
  } = useSubscriptionData();

  // Initialize payment methods state with dynamic data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    dynamicPaymentMethods,
  );

  // Sync payment methods when dynamic data changes
  React.useEffect(() => {
    setPaymentMethods(dynamicPaymentMethods);
  }, [dynamicPaymentMethods]);

  // Refresh subscription data when component mounts and when returning to this page
  React.useEffect(() => {
    refreshSubscriptionData();
  }, []);

  // Button functionality handlers
  const handleManagePlan = () => {
    setShowSubscriptionPortal(true);
  };

  const handleSubscriptionPortalClose = () => {
    setShowSubscriptionPortal(false);
    // Refresh data when portal closes to reflect any changes
    refreshSubscriptionData();
  };

  const handleSaveChanges = () => {
    // In a real app, this would update the user's email in the backend
    toast({
      title: "Account settings saved!",
      description: "Your account information has been updated successfully.",
    });
  };

  const handleEditPayment = (methodIndex: number) => {
    toast({
      title: "Edit Payment Method",
      description: `Editing ${paymentMethods[methodIndex].type} payment method.`,
    });
    // In a real app, this would open payment method editor
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentModal(true);
  };

  const handlePaymentMethodAdded = (newPaymentMethod: any) => {
    // Add to the subscription service for consistency
    subscriptionService.addPaymentMethod({
      type: newPaymentMethod.type,
      card: newPaymentMethod.card,
      upi: newPaymentMethod.upi,
      isDefault: paymentMethods.length === 0,
    });

    // Refresh subscription data to sync payment methods
    refreshSubscriptionData();
    toast({
      title: "Payment method added!",
      description: "Your new payment method has been added successfully.",
    });
  };

  const handleSetDefaultPayment = (methodId: string) => {
    subscriptionService.setDefaultPaymentMethod(methodId);
    refreshSubscriptionData();
    toast({
      title: "Default payment updated!",
      description: "Your default payment method has been updated.",
    });
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this payment method?",
    );
    if (confirm) {
      subscriptionService.removePaymentMethod(methodId);
      refreshSubscriptionData();
      toast({
        title: "Payment method removed!",
        description: "The payment method has been removed from your account.",
      });
    }
  };

  const handleDownloadData = () => {
    const userData = {
      user: currentUser,
      settings: JSON.parse(localStorage.getItem("sonicly_settings") || "{}"),
    };
    const dataBlob = new Blob([JSON.stringify(userData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sonicly-user-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Data downloaded!",
      description: "Your account data has been downloaded successfully.",
    });
  };

  const handlePrivacySettings = () => {
    navigate("/privacy");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = confirm(
      "⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you sure?",
    );
    if (confirmDelete) {
      const doubleConfirm = confirm(
        "🚨 FINAL WARNING: Type 'DELETE' in your mind and click OK to confirm permanent account deletion.",
      );
      if (doubleConfirm) {
        // Clear all data
        localStorage.clear();
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/"), 1000);
      }
    }
  };

  // Multiple subscription handlers
  const handleSwitchPrimary = (subscriptionId: string) => {
    subscriptionService.setPrimarySubscription(subscriptionId);
    refreshSubscriptionData();
    toast({
      title: "Primary plan switched!",
      description: "Your primary subscription plan has been updated.",
    });
  };

  const handlePauseSubscription = (subscriptionId: string) => {
    const sub = userSubscriptions.find((s) => s.id === subscriptionId);
    const newStatus = sub?.status === "active" ? "paused" : "active";
    subscriptionService.updateSubscription(subscriptionId, {
      status: newStatus,
    });
    refreshSubscriptionData();
    const action = sub?.status === "active" ? "paused" : "resumed";
    toast({
      title: `Subscription ${action}!`,
      description: `Your subscription has been ${action} successfully.`,
    });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    const sub = userSubscriptions.find((s) => s.id === subscriptionId);
    const confirmCancel = confirm(
      `Are you sure you want to cancel your ${sub?.planName} subscription?`,
    );
    if (confirmCancel) {
      subscriptionService.updateSubscription(subscriptionId, {
        status: "cancelled",
      });
      refreshSubscriptionData();
      toast({
        title: "Subscription cancelled!",
        description: "Your subscription has been cancelled successfully.",
      });
    }
  };

  const handleManagePayment = (subscriptionId: string) => {
    const sub = userSubscriptions.find((s) => s.id === subscriptionId);
    toast({
      title: "Manage Payment",
      description: `Opening payment management for ${sub?.planName}.`,
    });
    // Open payment management modal
  };

  // Demo toggle for testing single vs multiple subscription views
  const toggleSubscriptionMode = () => {
    const hasMultipleActive =
      userSubscriptions.filter((sub) => sub.status === "active").length > 1;

    if (hasMultipleActive) {
      // Switch to single plan mode - pause the family plan
      const familyPlan = userSubscriptions.find(
        (sub) => sub.planType === "family",
      );
      if (familyPlan) {
        subscriptionService.updateSubscription(familyPlan.id, {
          status: "paused",
        });
      }
    } else {
      // Switch to multiple plans mode - add or activate family plan
      const familyPlan = userSubscriptions.find(
        (sub) => sub.planType === "family",
      );
      if (familyPlan) {
        subscriptionService.updateSubscription(familyPlan.id, {
          status: "active",
        });
      } else {
        subscriptionService.addFamilyPlan();
      }
    }
    refreshSubscriptionData();
  };

  const handleRefreshData = () => {
    subscriptionService.refreshData();
    refreshSubscriptionData();
    toast({
      title: "Data refreshed!",
      description: "Your subscription data has been refreshed.",
    });
  };

  const handleResetData = () => {
    const confirmReset = confirm(
      "Are you sure you want to reset all subscription data?",
    );
    if (confirmReset) {
      subscriptionService.resetData();
      refreshSubscriptionData();
      toast({
        title: "Data reset!",
        description: "All subscription data has been reset successfully.",
      });
    }
  };

  // Get primary active subscription for display
  const primarySubscription =
    userSubscriptions.find((sub) => sub.isDefault && sub.status === "active") ||
    userSubscriptions.find((sub) => sub.status === "active");

  const subscriptionInfo = primarySubscription
    ? {
        plan: primarySubscription.planName,
        status: primarySubscription.status === "active" ? "Active" : "Inactive",
        nextBilling: primarySubscription.nextBilling,
        price: `${primarySubscription.currency}${primarySubscription.price}/${primarySubscription.interval}`,
        features: primarySubscription.features,
      }
    : {
        plan: "No Active Plan",
        status: "Inactive",
        nextBilling: "N/A",
        price: "₹0/month",
        features: ["No active subscription"],
      };

  const formatPaymentMethodDisplay = (method: PaymentMethod) => {
    if (method.card) {
      return {
        title: `${method.card.brand.toUpperCase()} ****${method.card.last4}`,
        subtitle: `Expires ${method.card.exp_month}/${method.card.exp_year}`,
      };
    }
    if (method.upi) {
      return {
        title: method.upi.vpa,
        subtitle: "UPI Payment",
      };
    }
    return {
      title: method.type.replace("_", " ").toUpperCase(),
      subtitle: "Payment Method",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Account</h1>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Offline Mode
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Multiple Subscription Manager - Only show when user has multiple ACTIVE subscriptions */}
        {userSubscriptions.filter((sub) => sub.status === "active").length >
          1 && (
          <MultipleSubscriptionManager
            subscriptions={userSubscriptions}
            onSwitchPrimary={handleSwitchPrimary}
            onPauseSubscription={handlePauseSubscription}
            onCancelSubscription={handleCancelSubscription}
            onManagePayment={handleManagePayment}
          />
        )}

        {/* Subscription Info */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Subscription
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage your premium subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{subscriptionInfo.plan}</h3>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {subscriptionInfo.status}
                  </Badge>
                </div>
                <p className="text-gray-400">
                  Next billing: {subscriptionInfo.nextBilling}
                </p>
                <p className="text-lg font-semibold mt-1">
                  {subscriptionInfo.price}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleManagePlan}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Manage Plan
              </Button>
            </div>

            <div className="border-t border-white/20 pt-4">
              <h4 className="font-semibold mb-3">Plan Features:</h4>
              <ul className="space-y-2">
                {subscriptionInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription className="text-gray-300">
              Update your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">ह��ंदी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSaveChanges}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                Stripe Powered
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Secure payment processing with Stripe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No payment methods added yet</p>
              </div>
            ) : (
              paymentMethods.map((method) => {
                const display = formatPaymentMethodDisplay(method);
                return (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{display.title}</p>
                          {method.isDefault && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                            >
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          {display.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefaultPayment(method.id)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}

            <Button
              variant="outline"
              onClick={handleAddPaymentMethod}
              className="w-full text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription className="text-gray-300">
              Control your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={handleDownloadData}
              className="w-full justify-start text-white border-white/20 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Your Data
            </Button>
            <Button
              variant="outline"
              onClick={handlePrivacySettings}
              className="w-full justify-start text-white border-white/20 hover:bg-white/10"
            >
              <Globe className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              className="w-full justify-start text-red-400 border-red-400/20 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethod
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onSuccess={handlePaymentMethodAdded}
      />

      {/* Subscription Portal */}
      <SubscriptionPortal
        isOpen={showSubscriptionPortal}
        onClose={handleSubscriptionPortalClose}
      />

      {/* Demo Controls Hover Menu */}
      <SubscriptionTestToggle
        hasMultipleActive={
          userSubscriptions.filter((sub) => sub.status === "active").length > 1
        }
        onToggle={toggleSubscriptionMode}
        onRefreshData={handleRefreshData}
        onResetData={handleResetData}
      />
    </div>
  );
};

export default Account;
