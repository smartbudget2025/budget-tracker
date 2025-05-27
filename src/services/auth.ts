import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@user';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isPremium: boolean;
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  // In a real app, this would make an API call to authenticate
  // For now, we'll simulate a successful login
  const user: User = {
    id: '1',
    email,
    name: email.split('@')[0],
    createdAt: new Date().toISOString(),
    isPremium: false,
  };

  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  // In a real app, this would make an API call to create a new user
  // For now, we'll simulate a successful registration
  const user: User = {
    id: Date.now().toString(),
    email,
    name,
    createdAt: new Date().toISOString(),
    isPremium: false,
  };

  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const updateUser = async (updates: Partial<User>): Promise<User> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('No user found');
    }

    const updatedUser = {
      ...currentUser,
      ...updates,
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  // In a real app, this would make an API call to change the password
  // For now, we'll just simulate a successful password change
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }
    
    // Simulate password change success
    return Promise.resolve();
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  // In a real app, this would make an API call to initiate password reset
  // For now, we'll just simulate a successful password reset request
  try {
    // Simulate password reset email sent
    return Promise.resolve();
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}; 