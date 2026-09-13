import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';
import { useOrdersStore, PaymentMethod, FulfillmentType } from '@/store/useOrdersStore';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string; phone: string; address: string;
    fulfillment: FulfillmentType;
    subtotal: string; tax: string; total: string;
  }>();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrdersStore((s) => s.addOrder);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = parseFloat(params.total || '0');
  const deliveryFee = params.fulfillment === 'delivery' ? 1.50 : 0;

  const handlePay = () => {
    if (!selectedMethod) return;
    setError(null);

    if (selectedMethod === 'cash') {
      finalizeOrder('cash', `CASH-${Date.now()}`);
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const ref = selectedMethod === 'sedad'
        ? `SD-${Date.now().toString().slice(-8)}`
        : `ED-${Date.now().toString().slice(-8)}`;
      finalizeOrder(selectedMethod, ref);
    }, 2200);
  };

  const finalizeOrder = async (method: PaymentMethod, ref: string) => {
    try {
      const order = await addOrder({
        items: [...items],
        subtotal: parseFloat(params.subtotal || '0'),
        tax: parseFloat(params.tax || '0'),
        deliveryFee,
        total,
        customerName: params.name,
        customerPhone: params.phone,
        customerAddress: params.address,
        fulfillment: params.fulfillment,
        paymentMethod: method,
        paymentRef: ref,
      });
      clearCart();
      router.replace({
        pathname: '/order-confirmation',
        params: {
          orderId: order.id,
          total: total.toFixed(2),
          paymentMethod: method,
          paymentRef: ref,
          fulfillment: params.fulfillment,
          name: params.name,
        },
      });
    } catch (e: any) {
      setProcessing(false);
      setError('حدث خطأ أثناء إنشاء الطلب. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.BLACK} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>طريقة الدفع</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Total amount card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>المبلغ المستحق</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)} د.ل</Text>
        </View>

        {/* Payment methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختر طريقة الدفع</Text>

          <Pressable
            onPress={() => setSelectedMethod('sedad')}
            style={[styles.payBtn, selectedMethod === 'sedad' && styles.payBtnSelectedSedad]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedMethod === 'sedad' }}
            accessibilityLabel="الدفع عبر سداد"
          >
            <Image
              source={require('@/assets/images/payment/sedad.png')}
              style={[styles.payBtnImage, selectedMethod !== 'sedad' && { opacity: 0.85 }]}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable
            onPress={() => setSelectedMethod('edfaely')}
            style={[styles.payBtn, selectedMethod === 'edfaely' && styles.payBtnSelectedEdfaely]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedMethod === 'edfaely' }}
            accessibilityLabel="الدفع عبر ادفعلي"
          >
            <Image
              source={require('@/assets/images/payment/edfaely.png')}
              style={[styles.payBtnImage, selectedMethod !== 'edfaely' && { opacity: 0.85 }]}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable
            onPress={() => setSelectedMethod('cash')}
            style={[styles.payBtn, selectedMethod === 'cash' && styles.payBtnSelectedCash]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedMethod === 'cash' }}
            accessibilityLabel="الدفع كاش"
          >
            <Image
              source={require('@/assets/images/payment/cash.png')}
              style={[styles.payBtnImage, selectedMethod !== 'cash' && { opacity: 0.85 }]}
              resizeMode="contain"
            />
          </Pressable>

          <View style={styles.securityNote}>
            <ShieldCheck size={16} color={Colors.DARK_GRAY} strokeWidth={2} />
            <Text style={styles.securityText}>جميع المعاملات مشفرة وآمنة</Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      {/* Bottom checkout bar */}
      <View style={styles.footer}>
        <View style={styles.footerTotalRow}>
          <Text style={styles.footerTotalLabel}>الإجمالي</Text>
          <Text style={styles.footerTotalValue}>{total.toFixed(2)} د.ل</Text>
        </View>
        <TouchableOpacity
          style={[styles.footerPayBtn, !selectedMethod && styles.footerPayBtnDisabled, processing && styles.footerPayBtnProcessing]}
          onPress={handlePay}
          disabled={!selectedMethod || processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <View style={styles.processingRow}>
              <ActivityIndicator color={Colors.WHITE} size="small" />
              <Text style={styles.payBtnText}>جاري المعالجة...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.payBtnText}>
                {selectedMethod === 'cash' ? 'تأكيد الطلب' : 'ادفع الآن'}
              </Text>
              <ChevronLeft size={20} color={Colors.WHITE} strokeWidth={2.5} />
            </>
          )}
        </TouchableOpacity>
      </View>
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
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: Colors.BLACK },
  container: { flex: 1 },
  totalCard: {
    marginHorizontal: Spacing.LG,
    marginTop: Spacing.LG,
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radius.CARD,
    padding: Spacing.XL,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 14, color: '#D6E4F0', marginBottom: 6 },
  totalValue: { fontSize: 32, fontWeight: '800', color: Colors.WHITE },
  section: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.LG },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  payBtn: { width: '100%', height: 72, marginBottom: 12, borderRadius: 36, overflow: 'hidden' },
  payBtnImage: { width: '100%', height: '100%' },
  payBtnSelectedSedad: { borderWidth: 2, borderColor: '#FF8A00', elevation: 3 },
  payBtnSelectedEdfaely: { borderWidth: 2, borderColor: '#FF8A00', elevation: 3 },
  payBtnSelectedCash: { borderWidth: 2, borderColor: '#1E3A8A', elevation: 3 },
  securityNote: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.MD,
  },
  securityText: { fontSize: 12, color: Colors.DARK_GRAY },
  errorText: { fontSize: 13, color: Colors.RED_500, paddingHorizontal: Spacing.LG, marginTop: Spacing.SM, textAlign: 'right' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Spacing.LG,
    paddingTop: Spacing.MD,
    paddingBottom: Spacing.XL + 20,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerTotalRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  footerTotalLabel: { fontSize: 15, fontWeight: '600', color: Colors.DARK_GRAY },
  footerTotalValue: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY },
  footerPayBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.EMERALD_600,
    borderRadius: Radius.PILL,
    paddingVertical: Spacing.MD + 2,
    gap: 8,
  },
  footerPayBtnDisabled: { backgroundColor: Colors.LIGHT_GRAY },
  footerPayBtnProcessing: { backgroundColor: Colors.PRIMARY_DARK },
  payBtnText: { color: Colors.WHITE, fontSize: 17, fontWeight: '700' },
  processingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
});
