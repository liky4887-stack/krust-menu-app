import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Minus, Plus, Trash2, MapPin, Tag, ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';
import { useCustomerStore } from '@/store/useCustomerStore';

export default function CartScreen() {
  const router = useRouter();
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const items = useCartStore((state) => state.items);
  const profile = useCustomerStore((s) => s.profile);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 1.50 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => { router.push('/checkout'); };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}><Text style={styles.topBarTitle}>سلتي</Text></View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}><Text style={styles.emptyEmoji}>🛒</Text></View>
          <Text style={styles.emptyTitle}>سلتك فارغة</Text>
          <Text style={styles.emptySubtitle}>أضف مشروبات وحلويات من قائمتنا للبدء</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.navigate('/')} activeOpacity={0.85}>
            <Text style={styles.emptyBtnText}>تصفح القائمة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ChevronLeft size={24} color={Colors.BLACK} strokeWidth={2.5} /></TouchableOpacity>
        <Text style={styles.topBarTitle}>سلتي</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.addressCard}>
          <View style={styles.addressIcon}><MapPin size={18} color={Colors.PRIMARY} strokeWidth={2} /></View>
          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>عنوان التوصيل</Text>
            <Text style={styles.addressValue} numberOfLines={2}>{profile?.address ?? 'لم يتم تحديد العنوان بعد'}</Text>
          </View>
          <TouchableOpacity style={styles.addressEdit}><Text style={styles.addressEditText}>تعديل</Text></TouchableOpacity>
        </View>
        <View style={styles.itemsSection}>
          <Text style={styles.sectionLabel}>{items.length} منتجات</Text>
          {items.map((item) => (
            <View key={item.id + (item.options ?? '')} style={styles.cartRow}>
              <View style={styles.itemImage}><Text style={styles.itemImageText} numberOfLines={2}>{item.name}</Text></View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                {item.nameEn ? <Text style={styles.itemNameEn} numberOfLines={1}>{item.nameEn}</Text> : null}
                {item.options ? <Text style={styles.itemOptions} numberOfLines={1}>{item.options}</Text> : null}
                <Text style={styles.itemPrice}>{item.price.toFixed(2)} د.ل</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => decrement(item.id)} activeOpacity={0.7}><Minus size={14} color={Colors.PRIMARY} strokeWidth={2.5} /></TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => increment(item.id)} activeOpacity={0.7}><Plus size={14} color={Colors.PRIMARY} strokeWidth={2.5} /></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)} activeOpacity={0.7}><Trash2 size={16} color={Colors.RED_500} strokeWidth={2} /></TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.couponCard}>
          <Tag size={18} color={Colors.PRIMARY} strokeWidth={2} />
          <Text style={styles.couponText}>كود الخصم</Text>
          <View style={styles.couponInput}><Text style={styles.couponPlaceholder}>أدخل كود الخصم</Text></View>
          <TouchableOpacity style={styles.couponBtn} activeOpacity={0.7}><Text style={styles.couponBtnText}>تطبيق</Text></TouchableOpacity>
        </View>
        <View style={styles.billCard}>
          <Text style={styles.billTitle}>ملخص الفاتورة</Text>
          <View style={styles.billRow}><Text style={styles.billLabel}>المجموع الفرعي</Text><Text style={styles.billValue}>{subtotal.toFixed(2)} د.ل</Text></View>
          <View style={styles.billRow}><Text style={styles.billLabel}>رسوم التوصيل</Text><Text style={styles.billValue}>{deliveryFee.toFixed(2)} د.ل</Text></View>
          <View style={styles.billRow}><Text style={styles.billLabel}>الضريبة (٨٪)</Text><Text style={styles.billValue}>{tax.toFixed(2)} د.ل</Text></View>
          <View style={styles.billDivider} />
          <View style={styles.billRow}><Text style={styles.billTotalLabel}>الإجمالي</Text><Text style={styles.billTotalValue}>{total.toFixed(2)} د.ل</Text></View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerTotalRow}><Text style={styles.footerTotalLabel}>الإجمالي</Text><Text style={styles.footerTotalValue}>{total.toFixed(2)} د.ل</Text></View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
          <Text style={styles.checkoutBtnText}>إتمام الطلب</Text>
          <ChevronLeft size={20} color={Colors.WHITE} strokeWidth={2.5} />
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
  addressCard: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.WHITE, marginHorizontal: Spacing.LG, marginTop: Spacing.MD, borderRadius: Radius.CARD, padding: Spacing.MD, borderWidth: 1, borderColor: Colors.BORDER },
  addressIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.PRIMARY_LIGHT, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.MD },
  addressInfo: { flex: 1 },
  addressLabel: { fontSize: 12, color: Colors.DARK_GRAY, marginBottom: 2, textAlign: 'right' },
  addressValue: { fontSize: 14, fontWeight: '600', color: Colors.BLACK, textAlign: 'right' },
  addressEdit: { paddingHorizontal: Spacing.SM },
  addressEditText: { fontSize: 13, fontWeight: '700', color: Colors.PRIMARY },
  itemsSection: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.LG },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  cartRow: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.WHITE, borderRadius: Radius.CARD, padding: Spacing.MD, marginBottom: Spacing.SM, borderWidth: 1, borderColor: Colors.BORDER },
  itemImage: { width: 64, height: 64, borderRadius: Radius.MD, backgroundColor: Colors.PRIMARY_LIGHT, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.MD },
  itemImageText: { fontSize: 11, fontWeight: '700', color: Colors.PRIMARY, textAlign: 'center', paddingHorizontal: 6 },
  itemDetails: { flex: 1, gap: 2 },
  itemName: { fontSize: 14, fontWeight: '700', color: Colors.BLACK, textAlign: 'right' },
  itemNameEn: { fontSize: 11, color: Colors.DARK_GRAY, textAlign: 'right' },
  itemOptions: { fontSize: 11, color: Colors.DARK_GRAY, textAlign: 'right' },
  itemPrice: { fontSize: 15, fontWeight: '800', color: Colors.PRIMARY, marginTop: 2, textAlign: 'right' },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.SM, marginHorizontal: Spacing.SM },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.PRIMARY_LIGHT, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 15, fontWeight: '700', color: Colors.BLACK, minWidth: 20, textAlign: 'center' },
  removeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.RED_50, alignItems: 'center', justifyContent: 'center' },
  couponCard: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.WHITE, marginHorizontal: Spacing.LG, marginTop: Spacing.MD, borderRadius: Radius.CARD, padding: Spacing.MD, borderWidth: 1, borderColor: Colors.BORDER, gap: Spacing.SM },
  couponText: { fontSize: 14, fontWeight: '600', color: Colors.BLACK },
  couponInput: { flex: 1, backgroundColor: Colors.SURFACE, borderRadius: Radius.SM, paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM + 2, borderWidth: 1, borderColor: Colors.LIGHT_GRAY },
  couponPlaceholder: { fontSize: 13, color: Colors.DARK_GRAY, textAlign: 'right' },
  couponBtn: { backgroundColor: Colors.PRIMARY, borderRadius: Radius.SM, paddingHorizontal: Spacing.MD + 2, paddingVertical: Spacing.SM + 2 },
  couponBtnText: { color: Colors.WHITE, fontSize: 13, fontWeight: '700' },
  billCard: { backgroundColor: Colors.WHITE, marginHorizontal: Spacing.LG, marginTop: Spacing.MD, borderRadius: Radius.CARD, padding: Spacing.MD, borderWidth: 1, borderColor: Colors.BORDER },
  billTitle: { fontSize: 15, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  billRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingVertical: 5 },
  billLabel: { fontSize: 14, color: Colors.DARK_GRAY },
  billValue: { fontSize: 14, color: Colors.BLACK, fontWeight: '500' },
  billDivider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Spacing.SM },
  billTotalLabel: { fontSize: 17, fontWeight: '700', color: Colors.BLACK },
  billTotalValue: { fontSize: 17, fontWeight: '800', color: Colors.PRIMARY },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.WHITE, paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD, paddingBottom: Spacing.XL + 20, borderTopWidth: 1, borderTopColor: Colors.BORDER, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  footerTotalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.MD },
  footerTotalLabel: { fontSize: 15, fontWeight: '600', color: Colors.DARK_GRAY },
  footerTotalValue: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY },
  checkoutBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.EMERALD_600, borderRadius: Radius.PILL, paddingVertical: Spacing.MD + 2, gap: 8 },
  checkoutBtnText: { color: Colors.WHITE, fontSize: 17, fontWeight: '700' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.XL },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.PRIMARY_LIGHT, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.LG },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.PRIMARY, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: Colors.DARK_GRAY, textAlign: 'center', marginBottom: Spacing.LG },
  emptyBtn: { backgroundColor: Colors.PRIMARY, borderRadius: Radius.PILL, paddingHorizontal: Spacing.XL, paddingVertical: Spacing.MD },
  emptyBtnText: { color: Colors.WHITE, fontSize: 15, fontWeight: '700' },
});
