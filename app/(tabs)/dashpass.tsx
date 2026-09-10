import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Gift } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { rewardsProducts, Product } from '@/constants/mockData';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/ui/product-card';

export default function DashPassScreen() {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const renderProduct = (item: Product) => (
    <ProductCard
      badge={item.badge}
      image={item.title}
      title={item.title}
      titleEn={item.titleEn}
      productId={item.id}
      originalPrice={item.originalPrice}
      price={item.price}
      rating={item.rating}
      onAddToCart={() =>
        addItem({ id: item.id, name: item.title, nameEn: item.titleEn, price: item.price, image: item.emoji })
      }
      onOpenProduct={() => router.push(`/product/${item.id}`)}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المكافآت</Text>
        <Text style={styles.headerSubtitle}>اكسب نقاطًا مع كل طلب</Text>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#0F4C8A', '#1A5DAB']}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroBadge}>
            <Gift size={18} color={Colors.GOLD} strokeWidth={2.5} />
            <Text style={styles.heroBadgeText}>مكافآت كرست</Text>
          </View>

          <Text style={styles.heroTitle}>اجمع نقاطك</Text>
          <Text style={styles.heroSubtitle}>
            استبدلها بمشروبات وحلويات مجانية
          </Text>

          <View style={styles.pointsRow}>
            <View style={styles.pointsCircle}>
              <Text style={styles.pointsValue}>٣٢٠</Text>
              <Text style={styles.pointsLabel}>نقطة</Text>
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsNext}>المكافأة التالية عند ٤٠٠ نقطة</Text>
              <View style={styles.pointsBar}>
                <View style={styles.pointsBarFill} />
              </View>
              <Text style={styles.pointsRemaining}>٨٠ نقطة متبقية</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85}>
            <Text style={styles.heroBtnText}>كيف تعمل المكافآت</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>استبدل نقاطك</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            مكافآت وأصناف مجانية للأعضاء
          </Text>
          <View style={styles.productGrid}>
            {rewardsProducts.map((item, index) => {
              if (index % 2 !== 0) return null;
              const nextItem = rewardsProducts[index + 1];
              return (
                <View key={item.id} style={styles.productRow}>
                  <View style={styles.productGridItem}>{renderProduct(item)}</View>
                  <View style={styles.productGridItem}>{nextItem ? renderProduct(nextItem) : null}</View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  heroCard: {
    marginHorizontal: Spacing.LG,
    marginTop: Spacing.MD,
    borderRadius: Radius.LG,
    padding: Spacing.XL,
    overflow: 'hidden',
    shadowColor: '#0F4C8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  heroBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: Spacing.MD,
    gap: Spacing.SM,
  },
  heroBadgeText: {
    color: Colors.GOLD,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.WHITE,
    marginBottom: 4,
    textAlign: 'right',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#D6E4F0',
    lineHeight: 20,
    marginBottom: Spacing.LG,
    textAlign: 'right',
  },
  pointsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  pointsCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(245,166,35,0.15)',
    borderWidth: 2,
    borderColor: Colors.GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.MD,
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.GOLD,
  },
  pointsLabel: {
    fontSize: 10,
    color: '#D6E4F0',
    marginTop: 1,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsNext: {
    fontSize: 12,
    color: '#D6E4F0',
    marginBottom: 6,
    textAlign: 'right',
  },
  pointsBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pointsBarFill: {
    width: '80%',
    height: '100%',
    backgroundColor: Colors.GOLD,
    borderRadius: 3,
  },
  pointsRemaining: {
    fontSize: 11,
    color: Colors.GOLD,
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'right',
  },
  heroBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: Spacing.MD,
    borderRadius: Radius.CHIP,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroBtnText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    paddingTop: Spacing.MD,
    paddingBottom: Spacing.SM,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.BLACK,
    textAlign: 'right',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.DARK_GRAY,
    paddingHorizontal: Spacing.LG,
    marginBottom: Spacing.MD,
    textAlign: 'right',
  },
  productGrid: {
    paddingHorizontal: Spacing.LG,
  },
  productRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.SM,
    marginBottom: Spacing.MD,
  },
  productGridItem: {
    flex: 1,
  },
  bottomPadding: {
    height: 120,
  },
});
