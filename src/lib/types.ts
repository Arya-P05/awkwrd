
export type Category = 'real-talk' | 'relationships' | 'sex' | 'dating';

export interface Card {
  id: string;
  question: string;
  category: Category;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  color: string;
  description: string;
  enabled: boolean;
}

// React Native specific theme constants
export const THEME = {
  colors: {
    background: '#f5f0fa',
    foreground: '#1a1a1a',
    primary: '#9c4dcc',
    primaryForeground: '#ffffff',
    secondary: '#d946ef',
    secondaryForeground: '#ffffff',
    muted: '#f5f0fa',
    mutedForeground: '#737373',
    accent: '#ff4d8d',
    accentForeground: '#ffffff',
    border: '#e5e5e5',
    
    // Category colors
    realTalk: '#9c4dcc',
    relationships: '#d946ef',
    sex: '#ff4d8d',
    dating: '#9333ea',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  }
};
