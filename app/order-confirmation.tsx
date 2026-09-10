import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Store, Bike, Receipt, Home, ClipboardList } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useOrdersStore } from '@/store/useOrdersStore';

const paymentLabels: Record<string, string> = { sedad: 'سداد', edfaely: 'ادفعلي', cash: 'الدفع عند الاستلام' };

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId: string; total: string; paymentMethod: string; paymentRef: string; fulfillment: string; name: string; }>();
  const orders = useOrdersStore((s) => s.orders);
  const order = orders.find((o) => o.id === params.orderId);
  const isPickup = params.fulfillment === 'pickup';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.checkCircle}><CheckCircle2 size={64} color={Colors.EMERALD_600} strokeWidth={2} /></View>
        <Text style={styles.title}>تم تأكيد طلبك!</Text>
        <Text style={styles.subtitle}>شكرًا لك يا {params.name}</Text>
        <View style={styles.orderNumberCard}><Text style={styles.orderNumberLabel}>رقم الطلب</Text><Text style={styles.orderNumber}>{params.orderId}</Text></View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>{isPickup ? <Store size={20} color={Colors.PRIMARY} strokeWidth={2} /> : <Bike size={20} color={Colors.PRIMARY} strokeWidth={2} />}</View>
            <View style={styles.infoContent}><Text style={styles.infoLabel}>طريقة الاستلام</Text><Text style={styles.infoValue}>{isPickup ? 'استلام من الفرع' : 'توصيل'}</Text></View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Receipt size={20} color={Colors.PRIMARY} strokeWidth={2} /></View>
            <View style={styles.infoContent}><Text style={styles.infoLabel}>طريقة الدفع</Text><Text style={styles.infoValue}>{paymentLabels[params.paymentMethod] ?? params.paymentMethod}</Text>{params.paymentMethod !== 'cash' && <Text style={styles.infoSub}>رقم العملية: {params.paymentRef}</Text>}</View>
          </View>
        </View>
        {order && (<View style={styles.itemsCard}><Text style={styles.itemsTitle}>تفاصيل الطلب</Text>{order.items.map((item) => (<View key={item.id + (item.options ?? '')} style={styles.itemRow}><View style={styles.itemInfo}><Text style={styles.itemName}>{item.name}</Text>{item.options ? <Text style={styles.itemOptions}>{item.options}</Text> : null}<Text style={styles.itemQty}>الكمية: {item.quantity}</Text></View><Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} د.ل</Text></View>))}<View style={styles.itemsDivider} /><View style={styles.totalRow}><Text style={styles.totalLabel}>الإجمالي</Text><Text style={styles.totalValue}>{params.total} د.ل</Text></View></View>)}
        {isPickup && (<View style={styles.estimatedCard}><Text style={styles.estimatedText}>سيكون طلبك جاهزًا خلال 15-20 دقيقة</Text></View>)}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.replace('/(tabs)/orders')} activeOpacity={0.85}><ClipboardList size={20} color={Colors.PRIMARY} strokeWidth={2} /><Text style={styles.actionText}>عرض طلباتي</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => router.replace('/(tabs)/')} activeOpacity={0.85}><Home size={20} color={Colors.WHITE} strokeWidth={2} /><Text style={styles.actionTextPrimary}>العودة للقائمة</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.XXL, paddingBottom: Spacing.XXL },
  checkCircle: { alignItems: 'center', marginBottom: Spacing.MD },
  title: { fontSize: 24, fontWeight: '800', color: Colors.EMERALD_600, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 15, color: Colors.DARK_GRAY, textAlign: 'center', marginBottom: Spacing.XL },
  orderNumberCard: { backgroundColor: Colors.PRIMARY_LIGHT, borderRadius: Radius.CARD, padding: Spacing.LG, alignItems: 'center', marginBottom: Spacing.LG },
  orderNumberLabel: { fontSize: 13, color: Colors.DARK_GRAY, marginBottom: 4 },
  orderNumber: { fontSize: 20, fontWeight: '800', color: Colors.PRIMARY },
  infoCard: { backgroundColor: Colors.WHITE, borderRadius: Radius.CARD, borderWidth: 1, borderColor: Colors.BORDER, padding: Spacing.MD, marginBottom: Spacing.LG },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.PRIMARY_LIGHT, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.MD },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.DARK_GRAY, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '700', color: Colors.BLACK },
  infoSub: { fontSize: 11, color: Colors.DARK_GRAY, marginTop: 2 },
  infoDivider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Spacing.MD },
  itemsCard: { backgroundColor: Colors.WHITE, borderRadius: Radius.CARD, borderWidth: 1, borderColor: Colors.BORDER, padding: Spacing.MD, marginBottom: Spacing.LG },
  itemsTitle: { fontSize: 16, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  itemRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.SM },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: Colors.BLACK, textAlign: 'right' },
  itemOptions: { fontSize: 12, color: Colors.DARK_GRAY, marginTop: 2, textAlign: 'right' },
  itemQty: { fontSize: 12, color: Colors.DARK_GRAY, marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: Colors.PRIMARY },
  itemsDivider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Spacing.SM },
  totalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 17, fontWeight: '700', color: Colors.BLACK },
  totalValue: { fontSize: 17, fontWeight: '800', color: Colors.PRIMARY },
  estimatedCard: { backgroundColor: '#E8F8EF', borderRadius: Radius.MD, padding: Spacing.MD, alignItems: 'center', marginBottom: Spacing.XL },
  estimatedText: { fontSize: 14, fontWeight: '600', color: Colors.EMERALD_600, textAlign: 'center' },
  actionsRow: { flexDirection: 'row-reverse', gap: Spacing.MD },
  actionBtn: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.WHITE, borderRadius: Radius.CHIP, paddingVertical: Spacing.MD, borderWidth: 1.5, borderColor: Colors.PRIMARY },
  actionText: { fontSize: 14, fontWeight: '700', color: Colors.PRIMARY },
  actionBtnPrimary: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  actionTextPrimary: { fontSize: 14, fontWeight: '700', color: Colors.WHITE },
});
