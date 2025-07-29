import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Smartphone,
  Plus,
  Check,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type PaymentMethod } from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { AddPaymentMethod } from "@/components/payments/AddPaymentMethod";
import { useSubscriptionData } from "@/lib/subscriptionData";

interface PaymentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  currency: string;
  interval: string;
  onPaymentSuccess: () => void;
}

export const PaymentSelectionModal: React.FC<PaymentSelectionModalProps> = ({
  isOpen,
  onClose,
  planName,
  planPrice,
  currency,
  interval,
  onPaymentSuccess,
}) => {
  const {
    paymentMethods: userPaymentMethods,
    service,
    refresh,
  } = useSubscriptionData();
  const { toast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Sync payment methods from subscription data
  React.useEffect(() => {
    setPaymentMethods(userPaymentMethods);
  }, [userPaymentMethods]);

  const handlePaymentMethodAdded = (newPaymentMethod: any) => {
    // Add to the subscription service
    const addedMethod = service.addPaymentMethod({
      type: newPaymentMethod.type,
      card: newPaymentMethod.card,
      upi: newPaymentMethod.upi,
      isDefault: paymentMethods.length === 0,
    });

    // Force refresh to immediately show the new payment method
    refresh();

    setSelectedPaymentMethod(addedMethod.id);
    setShowAddPayment(false);
  };

  const processUPIPayment = (upiId: string) => {
    const amount = planPrice;
    const merchantId = "SONICLY@paytm";
    const transactionId = `TXN${Date.now()}`;

    // UPI payment URL format for popular UPI apps
    const upiUrls = [
      `upi://pay?pa=${merchantId}&pn=Sonicly&am=${amount}&cu=INR&tn=Sonicly%20${planName}%20Subscription&tr=${transactionId}`,
      `paytmmp://pay?pa=${merchantId}&pn=Sonicly&am=${amount}&cu=INR&tn=Sonicly%20${planName}%20Subscription&tr=${transactionId}`,
      `phonepe://pay?pa=${merchantId}&pn=Sonicly&am=${amount}&cu=INR&tn=Sonicly%20${planName}%20Subscription&tr=${transactionId}`,
      `gpay://upi/pay?pa=${merchantId}&pn=Sonicly&am=${amount}&cu=INR&tn=Sonicly%20${planName}%20Subscription&tr=${transactionId}`,
    ];

    // Try to open UPI apps in order of preference
    const openUPIApp = (index = 0) => {
      if (index >= upiUrls.length) {
        // Fallback to web UPI if no apps are available
        window.open(
          `https://upiqr.in/api/qr?name=Sonicly&vpa=${merchantId}&amount=${amount}&note=Sonicly%20${planName}%20Subscription`,
          "_blank",
        );
        return;
      }

      const url = upiUrls[index];
      const link = document.createElement("a");
      link.href = url;
      link.click();

      // Fallback to next app after a short delay
      setTimeout(() => openUPIApp(index + 1), 1000);
    };

    openUPIApp();
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) return;

    setIsProcessing(true);

    const selectedMethod = paymentMethods.find(
      (pm) => pm.id === selectedPaymentMethod,
    );

    if (!selectedMethod) {
      setIsProcessing(false);
      return;
    }

    try {
      if (selectedMethod.type === "upi") {
        // Process UPI payment
        processUPIPayment(selectedMethod.upi?.vpa || "");

        // Simulate payment processing
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess();
          onClose();
          toast({
            title: "UPI Payment Initiated!",
            description: `Please complete the payment in your UPI app to activate ${planName}.`,
          });
        }, 2000);
      } else if (selectedMethod.type === "card") {
        // Process card payment (simulate Stripe payment)
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess();
          onClose();
          toast({
            title: "Payment Successful!",
            description: `Welcome to ${planName}. Your subscription is now active!`,
          });
        }, 3000);
      }
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    }
  };

  const formatPaymentMethodDisplay = (method: PaymentMethod) => {
    if (method.card) {
      return {
        title: `${method.card.brand.toUpperCase()} ****${method.card.last4}`,
        subtitle: `Expires ${method.card.exp_month}/${method.card.exp_year}`,
        icon: <CreditCard className="w-5 h-5" />,
      };
    }
    if (method.upi) {
      return {
        title: method.upi.vpa,
        subtitle: "UPI Payment",
        icon: <Smartphone className="w-5 h-5" />,
      };
    }
    return {
      title: "Payment Method",
      subtitle: "",
      icon: <CreditCard className="w-5 h-5" />,
    };
  };

  return (
    <>
      <Dialog open={isOpen && !showAddPayment} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Upgrade to {planName}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose your payment method to complete the upgrade
            </DialogDescription>
          </DialogHeader>

          {/* Plan Summary */}
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-purple-400">{planName}</h3>
              <Badge className="bg-purple-600 text-white">Upgrade</Badge>
            </div>
            <div className="text-2xl font-bold text-white">
              {currency}
              {planPrice}
              <span className="text-sm text-gray-400">/{interval}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Select Payment Method</h4>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No payment methods available</p>
              </div>
            ) : (
              paymentMethods.map((method) => {
                const display = formatPaymentMethodDisplay(method);
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            method.type === "upi"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {display.icon}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {display.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {display.subtitle}
                          </div>
                        </div>
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <Check className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Add New Payment Method */}
            <button
              onClick={() => setShowAddPayment(true)}
              className="w-full p-4 rounded-lg border border-dashed border-gray-600 hover:border-gray-500 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-white"
            >
              <Plus className="w-4 h-4" />
              Add New Payment Method
            </button>
          </div>

          {/* Security Info */}
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400" />
            <div className="text-sm">
              <div className="font-medium text-green-400">Secure Payment</div>
              <div className="text-gray-400">
                256-bit SSL encryption & PCI compliant
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-white border-white/20 hover:bg-white/10"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={
                paymentMethods.length === 0
                  ? () => setShowAddPayment(true)
                  : handlePayment
              }
              disabled={
                isProcessing ||
                (paymentMethods.length > 0 && !selectedPaymentMethod)
              }
              className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : paymentMethods.length === 0 ? (
                <>
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </>
              ) : (
                <>
                  Pay {currency}
                  {planPrice}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Modal */}
      <AddPaymentMethod
        isOpen={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        onSuccess={handlePaymentMethodAdded}
      />
    </>
  );
};
