import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform, Alert } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as StoreReview from 'expo-store-review';
import { useStripe } from '@stripe/stripe-react-native';
import { PRICING } from '../config/pricing';
import { colors } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);

const features = [
  {
    icon: 'chart-areaspline',
    title: 'AI-Powered Insights',
    description: 'Get personalized financial advice and spending predictions',
  },
  {
    icon: 'receipt-text',
    title: 'Receipt Scanning',
    description: 'Automatically extract and categorize expenses from receipts',
  },
  {
    icon: 'bank',
    title: 'Open Banking',
    description: 'Connect all your UK bank accounts for a complete financial view',
  },
  {
    icon: 'calculator-variant',
    title: 'Tax Insights',
    description: 'Track your tax obligations and find potential savings',
  },
  {
    icon: 'chart-timeline-variant',
    title: 'Investment Tracking',
    description: 'Monitor your investments, ISAs, and pension performance',
  },
  {
    icon: 'export-variant',
    title: 'Data Export',
    description: 'Export your financial data in various formats',
  },
];

const PremiumScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // Create payment intent on your backend
      const response = await fetch('YOUR_BACKEND_URL/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PRICING.EARLY_ACCESS.price,
          currency: PRICING.EARLY_ACCESS.currency,
        }),
      });

      const { clientSecret } = await response.json();

      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Budget Tracker Premium',
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        return;
      }

      // Present payment sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Error', paymentError.message);
      } else {
        Alert.alert(
          'Success!', 
          'Welcome to Premium! Your first 3 months are 50% off.'
        );
        // Update user's premium status in your backend
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2E7D32', '#1B5E20']}
        style={styles.header}
      >
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.subtitle}>
          Take control of your finances with advanced features
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <AnimatedView
              key={feature.title}
              entering={FadeInDown.delay(index * 100)}
              style={styles.featureCard}
            >
              <BlurView intensity={80} tint="light" style={styles.featureContent}>
                <Icon name={feature.icon} size={32} color="#2E7D32" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </BlurView>
            </AnimatedView>
          ))}
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>Choose Your Plan</Text>
          
          <View style={styles.planToggle}>
            <TouchableOpacity
              style={[
                styles.planOption,
                selectedPlan === 'monthly' && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <Text style={[
                styles.planText,
                selectedPlan === 'monthly' && styles.selectedPlanText,
              ]}>
                Monthly
              </Text>
              <Text style={[
                styles.planPrice,
                selectedPlan === 'monthly' && styles.selectedPlanText,
              ]}>
                £3.99/mo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.planOption,
                selectedPlan === 'yearly' && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan('yearly')}
            >
              <View>
                <Text style={[
                  styles.planText,
                  selectedPlan === 'yearly' && styles.selectedPlanText,
                ]}>
                  Yearly
                </Text>
                <Text style={[
                  styles.planPrice,
                  selectedPlan === 'yearly' && styles.selectedPlanText,
                ]}>
                  £39.99/yr
                </Text>
                <Text style={styles.savingsText}>Save 16%</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleSubscribe}
            style={styles.subscribeButton}
            contentStyle={styles.subscribeButtonContent}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Start ' + (selectedPlan === 'monthly' ? 'Monthly' : 'Yearly') + ' Plan'}
          </Button>

          <Text style={styles.guarantee}>
            7-day money-back guarantee • Cancel anytime
          </Text>
        </View>

        {/* Testimonials */}
        <View style={styles.testimonials}>
          <Text style={styles.testimonialsTitle}>What Users Say</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsList}
          >
            {[
              {
                text: "The AI insights have helped me save £200 monthly. It's like having a financial advisor in my pocket!",
                author: "Sarah M.",
                rating: 5,
              },
              {
                text: "Receipt scanning and automatic categorization save me hours of manual entry each month.",
                author: "James P.",
                rating: 5,
              },
              {
                text: "The tax insights feature is brilliant for self-employed people like me.",
                author: "David R.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <BlurView
                key={index}
                intensity={80}
                tint="light"
                style={styles.testimonialCard}
              >
                <Text style={styles.testimonialText}>{testimonial.text}</Text>
                <View style={styles.testimonialFooter}>
                  <Text style={styles.testimonialAuthor}>{testimonial.author}</Text>
                  <View style={styles.ratingContainer}>
                    {Array(testimonial.rating).fill(null).map((_, i) => (
                      <Icon key={i} name="star" size={16} color="#FFD700" />
                    ))}
                  </View>
                </View>
              </BlurView>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 32,
    paddingTop: 64,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    padding: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: -8,
  },
  featureCard: {
    width: (width - 48) / 2,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureContent: {
    padding: 16,
    alignItems: 'center',
    height: 160,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  pricingSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2E7D32',
  },
  planToggle: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  planOption: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: (width - 64) / 2,
  },
  selectedPlan: {
    backgroundColor: '#2E7D32',
  },
  planText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  selectedPlanText: {
    color: '#fff',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 4,
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  subscribeButton: {
    width: '100%',
    borderRadius: 25,
    marginBottom: 16,
    backgroundColor: '#2E7D32',
  },
  subscribeButtonContent: {
    paddingVertical: 8,
  },
  guarantee: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  testimonials: {
    marginTop: 40,
  },
  testimonialsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2E7D32',
  },
  testimonialsList: {
    paddingBottom: 16,
  },
  testimonialCard: {
    width: width - 64,
    marginRight: 16,
    borderRadius: 16,
    padding: 20,
  },
  testimonialText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  testimonialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
});

export default PremiumScreen; 