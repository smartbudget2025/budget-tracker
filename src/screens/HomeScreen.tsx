import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent, Alert } from 'react-native';
import { Card, Text, Button, useTheme, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolate,
  withSpring
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedView = Animated.createAnimatedComponent(View);

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

interface SavingsGoal {
  name: string;
  target: number;
  current: number;
  icon: string;
}

interface UpcomingBill {
  name: string;
  amount: number;
  dueDate: Date;
  icon: string;
}

const PREMIUM_FEATURES = [
    {
        id: 'ai_advisor',
        title: 'AI Financial Advisor',
        price: 0.99,
        description: 'Get instant AI advice on your spending'
    },
    {
        id: 'bill_checker',
        title: 'Bill Reduction Scanner',
        price: 1.99,
        description: 'Find cheaper alternatives for your bills'
    },
    {
        id: 'instant_insights',
        title: 'Instant Money Insights',
        price: 0.49,
        description: 'See where you can save money right now'
    }
];

const HomeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { subscriptionStatus } = useSubscription();
  const scrollY = useSharedValue(0);
  const [loading, setLoading] = useState(true);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(2000);
  const [netWorth, setNetWorth] = useState({
    total: 25000,
    change: 1200,
    assets: 30000,
    liabilities: 5000
  });
  const [savingsGoals] = useState<SavingsGoal[]>([
    { name: 'Emergency Fund', target: 10000, current: 6500, icon: 'shield' },
    { name: 'Holiday', target: 3000, current: 1200, icon: 'airplane' },
    { name: 'New Car', target: 15000, current: 3500, icon: 'car' }
  ]);
  const [upcomingBills] = useState<UpcomingBill[]>([
    { name: 'Rent', amount: 1200, dueDate: new Date(2024, 2, 1), icon: 'home' },
    { name: 'Utilities', amount: 150, dueDate: new Date(2024, 2, 5), icon: 'flash' },
    { name: 'Internet', amount: 45, dueDate: new Date(2024, 2, 10), icon: 'wifi' }
  ]);
  const [spendingData, setSpendingData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [65, 45, 80, 55, 90, 40, 95] }],
  });
  const [categoryData] = useState([
    { name: 'Housing', amount: 1200, color: '#4CAF50', percentage: 40 },
    { name: 'Food', amount: 450, color: '#2196F3', percentage: 15 },
    { name: 'Transport', amount: 300, color: '#FFC107', percentage: 10 },
    { name: 'Entertainment', amount: 250, color: '#9C27B0', percentage: 8 },
    { name: 'Others', amount: 800, color: '#FF5722', percentage: 27 }
  ]);

  const scrollHandler = useAnimatedScrollHandler((event: any) => {
    scrollY.value = withSpring(event.contentOffset.y);
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [-100, 0],
            [1.2, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
      setMonthlySpending(1250);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  const spendingPercentage = (monthlySpending / monthlyBudget) * 100;
  const isOverBudget = spendingPercentage > 100;

  const handlePurchase = (feature: any) => {
    Alert.alert(
        'Quick Purchase',
        `Get ${feature.title} for just £${feature.price}`,
        [
            {
                text: 'Buy Now',
                onPress: () => {
                    // Simulate successful purchase
                    setTimeout(() => {
                        Alert.alert(
                            'Thank You!',
                            'Feature unlocked. Check your email for details.',
                            [{ text: 'OK' }]
                        );
                    }, 500);
                }
            },
            {
                text: 'Cancel',
                style: 'cancel'
            }
        ]
    );
  };

  return (
    <AnimatedScrollView 
      style={styles.container}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      {/* Welcome Section with Parallax Effect */}
      <AnimatedView style={[styles.welcomeSection, headerStyle]}>
        <LinearGradient
          colors={['#2E7D32', '#1B5E20']}
          style={styles.welcomeGradient}
        >
          <Text style={styles.welcomeText}>
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-GB', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </LinearGradient>
      </AnimatedView>

      {/* Net Worth Card with Glass Effect */}
      <AnimatedView entering={FadeInDown.delay(300)}>
        <AnimatedBlurView intensity={80} tint="light" style={styles.glassCard}>
          <AnimatedView style={styles.netWorthContent}>
            <Text style={styles.cardTitle}>Net Worth</Text>
            <Text style={styles.netWorthAmount}>£{netWorth.total.toLocaleString()}</Text>
            <Text style={[styles.changeText, netWorth.change >= 0 ? styles.positive : styles.negative]}>
              {netWorth.change >= 0 ? '↑' : '↓'} £{Math.abs(netWorth.change).toLocaleString()} this month
            </Text>
            <View style={styles.netWorthDetails}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Assets</Text>
                <Text style={styles.detailAmount}>£{netWorth.assets.toLocaleString()}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Liabilities</Text>
                <Text style={styles.detailAmount}>£{netWorth.liabilities.toLocaleString()}</Text>
              </View>
            </View>
          </AnimatedView>
        </AnimatedBlurView>
      </AnimatedView>

      {/* Quick Actions Grid */}
      <AnimatedView entering={FadeInDown.delay(400)} style={styles.quickActionsGrid}>
        {[
          { icon: 'plus-circle', label: 'Add Transaction', screen: 'AddTransaction' },
          { icon: 'chart-timeline-variant', label: 'View Budget', screen: 'Budget' },
          { icon: 'receipt', label: 'Scan Receipt', screen: 'ScanReceipt', premium: true },
          { icon: 'chart-areaspline', label: 'Insights', screen: 'Insights' }
        ].map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionButton}
            onPress={() => {
              if (action.premium && !subscriptionStatus?.isPremium) {
                navigation.navigate('Premium');
              } else {
                navigation.navigate(action.screen);
              }
            }}
          >
            <AnimatedBlurView intensity={60} tint="light" style={styles.actionButtonContent}>
              <Icon name={action.icon} size={24} color="#2E7D32" />
              <Text style={styles.actionButtonLabel}>{action.label}</Text>
              {action.premium && !subscriptionStatus?.isPremium && (
                <Icon name="star" size={12} color="#FFD700" style={styles.premiumIcon} />
              )}
            </AnimatedBlurView>
          </TouchableOpacity>
        ))}
      </AnimatedView>

      {/* Monthly Overview Card */}
      <AnimatedView entering={FadeInDown.delay(500)}>
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Monthly Overview</Text>
            <View style={styles.budgetContainer}>
              <View>
                <Text style={styles.amountLabel}>Spent</Text>
                <Text style={[styles.amount, isOverBudget && styles.overBudget]}>
                  £{monthlySpending.toLocaleString()}
                </Text>
              </View>
              <View style={styles.divider} />
              <View>
                <Text style={styles.amountLabel}>Budget</Text>
                <Text style={styles.amount}>£{monthlyBudget.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${Math.min(spendingPercentage, 100)}%` }]} />
            </View>
            <Text style={[styles.percentageText, isOverBudget && styles.overBudget]}>
              {spendingPercentage.toFixed(1)}% of budget used
            </Text>
          </Card.Content>
        </Card>
      </AnimatedView>

      {/* Savings Goals */}
      <AnimatedView entering={FadeInDown.delay(600)}>
        <Card style={styles.goalsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Savings Goals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {savingsGoals.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalIcon}>
                    <Icon name={goal.icon} size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalAmount}>
                      £{goal.current.toLocaleString()} / £{goal.target.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <ProgressBar
                  progress={goal.current / goal.target}
                  color={theme.colors.primary}
                  style={styles.goalProgress}
                />
              </View>
            ))}
          </Card.Content>
        </Card>
      </AnimatedView>

      {/* Upcoming Bills */}
      <AnimatedView entering={FadeInDown.delay(700)}>
        <Card style={styles.billsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Upcoming Bills</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Bills')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {upcomingBills.map((bill, index) => (
              <View key={index} style={styles.billItem}>
                <View style={styles.billIcon}>
                  <Icon name={bill.icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.billInfo}>
                  <Text style={styles.billName}>{bill.name}</Text>
                  <Text style={styles.billDate}>
                    Due {bill.dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <Text style={styles.billAmount}>£{bill.amount}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </AnimatedView>

      {/* Spending Categories */}
      <AnimatedView entering={FadeInDown.delay(800)}>
        <Card style={styles.categoryCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Spending by Category</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={categoryData.map(cat => ({
                  name: cat.name,
                  amount: cat.amount,
                  color: cat.color,
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12,
                }))}
                width={Dimensions.get('window').width - 64}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
            <View style={styles.categoryList}>
              {categoryData.map((category, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>£{category.amount}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      </AnimatedView>

      <View style={styles.header}>
        <Text style={styles.title}>Quick Money Saving Tools</Text>
        <Text style={styles.subtitle}>Instant access - no waiting</Text>
      </View>

      {PREMIUM_FEATURES.map((feature, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.description}>{feature.description}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>£{feature.price}</Text>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handlePurchase(feature)}
              >
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      ))}

      <Card style={[styles.card, styles.specialOffer]}>
        <Card.Content>
          <Text style={styles.specialTitle}>🔥 Special Offer</Text>
          <Text style={styles.specialDescription}>
            Get all premium features for just £2.99
          </Text>
          <TouchableOpacity
            style={[styles.buyButton, styles.specialButton]}
            onPress={() => {
              Alert.alert(
                'Bundle Purchase',
                'Get all features for £2.99',
                [
                  {
                    text: 'Buy Now',
                    onPress: () => {
                      setTimeout(() => {
                        Alert.alert(
                          'Success!',
                          'All features unlocked! Check your email.',
                          [{ text: 'OK' }]
                        );
                      }, 500);
                    }
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  }
                ]
              );
            }}
          >
            <Text style={styles.buyButtonText}>Get All Features</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </AnimatedScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2E7D32',
  },
  welcomeSection: {
    padding: 16,
    paddingTop: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  netWorthCard: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  netWorthAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginVertical: 8,
  },
  changeText: {
    fontSize: 16,
    marginBottom: 16,
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  netWorthDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  overviewCard: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2E7D32',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  goalsCard: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalAmount: {
    fontSize: 14,
    color: '#666',
  },
  goalProgress: {
    height: 6,
    borderRadius: 3,
  },
  billsCard: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  billIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  billDate: {
    fontSize: 14,
    color: '#666',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  categoryCard: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryList: {
    marginTop: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#666',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  overBudget: {
    color: '#F44336',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 8,
    elevation: 2,
  },
  actionContent: {
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    marginTop: 8,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  premiumCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#E8F5E9',
    elevation: 2,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumText: {
    flex: 1,
    marginHorizontal: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  welcomeGradient: {
    padding: 24,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
  },
  glassCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  netWorthContent: {
    padding: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    marginTop: 8,
  },
  quickActionButton: {
    width: '50%',
    padding: 8,
  },
  actionButtonContent: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  actionButtonLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
  },
  premiumIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  detailColumn: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  buyButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen; 