import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Coffee, ClipboardList, Gift, ShoppingCart } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';

interface TabConfig {
  id: string;
  name: string;
  icon: typeof Coffee;
}

const tabs: TabConfig[] = [
  { id: 'index', name: 'القائمة', icon: Coffee },
  { id: 'orders', name: 'الطلبات', icon: ClipboardList },
  { id: 'dashpass', name: 'المكافآت', icon: Gift },
  { id: 'cart', name: 'السلة', icon: ShoppingCart },
];

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const insets = useSafeAreaInsets();
  const cartItemCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const activeIndex = state.index;

  const handlePress = (index: number) => {
    const target = tabs[index].id;
    navigation.navigate(target);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, Spacing.SM) },
      ]}
    >
      <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.inner}>
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          const Icon = tab.icon;
          const showBadge = tab.id === 'cart' && cartItemCount > 0;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handlePress(index)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={tab.name}
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.iconContainer}>
                <Icon
                  size={22}
                  color={isActive ? Colors.PRIMARY : Colors.DARK_GRAY}
                  strokeWidth={isActive ? 2.5 : 2}
                  absoluteStrokeWidth={false}
                />
                {showBadge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                ]}
              >
                {tab.name}
              </Text>
              {isActive ? <View style={styles.indicator} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'القائمة' }} />
      <Tabs.Screen name="orders" options={{ title: 'الطلبات' }} />
      <Tabs.Screen name="dashpass" options={{ title: 'المكافآت' }} />
      <Tabs.Screen name="cart" options={{ title: 'السلة' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    paddingTop: Spacing.SM,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#0A1B2A', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.SM,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.XS + 2,
    gap: 3,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
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
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.DARK_GRAY,
  },
  labelActive: {
    color: Colors.PRIMARY,
    fontWeight: '700',
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.PRIMARY,
    marginTop: 2,
  },
});
