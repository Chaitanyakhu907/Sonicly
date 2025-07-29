// API Service for communicating with the Sonicly server (cloud or local)
import { getApiBaseUrl } from "./cloudConfig";

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.makeRequest("/health");
  }

  // User operations
  async getUser(userId: string): Promise<any> {
    return this.makeRequest(`/users/${userId}`);
  }

  async saveUser(userId: string, userData: any): Promise<any> {
    return this.makeRequest(`/users/${userId}`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Subscription operations
  async getSubscriptions(userId: string): Promise<any[]> {
    return this.makeRequest(`/subscriptions/${userId}`);
  }

  async addSubscription(userId: string, subscriptionData: any): Promise<any> {
    return this.makeRequest(`/subscriptions/${userId}`, {
      method: "POST",
      body: JSON.stringify(subscriptionData),
    });
  }

  async updateSubscription(
    userId: string,
    subscriptionId: string,
    updateData: any,
  ): Promise<any> {
    return this.makeRequest(`/subscriptions/${userId}/${subscriptionId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  // Payment method operations
  async getPaymentMethods(userId: string): Promise<any[]> {
    return this.makeRequest(`/payments/${userId}`);
  }

  async addPaymentMethod(userId: string, paymentData: any): Promise<any> {
    return this.makeRequest(`/payments/${userId}`, {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  async removePaymentMethod(userId: string, paymentId: string): Promise<any> {
    return this.makeRequest(`/payments/${userId}/${paymentId}`, {
      method: "DELETE",
    });
  }

  // Billing history operations
  async getBillingHistory(userId: string): Promise<any[]> {
    return this.makeRequest(`/billing/${userId}`);
  }

  async addBillingRecord(userId: string, billingData: any): Promise<any> {
    return this.makeRequest(`/billing/${userId}`, {
      method: "POST",
      body: JSON.stringify(billingData),
    });
  }

  // Server connectivity check
  async isServerOnline(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
