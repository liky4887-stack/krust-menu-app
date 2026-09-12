/**
 * Design Tokens - Barrel Export
 * Centralized exports for all design tokens
 */

import colors from './colors';
import typography from './typography';
import { space, spacing } from './spacing';
import { shadows } from './shadows';
import { borderRadius } from './border-radius';

export { colors } from './colors';
export { space, spacing } from './spacing';
export { shadows } from './shadows';
export { borderRadius } from './border-radius';
export { fontFamily, fontSize, fontWeight, lineHeight } from './typography';

export default {
  colors,
  typography,
  space,
  spacing,
  shadows,
  borderRadius,
};
