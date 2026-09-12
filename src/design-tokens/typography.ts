/**
 * Design Tokens - Typography
 * Premium type scale for the DoorDash clone
 */

export const fontFamily = {
  sans: 'System', // Uses system font for best performance
  mono: 'Courier New',
};

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 36,
  '7xl': 40,
  '8xl': 48,
};

export const fontWeight = {
  thin: '100' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.6,
};

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
};

export default typography;
