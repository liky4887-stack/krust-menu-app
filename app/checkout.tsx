import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Store, Bike, User, Phone, MapPin, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';
import { useCustomerStore, CustomerProfile } from '@/store/useCustomerStore';
import { FulfillmentType } from '@/store/useOrdersStore';

export default function CheckoutScreen() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const profile = useCustomerStore((s) => s.profile);
  const setProfile = useCustomerStore((s) => s.setProfile);

  const [name, setName] = useState(profile?.name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [address, setAddress] = useState(profile?.address ?? '');
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('pickup');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'الرجاء إدخال الاسم';
    const phoneClean = phone.replace(/\s/g, '');
    if (!phoneClean) {
      e.phone = 'الرجاء إدخال رقم الهاتف';
    } else if (!/^09\d{8}$/.test(phoneClean)) {
      e.phone = 'رقم الهاتف يجب أن يبدأ بـ 09 ويتكون من 10 أرقام';
    }
    if (fulfillment === 'delivery' && !address.trim()) {
      e.address = 'الرجاء إدخال عنوان التوصيل';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceed = () => {
    setSubmitted(true);
    if (!validate()) return;
    const customerData: CustomerProfile = { name: name.trim(), phone: phone.replace(/\s/g, ''), address: address.trim() };
    setProfile(customerData);
    router.push({ pathname: '/payment', params: { name: customerData.name, phone: customerData.phone, address: customerData.address, fulfillment, subtotal: subtotal.toFixed(2), tax: tax.toFixed(2), total: total.toFixed(2) } });
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ChevronRight size={24} color={Colors.PRIMARY} strokeWidth={2.5} /></TouchableOpacity>
          <Text style={styles.topBarTitle}>إتمام الطلب</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>سلتك فارغة</Text>
          <TouchableOpacity onPress={() => router.navigate('/')} activeOpacity={0.85}><Text style={styles.emptyLink}>تصفح القائمة</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ChevronRight size={24} color={Colors.PRIMARY} strokeWidth={2.5} /></TouchableOpacity>
          <Text style={styles.topBarTitle}>إتمام الطلب</Text>
          <View style={styles.backBtn} />
        </View>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>طريقة الاستلام</Text>
            <View style={styles.fulfillmentRow}>
              <TouchableOpacity style={[styles.fulfillmentCard, fulfillment === 'pickup' && styles.fulfillmentCardActive]} onPress={() => setFulfillment('pickup')} activeOpacity={0.7}>
                <Store size={26} color={fulfillment === 'pickup' ? Colors.PRIMARY : Colors.DARK_GRAY} strokeWidth={2} />
                <Text style={[styles.fulfillmentLabel, fulfillment === 'pickup' && styles.fulfillmentLabelActive]}>استلام من الفرع</Text>
                <Text style={styles.fulfillmentDesc}>احضر إلى المتجر واستلم طلبك</Text>
                {fulfillment === 'pickup' && (<View style={styles.fulfillmentCheck}><Check size={14} color={Colors.WHITE} strokeWidth={3} /></View>)}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.fulfillmentCard, fulfillment === 'delivery' && styles.fulfillmentCardActive]} onPress={() => setFulfillment('delivery')} activeOpacity={0.7}>
                <Bike size={26} color={fulfillment === 'delivery' ? Colors.PRIMARY : Colors.DARK_GRAY} strokeWidth={2} />
                <Text style={[styles.fulfillmentLabel, fulfillment === 'delivery' && styles.fulfillmentLabelActive]}>توصيل</Text>
                <Text style={styles.fulfillmentDesc}>يوصلك الطلب إلى عنوانك</Text>
                {fulfillment === 'delivery' && (<View style={styles.fulfillmentCheck}><Check size={14} color={Colors.WHITE} strokeWidth={3} /></View>)}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات العميل</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}><User size={18} color={Colors.DARK_GRAY} strokeWidth={2} /></View>
              <TextInput style={styles.input} placeholder="الاسم الكامل" placeholderTextColor={Colors.DARK_GRAY} value={name} onChangeText={(v) => { setName(v); if (submitted) validate(); }} textAlign="right" textContentType="name" />
            </View>
            {submitted && errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}><Phone size={18} color={Colors.DARK_GRAY} strokeWidth={2} /></View>
              <TextInput style={styles.input} placeholder="رقم الهاتف (09xxxxxxxx)" placeholderTextColor={Colors.DARK_GRAY} value={phone} onChangeText={(v) => { setPhone(v); if (submitted) validate(); }} textAlign="right" keyboardType="phone-pad" textContentType="telephoneNumber" maxLength={10} />
            </View>
            {submitted && errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            {fulfillment === 'delivery' && (<>
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}><MapPin size={18} color={Colors.DARK_GRAY} strokeWidth={2} /></View>
                <TextInput style={[styles.input, styles.inputMultiline]} placeholder="عنوان التوصيل" placeholderTextColor={Colors.DARK_GRAY} value={address} onChangeText={(v) => { setAddress(v); if (submitted) validate(); }} textAlign="right" multiline textContentType="fullStreetAddress" />
              </View>
              {submitted && errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
            </>)}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ملخص الطلب</Text>
            <View style={styles.summaryCard}>
              {items.map((item) => (<View key={item.id + (item.options ?? '')} style={styles.summaryRow}><Text style={styles.summaryItem}>{item.name} × {item.quantity}</Text><Text style={styles.summaryPrice}>{(item.price * item.quantity).toFixed(2)} د.ل</Text></View>))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>المجموع الفرعي</Text><Text style={styles.summaryValue}>{subtotal.toFixed(2)} د.ل</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>الضريبة (٨٪)</Text><Text style={styles.summaryValue}>{tax.toFixed(2)} د.ل</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}><Text style={styles.summaryTotalLabel}>الإجمالي</Text><Text style={styles.summaryTotalValue}>{total.toFixed(2)} د.ل</Text></View>
            </View>
          </View>
          <View style={styles.bottomPadding} />
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleProceed} activeOpacity={0.85}><Text style={styles.checkoutBtnText}>المتابعة للدفع · {total.toFixed(2)} د.ل</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: Colors.PRIMARY },
  container: { flex: 1 },
  section: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  fulfillmentRow: { flexDirection: 'row-reverse', gap: Spacing.MD },
  fulfillmentCard: { flex: 1, backgroundColor: Colors.WHITE, borderRadius: Radius.CARD, borderWidth: 1.5, borderColor: Colors.BORDER, padding: Spacing.MD, alignItems: 'center', gap: 6, position: 'relative' },
  fulfillmentCardActive: { borderColor: Colors.PRIMARY, backgroundColor: Colors.PRIMARY_LIGHT },
  fulfillmentLabel: { fontSize: 14, fontWeight: '700', color: Colors.BLACK, textAlign: 'center' },
  fulfillmentLabelActive: { color: Colors.PRIMARY },
  fulfillmentDesc: { fontSize: 11, color: Colors.DARK_GRAY, textAlign: 'center', lineHeight: 16 },
  fulfillmentCheck: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center' },
  inputGroup: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.WHITE, borderRadius: Radius.MD, borderWidth: 1.5, borderColor: Colors.BORDER, marginBottom: Spacing.SM, paddingHorizontal: Spacing.MD },
  inputIcon: { width: 24, alignItems: 'center' },
  input: { flex: 1, paddingVertical: Spacing.MD + 2, fontSize: 15, color: Colors.BLACK, textAlign: 'right' },
  inputMultiline: { minHeight: 56, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: Colors.RED_500, marginBottom: Spacing.SM, textAlign: 'right' },
  summaryCard: { backgroundColor: Colors.WHITE, borderRadius: Radius.CARD, borderWidth: 1, borderColor: Colors.BORDER, padding: Spacing.MD },
  summaryRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  summaryItem: { fontSize: 14, color: Colors.BLACK, flex: 1, textAlign: 'right' },
  summaryPrice: { fontSize: 14, color: Colors.DARK_GRAY, fontWeight: '500' },
  summaryLabel: { fontSize: 14, color: Colors.DARK_GRAY },
  summaryValue: { fontSize: 14, color: Colors.BLACK, fontWeight: '600' },
  summaryTotalLabel: { fontSize: 17, fontWeight: '700', color: Colors.BLACK },
  summaryTotalValue: { fontSize: 17, fontWeight: '800', color: Colors.PRIMARY },
  summaryDivider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Spacing.SM },
  footer: { backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD, paddingBottom: Spacing.XL, borderTopWidth: 1, borderTopColor: Colors.BORDER, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  checkoutBtn: { backgroundColor: Colors.PRIMARY, borderRadius: Radius.CHIP, paddingVertical: Spacing.MD + 2, alignItems: 'center', justifyContent: 'center' },
  checkoutBtnText: { color: Colors.WHITE, fontSize: 17, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.MD },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.PRIMARY },
  emptyLink: { fontSize: 16, color: Colors.PRIMARY, fontWeight: '600' },
  bottomPadding: { height: 120 },
});
