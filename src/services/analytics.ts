import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';

class AnalyticsService {
  private enabled: boolean = !__DEV__;

  async initialize() {
    if (Platform.OS !== 'web') {
      await analytics().setAnalyticsCollectionEnabled(this.enabled);
    }
  }

  async logEvent(
    eventName: string,
    params?: { [key: string]: any }
  ) {
    if (!this.enabled) return;

    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('Error logging analytics event:', error);
    }
  }

  async logScreenView(
    screenName: string,
    screenClass?: string
  ) {
    if (!this.enabled) return;

    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error('Error logging screen view:', error);
    }
  }

  async logTransaction(params: {
    id: string;
    currency: string;
    value: number;
    items?: Array<{
      id: string;
      name: string;
      category?: string;
      price: number;
    }>;
  }) {
    if (!this.enabled) return;

    try {
      await analytics().logPurchase({
        transaction_id: params.id,
        value: params.value,
        currency: params.currency,
        items: params.items?.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
        })),
      });
    } catch (error) {
      console.error('Error logging transaction:', error);
    }
  }

  async logUserProperty(name: string, value: string) {
    if (!this.enabled) return;

    try {
      await analytics().setUserProperty(name, value);
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  }

  async logLogin(method: string) {
    await this.logEvent('login', { method });
  }

  async logSignUp(method: string) {
    await this.logEvent('sign_up', { method });
  }

  async logAddTransaction(params: {
    amount: number;
    category: string;
    type: 'income' | 'expense';
  }) {
    await this.logEvent('add_transaction', params);
  }

  async logUpdateBudget(params: {
    category: string;
    amount: number;
    period: 'weekly' | 'monthly';
  }) {
    await this.logEvent('update_budget', params);
  }

  async logError(error: Error, fatal: boolean = false) {
    await this.logEvent('app_error', {
      error_name: error.name,
      error_message: error.message,
      fatal,
    });
  }

  async logAppOpen() {
    await this.logEvent('app_open');
  }

  async logSubscriptionStart(tier: string, price: number) {
    await this.logEvent('subscription_start', {
      tier,
      price,
      currency: 'GBP',
    });
  }
}

export const analyticsService = new AnalyticsService(); 