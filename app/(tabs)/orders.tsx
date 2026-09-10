import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { RotateCw, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { recentOrders, OrderItem } from '@/constants/mockData';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/ui/product-card';

export default function OrdersScreen() {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const renderOrderItem = (item: OrderItem) => (
    <View style={styles.orderCard}>
      <ProductCard
        badge={item.product.badge}
        image={item.product.title}
        title={item.product.title}
        titleEn={item.product.titleEn}
        productId={item.product.id}
        originalPrice={item.product.originalPrice}
        price={item.product.price}
        rating={item.product.rating}
        onAddToCart={() =>
          addItem({ id: item.product.id, name: item.product.title, nameEn: item.product.titleEn, price: item.product.price, image: item.product.emoji })
        }
        onOpenProduct={() => router.push(`/product/${item.product.id}`)}
      />
      <View style={styles.orderMeta}>
        <View style={styles.orderMetaLeft}>
          <Calendar size={13} color={Colors.DARK_GRAY} strokeWidth={2} />
          <Text style={styles.orderDate}>{item.orderDate}</Text>
          <Text style={styles.orderDot}>·</Text>
          <Text style={styles.orderQty}>الكمية {item.quantity}</Text>
        </View>
        <TouchableOpacity
          style={styles.reorderBtn}
          onPress={() =>
            addItem({ id: item.product.id, name: item.product.title, nameEn: item.product.titleEn, price: item.product.price, image: item.product.emoji })
          }
          activeOpacity={0.7}
        >
          <RotateCw size={14} color={Colors.PRIMARY} strokeWidth={2.5} />
          <Text style={styles.reorderText}>إعادة الطلب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>طلباتك</Text>
        <Text style={styles.headerSubtitle}>أعد طلب مفضلاتك بنقرة واحدة</Text>
      </View>

      {recentOrders.length === 0 ? (
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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>الطلبات السابقة</Text>
            <View style={styles.ordersGrid}>
              {recentOrders.map((item, index) => {
                if (index % 2 !== 0) return null;
                const nextItem = recentOrders[index + 1];
                return (
                  <View key={item.id} style={styles.ordersRow}>
                    {renderOrderItem(item)}
                    {nextItem ? renderOrderItem(nextItem) : <View style={styles.orderCardPlaceholder} />}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.SURFACE,
  },
  header: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    marginTop: 2,
  },
  container: {
    flex: 1,
  },
  recentSection: {
    paddingTop: Spacing.MD,
    paddingHorizontal: Spacing.LG,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.BLACK,
    marginBottom: Spacing.MD,
    textAlign: 'right',
  },
  ordersGrid: {},
  ordersRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.SM,
    marginBottom: Spacing.MD,
  },
  orderCard: {
    flex: 1,
  },
  orderCardPlaceholder: {
    flex: 1,
  },
  orderMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.SM,
    paddingHorizontal: 4,
  },
  orderMetaLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  orderDate: {
    fontSize: 11,
    color: Colors.DARK_GRAY,
  },
  orderDot: {
    fontSize: 11,
    color: Colors.LIGHT_GRAY,
  },
  orderQty: {
    fontSize: 11,
    color: Colors.DARK_GRAY,
    fontWeight: '500',
  },
  reorderBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.PRIMARY_LIGHT,
    paddingHorizontal: Spacing.SM + 2,
    paddingVertical: 5,
    borderRadius: Radius.SM,
  },
  reorderText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.XL,
    gap: Spacing.SM,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: Spacing.XL,
    paddingVertical: Spacing.MD,
    borderRadius: Radius.CHIP,
    marginTop: Spacing.MD,
  },
  emptyBtnText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 120,
  },
});
