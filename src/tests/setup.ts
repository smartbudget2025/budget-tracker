import '@testing-library/jest-native/extend-expect';
import { NativeModules } from 'react-native';

// Mock the Secure Store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
  startTransaction: jest.fn(() => ({
    finish: jest.fn(),
  })),
}));

// Mock Firebase Analytics
jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    logEvent: jest.fn(),
    setAnalyticsCollectionEnabled: jest.fn(),
    setUserProperty: jest.fn(),
    logScreenView: jest.fn(),
  })),
}));

// Mock Expo Local Authentication
NativeModules.ExpoLocalAuthentication = {
  supportedAuthenticationTypesAsync: jest.fn(),
  authenticateAsync: jest.fn(),
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
};

// Mock Expo Splash Screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
})); 