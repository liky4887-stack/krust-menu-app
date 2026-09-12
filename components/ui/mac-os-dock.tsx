import React, { useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Platform,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/colors';

export interface DockApp {
  id: string;
  name: string;
  icon?: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

export interface MacOSDockProps {
  apps: DockApp[];
  activeIndex: number;
  onAppClick: (index: number) => void;
  badge?: number;
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
}

const BASE_ICON_SIZE = 52;
const MAX_SCALE = 1.18;
const MIN_SCALE = 1.0;
const EFFECT_WIDTH = 200;
const PADDING = 10;

export default function MacOSDock({
  apps,
  activeIndex,
  onAppClick,
  badge,
  bottomInset = 0,
  style,
}: MacOSDockProps) {
  const touchX = useSharedValue<number | null>(null);
  const dockX = useRef(0);
  const dockWidth = useRef(0);

  const scale0 = useSharedValue(1);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const scale4 = useSharedValue(1);
  const scale5 = useSharedValue(1);
  const scales: SharedValue<number>[] = [scale0, scale1, scale2, scale3, scale4, scale5];

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    dockX.current = e.nativeEvent.layout.x;
    dockWidth.current = e.nativeEvent.layout.width;
  }, []);

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(1)
    .onUpdate((e) => {
      touchX.value = e.absoluteX - dockX.current;
    })
    .onEnd(() => {
      touchX.value = null;
    });

  const hoverGesture = Gesture.Hover()
    .onUpdate((e) => {
      touchX.value = e.absoluteX - dockX.current;
    })
    .onEnd(() => {
      touchX.value = null;
    });

  const gesture = Platform.OS === 'web' ? hoverGesture : panGesture;

  useEffect(() => {
    const interval = setInterval(() => {
      const mx = touchX.value;
      const slotWidth = dockWidth.current / apps.length;
      if (mx === null) {
        scales.forEach((sv, i) => {
          if (i < apps.length && Math.abs(sv.value - MIN_SCALE) > 0.005) {
            sv.value = withSpring(MIN_SCALE, { damping: 18, stiffness: 250 });
          }
        });
        return;
      }
      apps.forEach((_, i) => {
        const slotCenter = slotWidth * i + slotWidth / 2;
        const min = mx - EFFECT_WIDTH / 2;
        const max = mx + EFFECT_WIDTH / 2;
        const sv = scales[i];
        if (slotCenter < min || slotCenter > max) {
          if (Math.abs(sv.value - MIN_SCALE) > 0.005) {
            sv.value = withSpring(MIN_SCALE, { damping: 18, stiffness: 300 });
          }
          return;
        }
        const dist = Math.abs(slotCenter - mx);
        const factor = 1 - dist / (EFFECT_WIDTH / 2);
        const target = MIN_SCALE + factor * (MAX_SCALE - MIN_SCALE);
        sv.value = withSpring(target, { damping: 16, stiffness: 280 });
      });
    }, 16);
    return () => clearInterval(interval);
  }, [apps, scales, touchX]);

  return (
    <GestureDetector gesture={gesture}>
      <View
        onLayout={handleLayout}
        style={[styles.dockContainer, { height: 64 + bottomInset }, style]}
      >
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFillObject} />
        <View style={styles.dockInner}>
          {apps.map((app, index) => (
            <DockItem
              key={app.id}
              label={app.name}
              scale={scales[index]}
              isActive={activeIndex === index}
              badge={app.id === 'cart' ? badge : undefined}
              onPress={() => onAppClick(index)}
            />
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}

interface DockItemProps {
  label: string;
  scale: SharedValue<number>;
  isActive: boolean;
  badge?: number;
  onPress: () => void;
}

const DockItem = React.memo(function DockItem({
  label,
  scale,
  isActive,
  badge,
  onPress,
}: DockItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotOpacity = useSharedValue(isActive ? 1 : 0);
  useEffect(() => {
    dotOpacity.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  return (
    <Pressable onPress={onPress} style={styles.itemWrapper}>
      <Animated.View style={[styles.labelBox, animatedStyle, isActive && styles.labelBoxActive]}>
        <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
        {badge !== undefined && badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        ) : null}
      </Animated.View>
      <Animated.View style={[styles.dot, dotStyle]} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  dockContainer: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(214,228,240,0.8)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(240,246,255,0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  dockInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: PADDING,
    gap: 0,
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  labelBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  labelBoxActive: {
    backgroundColor: 'rgba(26,93,171,0.1)',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.DARK_GRAY,
  },
  labelActive: {
    color: Colors.BRAND,
    fontWeight: '700',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.BRAND,
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.RED_500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.WHITE,
    fontSize: 10,
    fontWeight: '700',
  },
});
