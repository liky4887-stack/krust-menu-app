/**
 * CartItemRow - Individual cart item with animations and haptic feedback
 */

import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import colors from "@/src/design-tokens/colors";
import typography from "@/src/design-tokens/typography";
import { shadows } from "@/src/design-tokens/shadows";
import { space } from "@/src/design-tokens/spacing";
import { borderRadius } from "@/src/design-tokens/border-radius";
import { CartItem } from '@/store/useCartStore';

const triggerHaptic = (style: 'light' | 'medium') => {
  if (Platform.OS === 'web') return;
  try {
    const Haptics = require('expo-haptics');
    Haptics.impactAsync(style === 'light' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
};

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
    triggerHaptic('light');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handleRemove = () => {
    triggerHaptic('medium');
    opacity.value = withTiming(0, { duration: 300 }, () => {
      onRemove(item.id);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View entering={FadeIn.duration(300).springify()} style={[styles.container, animatedStyle]}>
      <AnimatedTouchableOpacity
        style={styles.content}
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, الكمية ${item.quantity}`}
      >
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji} numberOfLines={2}>{item.name}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          {item.nameEn ? <Text style={styles.nameEn}>{item.nameEn}</Text> : null}
          {item.options ? <Text style={styles.options} numberOfLines={2}>{item.options}</Text> : null}
          <Text style={styles.price}>{item.price.toFixed(2)} د.ل</Text>
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onDecrement(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`تقليل كمية ${item.name}`}
          >
            <Ionicons name="remove" size={16} color={colors.neutral[600]} />
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onIncrement(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`زيادة كمية ${item.name}`}
          >
            <Ionicons name="add" size={16} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={handleRemove}
          accessibilityRole="button"
          accessibilityLabel={`إزالة ${item.name} من السلة`}
        >
          <Ionicons name="trash-outline" size={18} color={colors.semantic.error} />
        </TouchableOpacity>
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: space.md,
    marginBottom: space.sm,
    ...shadows.sm,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.md,
    padding: 4,
  },
  emoji: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary[500],
    textAlign: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: 2,
  },
  nameEn: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    marginBottom: 2,
  },
  options: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
    marginBottom: 2,
    fontStyle: 'italic',
  },
  price: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    marginRight: space.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: space.xs,
    marginLeft: space.sm,
  },
});
