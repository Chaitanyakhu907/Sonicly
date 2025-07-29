import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise, stripeConfig } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddPaymentMethodProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentMethod: any) => void;
}

const CardForm: React.FC<{ onSubmit: (paymentMethod: any) => void }> = ({
  onSubmit,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setIsLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message || "An error occurred");
      } else {
        onSubmit(paymentMethod);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card" className="text-white">
          Card Information
        </Label>
        <div className="p-3 rounded-md border border-white/20 bg-white/5">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isLoading ? "Adding..." : "Add Card"}
      </Button>
    </form>
  );
};

const UPIForm: React.FC<{ onSubmit: (paymentMethod: any) => void }> = ({
  onSubmit,
}) => {
  const [upiId, setUpiId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate UPI payment method creation
    setTimeout(() => {
      const mockUPIMethod = {
        id: `pm_upi_${Date.now()}`,
        type: "upi",
        upi: { vpa: upiId },
      };
      onSubmit(mockUPIMethod);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="upi" className="text-white">
          UPI ID
        </Label>
        <Input
          id="upi"
          type="text"
          placeholder="yourname@paytm"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="bg-white/10 border-white/20 text-white"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !upiId}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isLoading ? "Adding..." : "Add UPI"}
      </Button>
    </form>
  );
};

const BankForm: React.FC<{ onSubmit: (paymentMethod: any) => void }> = ({
  onSubmit,
}) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate bank account addition
    setTimeout(() => {
      const mockBankMethod = {
        id: `pm_bank_${Date.now()}`,
        type: "bank_transfer",
        bank: {
          last4: accountNumber.slice(-4),
          ifsc: ifscCode,
        },
      };
      onSubmit(mockBankMethod);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="account" className="text-white">
          Account Number
        </Label>
        <Input
          id="account"
          type="text"
          placeholder="1234567890"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="bg-white/10 border-white/20 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ifsc" className="text-white">
          IFSC Code
        </Label>
        <Input
          id="ifsc"
          type="text"
          placeholder="HDFC0001234"
          value={ifscCode}
          onChange={(e) => setIfscCode(e.target.value)}
          className="bg-white/10 border-white/20 text-white"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !accountNumber || !ifscCode}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isLoading ? "Adding..." : "Add Bank Account"}
      </Button>
    </form>
  );
};

const AddPaymentMethodContent: React.FC<AddPaymentMethodProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const handlePaymentMethodAdded = (paymentMethod: any) => {
    onSuccess(paymentMethod);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Payment Method
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose your preferred payment method for Sonicly Premium
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger
              value="card"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600"
            >
              <CreditCard className="w-4 h-4" />
              Card
            </TabsTrigger>
            <TabsTrigger
              value="upi"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600"
            >
              <Smartphone className="w-4 h-4" />
              UPI
            </TabsTrigger>
            <TabsTrigger
              value="bank"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600"
            >
              <Building className="w-4 h-4" />
              Bank
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="mt-6">
            <CardForm onSubmit={handlePaymentMethodAdded} />
          </TabsContent>

          <TabsContent value="upi" className="mt-6">
            <UPIForm onSubmit={handlePaymentMethodAdded} />
          </TabsContent>

          <TabsContent value="bank" className="mt-6">
            <BankForm onSubmit={handlePaymentMethodAdded} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export const AddPaymentMethod: React.FC<AddPaymentMethodProps> = (props) => {
  return (
    <Elements stripe={stripePromise} options={stripeConfig}>
      <AddPaymentMethodContent {...props} />
    </Elements>
  );
};
