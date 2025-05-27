import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class SecureStorageService {
  private async store(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Fall back to localStorage for web
        localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing secure data:', error);
      throw error;
    }
  }

  private async retrieve(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Fall back to localStorage for web
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      throw error;
    }
  }

  private async remove(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing secure data:', error);
      throw error;
    }
  }

  // User authentication token
  async setAuthToken(token: string): Promise<void> {
    await this.store('auth_token', token);
  }

  async getAuthToken(): Promise<string | null> {
    return await this.retrieve('auth_token');
  }

  async removeAuthToken(): Promise<void> {
    await this.remove('auth_token');
  }

  // User credentials (encrypted)
  async setUserCredentials(email: string, password: string): Promise<void> {
    const credentials = JSON.stringify({ email, password });
    await this.store('user_credentials', credentials);
  }

  async getUserCredentials(): Promise<{ email: string; password: string } | null> {
    const credentials = await this.retrieve('user_credentials');
    return credentials ? JSON.parse(credentials) : null;
  }

  async removeUserCredentials(): Promise<void> {
    await this.remove('user_credentials');
  }

  // API keys
  async setApiKey(service: string, key: string): Promise<void> {
    await this.store(`api_key_${service}`, key);
  }

  async getApiKey(service: string): Promise<string | null> {
    return await this.retrieve(`api_key_${service}`);
  }

  async removeApiKey(service: string): Promise<void> {
    await this.remove(`api_key_${service}`);
  }

  // Biometric authentication status
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await this.store('biometric_enabled', String(enabled));
  }

  async getBiometricEnabled(): Promise<boolean> {
    const enabled = await this.retrieve('biometric_enabled');
    return enabled === 'true';
  }
}

export const secureStorage = new SecureStorageService(); 