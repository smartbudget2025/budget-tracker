import AsyncStorage from '@react-native-async-storage/async-storage';

const SUBSCRIPTION_KEY = '@subscription_status';

export interface SubscriptionStatus {
  isPremium: boolean;
  expiryDate: string | null;
  plan: 'monthly' | 'yearly' | null;
  startDate: string | null;
}

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
    return data ? JSON.parse(data) : {
      isPremium: false,
      expiryDate: null,
      plan: null,
      startDate: null,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      isPremium: false,
      expiryDate: null,
      plan: null,
      startDate: null,
    };
  }
};

export const updateSubscriptionStatus = async (status: SubscriptionStatus): Promise<void> => {
  try {
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(status));
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
};

export const activateSubscription = async (plan: 'monthly' | 'yearly'): Promise<void> => {
  const startDate = new Date();
  const expiryDate = new Date();
  
  // Set expiry date based on plan
  if (plan === 'monthly') {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  const status: SubscriptionStatus = {
    isPremium: true,
    plan,
    startDate: startDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
  };

  await updateSubscriptionStatus(status);
};

export const deactivateSubscription = async (): Promise<void> => {
  const status: SubscriptionStatus = {
    isPremium: false,
    expiryDate: null,
    plan: null,
    startDate: null,
  };

  await updateSubscriptionStatus(status);
};

export const checkSubscriptionExpiry = async (): Promise<boolean> => {
  const status = await getSubscriptionStatus();
  
  if (!status.isPremium || !status.expiryDate) {
    return false;
  }

  const now = new Date();
  const expiry = new Date(status.expiryDate);
  
  if (now > expiry) {
    await deactivateSubscription();
    return false;
  }

  return true;
}; 