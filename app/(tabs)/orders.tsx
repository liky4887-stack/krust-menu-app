import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { RotateCw, Store, Bike, Receipt, Clock, CheckCircle2, ChefHat, Package, XCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useOrdersStore, Order, OrderStatus } from '@/store/useOrdersStore';
import { useCartStore } from '@/store/useCartStore';

const paymentLabels: Record<string, string> = {
  sedad: 'سداد',
  edfaely: 'ادفعلي',
  cash: 'الدفع عند الاستلام',
};

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'بانتظار التأكيد', color: '#F5A623', bg: '#FEF3E2', icon: Clock },
  preparing: { label: 'قيد التحضير', color: '#1A5DAB', bg: '#E8F1FB', icon: ChefHat },
  ready: { label: 'جاهز', color: '#059669', bg: '#E8F8EF', icon: Package },
  completed: { label: 'مكتمل', color: '#059669', bg: '#E8F8EF', icon: CheckCircle2 },
  cancelled: { label: 'ملغي', color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  return `${d.getDate()} ${months[d.getMonth()] ?? ''} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}

export default function OrdersScreen() {
  const router = useRouter();
  const orders = useOrdersStore((s) => s.orders);
  const addItem = useCartStore((s) => s.addItem);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    syncFromSupabase();
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        syncFromSupabase();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        price: item.price,
        image: item.image,
        imageUrl: item.imageUrl,
        options: item.options,
      });
    });
    router.navigate('/(tabs)/cart');
  };

  const activeOrders = orders.filter((o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  const renderOrder = (order: Order) => {
    const sCfg = statusConfig[order.status];
    const StatusIcon = sCfg.icon;
    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
          <View style={[styles.orderBadge, { backgroundColor: sCfg.bg }]}>
            <StatusIcon size={12} color={sCfg.color} strokeWidth={2.5} />
            <Text style={[styles.orderBadgeText, { color: sCfg.color }]}>{sCfg.label}</Text>
          </View>
        </View>

        {order.items.map((item) => (
          <View key={item.id + (item.options ?? '')} style={styles.orderItemRow}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.orderItemImg} resizeMode="cover" />
            ) : null}
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemName}>{item.name} × {item.quantity}</Text>
              {item.options ? <Text style={styles.orderItemOptions} numberOfLines={1}>{item.options}</Text> : null}
            </View>
            <Text style={styles.orderItemPrice}>{(item.price * item.quantity).toFixed(2)} د.ل</Text>
          </View>
        ))}

        <View style={styles.orderMetaRow}>
          <View style={styles.orderMetaItem}>
            {order.fulfillment === 'pickup'
              ? <Store size={13} color={Colors.DARK_GRAY} strokeWidth={2} />
              : <Bike size={13} color={Colors.DARK_GRAY} strokeWidth={2} />}
            <Text style={styles.orderMetaText}>
              {order.fulfillment === 'pickup' ? 'استلام' : 'توصيل'}
            </Text>
          </View>
          <View style={styles.orderMetaItem}>
            <Receipt size={13} color={Colors.DARK_GRAY} strokeWidth={2} />
            <Text style={styles.orderMetaText}>{paymentLabels[order.paymentMethod] ?? order.paymentMethod}</Text>
          </View>
          <Text style={styles.orderTotal}>{order.total.toFixed(2)} د.ل</Text>
        </View>

        {(order.status === 'completed') && (
          <TouchableOpacity
            style={styles.reorderBtn}
            onPress={() => handleReorder(order)}
            activeOpacity={0.7}
          >
            <RotateCw size={14} color={Colors.PRIMARY} strokeWidth={2.5} />
            <Text style={styles.reorderText}>إعادة الطلب</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>طلباتك</Text>
        <Text style={styles.headerSubtitle}>تابع طلباتك وأعد طلب مفضلاتك</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>لا توجد طلبات سابقة</Text>
          <Text style={styles.emptySubtitle}>ابدأ بطلب أول كوب من كرست</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.navigate('/')}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnText}>تصفح القائمة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {activeOrders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>طلبات نشطة</Text>
              <View style={styles.ordersList}>
                {activeOrders.map((order) => renderOrder(order))}
              </View>
            </View>
          )}
          {pastOrders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>طلبات سابقة</Text>
              <View style={styles.ordersList}>
                {pastOrders.map((order) => renderOrder(order))}
              </View>
            </View>
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  header: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY },
  headerSubtitle: { fontSize: 14, color: Colors.DARK_GRAY, marginTop: 2 },
  container: { flex: 1 },
  section: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.SM, textAlign: 'right' },
  ordersList: { gap: Spacing.MD },
  orderCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.CARD,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: Spacing.MD,
  },
  orderHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.SM,
  },
  orderDate: { fontSize: 13, fontWeight: '600', color: Colors.DARK_GRAY },
  orderBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: 4,
  },
  orderBadgeText: { fontSize: 11, fontWeight: '700' },
  orderItemRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 4,
    gap: Spacing.SM,
  },
  orderItemImg: { width: 32, height: 32, borderRadius: 8 },
  orderItemInfo: { flex: 1 },
  orderItemName: { fontSize: 13, color: Colors.BLACK, textAlign: 'right' },
  orderItemOptions: { fontSize: 11, color: Colors.DARK_GRAY, marginTop: 1, textAlign: 'right' },
  orderItemPrice: { fontSize: 13, color: Colors.DARK_GRAY, fontWeight: '500' },
  orderMetaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.SM,
    paddingTop: Spacing.SM,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
  },
  orderMetaItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  orderMetaText: { fontSize: 11, color: Colors.DARK_GRAY },
  orderTotal: { fontSize: 14, fontWeight: '800', color: Colors.PRIMARY },
  reorderBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.PRIMARY_LIGHT,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM + 2,
    borderRadius: Radius.SM,
    marginTop: Spacing.SM,
  },
  reorderText: { fontSize: 13, fontWeight: '600', color: Colors.PRIMARY },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.XL, gap: Spacing.SM },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.PRIMARY },
  emptySubtitle: { fontSize: 14, color: Colors.DARK_GRAY, textAlign: 'center' },
  emptyBtn: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: Spacing.XL,
    paddingVertical: Spacing.MD,
    borderRadius: Radius.CHIP,
    marginTop: Spacing.MD,
  },
  emptyBtnText: { color: Colors.WHITE, fontSize: 15, fontWeight: '700' },
  bottomPadding: { height: 120 },
});
