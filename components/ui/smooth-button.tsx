import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { cva, type VariantProps } from 'class-variance-authority';
import { Colors, Radius } from '@/constants/colors';

const smoothButtonVariants = cva('', {
  variants: {
    variant: {
      default: {},
      destructive: {},
      outline: {},
      secondary: {},
      ghost: {},
      link: {},
      candy: {},
    },
    size: {
      default: {},
      sm: {},
      lg: {},
      icon: {},
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export type SmoothButtonProps = {
  variant?: VariantProps<typeof smoothButtonVariants>['variant'];
  size?: VariantProps<typeof smoothButtonVariants>['size'];
  className?: string;
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
} & Omit<React.ComponentProps<typeof TouchableOpacity>, 'onPress' | 'style'>;

const sizeStyles: Record<string, { height: number; paddingHorizontal: number; borderRadius: number }> = {
  default: { height: 40, paddingHorizontal: 16, borderRadius: Radius.SM },
  sm: { height: 36, paddingHorizontal: 16, borderRadius: Radius.SM },
  lg: { height: 44, paddingHorizontal: 32, borderRadius: Radius.SM },
  icon: { height: 40, paddingHorizontal: 0, borderRadius: Radius.SM },
};

const variantStyles: Record<string, { backgroundColor: string; borderWidth: number; borderColor: string }> = {
  default: { backgroundColor: Colors.PRIMARY, borderWidth: 0, borderColor: 'transparent' },
  destructive: { backgroundColor: Colors.RED_500, borderWidth: 0, borderColor: 'transparent' },
  outline: { backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER },
  secondary: { backgroundColor: Colors.GRAY, borderWidth: 0, borderColor: 'transparent' },
  ghost: { backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent' },
  link: { backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent' },
  candy: { backgroundColor: Colors.BRAND, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.25)' },
};

const textColorForVariant: Record<string, string> = {
  default: Colors.WHITE,
  destructive: Colors.WHITE,
  outline: Colors.BLACK,
  secondary: Colors.BLACK,
  ghost: Colors.BLACK,
  link: Colors.PRIMARY,
  candy: Colors.WHITE,
};

export default function SmoothButton({
  variant = 'default',
  size = 'default',
  children,
  onPress,
  disabled,
  style,
  ...props
}: SmoothButtonProps) {
  const scale = useSharedValue(1);
  const sizeStyle = sizeStyles[size || 'default'] || sizeStyles.default;
  const variantStyle = variantStyles[variant || 'default'] || variantStyles.default;
  const textColor = textColorForVariant[variant || 'default'] || Colors.WHITE;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.85}
        style={[
          styles.base,
          sizeStyle,
          variantStyle,
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text style={[styles.text, { color: textColor }]}>{children}</Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

export { smoothButtonVariants };
