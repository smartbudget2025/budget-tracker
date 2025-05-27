import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Text, Button, useTheme, ActivityIndicator, Chip } from 'react-native-paper';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { getTransactionStats } from '../services/transactions';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSubscription } from '../contexts/SubscriptionContext';

interface Insight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface Prediction {
  category: string;
  currentSpend: number;
  predictedSpend: number;
  trend: 'up' | 'down' | 'stable';
}

interface TrendDataset {
  data: number[];
  color: (opacity: number) => string;
  strokeWidth: number;
}

interface TrendData {
  labels: string[];
  datasets: TrendDataset[];
  legend: string[];
}

interface CategoryData {
  labels: string[];
  datasets: Array<{
    data: number[];
  }>;
}

interface InsightsScreenProps {
  navigation: any;
}

const screenWidth = Dimensions.get('window').width;

const InsightsScreen: React.FC<InsightsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { subscriptionStatus } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState<any>(null);
  const [isPremium] = useState(false); // Will be connected to user's subscription status

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getTransactionStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const spendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [2000, 2500, 2300, 2800, 2600, 3000]
    }]
  };

  const categoryData = [
    { name: 'Housing', amount: 1500, color: '#FF6384' },
    { name: 'Food', amount: 500, color: '#36A2EB' },
    { name: 'Transport', amount: 300, color: '#FFCE56' },
    { name: 'Entertainment', amount: 200, color: '#4BC0C0' },
  ];

  const [insights, setInsights] = useState([
    {
      title: 'Unusual Spending',
      description: 'Your entertainment spending is 45% higher than usual this month',
      type: 'negative',
      icon: 'alert-circle',
    },
    {
      title: 'Savings Goal Progress',
      description: 'You're on track to reach your emergency fund goal 2 months early!',
      type: 'positive',
      icon: 'trophy',
    },
    {
      title: 'Recurring Payment Change',
      description: 'Your Netflix subscription increased by £2 this month',
      type: 'neutral',
      icon: 'refresh',
    },
  ]);

  const [predictions, setPredictions] = useState([
    {
      category: 'Groceries',
      currentSpend: 400,
      predictedSpend: 450,
      trend: 'up',
    },
    {
      category: 'Transport',
      currentSpend: 150,
      predictedSpend: 130,
      trend: 'down',
    },
    {
      category: 'Utilities',
      currentSpend: 200,
      predictedSpend: 200,
      trend: 'stable',
    },
  ]);

  const [trendData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2100, 1950, 2300, 2100, 2400, 2200],
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [1800, 1900, 2000, 2100, 2200, 2300],
        color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Actual', 'Predicted'],
  });

  const [categoryComparison] = useState({
    labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping'],
    datasets: [
      {
        data: [1200, 450, 300, 250, 400],
      },
    ],
  });

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return '#4CAF50';
      case 'negative':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Analyzing your financial data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Period Selection */}
      <View style={styles.periodContainer}>
        <Chip
          selected={selectedPeriod === 'week'}
          onPress={() => setSelectedPeriod('week')}
          style={styles.chip}
        >
          Week
        </Chip>
        <Chip
          selected={selectedPeriod === 'month'}
          onPress={() => setSelectedPeriod('month')}
          style={styles.chip}
        >
          Month
        </Chip>
        <Chip
          selected={selectedPeriod === 'year'}
          onPress={() => setSelectedPeriod('year')}
          style={styles.chip}
        >
          Year
        </Chip>
      </View>

      {/* AI Insights */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>AI-Powered Insights</Text>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: `${getInsightColor(insight.type)}20` }]}>
                  <Icon name={insight.icon} size={24} color={getInsightColor(insight.type)} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </Animated.View>

      {/* Spending Trends */}
      <Animated.View entering={FadeInDown.delay(300)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Spending Trends</Text>
            <LineChart
              data={trendData}
              width={Dimensions.get('window').width - 48}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#fff',
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </Animated.View>

      {/* Category Comparison */}
      <Animated.View entering={FadeInDown.delay(400)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Category Comparison</Text>
            <BarChart
              data={categoryComparison}
              width={Dimensions.get('window').width - 48}
              height={220}
              yAxisLabel="£"
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </Animated.View>

      {/* Spending Predictions */}
      <Animated.View entering={FadeInDown.delay(500)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>AI Predictions</Text>
            {predictions.map((prediction, index) => (
              <View key={index} style={styles.predictionItem}>
                <View style={styles.predictionHeader}>
                  <Text style={styles.predictionCategory}>{prediction.category}</Text>
                  <View style={styles.predictionTrend}>
                    <Icon
                      name={
                        prediction.trend === 'up'
                          ? 'trending-up'
                          : prediction.trend === 'down'
                          ? 'trending-down'
                          : 'trending-neutral'
                      }
                      size={20}
                      color={
                        prediction.trend === 'up'
                          ? '#F44336'
                          : prediction.trend === 'down'
                          ? '#4CAF50'
                          : '#FF9800'
                      }
                    />
                  </View>
                </View>
                <View style={styles.predictionValues}>
                  <View>
                    <Text style={styles.predictionLabel}>Current</Text>
                    <Text style={styles.predictionAmount}>£{prediction.currentSpend}</Text>
                  </View>
                  <Icon name="arrow-right" size={20} color="#666" />
                  <View>
                    <Text style={styles.predictionLabel}>Predicted</Text>
                    <Text style={styles.predictionAmount}>£{prediction.predictedSpend}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </Animated.View>

      {/* Premium Upsell */}
      {!subscriptionStatus?.isPremium && (
        <Animated.View entering={FadeInDown.delay(600)}>
          <Card style={styles.premiumCard}>
            <Card.Content>
              <View style={styles.premiumContent}>
                <Icon name="star" size={24} color="#FFD700" />
                <View style={styles.premiumTextContainer}>
                  <Text style={styles.premiumTitle}>Unlock Advanced Insights</Text>
                  <Text style={styles.premiumDescription}>
                    Get personalized recommendations, detailed analysis, and more with Premium!
                  </Text>
                </View>
              </View>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Premium')}
                style={styles.premiumButton}
              >
                Upgrade Now
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>
      )}
    </ScrollView>
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
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  chip: {
    marginHorizontal: 4,
  },
  card: {
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
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  predictionItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  predictionTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  predictionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  premiumCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#E8F5E9',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#666',
  },
  premiumButton: {
    backgroundColor: '#2E7D32',
  },
});

export default InsightsScreen; 