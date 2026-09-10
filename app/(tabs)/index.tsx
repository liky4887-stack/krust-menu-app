import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { categories, products, featuredProducts, Product } from '@/constants/mockData';
import { useCartStore } from '@/store/useCartStore';
import SearchBar from '@/components/SearchBar';
import CategoryChip from '@/components/CategoryChip';
import ProductCard from '@/components/ui/product-card';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

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
        <View style={styles.logoContainer}>
          <Text style={styles.logoTitle}>Krust</Text>
          <Text style={styles.logoSubtitle}>2026</Text>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

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

        {!selectedCategory && !searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>مشروبات مميزة</Text>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContent}
            >
              {featuredProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.featuredCard}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/product/${item.id}`)}
                >
                  <View style={styles.featuredImageArea}>
                    <Text style={styles.featuredImageText} numberOfLines={2}>{item.title}</Text>
                  </View>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.featuredTitleEn} numberOfLines={1}>{item.titleEn}</Text>
                    {item.description ? <Text style={styles.featuredDesc} numberOfLines={2}>{item.description}</Text> : null}
                    <View style={styles.featuredBottom}>
                      <Text style={styles.featuredPrice}>{item.price.toFixed(2)} د.ل</Text>
                      <TouchableOpacity
                        style={styles.featuredAdd}
                        onPress={() => addItem({ id: item.id, name: item.title, nameEn: item.titleEn, price: item.price, image: item.emoji })}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.featuredAddText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
    backgroundColor: Colors.PRIMARY_LIGHT,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM + 2,
    borderRadius: Radius.CHIP,
    marginRight: Spacing.SM,
    borderWidth: 1,
    borderColor: Colors.BORDER,
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
  section: {
    paddingTop: Spacing.MD,
    paddingBottom: Spacing.SM,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    marginBottom: Spacing.MD,
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
  featuredContent: {
    paddingHorizontal: Spacing.LG,
    gap: Spacing.MD,
    flexDirection: 'row-reverse',
  },
  featuredCard: {
    width: 168,
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.CARD,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.BORDER,
    shadowColor: '#0A1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  featuredImageArea: {
    height: 80,
    backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredImageText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.PRIMARY,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  featuredInfo: {
    padding: Spacing.MD,
    gap: 4,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.BLACK,
    textAlign: 'right',
  },
  featuredTitleEn: {
    fontSize: 11,
    color: Colors.DARK_GRAY,
    fontWeight: '500',
    textAlign: 'right',
  },
  featuredDesc: {
    fontSize: 12,
    color: Colors.DARK_GRAY,
    lineHeight: 16,
    textAlign: 'right',
  },
  featuredBottom: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  featuredAdd: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredAddText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: '700',
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
