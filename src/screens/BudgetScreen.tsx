import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Card, Text, ProgressBar, Button, Portal, Modal, TextInput, useTheme } from 'react-native-paper';
import { getTransactionStats } from '../services/transactions';
import { Budget, getBudgets, createMonthlyBudget, deleteBudget, getBudgetProgress } from '../services/budget';
import { useSubscription } from '../contexts/SubscriptionContext';

const BudgetScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { subscriptionStatus } = useSubscription();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, { spent: number; remaining: number; progress: number }>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetData, transactionStats] = await Promise.all([
        getBudgets(),
        getTransactionStats(),
      ]);

      setBudgets(budgetData);
      setStats(transactionStats);

      // Load progress for each budget
      const progressData: Record<string, { spent: number; remaining: number; progress: number }> = {};
      await Promise.all(
        budgetData.map(async (budget) => {
          const budgetProgress = await getBudgetProgress(budget.id);
          progressData[budget.id] = budgetProgress;
        })
      );
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    if (!selectedCategory || !budgetLimit) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const newBudget = await createMonthlyBudget(selectedCategory, parseFloat(budgetLimit));
      setBudgets([...budgets, newBudget]);
      setVisible(false);
      resetForm();
      await loadData(); // Refresh all data
    } catch (error) {
      Alert.alert('Error', 'Failed to create budget');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget(id);
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete budget');
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setBudgetLimit('');
  };

  const renderBudgetCard = (budget: Budget) => {
    const budgetProgress = progress[budget.id] || { spent: 0, remaining: 0, progress: 0 };
    const isOverBudget = budgetProgress.progress > 1;

    return (
      <Card 
        key={budget.id} 
        style={styles.budgetCard}
        onLongPress={() => {
          Alert.alert(
            'Delete Budget',
            'Are you sure you want to delete this budget?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete', 
                onPress: () => handleDeleteBudget(budget.id),
                style: 'destructive'
              },
            ]
          );
        }}
      >
        <Card.Content>
          <View style={styles.budgetHeader}>
            <Text style={styles.category}>{budget.category}</Text>
            <Text style={[
              styles.remaining,
              { color: isOverBudget ? '#F44336' : '#4CAF50' }
            ]}>
              {isOverBudget ? 'Over by ' : 'Remaining: '}
              £{Math.abs(budgetProgress.remaining).toFixed(2)}
            </Text>
          </View>

          <ProgressBar
            progress={Math.min(budgetProgress.progress, 1)}
            color={isOverBudget ? '#F44336' : '#4CAF50'}
            style={styles.progressBar}
          />

          <View style={styles.budgetDetails}>
            <Text style={styles.spent}>
              Spent: £{budgetProgress.spent.toFixed(2)}
            </Text>
            <Text style={styles.limit}>
              of £{budget.limit.toFixed(2)}
            </Text>
          </View>

          <Text style={styles.dateRange}>
            {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Monthly Overview */}
      <Card style={styles.overviewCard}>
        <Card.Content>
          <Text style={styles.overviewTitle}>Monthly Overview</Text>
          <View style={styles.overviewStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>£{stats?.totalIncome.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>£{stats?.totalExpenses.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={[
                styles.statValue,
                { color: (stats?.balance || 0) >= 0 ? '#4CAF50' : '#F44336' }
              ]}>
                £{(stats?.balance || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Budget List */}
      <View style={styles.budgetList}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Category Budgets</Text>
          <Button 
            mode="contained"
            onPress={() => setVisible(true)}
            style={styles.addButton}
            disabled={!subscriptionStatus?.isPremium && budgets.length >= 2}
          >
            Add Budget
          </Button>
        </View>

        {budgets.length === 0 ? (
          <Text style={styles.emptyText}>No budgets set yet</Text>
        ) : (
          budgets.map(renderBudgetCard)
        )}

        {!subscriptionStatus?.isPremium && budgets.length >= 2 && (
          <Card style={styles.upgradeCard}>
            <Card.Content>
              <Text style={styles.upgradeTitle}>🚀 Unlock Unlimited Budgets</Text>
              <Text style={styles.upgradeText}>
                Upgrade to Premium to create unlimited budget categories and access advanced tracking features.
              </Text>
              <Button 
                mode="contained"
                onPress={() => navigation.navigate('Premium')}
                style={styles.upgradeButton}
              >
                Upgrade Now
              </Button>
            </Card.Content>
          </Card>
        )}
      </View>

      {/* Add Budget Modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => {
            setVisible(false);
            resetForm();
          }}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Add Monthly Budget</Text>
          
          <TextInput
            label="Category"
            value={selectedCategory}
            onChangeText={setSelectedCategory}
            style={styles.input}
          />

          <TextInput
            label="Monthly Limit"
            value={budgetLimit}
            onChangeText={setBudgetLimit}
            keyboardType="numeric"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleAddBudget}
            style={styles.modalButton}
          >
            Add Budget
          </Button>
        </Modal>
      </Portal>
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
  },
  overviewCard: {
    margin: 16,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  budgetList: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 20,
  },
  budgetCard: {
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  remaining: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  spent: {
    fontSize: 14,
    color: '#666',
  },
  limit: {
    fontSize: 14,
    color: '#666',
  },
  dateRange: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
  upgradeCard: {
    marginTop: 16,
    backgroundColor: '#E8F5E9',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#2E7D32',
  },
});

export default BudgetScreen; 