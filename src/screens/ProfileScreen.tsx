import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Card, Text, Button, List, Avatar, Divider, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const ProfileScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const { subscriptionStatus, clearSubscription } = useSubscription();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      if (subscriptionStatus?.isPremium) {
        await clearSubscription();
      }
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    Alert.alert('Coming Soon', 'Data export feature will be available soon!');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Signing out...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.header}
      >
        <Avatar.Text 
          size={80} 
          label={user?.name?.substring(0, 2).toUpperCase() || 'UK'}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || 'Smart Budget User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {subscriptionStatus?.isPremium ? (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        ) : (
          <Button 
            mode="contained"
            onPress={() => navigation.navigate('Premium')}
            style={styles.upgradeButton}
          >
            Upgrade to Premium
          </Button>
        )}
      </Animated.View>

      {/* Settings */}
      <Animated.View entering={FadeInDown.delay(400)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <List.Item
              title="Push Notifications"
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#767577', true: '#81c784' }}
                  thumbColor={notifications ? '#2E7D32' : '#f4f3f4'}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Dark Mode"
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#767577', true: '#81c784' }}
                  thumbColor={darkMode ? '#2E7D32' : '#f4f3f4'}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Biometric Login"
              right={() => (
                <Switch
                  value={biometrics}
                  onValueChange={setBiometrics}
                  trackColor={{ false: '#767577', true: '#81c784' }}
                  thumbColor={biometrics ? '#2E7D32' : '#f4f3f4'}
                />
              )}
            />
          </Card.Content>
        </Card>
      </Animated.View>

      {/* Account Settings */}
      <Animated.View entering={FadeInDown.delay(600)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <List.Item
              title="Change Password"
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'Password change feature will be available soon!')}
            />
            <Divider />
            
            <List.Item
              title="Export Data"
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleExportData}
            />
            <Divider />
            
            {subscriptionStatus?.isPremium && (
              <>
                <List.Item
                  title="Manage Subscription"
                  description={`${subscriptionStatus.plan} plan`}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => navigation.navigate('Premium')}
                />
                <Divider />
              </>
            )}
            
            <List.Item
              title="Privacy Policy"
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'Privacy Policy will be available soon!')}
            />
            <Divider />
            
            <List.Item
              title="Terms of Service"
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'Terms of Service will be available soon!')}
            />
          </Card.Content>
        </Card>
      </Animated.View>

      {/* Support */}
      <Animated.View entering={FadeInDown.delay(800)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <List.Item
              title="Help Center"
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'Help Center will be available soon!')}
            />
            <Divider />
            
            <List.Item
              title="Contact Support"
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'Support contact will be available soon!')}
            />
            <Divider />
            
            <List.Item
              title="Report a Bug"
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'Bug reporting will be available soon!')}
            />
          </Card.Content>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(1000)}>
        <Button 
          mode="outlined" 
          onPress={handleSignOut}
          style={styles.logoutButton}
          textColor="#F44336"
          loading={loading}
        >
          Log Out
        </Button>

        <Text style={styles.version}>Version 1.0.0</Text>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    backgroundColor: '#2E7D32',
    marginBottom: 12,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  premiumBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 2,
  },
  premiumText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  upgradeButton: {
    backgroundColor: '#2E7D32',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2E7D32',
  },
  logoutButton: {
    margin: 16,
    borderColor: '#F44336',
    borderWidth: 2,
  },
  version: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
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
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});

export default ProfileScreen; 