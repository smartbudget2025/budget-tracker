import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

const brandColors = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  secondary: '#FFC107',
  secondaryDark: '#FFA000',
  secondaryLight: '#FFD54F',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

const lightColors = {
  primary: '#2E7D32',
  primaryContainer: '#E8F5E9',
  secondary: '#1B5E20',
  secondaryContainer: '#C8E6C9',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#F44336',
  errorContainer: '#FFEBEE',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#1B5E20',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#0A3D0F',
  onBackground: '#121212',
  onSurface: '#121212',
  onError: '#FFFFFF',
  onErrorContainer: '#D32F2F',
  outline: '#79747E',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
};

const darkColors = {
  primary: '#81C784',
  primaryContainer: '#1B5E20',
  secondary: '#A5D6A7',
  secondaryContainer: '#0A3D0F',
  background: '#121212',
  surface: '#1E1E1E',
  error: '#EF5350',
  errorContainer: '#B71C1C',
  onPrimary: '#121212',
  onPrimaryContainer: '#E8F5E9',
  onSecondary: '#121212',
  onSecondaryContainer: '#C8E6C9',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onError: '#FFFFFF',
  onErrorContainer: '#FFEBEE',
  outline: '#938F99',
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...brandColors,
  },
  roundness: 16,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...brandColors,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#2C2C2C',
  },
  roundness: 16,
};

export const navigationLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.surface,
    text: lightColors.onSurface,
    border: lightColors.outline,
  },
};

export const navigationDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.surface,
    text: darkColors.onSurface,
    border: darkColors.outline,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 6,
  },
}; 