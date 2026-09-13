import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Clock, ChefHat, Package, CheckCircle2, Store, Bike } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { OrderStatus } from '@/store/useOrdersStore';

interface TrackingOrder {
  id: string;
  status: OrderStatus;
  customer_name: string;
  fulfillment: string;
  total: number;
  items_json: any[];
  created_at: string;
}

const steps: { key: OrderStatus; label: string; icon: typeof Clock; desc: string }[] = [
  { key: 'pending', label: 'تأكيد الطلب', icon: Clock, desc: 'تم استلام طلبك' },
  { key: 'preparing', label: 'قيد التحضير', icon: ChefHat, desc: 'نحضر طلبك بكل عناية' },
  { key: 'ready', label: 'جاهز', icon: Package, desc: 'طلبك جاهز للاستلام' },
  { key: 'completed', label: 'مكتمل', icon: CheckCircle2, desc: 'تم استلام طلبك' },
];

const stepOrder: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      if (data) setOrder(data as TrackingOrder);
      setLoading(false);
    };
    fetchOrder();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload: any) => {
        setOrder(payload.new as TrackingOrder);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>جاري تحميل الطلب...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>الطلب غير موجود</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>العودة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStepIndex = stepOrder.indexOf(order.status);
  const items = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronRight size={24} color={Colors.PRIMARY} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>تتبع الطلب</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Status hero */}
        <View style={styles.statusHero}>
          {(() => {
            const StatusIcon = steps[currentStepIndex]?.icon ?? Clock;
            return (
              <View style={styles.statusIconCircle}>
                <StatusIcon size={36} color={Colors.WHITE} strokeWidth={2} />
              </View>
            );
          })()}
          <Text style={styles.statusHeroTitle}>{steps[currentStepIndex]?.label ?? 'مكتمل'}</Text>
          <Text style={styles.statusHeroDesc}>{steps[currentStepIndex]?.desc ?? ''}</Text>
        </View>

        {/* Progress steps */}
        <View style={styles.stepsSection}>
          {steps.map((step, index) => {
            const isDone = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const StepIcon = step.icon;
            return (
              <View key={step.key} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepIcon, isDone && styles.stepIconDone, isCurrent && styles.stepIconCurrent]}>
                    <StepIcon size={18} color={isDone ? Colors.WHITE : Colors.DARK_GRAY} strokeWidth={2.5} />
                  </View>
                  {index < steps.length - 1 && (
                    <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepLabel, isDone && styles.stepLabelDone]}>{step.label}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Order info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>رقم الطلب</Text>
            <Text style={styles.infoValue}>#{order.id.slice(0, 8)}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIconSmall}>
              {order.fulfillment === 'pickup'
                ? <Store size={16} color={Colors.PRIMARY} strokeWidth={2} />
                : <Bike size={16} color={Colors.PRIMARY} strokeWidth={2} />}
            </View>
            <Text style={styles.infoText}>
              {order.fulfillment === 'pickup' ? 'استلام من الفرع' : 'توصيل'}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>الطلبات</Text>
          {items?.map((item: any, i: number) => (
            <View key={i} style={styles.itemRow}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.itemImg} resizeMode="cover" />
              ) : null}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name} × {item.quantity}</Text>
                {item.options ? <Text style={styles.itemOptions} numberOfLines={1}>{item.options}</Text> : null}
              </View>
              <Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} د.ل</Text>
            </View>
          ))}
          <View style={styles.itemsDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>الإجمالي</Text>
            <Text style={styles.totalValue}>{Number(order.total).toFixed(2)} د.ل</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: Colors.PRIMARY },
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.MD },
  loadingText: { fontSize: 16, color: Colors.DARK_GRAY },
  backLink: { fontSize: 16, color: Colors.PRIMARY, fontWeight: '600' },
  statusHero: {
    alignItems: 'center',
    paddingVertical: Spacing.XL,
    paddingHorizontal: Spacing.LG,
  },
  statusIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.MD,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  statusHeroTitle: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY, marginBottom: 4 },
  statusHeroDesc: { fontSize: 14, color: Colors.DARK_GRAY, textAlign: 'center' },
  stepsSection: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: Spacing.LG,
    borderRadius: Radius.CARD,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: Spacing.LG,
    marginBottom: Spacing.MD,
  },
  stepRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    minHeight: 60,
  },
  stepLeft: {
    alignItems: 'center',
    width: 40,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.SURFACE,
    borderWidth: 2,
    borderColor: Colors.BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconDone: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  stepIconCurrent: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: Colors.BORDER,
    marginTop: 4,
  },
  stepLineDone: {
    backgroundColor: Colors.PRIMARY,
  },
  stepContent: {
    flex: 1,
    marginRight: Spacing.SM,
    paddingBottom: Spacing.MD,
  },
  stepLabel: { fontSize: 15, fontWeight: '700', color: Colors.DARK_GRAY, textAlign: 'right' },
  stepLabelDone: { color: Colors.BLACK },
  stepDesc: { fontSize: 12, color: Colors.DARK_GRAY, marginTop: 2, textAlign: 'right' },
  infoCard: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: Spacing.LG,
    borderRadius: Radius.CARD,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: Spacing.MD,
    marginBottom: Spacing.MD,
  },
  infoHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTitle: { fontSize: 14, color: Colors.DARK_GRAY },
  infoValue: { fontSize: 16, fontWeight: '800', color: Colors.PRIMARY },
  infoDivider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Spacing.MD },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.SM },
  infoIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { fontSize: 14, fontWeight: '600', color: Colors.BLACK },
  itemsCard: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: Spacing.LG,
    borderRadius: Radius.CARD,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: Spacing.MD,
    marginBottom: Spacing.MD,
  },
  itemsTitle: { fontSize: 16, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  itemRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 4,
    gap: Spacing.SM,
  },
  itemImg: { width: 36, height: 36, borderRadius: 8 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, color: Colors.BLACK, textAlign: 'right' },
  itemOptions: { fontSize: 11, color: Colors.DARK_GRAY, marginTop: 1, textAlign: 'right' },
  itemPrice: { fontSize: 14, color: Colors.DARK_GRAY, fontWeight: '500' },
  itemsDivider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Spacing.SM },
  totalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 17, fontWeight: '700', color: Colors.BLACK },
  totalValue: { fontSize: 17, fontWeight: '800', color: Colors.PRIMARY },
});
