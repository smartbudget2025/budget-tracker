import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { secureStorage } from './secureStorage';

interface RequestConfig extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

interface QueuedRequest {
  url: string;
  config: RequestConfig;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

class NetworkService {
  private baseUrl: string;
  private offlineQueue: QueuedRequest[] = [];
  private isOnline: boolean = true;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.budgettracker.com';
    this.setupNetworkListener();
  }

  private setupNetworkListener() {
    if (Platform.OS !== 'web') {
      NetInfo.addEventListener(state => {
        const wasOffline = !this.isOnline;
        this.isOnline = state.isConnected ?? false;

        if (wasOffline && this.isOnline) {
          this.processOfflineQueue();
        }
      });
    }
  }

  private async processOfflineQueue() {
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const request of queue) {
      try {
        const response = await this.makeRequest(request.url, request.config);
        request.resolve(response);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  private async makeRequest(url: string, config: RequestConfig): Promise<any> {
    const { retries = 3, retryDelay = 1000, ...fetchConfig } = config;

    // Add auth token if available
    const token = await secureStorage.getAuthToken();
    if (token) {
      fetchConfig.headers = {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${url}`, fetchConfig);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }

    throw lastError;
  }

  private async handleRequest(url: string, config: RequestConfig): Promise<any> {
    if (!this.isOnline) {
      // If it's a GET request, try to return cached data
      if (config.method === 'GET') {
        // Implement cache logic here
      }

      // Queue other requests for later
      return new Promise((resolve, reject) => {
        this.offlineQueue.push({ url, config, resolve, reject });
      });
    }

    return this.makeRequest(url, config);
  }

  async get(url: string, config: RequestConfig = {}): Promise<any> {
    return this.handleRequest(url, { ...config, method: 'GET' });
  }

  async post(url: string, data: any, config: RequestConfig = {}): Promise<any> {
    return this.handleRequest(url, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(data),
    });
  }

  async put(url: string, data: any, config: RequestConfig = {}): Promise<any> {
    return this.handleRequest(url, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(data),
    });
  }

  async delete(url: string, config: RequestConfig = {}): Promise<any> {
    return this.handleRequest(url, { ...config, method: 'DELETE' });
  }

  // Check if device is online
  async isNetworkAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return navigator.onLine;
    }
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }
}

export const networkService = new NetworkService(); 