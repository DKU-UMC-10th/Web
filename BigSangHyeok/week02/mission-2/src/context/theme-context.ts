import { createContext, useContext } from 'react';

export const THEME = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
