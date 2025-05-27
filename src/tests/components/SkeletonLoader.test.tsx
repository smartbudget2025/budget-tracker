import React from 'react';
import { render } from '@testing-library/react-native';
import { SkeletonLoader, TransactionSkeleton, BudgetSkeleton, InsightSkeleton } from '../../components/SkeletonLoader';
import { ThemeProvider } from '../../contexts/ThemeContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('SkeletonLoader Components', () => {
  describe('SkeletonLoader', () => {
    it('renders with default props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SkeletonLoader testID="skeleton" />
        </TestWrapper>
      );
      
      const skeleton = getByTestId('skeleton');
      expect(skeleton).toBeTruthy();
      expect(skeleton.props.style).toContainEqual(
        expect.objectContaining({
          width: '100%',
          height: 20,
          borderRadius: 4,
        })
      );
    });

    it('renders with custom props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SkeletonLoader
            testID="custom-skeleton"
            width={150}
            height={30}
            borderRadius={8}
          />
        </TestWrapper>
      );
      
      const skeleton = getByTestId('custom-skeleton');
      expect(skeleton).toBeTruthy();
      expect(skeleton.props.style).toContainEqual(
        expect.objectContaining({
          width: 150,
          height: 30,
          borderRadius: 8,
        })
      );
    });
  });

  describe('TransactionSkeleton', () => {
    it('renders correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <TransactionSkeleton testID="transaction-skeleton" />
        </TestWrapper>
      );
      
      expect(getByTestId('transaction-skeleton')).toBeTruthy();
    });
  });

  describe('BudgetSkeleton', () => {
    it('renders correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <BudgetSkeleton testID="budget-skeleton" />
        </TestWrapper>
      );
      
      expect(getByTestId('budget-skeleton')).toBeTruthy();
    });
  });

  describe('InsightSkeleton', () => {
    it('renders correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <InsightSkeleton testID="insight-skeleton" />
        </TestWrapper>
      );
      
      expect(getByTestId('insight-skeleton')).toBeTruthy();
    });
  });
}); 