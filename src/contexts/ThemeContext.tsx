import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, navigationLightTheme, navigationDarkTheme } from '../theme';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: typeof lightTheme;
  navigationTheme: typeof navigationLightTheme;
  themeType: ThemeType;
  isDarkMode: boolean;
  setThemeType: (type: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  navigationTheme: navigationLightTheme,
  themeType: 'system',
  isDarkMode: false,
  setThemeType: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const handleThemeChange = async (newTheme: ThemeType) => {
    setThemeType(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const isDarkMode = 
    themeType === 'system' 
      ? systemColorScheme === 'dark'
      : themeType === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigationTheme = isDarkMode ? navigationDarkTheme : navigationLightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        navigationTheme,
        themeType,
        isDarkMode,
        setThemeType: handleThemeChange,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 