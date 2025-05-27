import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
  borderRadius?: number;
  testID?: string;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  style = {},
  borderRadius = 4,
  testID,
}: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface SkeletonComponentProps {
  testID?: string;
}

export function TransactionSkeleton({ testID }: SkeletonComponentProps) {
  return (
    <View testID={testID} style={styles.transactionContainer}>
      <SkeletonLoader width={40} height={40} borderRadius={20} />
      <View style={styles.transactionContent}>
        <SkeletonLoader width={200} height={20} style={styles.marginBottom} />
        <SkeletonLoader width={100} height={16} />
      </View>
      <SkeletonLoader width={80} height={20} />
    </View>
  );
}

export function BudgetSkeleton({ testID }: SkeletonComponentProps) {
  return (
    <View testID={testID} style={styles.budgetContainer}>
      <View style={styles.budgetHeader}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={styles.budgetContent}>
          <SkeletonLoader width={150} height={20} style={styles.marginBottom} />
          <SkeletonLoader width={100} height={16} />
        </View>
      </View>
      <SkeletonLoader height={8} style={styles.marginTop} />
    </View>
  );
}

export function InsightSkeleton({ testID }: SkeletonComponentProps) {
  return (
    <View testID={testID} style={styles.insightContainer}>
      <SkeletonLoader height={200} style={styles.marginBottom} />
      <View style={styles.insightStats}>
        <SkeletonLoader width="45%" height={100} />
        <SkeletonLoader width="45%" height={100} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  transactionContent: {
    flex: 1,
  },
  budgetContainer: {
    padding: 16,
    gap: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetContent: {
    flex: 1,
  },
  insightContainer: {
    padding: 16,
  },
  insightStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  marginBottom: {
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 8,
  },
}); 