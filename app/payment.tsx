import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, ShieldCheck, CreditCard, Banknote, Wallet, Landmark } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';
import { useOrdersStore, PaymentMethod, FulfillmentType } from '@/store/useOrdersStore';

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
  color: string;
  bg: string;
}

const paymentOptions: PaymentOption[] = [
  { id: 'sedad', label: 'سداد', description: 'تحويل فوري ومأمون', icon: Landmark, color: '#0B9B4A', bg: '#E8F8EF' },
  { id: 'edfaely', label: 'ادفعلي', description: 'محفظة إلكترونية سريعة', icon: Wallet, color: '#1A5DAB', bg: '#E8F1FB' },
  { id: 'cash', label: 'الدفع عند الاستلام', description: 'ادفع نقدًا عند استلام طلبك', icon: Banknote, color: '#F5A623', bg: '#FEF3E2' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name: string; phone: string; address: string; fulfillment: FulfillmentType; subtotal: string; tax: string; total: string; }>();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = parseFloat(params.total || '0');

  const handlePay = () => {
    if (!selected) return;
    setError(null);
    if (selected === 'cash') { finalizeOrder('cash', `CASH-${Date.now()}`); return; }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const ref = selected === 'sedad' ? `SD-${Date.now().toString().slice(-8)}` : `ED-${Date.now().toString().slice(-8)}`;
      finalizeOrder(selected, ref);
    }, 2200);
  };

  const finalizeOrder = (method: PaymentMethod, ref: string) => {
    const order = addOrder({
      items: [...items],
      subtotal: parseFloat(params.subtotal || '0'),
      tax: parseFloat(params.tax || '0'),
      total,
      customerName: params.name,
      customerPhone: params.phone,
      customerAddress: params.address,
      fulfillment: params.fulfillment,
      paymentMethod: method,
      paymentRef: ref,
    });
    clearCart();
    router.replace({ pathname: '/order-confirmation', params: { orderId: order.id, total: total.toFixed(2), paymentMethod: method, paymentRef: ref, fulfillment: params.fulfillment, name: params.name } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ChevronLeft size={24} color={Colors.BLACK} strokeWidth={2.5} /></TouchableOpacity>
        <Text style={styles.topBarTitle}>طريقة الدفع</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.totalCard}><Text style={styles.totalLabel}>المبلغ المستحق</Text><Text style={styles.totalValue}>{total.toFixed(2)} د.ل</Text></View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختر طريقة الدفع</Text>
          {paymentOptions.map((opt) => {
            const isSelected = selected === opt.id;
            const Icon = opt.icon;
            return (
              <TouchableOpacity key={opt.id} style={[styles.paymentCard, isSelected && styles.paymentCardActive]} onPress={() => setSelected(opt.id)} activeOpacity={0.7}>
                <View style={[styles.paymentIcon, { backgroundColor: opt.bg }]}><Icon size={24} color={opt.color} strokeWidth={2} /></View>
                <View style={styles.paymentInfo}><Text style={styles.paymentLabel}>{opt.label}</Text><Text style={styles.paymentDesc}>{opt.description}</Text></View>
                <View style={[styles.radio, isSelected && styles.radioActive]}>{isSelected && <Check size={14} color={Colors.WHITE} strokeWidth={3} />}</View>
              </TouchableOpacity>
            );
          })}
          <View style={styles.securityNote}><ShieldCheck size={16} color={Colors.DARK_GRAY} strokeWidth={2} /><Text style={styles.securityText}>جميع المعاملات مشفرة وآمنة</Text></View>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerTotalRow}><Text style={styles.footerTotalLabel}>الإجمالي</Text><Text style={styles.footerTotalValue}>{total.toFixed(2)} د.ل</Text></View>
        <TouchableOpacity style={[styles.payBtn, !selected && styles.payBtnDisabled, processing && styles.payBtnProcessing]} onPress={handlePay} disabled={!selected || processing} activeOpacity={0.85}>
          {processing ? (
            <View style={styles.processingRow}><ActivityIndicator color={Colors.WHITE} size="small" /><Text style={styles.payBtnText}>جاري المعالجة...</Text></View>
          ) : (
            <><Text style={styles.payBtnText}>{selected === 'cash' ? 'تأكيد الطلب' : 'ادفع الآن'}</Text><ChevronLeft size={20} color={Colors.WHITE} strokeWidth={2.5} /></>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM, backgroundColor: Colors.WHITE, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: Colors.BLACK },
  container: { flex: 1 },
  totalCard: { marginHorizontal: Spacing.LG, marginTop: Spacing.LG, backgroundColor: Colors.PRIMARY, borderRadius: Radius.CARD, padding: Spacing.XL, alignItems: 'center' },
  totalLabel: { fontSize: 14, color: '#D6E4F0', marginBottom: 6 },
  totalValue: { fontSize: 32, fontWeight: '800', color: Colors.WHITE },
  section: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.LG },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  paymentCard: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.WHITE, borderRadius: Radius.CARD, borderWidth: 1.5, borderColor: Colors.BORDER, padding: Spacing.MD, marginBottom: Spacing.SM },
  paymentCardActive: { borderColor: Colors.PRIMARY, backgroundColor: Colors.PRIMARY_LIGHT },
  paymentIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.MD },
  paymentInfo: { flex: 1 },
  paymentLabel: { fontSize: 16, fontWeight: '700', color: Colors.BLACK, marginBottom: 2, textAlign: 'right' },
  paymentDesc: { fontSize: 12, color: Colors.DARK_GRAY, textAlign: 'right' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.LIGHT_GRAY, alignItems: 'center', justifyContent: 'center' },
  radioActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  securityNote: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: Spacing.MD },
  securityText: { fontSize: 12, color: Colors.DARK_GRAY },
  errorText: { fontSize: 13, color: Colors.RED_500, paddingHorizontal: Spacing.LG, marginTop: Spacing.SM, textAlign: 'right' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.WHITE, paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD, paddingBottom: Spacing.XL + 20, borderTopWidth: 1, borderTopColor: Colors.BORDER, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  footerTotalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.MD },
  footerTotalLabel: { fontSize: 15, fontWeight: '600', color: Colors.DARK_GRAY },
  footerTotalValue: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY },
  payBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.EMERALD_600, borderRadius: Radius.PILL, paddingVertical: Spacing.MD + 2, gap: 8 },
  payBtnDisabled: { backgroundColor: Colors.LIGHT_GRAY },
  payBtnProcessing: { backgroundColor: Colors.PRIMARY_DARK },
  payBtnText: { color: Colors.WHITE, fontSize: 17, fontWeight: '700' },
  processingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
});
