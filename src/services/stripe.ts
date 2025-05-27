import { initStripe, useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_'; // Will need to be replaced with real key
const API_URL = 'https://your-backend-url.com'; // Will need to be updated

export type SubscriptionPlan = 'monthly' | 'yearly';

interface PaymentSheetResponse {
  error?: {
    code: string;
    message: string;
  };
}

export const initializeStripe = async () => {
  try {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: 'merchant.com.smartbudgetuk',
      urlScheme: 'smartbudgetuk', // Required for Apple Pay
      setReturnUrlSchemeOnAndroid: true,
    });
  } catch (error: any) {
    console.error('Stripe initialization error:', error);
    Alert.alert('Error', 'Failed to initialize payment system. Please try again later.');
    throw error;
  }
};

export const createSubscription = async (plan: SubscriptionPlan) => {
  const stripe = useStripe();
  
  try {
    // 1. Create payment intent on the server
    const response = await fetch(`${API_URL}/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create subscription');
    }

    // 2. Initialize the Payment sheet
    const { error: paymentSheetError } = await stripe.initPaymentSheet({
      paymentIntentClientSecret: data.clientSecret,
      merchantDisplayName: 'Smart Budget UK',
      style: 'automatic',
      googlePay: {
        merchantCountryCode: 'GB',
        testEnv: true,
        currencyCode: 'GBP',
      },
      applePay: {
        merchantCountryCode: 'GB',
      },
      customFlow: false,
      defaultBillingDetails: {
        address: {
          country: 'GB',
        },
      },
      returnURL: 'smartbudgetuk://payment-result',
    });

    if (paymentSheetError) {
      console.error('Payment sheet initialization error:', paymentSheetError);
      throw new Error(paymentSheetError.message || 'Failed to initialize payment');
    }

    // 3. Present the Payment Sheet
    const { error: presentError }: PaymentSheetResponse = await stripe.presentPaymentSheet();

    if (presentError) {
      if (presentError.code === 'Canceled') {
        return {
          success: false,
          message: 'Payment cancelled',
          isCancelled: true,
        };
      }
      console.error('Payment presentation error:', presentError);
      throw new Error(presentError.message || 'Payment failed');
    }

    // 4. Payment successful
    return {
      success: true,
      message: 'Payment successful! Welcome to Premium!',
      isCancelled: false,
    };

  } catch (error: any) {
    console.error('Subscription error:', error);
    return {
      success: false,
      message: error.message || 'Something went wrong with the payment.',
      isCancelled: false,
    };
  }
}; 