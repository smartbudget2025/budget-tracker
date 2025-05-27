import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: Props) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2E7D32', '#1B5E20']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text variant="displayLarge" style={styles.title}>
          Penny
        </Text>
        <Text variant="titleLarge" style={styles.subtitle}>
          Smart money management
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
});

export default SplashScreen; 