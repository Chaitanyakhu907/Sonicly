// Dynamic subscription and payment data service

export interface DynamicSubscription {
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
    brand?: string;
  };
}

export interface DynamicPaymentMethod {
  id: string;
  type: "card" | "upi" | "bank_transfer";
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  upi?: {
    vpa: string;
  };
  bank?: {
    last4: string;
    ifsc: string;
  };
  isDefault: boolean;
  created: number;
}

export interface DynamicBillingHistory {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  invoice_url?: string;
  plan: string;
  paymentMethod: string;
  transactionId: string;
}

class SubscriptionDataService {
  private subscriptions: DynamicSubscription[] = [];
  private paymentMethods: DynamicPaymentMethod[] = [];
  private billingHistory: DynamicBillingHistory[] = [];

  private currentUserId: string = "";

  constructor() {
    this.initializeDefaultData();
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
    this.loadUserData();
  }

  private getStorageKey(key: string): string {
    return `${key}_${this.currentUserId}`;
  }

  private loadUserData() {
    if (!this.currentUserId) return;

    try {
      const savedSubs = localStorage.getItem(
        this.getStorageKey("sonicly_subscriptions"),
      );
      const savedPayments = localStorage.getItem(
        this.getStorageKey("sonicly_payment_methods"),
      );
      const savedBilling = localStorage.getItem(
        this.getStorageKey("sonicly_billing_history"),
      );

      if (savedSubs) {
        this.subscriptions = JSON.parse(savedSubs);
      } else {
        this.initializeUserSpecificData();
      }

      if (savedPayments) {
        this.paymentMethods = JSON.parse(savedPayments);
      }

      if (savedBilling) {
        this.billingHistory = JSON.parse(savedBilling);
      } else {
        this.generateBillingHistory();
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      this.initializeUserSpecificData();
    }
  }

  private saveUserData() {
    if (!this.currentUserId) return;

    try {
      localStorage.setItem(
        this.getStorageKey("sonicly_subscriptions"),
        JSON.stringify(this.subscriptions),
      );
      localStorage.setItem(
        this.getStorageKey("sonicly_payment_methods"),
        JSON.stringify(this.paymentMethods),
      );
      localStorage.setItem(
        this.getStorageKey("sonicly_billing_history"),
        JSON.stringify(this.billingHistory),
      );
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  }

  private initializeUserSpecificData() {
    // Check if this is an existing demo user - only they get pre-populated data
    const existingDemoUsers = [
      "user_1",
      "user_2",
      "user_3",
      "user_4",
      "user_5",
    ];

    // Only provide sample data for demo users, all new users get clean free accounts
    const userProfiles = {
      user_1: {
        // Chaitanya - Demo premium user (existing)
        subscriptions: [
          {
            id: "sub_premium_monthly",
            planName: "Premium Monthly",
            planType: "premium",
            price: 199,
            currency: "₹",
            interval: "month",
            status: "active",
            nextBilling: this.getNextBillingDate(1),
            isDefault: true,
            features: [
              "Unlimited music streaming",
              "High quality audio (320kbps)",
              "No advertisements",
              "Offline listening",
              "Premium playlists",
              "AI-powered recommendations",
            ],
            startDate: this.getPastDate(60),
            paymentMethod: { type: "card", last4: "4242", brand: "Visa" },
          },
        ],
        paymentMethods: [
          {
            id: "pm_card_visa",
            type: "card",
            card: {
              brand: "visa",
              last4: "4242",
              exp_month: 12,
              exp_year: 2025,
            },
            isDefault: true,
            created: Date.now() - 86400000,
          },
          {
            id: "pm_upi_paytm",
            type: "upi",
            upi: { vpa: "chaitanya@paytm" },
            isDefault: false,
            created: Date.now() - 172800000,
          },
        ],
      },
      user_2: {
        // Rahul - Family plan user
        subscriptions: [
          {
            id: "sub_family_yearly",
            planName: "Family Yearly",
            planType: "family",
            price: 2990,
            currency: "₹",
            interval: "year",
            status: "active",
            nextBilling: this.getNextBillingDate(12),
            isDefault: true,
            features: [
              "Everything in Premium",
              "Up to 6 family members",
              "Individual profiles",
              "Parental controls",
              "Family mix playlists",
              "Shared favorites",
            ],
            startDate: this.getPastDate(120),
            paymentMethod: { type: "upi", upiId: "rahul@phonepe" },
          },
        ],
        paymentMethods: [
          {
            id: "pm_upi_phonepe",
            type: "upi",
            upi: { vpa: "rahul@phonepe" },
            isDefault: true,
            created: Date.now() - 86400000,
          },
          {
            id: "pm_card_master",
            type: "card",
            card: {
              brand: "mastercard",
              last4: "8888",
              exp_month: 8,
              exp_year: 2026,
            },
            isDefault: false,
            created: Date.now() - 172800000,
          },
        ],
      },
      user_3: {
        // Priya - Free user
        subscriptions: [],
        paymentMethods: [
          {
            id: "pm_upi_gpay",
            type: "upi",
            upi: { vpa: "priya@oksbi" },
            isDefault: true,
            created: Date.now() - 86400000,
          },
        ],
      },
      user_4: {
        // Arjun - Premium user with multiple cards
        subscriptions: [
          {
            id: "sub_premium_monthly_rock",
            planName: "Premium Monthly",
            planType: "premium",
            price: 199,
            currency: "₹",
            interval: "month",
            status: "active",
            nextBilling: this.getNextBillingDate(1),
            isDefault: true,
            features: [
              "Unlimited music streaming",
              "High quality audio (320kbps)",
              "No advertisements",
              "Offline listening",
              "Premium playlists",
              "Rock & Metal collections",
            ],
            startDate: this.getPastDate(90),
            paymentMethod: { type: "card", last4: "1234", brand: "Visa" },
          },
        ],
        paymentMethods: [
          {
            id: "pm_card_visa_arjun",
            type: "card",
            card: {
              brand: "visa",
              last4: "1234",
              exp_month: 3,
              exp_year: 2026,
            },
            isDefault: true,
            created: Date.now() - 86400000,
          },
          {
            id: "pm_card_amex",
            type: "card",
            card: {
              brand: "amex",
              last4: "9876",
              exp_month: 11,
              exp_year: 2025,
            },
            isDefault: false,
            created: Date.now() - 172800000,
          },
        ],
      },
      user_5: {
        // Neha - Family plan with jazz focus
        subscriptions: [
          {
            id: "sub_family_monthly_jazz",
            planName: "Family Monthly",
            planType: "family",
            price: 299,
            currency: "₹",
            interval: "month",
            status: "active",
            nextBilling: this.getNextBillingDate(1),
            isDefault: true,
            features: [
              "Everything in Premium",
              "Up to 6 family members",
              "Individual profiles",
              "Jazz & Blues collections",
              "Music theory integration",
            ],
            startDate: this.getPastDate(45),
            paymentMethod: { type: "card", last4: "5555", brand: "Mastercard" },
          },
        ],
        paymentMethods: [
          {
            id: "pm_card_master_neha",
            type: "card",
            card: {
              brand: "mastercard",
              last4: "5555",
              exp_month: 9,
              exp_year: 2025,
            },
            isDefault: true,
            created: Date.now() - 86400000,
          },
        ],
      },
    };

    // Only use pre-populated data for existing demo users
    if (existingDemoUsers.includes(this.currentUserId)) {
      const userProfile =
        userProfiles[this.currentUserId as keyof typeof userProfiles];
      if (userProfile) {
        this.subscriptions = userProfile.subscriptions as DynamicSubscription[];
        this.paymentMethods =
          userProfile.paymentMethods as DynamicPaymentMethod[];
      } else {
        // Clean free account for demo users without data
        this.subscriptions = [];
        this.paymentMethods = [];
      }
    } else {
      // All new users get completely clean free accounts - no premium, no payment methods
      this.subscriptions = [];
      this.paymentMethods = [];
    }

    this.generateBillingHistory();
    this.saveUserData();
  }

  private initializeDefaultData() {
    // New users get completely clean accounts - no subscriptions, no payment methods
    this.subscriptions = [];
    this.paymentMethods = [];
    this.billingHistory = [];
  }

  private getNextBillingDate(monthsFromNow: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsFromNow);
    return date.toISOString().split("T")[0];
  }

  private getPastDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  }

  private generateBillingHistory() {
    // Only regenerate billing history if it's empty
    if (this.billingHistory.length > 0) {
      return;
    }

    // Only generate billing history if user has subscriptions
    if (this.subscriptions.length === 0) {
      return;
    }

    const currentDate = new Date();
    const activeSub =
      this.subscriptions.find((s) => s.status === "active") ||
      this.subscriptions[0];

    // Only generate billing history if we have a valid subscription
    if (!activeSub || !activeSub.price) {
      return;
    }

    // Generate billing history based on subscription start date
    const startDate = new Date(activeSub.startDate);
    const monthsBetween = Math.floor(
      (currentDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30),
    );
    const maxHistory = Math.min(monthsBetween, 6); // Max 6 months or since start

    for (let i = 1; i <= maxHistory; i++) {
      const billingDate = new Date(currentDate);
      billingDate.setMonth(billingDate.getMonth() - i);

      // Ensure billing date is not before start date
      if (billingDate >= startDate) {
        this.billingHistory.push({
          id: `inv_${activeSub.id}_${i}`,
          date: billingDate.toISOString().split("T")[0],
          amount: activeSub.price,
          currency: activeSub.currency,
          status: Math.random() > 0.1 ? "paid" : "pending", // 90% success rate
          plan: activeSub.planName,
          paymentMethod:
            activeSub.paymentMethod.type === "card"
              ? `${activeSub.paymentMethod.brand} ****${activeSub.paymentMethod.last4}`
              : `UPI: ${activeSub.paymentMethod.upiId || "Unknown"}`,
          transactionId: `TXN${activeSub.id}_${i}`,
          invoice_url: `#invoice_${i}`,
        });
      }
    }
  }

  // Subscription methods
  getSubscriptions(): DynamicSubscription[] {
    return this.subscriptions;
  }

  addSubscription(
    subscription: Partial<DynamicSubscription>,
  ): DynamicSubscription {
    const newSub: DynamicSubscription = {
      id: `sub_${Date.now()}`,
      planName: subscription.planName || "New Plan",
      planType: subscription.planType || "premium",
      price: subscription.price || 199,
      currency: subscription.currency || "₹",
      interval: subscription.interval || "month",
      status: subscription.status || "active",
      nextBilling:
        subscription.nextBilling ||
        this.getNextBillingDate(subscription.interval === "year" ? 12 : 1),
      isDefault: subscription.isDefault || false,
      features: subscription.features || [],
      startDate:
        subscription.startDate || new Date().toISOString().split("T")[0],
      paymentMethod: subscription.paymentMethod || {
        type: "card",
        last4: "0000",
      },
    };

    this.subscriptions.push(newSub);

    // Clear billing history and regenerate for the new subscription
    this.billingHistory = [];
    this.generateBillingHistory();

    this.saveUserData();
    return newSub;
  }

  updateSubscription(id: string, updates: Partial<DynamicSubscription>): void {
    const index = this.subscriptions.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.subscriptions[index] = { ...this.subscriptions[index], ...updates };

      // If subscription is being cancelled, don't regenerate billing history
      if (updates.status !== "cancelled") {
        // Clear and regenerate billing history for active subscriptions
        this.billingHistory = [];
        this.generateBillingHistory();
      }

      this.saveUserData(); // Save changes to localStorage
    }
  }

  setPrimarySubscription(id: string): void {
    this.subscriptions.forEach((sub) => {
      sub.isDefault = sub.id === id;
    });
    this.saveUserData(); // Save changes to localStorage
  }

  // Payment methods
  getPaymentMethods(): DynamicPaymentMethod[] {
    return this.paymentMethods;
  }

  addPaymentMethod(
    method: Partial<DynamicPaymentMethod>,
  ): DynamicPaymentMethod {
    const newMethod: DynamicPaymentMethod = {
      id: `pm_${Date.now()}`,
      type: method.type || "card",
      card: method.card,
      upi: method.upi,
      bank: method.bank,
      isDefault: method.isDefault || this.paymentMethods.length === 0,
      created: Date.now(),
    };

    this.paymentMethods.push(newMethod);
    this.saveUserData(); // Save changes to localStorage
    return newMethod;
  }

  removePaymentMethod(id: string): void {
    this.paymentMethods = this.paymentMethods.filter((pm) => pm.id !== id);
    this.saveUserData(); // Save changes to localStorage
  }

  setDefaultPaymentMethod(id: string): void {
    this.paymentMethods.forEach((pm) => {
      pm.isDefault = pm.id === id;
    });
    this.saveUserData(); // Save changes to localStorage
  }

  // Billing history
  getBillingHistory(): DynamicBillingHistory[] {
    return this.billingHistory.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  addBillingRecord(record: Partial<DynamicBillingHistory>): void {
    const newRecord: DynamicBillingHistory = {
      id: `inv_${Date.now()}`,
      date: record.date || new Date().toISOString().split("T")[0],
      amount: record.amount || 0,
      currency: record.currency || "₹",
      status: record.status || "pending",
      plan: record.plan || "Unknown Plan",
      paymentMethod: record.paymentMethod || "Unknown Method",
      transactionId: record.transactionId || `TXN${Date.now()}`,
      invoice_url: record.invoice_url,
    };

    this.billingHistory.unshift(newRecord);
    this.saveUserData(); // Save changes to localStorage
  }

  // Demo functions
  addFamilyPlan(): void {
    this.addSubscription({
      planName: "Family Yearly",
      planType: "family",
      price: 2990,
      interval: "year",
      status: "active",
      isDefault: false,
      features: [
        "Everything in Premium",
        "Up to 6 family members",
        "Individual profiles",
        "Parental controls",
        "Family mix playlists",
        "Shared favorites",
      ],
      paymentMethod: {
        type: "upi",
        upiId: "chaitanya@paytm",
      },
    });
  }

  refreshData(): void {
    // Update next billing dates
    this.subscriptions.forEach((sub) => {
      if (sub.status === "active") {
        const nextDate = new Date(sub.nextBilling);
        nextDate.setMonth(
          nextDate.getMonth() + (sub.interval === "year" ? 12 : 1),
        );
        sub.nextBilling = nextDate.toISOString().split("T")[0];
      }
    });

    // Add a new billing record if needed (only for users with active subscriptions)
    const activeSub = this.subscriptions.find((s) => s.status === "active");
    if (!activeSub) {
      return; // No active subscription, no billing to refresh
    }

    const lastBilling = this.billingHistory[0];
    const lastDate = new Date(lastBilling?.date || 0);
    const now = new Date();

    if (now.getTime() - lastDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
      // 30 days
      this.addBillingRecord({
        amount: activeSub.price,
        currency: activeSub.currency,
        status: "paid",
        plan: activeSub.planName,
        paymentMethod:
          activeSub.paymentMethod.type === "card"
            ? `${activeSub.paymentMethod.brand || "Unknown"} ****${activeSub.paymentMethod.last4 || "0000"}`
            : `UPI: ${activeSub.paymentMethod.upiId || "Unknown"}`,
      });
    }

    // Save updated data
    this.saveUserData();
  }

  resetData(): void {
    this.initializeDefaultData();
  }
}

// Singleton instance
export const subscriptionDataService = new SubscriptionDataService();

// React hook for easy integration
import { useState, useEffect } from "react";

export const useSubscriptionData = () => {
  const [subscriptions, setSubscriptions] = useState<DynamicSubscription[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<DynamicPaymentMethod[]>(
    [],
  );
  const [billingHistory, setBillingHistory] = useState<DynamicBillingHistory[]>(
    [],
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const refresh = () => {
    // Force update by creating new arrays to trigger re-renders
    setSubscriptions([...subscriptionDataService.getSubscriptions()]);
    setPaymentMethods([...subscriptionDataService.getPaymentMethods()]);
    setBillingHistory([...subscriptionDataService.getBillingHistory()]);
  };

  useEffect(() => {
    // Get current user and set up service
    const userId = localStorage.getItem("sonicly_current_user");
    if (userId && userId !== "null") {
      setCurrentUserId(userId);
      subscriptionDataService.setCurrentUser(userId);
      refresh();
    }
  }, []);

  // Watch for user changes and periodic refresh
  useEffect(() => {
    const checkUserChange = () => {
      const userId = localStorage.getItem("sonicly_current_user");
      if (userId && userId !== "null" && userId !== currentUserId) {
        setCurrentUserId(userId);
        subscriptionDataService.setCurrentUser(userId);
        refresh();
      }
    };

    const periodicRefresh = () => {
      // Periodically refresh to ensure data stays in sync
      if (currentUserId) {
        refresh();
      }
    };

    // Check for user changes less frequently to avoid performance issues
    const userCheckInterval = setInterval(checkUserChange, 5000);

    // Remove aggressive polling - only refresh on specific events

    // Also listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sonicly_current_user") {
        checkUserChange();
      }
      // Refresh on any subscription-related storage changes
      if (e.key?.includes("sonicly_")) {
        refresh();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(userCheckInterval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUserId]);

  return {
    subscriptions,
    paymentMethods,
    billingHistory,
    refresh,
    service: subscriptionDataService,
  };
};
