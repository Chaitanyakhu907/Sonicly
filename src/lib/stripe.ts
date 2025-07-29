import { loadStripe } from "@stripe/stripe-js";

// Get the publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn(
    "Stripe publishable key not found. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file",
  );
}

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey || "");

// Stripe configuration
export const stripeConfig = {
  publishableKey: stripePublishableKey,
  appearance: {
    theme: "night" as const,
    variables: {
      colorPrimary: "#8B5CF6",
      colorBackground: "rgba(255, 255, 255, 0.1)",
      colorText: "#FFFFFF",
      colorDanger: "#EF4444",
      fontFamily: "Inter, Roboto, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  },
};

// Payment method types
export type PaymentMethodType = "card" | "upi" | "bank_transfer" | "wallet";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  upi?: {
    vpa: string;
  };
  isDefault: boolean;
  created: number;
}

// Mock payment methods for demo (replace with actual Stripe data)
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1234567890",
    type: "card",
    card: {
      brand: "visa",
      last4: "4242",
      exp_month: 12,
      exp_year: 2025,
    },
    isDefault: true,
    created: Date.now() - 86400000, // 1 day ago
  },
  {
    id: "pm_0987654321",
    type: "upi",
    upi: {
      vpa: "chaitanya@paytm",
    },
    isDefault: false,
    created: Date.now() - 172800000, // 2 days ago
  },
];
