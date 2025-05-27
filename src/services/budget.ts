import AsyncStorage from '@react-native-async-storage/async-storage';

const BUDGET_KEY = '@budgets';

export interface Budget {
  id: string;
  category: string;
  limit: number;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
}

export const getBudgets = async (): Promise<Budget[]> => {
  try {
    const data = await AsyncStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading budgets:', error);
    return [];
  }
};

export const addBudget = async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
  try {
    const budgets = await getBudgets();
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
    };
    
    await AsyncStorage.setItem(BUDGET_KEY, JSON.stringify([...budgets, newBudget]));
    return newBudget;
  } catch (error) {
    console.error('Error adding budget:', error);
    throw error;
  }
};

export const updateBudget = async (budget: Budget): Promise<void> => {
  try {
    const budgets = await getBudgets();
    const updatedBudgets = budgets.map(b => 
      b.id === budget.id ? budget : b
    );
    
    await AsyncStorage.setItem(BUDGET_KEY, JSON.stringify(updatedBudgets));
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
};

export const deleteBudget = async (id: string): Promise<void> => {
  try {
    const budgets = await getBudgets();
    const filteredBudgets = budgets.filter(b => b.id !== id);
    await AsyncStorage.setItem(BUDGET_KEY, JSON.stringify(filteredBudgets));
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
};

export const getBudgetProgress = async (budgetId: string): Promise<{
  spent: number;
  remaining: number;
  progress: number;
}> => {
  try {
    const budgets = await getBudgets();
    const budget = budgets.find(b => b.id === budgetId);
    
    if (!budget) {
      throw new Error('Budget not found');
    }

    // This would be replaced with actual transaction data in a real app
    const spent = Math.random() * budget.limit; // Dummy data
    const remaining = budget.limit - spent;
    const progress = spent / budget.limit;

    return {
      spent,
      remaining,
      progress,
    };
  } catch (error) {
    console.error('Error getting budget progress:', error);
    throw error;
  }
};

export const createMonthlyBudget = async (category: string, limit: number): Promise<Budget> => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  const budget: Omit<Budget, 'id'> = {
    category,
    limit,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isRecurring: true,
  };

  return addBudget(budget);
};

export const rolloverRecurringBudgets = async (): Promise<void> => {
  try {
    const budgets = await getBudgets();
    const now = new Date();

    const updatedBudgets = await Promise.all(
      budgets.map(async budget => {
        if (budget.isRecurring && new Date(budget.endDate) < now) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);

          const newBudget = await addBudget({
            ...budget,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          });

          return newBudget;
        }
        return budget;
      })
    );

    await AsyncStorage.setItem(BUDGET_KEY, JSON.stringify(updatedBudgets));
  } catch (error) {
    console.error('Error rolling over budgets:', error);
    throw error;
  }
}; 