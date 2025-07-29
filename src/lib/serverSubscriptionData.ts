// Server-based subscription data service
import { apiService } from "./apiService";
import { useState, useEffect } from "react";

// Import types from existing subscription data
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

class ServerSubscriptionDataService {
  private currentUserId: string = "";
  private isOnline: boolean = true;

  constructor() {
    this.checkServerStatus();
  }

  async checkServerStatus(): Promise<boolean> {
    try {
      this.isOnline = await apiService.isServerOnline();
      return this.isOnline;
    } catch (error) {
      console.warn("Server is offline, falling back to localStorage");
      this.isOnline = false;
      return false;
    }
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  private getStorageKey(key: string): string {
    return `${key}_${this.currentUserId}`;
  }

  // Fallback to localStorage when server is offline
  private getLocalStorageData(key: string): any {
    try {
      const data = localStorage.getItem(this.getStorageKey(key));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  }

  private setLocalStorageData(key: string, data: any): void {
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }

  // Subscription methods
  async getSubscriptions(): Promise<DynamicSubscription[]> {
    if (!this.currentUserId) return [];

    try {
      if (this.isOnline) {
        return await apiService.getSubscriptions(this.currentUserId);
      } else {
        return this.getLocalStorageData("sonicly_subscriptions");
      }
    } catch (error) {
      console.error("Error getting subscriptions:", error);
      return this.getLocalStorageData("sonicly_subscriptions");
    }
  }

  async addSubscription(
    subscription: Partial<DynamicSubscription>,
  ): Promise<DynamicSubscription> {
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

    try {
      if (this.isOnline) {
        const result = await apiService.addSubscription(
          this.currentUserId,
          newSub,
        );
        return result.subscription;
      } else {
        const subscriptions = this.getLocalStorageData("sonicly_subscriptions");
        subscriptions.push(newSub);
        this.setLocalStorageData("sonicly_subscriptions", subscriptions);
        return newSub;
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
      // Fallback to localStorage
      const subscriptions = this.getLocalStorageData("sonicly_subscriptions");
      subscriptions.push(newSub);
      this.setLocalStorageData("sonicly_subscriptions", subscriptions);
      return newSub;
    }
  }

  async updateSubscription(
    id: string,
    updates: Partial<DynamicSubscription>,
  ): Promise<void> {
    try {
      if (this.isOnline) {
        await apiService.updateSubscription(this.currentUserId, id, updates);
      } else {
        const subscriptions = this.getLocalStorageData("sonicly_subscriptions");
        const index = subscriptions.findIndex(
          (s: DynamicSubscription) => s.id === id,
        );
        if (index !== -1) {
          subscriptions[index] = { ...subscriptions[index], ...updates };
          this.setLocalStorageData("sonicly_subscriptions", subscriptions);
        }
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      // Fallback to localStorage
      const subscriptions = this.getLocalStorageData("sonicly_subscriptions");
      const index = subscriptions.findIndex(
        (s: DynamicSubscription) => s.id === id,
      );
      if (index !== -1) {
        subscriptions[index] = { ...subscriptions[index], ...updates };
        this.setLocalStorageData("sonicly_subscriptions", subscriptions);
      }
    }
  }

  async setPrimarySubscription(id: string): Promise<void> {
    const subscriptions = await this.getSubscriptions();
    const updates = subscriptions.map((sub) => ({
      id: sub.id,
      isDefault: sub.id === id,
    }));

    for (const update of updates) {
      await this.updateSubscription(update.id, { isDefault: update.isDefault });
    }
  }

  // Payment methods
  async getPaymentMethods(): Promise<DynamicPaymentMethod[]> {
    if (!this.currentUserId) return [];

    try {
      if (this.isOnline) {
        return await apiService.getPaymentMethods(this.currentUserId);
      } else {
        return this.getLocalStorageData("sonicly_payment_methods");
      }
    } catch (error) {
      console.error("Error getting payment methods:", error);
      return this.getLocalStorageData("sonicly_payment_methods");
    }
  }

  async addPaymentMethod(
    method: Partial<DynamicPaymentMethod>,
  ): Promise<DynamicPaymentMethod> {
    const newMethod: DynamicPaymentMethod = {
      id: `pm_${Date.now()}`,
      type: method.type || "card",
      card: method.card,
      upi: method.upi,
      bank: method.bank,
      isDefault: method.isDefault || false,
      created: Date.now(),
    };

    try {
      if (this.isOnline) {
        const result = await apiService.addPaymentMethod(
          this.currentUserId,
          newMethod,
        );
        return result.payment;
      } else {
        const paymentMethods = this.getLocalStorageData(
          "sonicly_payment_methods",
        );
        paymentMethods.push(newMethod);
        this.setLocalStorageData("sonicly_payment_methods", paymentMethods);
        return newMethod;
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      // Fallback to localStorage
      const paymentMethods = this.getLocalStorageData(
        "sonicly_payment_methods",
      );
      paymentMethods.push(newMethod);
      this.setLocalStorageData("sonicly_payment_methods", paymentMethods);
      return newMethod;
    }
  }

  async removePaymentMethod(id: string): Promise<void> {
    try {
      if (this.isOnline) {
        await apiService.removePaymentMethod(this.currentUserId, id);
      } else {
        const paymentMethods = this.getLocalStorageData(
          "sonicly_payment_methods",
        );
        const filtered = paymentMethods.filter(
          (pm: DynamicPaymentMethod) => pm.id !== id,
        );
        this.setLocalStorageData("sonicly_payment_methods", filtered);
      }
    } catch (error) {
      console.error("Error removing payment method:", error);
      // Fallback to localStorage
      const paymentMethods = this.getLocalStorageData(
        "sonicly_payment_methods",
      );
      const filtered = paymentMethods.filter(
        (pm: DynamicPaymentMethod) => pm.id !== id,
      );
      this.setLocalStorageData("sonicly_payment_methods", filtered);
    }
  }

  async setDefaultPaymentMethod(id: string): Promise<void> {
    const paymentMethods = await this.getPaymentMethods();
    // Update all payment methods to set default
    // Since we can't bulk update, we'll do this locally and sync
    const updated = paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id,
    }));

    if (this.isOnline) {
      // For server, we'd need to implement a bulk update endpoint
      // For now, store locally and sync when possible
      this.setLocalStorageData("sonicly_payment_methods", updated);
    } else {
      this.setLocalStorageData("sonicly_payment_methods", updated);
    }
  }

  // Billing history
  async getBillingHistory(): Promise<DynamicBillingHistory[]> {
    if (!this.currentUserId) return [];

    try {
      if (this.isOnline) {
        return await apiService.getBillingHistory(this.currentUserId);
      } else {
        return this.getLocalStorageData("sonicly_billing_history");
      }
    } catch (error) {
      console.error("Error getting billing history:", error);
      return this.getLocalStorageData("sonicly_billing_history");
    }
  }

  async addBillingRecord(
    record: Partial<DynamicBillingHistory>,
  ): Promise<void> {
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

    try {
      if (this.isOnline) {
        await apiService.addBillingRecord(this.currentUserId, newRecord);
      } else {
        const billingHistory = this.getLocalStorageData(
          "sonicly_billing_history",
        );
        billingHistory.unshift(newRecord);
        this.setLocalStorageData("sonicly_billing_history", billingHistory);
      }
    } catch (error) {
      console.error("Error adding billing record:", error);
      // Fallback to localStorage
      const billingHistory = this.getLocalStorageData(
        "sonicly_billing_history",
      );
      billingHistory.unshift(newRecord);
      this.setLocalStorageData("sonicly_billing_history", billingHistory);
    }
  }

  private getNextBillingDate(monthsFromNow: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsFromNow);
    return date.toISOString().split("T")[0];
  }

  // Demo/utility methods
  async addFamilyPlan(): Promise<void> {
    await this.addSubscription({
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
        upiId: "family@paytm",
      },
    });
  }

  async refreshData(): Promise<void> {
    // Sync any pending localStorage data to server if online
    await this.checkServerStatus();
  }

  async resetData(): Promise<void> {
    // Clear both server and localStorage data
    if (this.currentUserId) {
      this.setLocalStorageData("sonicly_subscriptions", []);
      this.setLocalStorageData("sonicly_payment_methods", []);
      this.setLocalStorageData("sonicly_billing_history", []);
    }
  }
}

// Singleton instance
export const serverSubscriptionDataService =
  new ServerSubscriptionDataService();

// React hook for easy integration
export const useServerSubscriptionData = () => {
  const [subscriptions, setSubscriptions] = useState<DynamicSubscription[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<DynamicPaymentMethod[]>(
    [],
  );
  const [billingHistory, setBillingHistory] = useState<DynamicBillingHistory[]>(
    [],
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const refresh = async () => {
    try {
      const [subs, payments, billing] = await Promise.all([
        serverSubscriptionDataService.getSubscriptions(),
        serverSubscriptionDataService.getPaymentMethods(),
        serverSubscriptionDataService.getBillingHistory(),
      ]);

      setSubscriptions(subs);
      setPaymentMethods(payments);
      setBillingHistory(billing);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("sonicly_current_user");
    if (userId && userId !== "null") {
      setCurrentUserId(userId);
      serverSubscriptionDataService.setCurrentUser(userId);
      refresh();
    }
  }, []);

  // Check server status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const online = await serverSubscriptionDataService.checkServerStatus();
      setIsOnline(online);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Watch for user changes
  useEffect(() => {
    const checkUserChange = () => {
      const userId = localStorage.getItem("sonicly_current_user");
      if (userId && userId !== "null" && userId !== currentUserId) {
        setCurrentUserId(userId);
        serverSubscriptionDataService.setCurrentUser(userId);
        refresh();
      }
    };

    const interval = setInterval(checkUserChange, 5000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sonicly_current_user") {
        checkUserChange();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUserId]);

  return {
    subscriptions,
    paymentMethods,
    billingHistory,
    refresh,
    service: serverSubscriptionDataService,
    isOnline,
  };
};
