/**
 * Design Tokens - Spacing
 * Consistent spacing scale based on 8px base unit
 */

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

// Semantic spacing aliases
export const space = {
  xs: spacing[1],   // 4
  sm: spacing[2],   // 8
  md: spacing[4],   // 16
  lg: spacing[5],   // 20
  xl: spacing[6],   // 24
  '2xl': spacing[8], // 32
  '3xl': spacing[10], // 40
  '4xl': spacing[12], // 48
};

export default { spacing, space };
