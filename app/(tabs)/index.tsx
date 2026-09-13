import { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Heart, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { categories, products, featuredProducts, Product } from '@/constants/mockData';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import SearchBar from '@/components/SearchBar';
import CategoryChip from '@/components/CategoryChip';
import ProductCard from '@/components/ui/product-card';
import FloatingCart from '@/components/FloatingCart';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = SCREEN_WIDTH - Spacing.LG * 2;

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  const filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.title.includes(searchQuery) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description ?? '').includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const renderProduct = (item: Product) => (
    <ProductCard
      badge={item.badge}
      image={item.title}
      imageUrl={item.imageUrl}
      title={item.title}
      titleEn={item.titleEn}
      productId={item.id}
      originalPrice={item.originalPrice}
      price={item.price}
      rating={item.rating}
      onAddToCart={() =>
        addItem({ id: item.id, name: item.title, nameEn: item.titleEn, price: item.price, image: item.emoji, imageUrl: item.imageUrl })
      }
      onOpenProduct={() => router.push(`/product/${item.id}`)}
    />
  );

  const banners = [
    { text: 'اشرب، وفّر، واستمتع! عروض حصرية على مشروباتك المفضلة في كرست', sub: 'Krust' },
    { text: 'مشروبات باردة منعشة بانتظارك — جرّب الموهيتو الجديد', sub: 'جديد' },
    { text: 'اشترِ واحدًا واحصل على الثاني مجانًا — لفترة محدودة', sub: 'عرض' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.logoContainer}
          onLongPress={() => router.push('/staff-login')}
          delayLongPress={1500}
        >
          <Text style={styles.logoTitle}>Krust</Text>
          <Text style={styles.logoSubtitle}>2026</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Category pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            style={[styles.chip, !selectedCategory && styles.chipSelected]}
            onPress={() => setSelectedCategory(null)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipLabel, !selectedCategory && styles.chipLabelSelected]}>الكل</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              selected={selectedCategory === cat.id}
              onPress={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
            />
          ))}
        </ScrollView>

        {/* Promo banner carousel */}
        {!selectedCategory && !searchQuery && (
          <View style={styles.bannerSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
                if (idx !== bannerIndex) setBannerIndex(idx);
              }}
              scrollEventThrottle={16}
            >
              {banners.map((banner, i) => (
                <View key={i} style={[styles.bannerCard, { width: BANNER_WIDTH }]}>
                  <View style={styles.bannerOverlay} />
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerText}>{banner.text}</Text>
                    <Text style={styles.bannerSub}>{banner.sub}</Text>
                  </View>
                  <View style={styles.bannerEmojiArea}>
                    <Text style={styles.bannerEmoji}>☕</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.dots}>
              {banners.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === bannerIndex && styles.dotActive]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Favorites */}
        {!selectedCategory && !searchQuery && favoriteProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Heart size={18} color={Colors.RED_500} fill={Colors.RED_500} strokeWidth={2} />
                <Text style={styles.sectionTitle}>المفضلة</Text>
              </View>
              <Text style={styles.seeAll}>{favoriteProducts.length} منتج</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {favoriteProducts.map((item) => (
                <View key={item.id} style={styles.carouselItem}>
                  {renderProduct(item)}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Popular drinks carousel */}
        {!selectedCategory && !searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>مشروبات مميزة</Text>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {featuredProducts.map((item) => (
                <View key={item.id} style={styles.carouselItem}>
                  {renderProduct(item)}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Full menu grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.label ?? 'القائمة'
                : searchQuery
                  ? 'نتائج البحث'
                  : 'القائمة الكاملة'}
            </Text>
            <Text style={styles.itemCount}>{filtered.length} منتج</Text>
          </View>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Search size={36} color={Colors.LIGHT_GRAY} strokeWidth={1.5} />
              <Text style={styles.emptyText}>لا توجد منتجات</Text>
            </View>
          ) : (
            <View style={styles.productGrid}>
              {filtered.map((item, index) => {
                if (index % 2 !== 0) return null;
                const nextItem = filtered[index + 1];
                return (
                  <View key={item.id} style={styles.productRow}>
                    <View style={styles.productGridItem}>{renderProduct(item)}</View>
                    <View style={styles.productGridItem}>{nextItem ? renderProduct(nextItem) : null}</View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      <FloatingCart />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.SURFACE,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.SM + 4,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.PRIMARY,
    lineHeight: 30,
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.DARK_GRAY,
    letterSpacing: 2,
    lineHeight: 14,
  },
  container: {
    flex: 1,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.SM,
    flexDirection: 'row-reverse',
  },
  chip: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM + 2,
    borderRadius: Radius.MD,
    marginRight: Spacing.SM,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  chipSelected: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.BLACK,
  },
  chipLabelSelected: {
    color: Colors.WHITE,
  },
  bannerSection: {
    paddingHorizontal: Spacing.LG,
    paddingTop: Spacing.MD,
  },
  bannerCard: {
    height: 149,
    borderRadius: Radius.LG,
    backgroundColor: Colors.PRIMARY_DARK,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.PRIMARY_DARK,
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    paddingRight: Spacing.LG,
    paddingLeft: Spacing.XL,
    zIndex: 2,
  },
  bannerText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'right',
  },
  bannerSub: {
    color: Colors.GOLD,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'right',
  },
  bannerEmojiArea: {
    position: 'absolute',
    left: Spacing.MD,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bannerEmoji: {
    fontSize: 72,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.SM + 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.PRIMARY,
    opacity: 0.3,
  },
  dotActive: {
    opacity: 1,
  },
  section: {
    paddingTop: Spacing.LG,
    paddingBottom: Spacing.SM,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    marginBottom: Spacing.MD,
  },
  sectionTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.BLACK,
    textAlign: 'right',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  itemCount: {
    fontSize: 13,
    color: Colors.DARK_GRAY,
    fontWeight: '500',
  },
  carouselContent: {
    paddingHorizontal: Spacing.LG,
    gap: Spacing.MD,
    flexDirection: 'row-reverse',
    paddingBottom: Spacing.XS,
  },
  carouselItem: {
    width: 200,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.XXL * 2,
    gap: Spacing.SM,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.DARK_GRAY,
  },
  bottomPadding: {
    height: 120,
  },
});
