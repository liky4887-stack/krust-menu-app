import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';

export default function FloatingCart() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotal());
  const count = useCartStore((s) => s.getItemCount());
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevCount = useRef(0);

  useEffect(() => {
    if (count > 0 && prevCount.current === 0) {
      Animated.spring(slideAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else if (count === 0 && prevCount.current > 0) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
    prevCount.current = count;
  }, [count]);

  if (count === 0) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity
        style={styles.cartBar}
        onPress={() => router.push('/(tabs)/cart')}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          <View style={styles.iconWrapper}>
            <ShoppingCart size={20} color={Colors.WHITE} strokeWidth={2.5} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          </View>
          <View style={styles.textSection}>
            <Text style={styles.label}>عرض السلة</Text>
            <Text style={styles.total}>{total.toFixed(2)} د.ل</Text>
          </View>
        </View>
        <View style={styles.arrow} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: Spacing.LG,
    right: Spacing.LG,
    zIndex: 50,
  },
  cartBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radius.PILL,
    paddingVertical: Spacing.SM + 2,
    paddingHorizontal: Spacing.LG,
    shadowColor: '#0A1B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  leftSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.SM + 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    left: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.RED_500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  badgeText: {
    color: Colors.WHITE,
    fontSize: 10,
    fontWeight: '800',
  },
  textSection: {
    gap: 1,
    alignItems: 'flex-end',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  total: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
  arrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderTopColor: Colors.WHITE,
    borderRightWidth: 2,
    borderRightColor: Colors.WHITE,
    transform: [{ rotate: '45deg' }],
  },
});
