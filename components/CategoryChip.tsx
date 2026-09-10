/**
 * CategoryChip - Animated category selection chip
 */

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import colors from "@/src/design-tokens/colors";
import typography from "@/src/design-tokens/typography";
import { space } from "@/src/design-tokens/spacing";
import { borderRadius } from "@/src/design-tokens/border-radius";
import { Category } from '@/constants/mockData';
import * as Haptics from 'expo-haptics';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  onPress?: () => void;
}

export default function CategoryChip({ category, selected = false, onPress }: CategoryChipProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 10, stiffness: 200 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, selected && styles.selected, animatedStyle]}
      activeOpacity={0.7}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`تصفية حسب ${category.label}`}
      accessibilityState={{ selected }}
    >
      <Text style={styles.emoji}>{category.emoji}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>{category.label}</Text>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: borderRadius.pill,
    marginLeft: space.sm,
  },
  selected: {
    backgroundColor: colors.primary[500],
  },
  emoji: {
    fontSize: typography.fontSize.base,
    marginLeft: space.sm,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[900],
  },
  labelSelected: {
    color: colors.text.inverse,
  },
});
