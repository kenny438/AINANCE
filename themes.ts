export interface ThemeDefinition {
  id: string;
  properties: {
    // CSS variables for light mode
    light: Record<string, string>;
    // CSS variables for dark mode
    dark: Record<string, string>;
  };
}

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: 'theme-kpop-demon-hunters',
    properties: {
      light: {
        '--color-background': '#1A1A1D',
        '--color-surface': '#25252A',
        '--color-border': '#4E4E50',
        '--color-primary': '#FF00FF', // Neon Magenta
        '--color-secondary': '#1F1F23',
        '--color-accent': '#C300C3',
        '--color-text-primary': '#F5F5F5',
        '--color-text-secondary': '#9E9E9E',
        '--color-text-on-primary': '#FFFFFF',
      },
      dark: {
        '--dark-color-background': '#0C0C0D',
        '--dark-color-surface': '#16161A',
        '--dark-color-border': '#3D3D40',
        '--dark-color-primary': '#FF00FF',
        '--dark-color-secondary': '#121215',
        '--dark-color-accent': '#D62AD6',
        '--dark-color-text-primary': '#FFFFFF',
        '--dark-color-text-secondary': '#A9A9A9',
        '--dark-color-text-on-primary': '#FFFFFF',
      },
    },
  },
  {
    id: 'theme-hello-kitty-dream',
    properties: {
      light: {
        '--color-background': '#FFF0F5', // Lavender Blush
        '--color-surface': '#FFFFFF',
        '--color-border': '#FFD6E5',
        '--color-primary': '#FF69B4', // Hot Pink
        '--color-secondary': '#FFF5F8',
        '--color-accent': '#FF1493', // Deep Pink
        '--color-text-primary': '#5C3C48',
        '--color-text-secondary': '#966F7F',
        '--color-text-on-primary': '#FFFFFF',
      },
      dark: { // A "dark" version of a pastel theme is tricky, let's make it more of a "night" theme
        '--dark-color-background': '#4A2A3A',
        '--dark-color-surface': '#6B3E54',
        '--dark-color-border': '#8C526E',
        '--dark-color-primary': '#FFB6C1', // Light Pink
        '--dark-color-secondary': '#5A344A',
        '--dark-color-accent': '#FFC0CB', // Pink
        '--dark-color-text-primary': '#FFF0F5',
        '--dark-color-text-secondary': '#D3B4C4',
        '--dark-color-text-on-primary': '#4A2A3A',
      },
    },
  },
  {
    id: 'theme-solarpunk-utopia',
    properties: {
        light: {
            '--color-background': '#F0FFF0', // Honeydew
            '--color-surface': '#FFFFFF',
            '--color-border': '#BEEBBA',
            '--color-primary': '#228B22', // Forest Green
            '--color-secondary': '#FAFAF5',
            '--color-accent': '#3CB371', // Medium Sea Green
            '--color-text-primary': '#1A3A1A',
            '--color-text-secondary': '#4F6A4F',
            '--color-text-on-primary': '#FFFFFF',
        },
        dark: {
            '--dark-color-background': '#011C01',
            '--dark-color-surface': '#0A2A0A',
            '--dark-color-border': '#1A4A1A',
            '--dark-color-primary': '#FFD700', // Gold
            '--dark-color-secondary': '#052505',
            '--dark-color-accent': '#9ACD32', // Yellow Green
            '--dark-color-text-primary': '#E0FFE0',
            '--dark-color-text-secondary': '#A0C0A0',
            '--dark-color-text-on-primary': '#011C01',
        },
    },
  },
  {
    id: 'theme-8bit-nostalgia',
    properties: {
        light: { // A light version is non-standard for this, but let's try a Gameboy look
            '--color-background': '#C4CFA1',
            '--color-surface': '#E0E8C0',
            '--color-border': '#A9B388',
            '--color-primary': '#547253',
            '--color-secondary': '#D5DDC5',
            '--color-accent': '#445D44',
            '--color-text-primary': '#2C3E2B',
            '--color-text-secondary': '#5B684A',
            '--color-text-on-primary': '#E0E8C0',
        },
        dark: { // Classic terminal look
            '--dark-color-background': '#0F0F0F',
            '--dark-color-surface': '#1A1A1A',
            '--dark-color-border': '#333333',
            '--dark-color-primary': '#00FF00', // Bright Green
            '--dark-color-secondary': '#151515',
            '--dark-color-accent': '#33FF33',
            '--dark-color-text-primary': '#00FF00',
            '--dark-color-text-secondary': '#008000', // Darker Green
            '--dark-color-text-on-primary': '#0F0F0F',
        },
    },
  },
    {
    id: 'theme-gothic-noir',
    properties: {
        light: {
            '--color-background': '#EAE6E1',
            '--color-surface': '#F5F2ED',
            '--color-border': '#D4CEC6',
            '--color-primary': '#8B0000', // Dark Red
            '--color-secondary': '#F0ECE6',
            '--color-accent': '#660000',
            '--color-text-primary': '#333333',
            '--color-text-secondary': '#666666',
            '--color-text-on-primary': '#FFFFFF',
        },
        dark: {
            '--dark-color-background': '#121212',
            '--dark-color-surface': '#1E1E1E',
            '--dark-color-border': '#333333',
            '--dark-color-primary': '#DC143C', // Crimson
            '--dark-color-secondary': '#1A1A1A',
            '--dark-color-accent': '#B22222', // Firebrick
            '--dark-color-text-primary': '#DCDCDC', // Gainsboro
            '--dark-color-text-secondary': '#808080', // Gray
            '--dark-color-text-on-primary': '#FFFFFF',
        },
    },
  },
  {
    id: 'theme-synthwave-sunset',
    properties: {
        light: { // A "day" version of synthwave
            '--color-background': '#FFE4E1',
            '--color-surface': '#FFFFFF',
            '--color-border': '#FFC0CB',
            '--color-primary': '#FF69B4', // Hot Pink
            '--color-secondary': '#FFF5EE',
            '--color-accent': '#FF1493',
            '--color-text-primary': '#3D003D',
            '--color-text-secondary': '#8A2BE2',
            '--color-text-on-primary': '#FFFFFF',
        },
        dark: {
            '--dark-color-background': '#1A103C',
            '--dark-color-surface': '#2C1B4E',
            '--dark-color-border': '#4C3B6E',
            '--dark-color-primary': '#00FFFF', // Cyan
            '--dark-color-secondary': '#231545',
            '--dark-color-accent': '#FF00FF', // Magenta
            '--dark-color-text-primary': '#F0F0FF',
            '--dark-color-text-secondary': '#A090C0',
            '--dark-color-text-on-primary': '#1A103C',
        },
    },
  },
];
