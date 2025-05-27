import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSubscriptionStatus, checkSubscriptionExpiry, SubscriptionStatus, activateSubscription, deactivateSubscription } from '../services/subscription';

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  handleSubscriptionUpdate: (plan: 'monthly' | 'yearly') => Promise<void>;
  clearSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptionStatus: null,
  isLoading: true,
  refreshSubscription: async () => {},
  handleSubscriptionUpdate: async () => {},
  clearSubscription: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
      const isValid = await checkSubscriptionExpiry();
      if (isValid) {
        const status = await getSubscriptionStatus();
        setSubscriptionStatus(status);
      } else {
        setSubscriptionStatus({
          isPremium: false,
          expiryDate: null,
          plan: null,
          startDate: null,
        });
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscriptionStatus({
        isPremium: false,
        expiryDate: null,
        plan: null,
        startDate: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const handleSubscriptionUpdate = async (plan: 'monthly' | 'yearly') => {
    try {
      setIsLoading(true);
      await activateSubscription(plan);
      await loadSubscription();
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSubscription = async () => {
    try {
      setIsLoading(true);
      await deactivateSubscription();
      await loadSubscription();
    } catch (error) {
      console.error('Error clearing subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setIsLoading(true);
    await loadSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionStatus,
        isLoading,
        refreshSubscription,
        handleSubscriptionUpdate,
        clearSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}; 