import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import { Card, Text, FAB, useTheme, Button, TextInput, Portal, Modal, ActivityIndicator, Searchbar, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { Transaction, getTransactions, addTransaction, deleteTransaction } from '../services/transactions';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { useSubscription } from '../contexts/SubscriptionContext';

const categories = [
  '🏠 Housing', '🍽️ Food', '🚗 Transport', '🎮 Entertainment',
  '🏥 Healthcare', '👕 Shopping', '💼 Business', '💰 Income'
];

const TransactionsScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { subscriptionStatus } = useSubscription();
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [processingReceipt, setProcessingReceipt] = useState(false);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const handleAddTransaction = async () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const newTransaction = await addTransaction({
        amount: parseFloat(amount),
        category: selectedCategory,
        description: description || selectedCategory,
        date: new Date(),
        type: transactionType,
        isRecurring: isRecurring,
        recurringFrequency: recurringFrequency,
        tags: selectedTags,
      });

      setTransactions([newTransaction, ...transactions]);
      setVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setTransactionType('expense');
    setIsRecurring(false);
    setRecurringFrequency('monthly');
    setSelectedTags([]);
    setReceiptImage(null);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Animated.View entering={FadeInDown}>
      <Card 
        style={styles.transactionCard}
        onLongPress={() => {
          Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete', 
                onPress: () => handleDeleteTransaction(item.id),
                style: 'destructive'
              },
            ]
          );
        }}
      >
        <Card.Content>
          <View style={styles.transactionHeader}>
            <View>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <Text style={[
              styles.amount,
              { color: item.type === 'income' ? '#4CAF50' : '#F44336' }
            ]}>
              {item.type === 'income' ? '+' : '-'}£{item.amount.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.date}>{format(new Date(item.date), 'dd MMM yyyy')}</Text>
        </Card.Content>
      </Card>
    </Animated.View>
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImagePickerAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
      setProcessingReceipt(true);
      // Simulate receipt processing
      setTimeout(() => {
        setAmount('45.99');
        setDescription('Tesco Shopping');
        setSelectedCategory('🍽️ Food');
        setSelectedTags(['food', 'essentials']);
        setProcessingReceipt(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search transactions"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => setSelectedFilter('all')}
          style={styles.filterChip}
        >
          All
        </Chip>
        <Chip
          selected={selectedFilter === 'expense'}
          onPress={() => setSelectedFilter('expense')}
          style={styles.filterChip}
        >
          Expenses
        </Chip>
        <Chip
          selected={selectedFilter === 'income'}
          onPress={() => setSelectedFilter('income')}
          style={styles.filterChip}
        >
          Income
        </Chip>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No transactions yet</Text>
        )}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Add Transaction</Text>
          
          <View style={styles.buttonGroup}>
            <Button
              mode={transactionType === 'expense' ? 'contained' : 'outlined'}
              onPress={() => setTransactionType('expense')}
              style={styles.typeButton}
            >
              Expense
            </Button>
            <Button
              mode={transactionType === 'income' ? 'contained' : 'outlined'}
              onPress={() => setTransactionType('income')}
              style={styles.typeButton}
            >
              Income
            </Button>
          </View>

          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <Text style={styles.categoryLabel}>Category</Text>
          <View style={styles.categories}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.categoryButtonLabel}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.recurringContainer}>
            <Text style={styles.sectionTitle}>Recurring Transaction</Text>
            <TouchableOpacity
              style={styles.recurringToggle}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <Icon
                name={isRecurring ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.recurringText}>Make this a recurring transaction</Text>
            </TouchableOpacity>
            {isRecurring && (
              <View style={styles.frequencyContainer}>
                {(['weekly', 'monthly', 'yearly'] as const).map((frequency) => (
                  <Chip
                    key={frequency}
                    selected={recurringFrequency === frequency}
                    onPress={() => setRecurringFrequency(frequency)}
                    style={styles.frequencyChip}
                  >
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </Chip>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagGrid}>
            {['food', 'transport', 'entertainment', 'bills', 'shopping', 
              'health', 'income', 'work', 'essentials', 'dining'].map((tag, index) => (
              <Chip
                key={index}
                selected={selectedTags.includes(tag)}
                onPress={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
                style={styles.tagChip}
              >
                {tag}
              </Chip>
            ))}
          </View>

          {receiptImage && (
            <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddTransaction}
              style={styles.addButton}
            >
              Add Transaction
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setModalVisible(true)}
      />

      <FAB
        icon="camera"
        style={styles.scanFab}
        onPress={pickImage}
        label={subscriptionStatus?.isPremium ? 'Scan Receipt' : 'Premium'}
        disabled={!subscriptionStatus?.isPremium}
      />
    </View>
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
  searchBar: {
    margin: 16,
    elevation: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
  transactionCard: {
    marginBottom: 8,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  scanFab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#2E7D32',
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
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    margin: 4,
  },
  categoryButtonLabel: {
    fontSize: 12,
  },
  selectedCategory: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  recurringContainer: {
    marginTop: 16,
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recurringText: {
    marginLeft: 8,
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  frequencyChip: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#2E7D32',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagChip: {
    margin: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#2E7D32',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    marginTop: 16,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  processingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2E7D32',
  },
});

export default TransactionsScreen; 