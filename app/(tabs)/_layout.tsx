import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, ClipboardList, ShoppingCart } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';

const ACTIVE_COLOR = '#143D33';
const INACTIVE_COLOR = '#A3A3A3';

type LucideIcon = typeof Home;

interface TabConfig {
  name: string;
  label: string;
  lucideIcon?: LucideIcon;
  ioniconName?: keyof typeof Ionicons.glyphMap;
}

const tabConfigs: TabConfig[] = [
  { name: 'index', label: 'القائمة', lucideIcon: Home },
  { name: 'orders', label: 'الطلبات', lucideIcon: ClipboardList },
  { name: 'messages', label: 'الرسائل', ioniconName: 'chatbubbles-outline' },
  { name: 'cart', label: 'السلة', lucideIcon: ShoppingCart },
];

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const insets = useSafeAreaInsets();
  const cartItemCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handlePress = (routeName: string) => {
    const route = state.routes.find((r: any) => r.name === routeName);
    if (!route) return;
    const isFocused = state.index === state.routes.indexOf(route);
    if (isFocused) {
      navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    } else {
      navigation.navigate(route.key);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, Spacing.SM) },
      ]}
    >
      <View style={styles.inner}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const config = tabConfigs.find((t) => t.name === route.name);
          if (!config) return null;

          const showBadge = route.name === 'cart' && cartItemCount > 0;
          const iconColor = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => handlePress(route.name)}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel={config.label}
              accessibilityState={{ selected: isFocused }}
            >
              <View style={styles.iconWrapper}>
                {config.lucideIcon ? (
                  (() => {
                    const Icon = config.lucideIcon!;
                    return (
                      <Icon
                        size={24}
                        color={iconColor}
                        strokeWidth={isFocused ? 2.5 : 2}
                        absoluteStrokeWidth={false}
                      />
                    );
                  })()
                ) : (
                  <Ionicons
                    name={config.ioniconName!}
                    size={24}
                    color={iconColor}
                  />
                )}
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
                  isFocused && styles.labelActive,
                ]}
              >
                {config.label}
              </Text>
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
      <Tabs.Screen name="messages" options={{ title: 'الرسائل' }} />
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: Spacing.SM,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
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
    gap: 4,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.RED_500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: INACTIVE_COLOR,
  },
  labelActive: {
    color: ACTIVE_COLOR,
    fontWeight: '700',
  },
});
