import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useCartStore, CartItem } from '@/store/useCartStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { ourPicks } from '@/constants/mockData';
import CartItemRow from '@/components/CartItemRow';

export default function CartScreen() {
  const router = useRouter();
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const itemCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const profile = useCustomerStore((s) => s.profile);

  const renderPick = (item: CartItem) => (
    <TouchableOpacity style={styles.pickCard} onPress={() => addItem({ id: item.id, name: item.name, nameEn: item.nameEn, price: item.price, image: item.image })} activeOpacity={0.7}>
      <View style={styles.pickImageArea}><Text style={styles.pickImageText} numberOfLines={2}>{item.name}</Text></View>
      <Text style={styles.pickName} numberOfLines={1}>{item.name}</Text>
      {item.nameEn ? <Text style={styles.pickNameEn} numberOfLines={1}>{item.nameEn}</Text> : null}
      <Text style={styles.pickPrice}>{item.price.toFixed(2)} د.ل</Text>
      <View style={styles.addPickBtn}><Ionicons name="add" size={14} color={Colors.WHITE} /></View>
    </TouchableOpacity>
  );

  const handleCheckout = () => { router.push('/checkout'); };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}><Ionicons name="cafe-outline" size={44} color={Colors.DARK_GRAY} /></View>
          <Text style={styles.emptyTitle}>سلتك فارغة</Text>
          <Text style={styles.emptySubtitle}>أضف مشروبات وحلويات من قائمتنا للبدء</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>سلتك</Text>
        <Text style={styles.headerSubtitle}>{itemCount} {itemCount === 1 ? 'منتج' : 'منتجات'}</Text>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {profile && (
          <View style={styles.customerBar}>
            <Ionicons name="person-circle-outline" size={20} color={Colors.PRIMARY} />
            <View style={styles.customerInfo}><Text style={styles.customerName}>{profile.name}</Text><Text style={styles.customerPhone}>{profile.phone}</Text></View>
          </View>
        )}
        <View style={styles.itemsSection}>
          {items.map((item) => (<CartItemRow key={item.id + (item.options ?? '')} item={item} onIncrement={increment} onDecrement={decrement} onRemove={removeItem} />))}
        </View>
        <View style={styles.picksSection}>
          <Text style={styles.sectionTitle}>قد يعجبك أيضًا</Text>
          <View style={styles.picksGrid}>
            {ourPicks.map((item, index) => {
              if (index % 2 !== 0) return null;
              const nextItem = ourPicks[index + 1];
              return (<View key={item.id} style={styles.picksRow}>{renderPick(item)}{nextItem ? renderPick(nextItem) : <View style={styles.pickPlaceholder} />}</View>);
            })}
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerRow}><Text style={styles.footerLabel}>المجموع الفرعي</Text><Text style={styles.footerValue}>{subtotal.toFixed(2)} د.ل</Text></View>
          <View style={styles.footerRow}><Text style={styles.footerLabel}>الضريبة (٨٪)</Text><Text style={styles.footerValue}>{tax.toFixed(2)} د.ل</Text></View>
          <View style={styles.divider} />
          <View style={styles.footerRow}><Text style={styles.totalLabel}>الإجمالي</Text><Text style={styles.totalValue}>{total.toFixed(2)} د.ل</Text></View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
            <Text style={styles.checkoutBtnText}>إتمام الطلب</Text>
            <Ionicons name="arrow-back" size={20} color={Colors.WHITE} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  header: { paddingHorizontal: Spacing.LG, paddingVertical: Spacing.MD, backgroundColor: Colors.WHITE, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY },
  headerSubtitle: { fontSize: 14, color: Colors.DARK_GRAY, marginTop: 2 },
  container: { flex: 1 },
  customerBar: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.PRIMARY_LIGHT, marginHorizontal: Spacing.LG, marginTop: Spacing.MD, borderRadius: Radius.MD, paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM + 2, gap: 8 },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 14, fontWeight: '700', color: Colors.BLACK, textAlign: 'right' },
  customerPhone: { fontSize: 12, color: Colors.DARK_GRAY, textAlign: 'right' },
  itemsSection: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD },
  picksSection: { paddingTop: Spacing.LG, paddingHorizontal: Spacing.LG },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  picksGrid: {},
  picksRow: { flexDirection: 'row-reverse', gap: Spacing.SM, marginBottom: Spacing.SM },
  pickPlaceholder: { flex: 1 },
  pickCard: { flex: 1, backgroundColor: Colors.WHITE, borderRadius: Radius.CARD, padding: Spacing.MD, alignItems: 'center', margin: 2, position: 'relative', borderWidth: 1, borderColor: Colors.BORDER, shadowColor: '#0A1B2A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  pickImageArea: { width: '100%', height: 48, backgroundColor: Colors.PRIMARY_LIGHT, borderRadius: Radius.SM, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.SM },
  pickImageText: { fontSize: 11, fontWeight: '700', color: Colors.PRIMARY, textAlign: 'center', paddingHorizontal: 8 },
  pickName: { fontSize: 13, fontWeight: '700', color: Colors.BLACK, marginBottom: 2, textAlign: 'center' },
  pickNameEn: { fontSize: 10, color: Colors.DARK_GRAY, marginBottom: 4 },
  pickPrice: { fontSize: 13, fontWeight: '800', color: Colors.PRIMARY },
  addPickBtn: { position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center' },
  footer: { backgroundColor: Colors.WHITE, paddingHorizontal: Spacing.LG, paddingTop: Spacing.LG, paddingBottom: 140, marginTop: Spacing.MD, borderTopWidth: 1, borderTopColor: Colors.BORDER },
  footerRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: Spacing.SM },
  footerLabel: { fontSize: 15, color: Colors.DARK_GRAY },
  footerValue: { fontSize: 15, color: Colors.BLACK, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Spacing.SM },
  totalLabel: { fontSize: 18, fontWeight: '700', color: Colors.BLACK },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.PRIMARY },
  checkoutBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.PRIMARY, borderRadius: Radius.CHIP, paddingVertical: Spacing.MD + 2, marginTop: Spacing.LG, gap: 8 },
  checkoutBtnText: { color: Colors.WHITE, fontSize: 16, fontWeight: '700' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.XL },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.PRIMARY_LIGHT, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.LG },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.PRIMARY, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: Colors.DARK_GRAY, textAlign: 'center' },
});
