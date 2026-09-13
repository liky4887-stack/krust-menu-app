import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Clock, ChefHat, Package, CheckCircle2, XCircle, LogOut, Store, Bike } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { OrderStatus } from '@/store/useOrdersStore';

interface StaffOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  fulfillment: string;
  total: number;
  status: OrderStatus;
  items_json: any[];
  created_at: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'بانتظار', color: '#F5A623', bg: '#FEF3E2', icon: Clock },
  preparing: { label: 'قيد التحضير', color: '#1A5DAB', bg: '#E8F1FB', icon: ChefHat },
  ready: { label: 'جاهز', color: '#059669', bg: '#E8F8EF', icon: Package },
  completed: { label: 'مكتمل', color: '#059669', bg: '#E8F8EF', icon: CheckCircle2 },
  cancelled: { label: 'ملغي', color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'completed',
  completed: null,
  cancelled: null,
};

const nextStatusLabel: Record<OrderStatus, string> = {
  pending: 'بدء التحضير',
  preparing: 'جاهز',
  ready: 'إكمال',
  completed: '',
  cancelled: '',
};

export default function StaffDashboardScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setOrders(data as StaffOrder[]);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('staff-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('staff_profiles')
          .select('display_name')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) setDisplayName(profile.display_name ?? '');
          });
      }
    });

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  const renderOrder = (order: StaffOrder) => {
    const sCfg = statusConfig[order.status];
    const StatusIcon = sCfg.icon;
    const next = nextStatus[order.status];
    const items = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json;
    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderCustomer}>{order.customer_name}</Text>
            <Text style={styles.orderPhone}>{order.customer_phone}</Text>
          </View>
          <View style={[styles.orderBadge, { backgroundColor: sCfg.bg }]}>
            <StatusIcon size={12} color={sCfg.color} strokeWidth={2.5} />
            <Text style={[styles.orderBadgeText, { color: sCfg.color }]}>{sCfg.label}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {items?.map((item: any, i: number) => (
            <Text key={i} style={styles.orderItemText}>
              {item.name} × {item.quantity}
            </Text>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.orderMetaRow}>
            <View style={styles.orderMetaItem}>
              {order.fulfillment === 'pickup'
                ? <Store size={13} color={Colors.DARK_GRAY} strokeWidth={2} />
                : <Bike size={13} color={Colors.DARK_GRAY} strokeWidth={2} />}
              <Text style={styles.orderMetaText}>
                {order.fulfillment === 'pickup' ? 'استلام' : 'توصيل'}
              </Text>
            </View>
            <Text style={styles.orderTotal}>{Number(order.total).toFixed(2)} د.ل</Text>
          </View>

          {next && (
            <TouchableOpacity
              style={styles.advanceBtn}
              onPress={() => handleStatusChange(order.id, next)}
              activeOpacity={0.7}
            >
              <Text style={styles.advanceBtnText}>{nextStatusLabel[order.status]}</Text>
              <ChevronRight size={16} color={Colors.WHITE} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>لوحة التحكم</Text>
            <Text style={styles.headerSubtitle}>
              {displayName ? `مرحبًا ${displayName}` : 'مرحبًا'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} color={Colors.PRIMARY} strokeWidth={2} />
            <Text style={styles.logoutText}>خروج</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeOrders.length}</Text>
            <Text style={styles.statLabel}>طلبات نشطة</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedOrders.length}</Text>
            <Text style={styles.statLabel}>طلبات مكتملة</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {activeOrders.filter((o) => o.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>بانتظار</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {activeOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>طلبات نشطة</Text>
            {activeOrders.map(renderOrder)}
          </View>
        )}
        {completedOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>طلبات مكتملة</Text>
            {completedOrders.map(renderOrder)}
          </View>
        )}
        {orders.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>لا توجد طلبات</Text>
          </View>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  header: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  headerTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY },
  headerSubtitle: { fontSize: 14, color: Colors.DARK_GRAY, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.PRIMARY_LIGHT,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: Radius.PILL,
  },
  logoutText: { fontSize: 13, fontWeight: '700', color: Colors.PRIMARY },
  statsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.SM,
    marginTop: Spacing.MD,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.SURFACE,
    borderRadius: Radius.MD,
    padding: Spacing.MD,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.PRIMARY },
  statLabel: { fontSize: 11, color: Colors.DARK_GRAY, marginTop: 2 },
  container: { flex: 1 },
  section: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.SM, textAlign: 'right' },
  orderCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.CARD,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: Spacing.MD,
    marginBottom: Spacing.MD,
  },
  orderHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.SM,
  },
  orderCustomer: { fontSize: 15, fontWeight: '700', color: Colors.BLACK, textAlign: 'right' },
  orderPhone: { fontSize: 12, color: Colors.DARK_GRAY, marginTop: 2 },
  orderBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.SM,
    paddingHorizontal: Spacing.SM,
    paddingVertical: 4,
  },
  orderBadgeText: { fontSize: 11, fontWeight: '700' },
  orderItems: { gap: 2, marginBottom: Spacing.SM },
  orderItemText: { fontSize: 13, color: Colors.DARK_GRAY, textAlign: 'right' },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    paddingTop: Spacing.SM,
  },
  orderMetaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  orderMetaItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  orderMetaText: { fontSize: 11, color: Colors.DARK_GRAY },
  orderTotal: { fontSize: 15, fontWeight: '800', color: Colors.PRIMARY },
  advanceBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radius.SM,
    paddingVertical: Spacing.SM + 2,
  },
  advanceBtnText: { color: Colors.WHITE, fontSize: 14, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.XXL },
  emptyText: { fontSize: 16, color: Colors.DARK_GRAY },
  bottomPadding: { height: 120 },
});
