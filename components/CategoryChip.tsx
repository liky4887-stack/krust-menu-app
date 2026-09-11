import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '@/constants/colors';
import { Category } from '@/constants/mockData';

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
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM + 2,
    borderRadius: Radius.MD,
    marginLeft: Spacing.SM,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  selected: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  emoji: {
    fontSize: 14,
    marginLeft: Spacing.XS,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.BLACK,
  },
  labelSelected: {
    color: Colors.WHITE,
  },
});
