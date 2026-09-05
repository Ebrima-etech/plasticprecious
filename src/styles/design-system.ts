// FAANG-Quality Design System
// Professional design tokens for Plastic Precious eCommerce platform

export const colors = {
  // Primary Green (Brand color)
  primary: {
    50: '#f0faf4',
    100: '#e0f5e8',
    200: '#c1ead1',
    300: '#a3dfba',
    400: '#84d4a3',
    500: '#22c55e', // Primary green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Semantic colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Neutral grays (professional, modern)
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic neutral
  background: '#ffffff',
  surface: '#f9fafb',
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },
  border: '#e5e7eb',
  divider: '#f3f4f6',
};

export const typography = {
  fontFamily: {
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ],
    mono: [
      '"SF Mono"',
      'Monaco',
      '"Cascadia Code"',
      '"Roboto Mono"',
      'Consolas',
      'monospace',
    ],
  },

  // Font sizes (8px base scale)
  fontSize: {
    xs: ['12px', { lineHeight: '16px', letterSpacing: '0.3px' }],
    sm: ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
    base: ['16px', { lineHeight: '24px', letterSpacing: '0' }],
    lg: ['18px', { lineHeight: '28px', letterSpacing: '0' }],
    xl: ['20px', { lineHeight: '28px', letterSpacing: '0' }],
    '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.5px' }],
    '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.5px' }],
    '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-1px' }],
    '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-1px' }],
  },

  // Font weights
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights for different contexts
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.5px',
    normal: '0',
    wide: '0.5px',
  },
};

export const spacing = {
  // 4px base unit scale (professional, modern)
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

export const shadows = {
  // Elevation system (subtle, professional)
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const borderRadius = {
  none: '0',
  xs: '2px',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
};

export const transitions = {
  // Animation timing (smooth, professional)
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
  slower: '600ms',

  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const zIndex = {
  hide: '-1',
  base: '0',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  backdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
};

// Breakpoints (mobile-first)
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Component-specific constants
export const components = {
  button: {
    height: {
      xs: '28px',
      sm: '32px',
      base: '40px',
      lg: '48px',
    },
    padding: {
      xs: '4px 12px',
      sm: '8px 14px',
      base: '10px 16px',
      lg: '12px 20px',
    },
  },
  input: {
    height: '40px',
    borderRadius: '6px',
  },
  card: {
    padding: '20px',
    borderRadius: '12px',
  },
};
