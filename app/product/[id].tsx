import { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Clock, Flame, Share2, Heart, Plus } from 'lucide-react-native';
import { Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { products, ProductOptionGroup, ProductOption, Product } from '@/constants/mockData';
import { getMeta } from '@/constants/productMeta';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isFav = favoriteIds.includes(id);

  const product = products.find((p) => p.id === id);
  const meta = getMeta(id);
  const addOnProducts = useMemo(() => {
    if (!meta.addOnIds) return [];
    return meta.addOnIds
      .map((aid) => products.find((p) => p.id === aid))
      .filter((p): p is Product => Boolean(p));
  }, [meta.addOnIds]);

  const computePrice = useMemo(() => {
    if (!product) return 0;
    let total = product.price;
    if (product.optionGroups) {
      for (const group of product.optionGroups) {
        const selectedId = selectedOptions[group.id];
        if (selectedId) {
          const opt = group.options.find((o) => o.id === selectedId);
          if (opt?.price) total += opt.price - product.price;
        }
      }
    }
    return total;
  }, [product, selectedOptions]);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>المنتج غير موجود</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>العودة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    let optionsLabel: string | undefined;
    if (product.optionGroups) {
      const labels: string[] = [];
      for (const group of product.optionGroups) {
        const selectedId = selectedOptions[group.id];
        if (selectedId) {
          const opt = group.options.find((o) => o.id === selectedId);
          if (opt) labels.push(`${group.label}: ${opt.label}`);
        }
      }
      if (labels.length > 0) optionsLabel = labels.join(' · ');
    }
    addItem({
      id: product.id,
      name: product.title,
      nameEn: product.titleEn,
      price: computePrice,
      image: product.emoji,
      imageUrl: product.imageUrl,
      options: optionsLabel,
    }, quantity);
    router.back();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `كرست — ${product.title} (${product.titleEn})\nالسعر: ${product.price.toFixed(2)} د.ل\n${product.description ?? ''}`,
      });
    } catch {
    }
  };

  const handleAddOn = (addon: Product) => {
    addItem({ id: addon.id, name: addon.title, nameEn: addon.titleEn, price: addon.price, image: addon.emoji, imageUrl: addon.imageUrl });
  };

  const selectOption = (groupId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupId]: optionId }));
  };

  const allRequiredSelected = product.optionGroups
    ? product.optionGroups.filter((g) => g.required).every((g) => selectedOptions[g.id])
    : true;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronRight size={24} color={Colors.PRIMARY} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>تفاصيل المنتج</Text>
          <View style={styles.topBarActions}>
            <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
              <Share2 size={20} color={Colors.PRIMARY} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(product.id)} style={styles.iconBtn}>
              <Heart
                size={20}
                color={isFav ? Colors.RED_500 : Colors.PRIMARY}
                fill={isFav ? Colors.RED_500 : 'transparent'}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageArea}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <Text style={styles.imagePlaceholder} numberOfLines={3}>{product.title}</Text>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.titleEn}>{product.titleEn}</Text>
          {product.description ? <Text style={styles.description}>{product.description}</Text> : null}
          {product.descriptionEn ? <Text style={styles.descriptionEn}>{product.descriptionEn}</Text> : null}

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Clock size={14} color={Colors.PRIMARY} strokeWidth={2} />
              <Text style={styles.metaText}>وقت التحضير: {meta.prepTime}</Text>
            </View>
            {meta.calories !== undefined && (
              <View style={styles.metaChip}>
                <Flame size={14} color={Colors.AMBER} strokeWidth={2} />
                <Text style={styles.metaText}>{meta.calories} سعرة حرارية</Text>
              </View>
            )}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{computePrice.toFixed(2)} د.ل</Text>
            {product.originalPrice && product.originalPrice > product.price ? (
              <Text style={styles.originalPrice}>{product.originalPrice.toFixed(2)} د.ل</Text>
            ) : null}
          </View>

          {product.optionGroups?.map((group: ProductOptionGroup) => (
            <View key={group.id} style={styles.optionGroup}>
              <Text style={styles.optionGroupLabel}>
                {group.label}
                {group.labelEn ? <Text style={styles.optionGroupLabelEn}> — {group.labelEn}</Text> : null}
                {group.required ? <Text style={styles.required}> *</Text> : null}
              </Text>
              <View style={styles.optionsList}>
                {group.options.map((opt: ProductOption) => {
                  const isSelected = selectedOptions[group.id] === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                      onPress={() => selectOption(group.id, opt.id)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {opt.label}
                        {opt.labelEn ? <Text style={styles.optionTextEn}> — {opt.labelEn}</Text> : null}
                      </Text>
                      {opt.price !== undefined && opt.price !== product.price ? (
                        <Text style={[styles.optionPrice, isSelected && styles.optionPriceSelected]}>
                          {opt.price > 0 ? `+${(opt.price - product.price).toFixed(0)} د.ل` : ''}
                        </Text>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>الكمية</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {addOnProducts.length > 0 && (
            <View style={styles.addOnsSection}>
              <Text style={styles.addOnsTitle}>أضف مع طلبك</Text>
              <Text style={styles.addOnsSubtitle}>منتجات تكمل طلبك</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.addOnsScroll}
              >
                {addOnProducts.map((addon) => (
                  <TouchableOpacity
                    key={addon.id}
                    style={styles.addOnCard}
                    onPress={() => handleAddOn(addon)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.addOnImageArea}>
                      <Text style={styles.addOnImageText} numberOfLines={2}>{addon.title}</Text>
                    </View>
                    <Text style={styles.addOnName} numberOfLines={1}>{addon.title}</Text>
                    <Text style={styles.addOnNameEn} numberOfLines={1}>{addon.titleEn}</Text>
                    <View style={styles.addOnBottom}>
                      <Text style={styles.addOnPrice}>{addon.price.toFixed(2)} د.ل</Text>
                      <View style={styles.addOnPlusBtn}>
                        <Plus size={14} color={Colors.WHITE} strokeWidth={2.5} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addToCartBtn, !allRequiredSelected && styles.addToCartBtnDisabled]}
          onPress={handleAddToCart}
          disabled={!allRequiredSelected}
          activeOpacity={0.85}
        >
          <Text style={styles.addToCartText}>
            {allRequiredSelected ? `أضف إلى السلة · ${(computePrice * quantity).toFixed(2)} د.ل` : 'اختر الخيارات المطلوبة'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: Colors.PRIMARY },
  topBarActions: { flexDirection: 'row-reverse', gap: 4 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  imageArea: {
    height: 200,
    backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.LG,
    borderRadius: Radius.LG,
    marginBottom: Spacing.MD,
  },
  productImage: { width: '100%', height: '100%', borderRadius: Radius.LG },
  imagePlaceholder: { fontSize: 18, fontWeight: '700', color: Colors.PRIMARY, textAlign: 'center', paddingHorizontal: 20 },
  infoSection: { paddingHorizontal: Spacing.LG },
  title: { fontSize: 24, fontWeight: '800', color: Colors.BLACK, textAlign: 'right' },
  titleEn: { fontSize: 14, color: Colors.DARK_GRAY, fontWeight: '500', marginTop: 2, textAlign: 'right' },
  description: { fontSize: 15, color: Colors.DARK_GRAY, lineHeight: 22, marginTop: Spacing.SM, textAlign: 'right' },
  descriptionEn: { fontSize: 13, color: Colors.DARK_GRAY, lineHeight: 18, marginTop: 4, textAlign: 'right' },
  metaRow: { flexDirection: 'row-reverse', gap: Spacing.SM, marginTop: Spacing.MD, flexWrap: 'wrap' },
  metaChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.PRIMARY_LIGHT,
    borderRadius: Radius.SM,
    paddingHorizontal: Spacing.SM + 2,
    paddingVertical: Spacing.SM,
  },
  metaText: { fontSize: 12, fontWeight: '600', color: Colors.PRIMARY },
  priceRow: { flexDirection: 'row-reverse', alignItems: 'baseline', gap: Spacing.SM, marginTop: Spacing.MD },
  price: { fontSize: 28, fontWeight: '800', color: Colors.PRIMARY },
  originalPrice: { fontSize: 16, color: Colors.DARK_GRAY, textDecorationLine: 'line-through' },
  optionGroup: { marginTop: Spacing.LG },
  optionGroupLabel: { fontSize: 17, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.SM, textAlign: 'right' },
  optionGroupLabelEn: { fontSize: 13, fontWeight: '500', color: Colors.DARK_GRAY },
  required: { color: Colors.RED_500 },
  optionsList: { gap: Spacing.SM },
  optionChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.MD,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.MD,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
  },
  optionChipSelected: { backgroundColor: Colors.PRIMARY_LIGHT, borderColor: Colors.PRIMARY },
  optionText: { fontSize: 15, fontWeight: '600', color: Colors.BLACK, flex: 1, textAlign: 'right' },
  optionTextSelected: { color: Colors.PRIMARY },
  optionTextEn: { fontSize: 12, fontWeight: '500', color: Colors.DARK_GRAY },
  optionPrice: { fontSize: 14, fontWeight: '700', color: Colors.DARK_GRAY },
  optionPriceSelected: { color: Colors.PRIMARY },
  quantityRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.XL,
    paddingVertical: Spacing.MD,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
  },
  quantityLabel: { fontSize: 17, fontWeight: '700', color: Colors.BLACK },
  quantityControls: { flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.MD },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.WHITE,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.BORDER,
  },
  qtyBtnText: { fontSize: 20, fontWeight: '700', color: Colors.PRIMARY },
  quantityValue: { fontSize: 20, fontWeight: '800', color: Colors.BLACK, minWidth: 30, textAlign: 'center' },
  addOnsSection: { marginTop: Spacing.XL, borderTopWidth: 1, borderTopColor: Colors.BORDER, paddingTop: Spacing.LG },
  addOnsTitle: { fontSize: 17, fontWeight: '700', color: Colors.BLACK, textAlign: 'right', marginBottom: 2 },
  addOnsSubtitle: { fontSize: 13, color: Colors.DARK_GRAY, marginBottom: Spacing.MD, textAlign: 'right' },
  addOnsScroll: { gap: Spacing.MD, paddingRight: 0 },
  addOnCard: {
    width: 130,
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.CARD,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    overflow: 'hidden',
  },
  addOnImageArea: {
    height: 60,
    backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOnImageText: { fontSize: 11, fontWeight: '700', color: Colors.PRIMARY, textAlign: 'center', paddingHorizontal: 8 },
  addOnName: { fontSize: 12, fontWeight: '700', color: Colors.BLACK, paddingHorizontal: Spacing.SM, paddingTop: Spacing.SM, textAlign: 'right' },
  addOnNameEn: { fontSize: 10, color: Colors.DARK_GRAY, paddingHorizontal: Spacing.SM, textAlign: 'right' },
  addOnBottom: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.SM,
    paddingBottom: Spacing.SM,
    paddingTop: 4,
  },
  addOnPrice: { fontSize: 13, fontWeight: '800', color: Colors.PRIMARY },
  addOnPlusBtn: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center', justifyContent: 'center',
  },
  bottomPadding: { height: 120 },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: Spacing.LG,
    paddingTop: Spacing.MD,
    paddingBottom: Spacing.XL,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  addToCartBtn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radius.CHIP,
    paddingVertical: Spacing.MD + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtnDisabled: { backgroundColor: Colors.LIGHT_GRAY },
  addToCartText: { color: Colors.WHITE, fontSize: 17, fontWeight: '700' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 20, fontWeight: '700', color: Colors.PRIMARY, marginBottom: Spacing.MD },
  backLink: { fontSize: 16, color: Colors.PRIMARY, fontWeight: '600' },
});
