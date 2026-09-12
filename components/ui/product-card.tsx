import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, TouchableOpacity, StyleProp, Image } from 'react-native';
import { Check, Heart, ShoppingCart, Star, MapPin } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export interface ProductCardProps {
  badge?: string;
  style?: StyleProp<ViewStyle>;
  currency?: string;
  image: string;
  imageUrl?: string;
  title: string;
  titleEn?: string;
  productId?: string;
  onAddToCart?: () => void;
  onWishlist?: () => void;
  onOpenProduct?: () => void;
  originalPrice?: number;
  price: number;
  rating?: number;
}

const badgeColors: Record<string, string> = {
  sale: Colors.RED_500,
  'عرض': Colors.RED_500,
  new: Colors.EMERALD_600,
  'جديد': Colors.EMERALD_600,
  dashpass: Colors.BRAND,
  popular: Colors.BRAND,
  'الأكثر طلبًا': Colors.BRAND,
  'خالٍ من السكر': Colors.PRIMARY_DARK,
  'مكافأة': Colors.GOLD,
};

function RatingBadge({ value }: { value: number }) {
  return (
    <View style={styles.ratingBadge}>
      <Star size={11} color={Colors.WHITE} fill={Colors.AMBER} strokeWidth={0} />
      <Text style={styles.ratingText}>{value.toFixed(1)}</Text>
    </View>
  );
}

export default function ProductCard({
  badge,
  currency = 'د.ل ',
  image,
  imageUrl,
  title,
  titleEn,
  productId,
  onAddToCart,
  onWishlist,
  onOpenProduct,
  originalPrice,
  price,
  rating,
  style,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const wishlisted = productId ? favoriteIds.includes(productId) : false;
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;
  const badgeColor = badge ? badgeColors[badge] ?? Colors.BLACK : Colors.BLACK;

  const handleAdd = () => {
    if (added) return;
    setAdded(true);
    onAddToCart?.();
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = () => {
    if (productId) toggleFavorite(productId);
    onWishlist?.();
  };

  const handleOpen = () => {
    if (onOpenProduct) {
      onOpenProduct();
    } else if (productId) {
      router.push(`/product/${productId}`);
    }
  };

  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity
        style={styles.imageArea}
        activeOpacity={0.85}
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={`عرض تفاصيل ${title}`}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <Text style={styles.imageText} numberOfLines={2}>{image}</Text>
        )}
        {rating !== undefined ? <RatingBadge value={rating} /> : null}
        {badge ? (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        {discount ? (
          <View style={styles.discountPill}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        ) : null}
      </TouchableOpacity>
      <Pressable
        accessibilityLabel={wishlisted ? `إزالة ${title} من المفضلة` : `إضافة ${title} إلى المفضلة`}
        accessibilityRole="button"
        onPress={handleWishlist}
        style={({ pressed }) => [styles.heartButton, pressed && styles.pressed]}
      >
        <Heart
          size={16}
          color={wishlisted ? Colors.RED_500 : Colors.DARK_GRAY}
          fill={wishlisted ? Colors.RED_500 : 'transparent'}
          strokeWidth={2}
        />
      </Pressable>

      <TouchableOpacity
        style={styles.content}
        activeOpacity={0.85}
        onPress={handleOpen}
      >
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        {titleEn ? <Text style={styles.titleEn} numberOfLines={1}>{titleEn}</Text> : null}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{currency}{price.toFixed(2)}</Text>
            {originalPrice && originalPrice > price ? (
              <Text style={styles.originalPrice}>{currency}{originalPrice.toFixed(2)}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.cartButton, added && styles.cartButtonAdded]}
            onPress={handleAdd}
            activeOpacity={0.7}
            accessibilityLabel={added ? `${title} تمت الإضافة` : `أضف ${title} إلى السلة`}
          >
            {added
              ? <Check color={Colors.WHITE} size={16} strokeWidth={2.5} />
              : <ShoppingCart color={Colors.WHITE} size={16} strokeWidth={2} />}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.LG,
    overflow: 'hidden',
    shadowColor: '#0A1B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  imageArea: {
    height: 130,
    backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.PRIMARY,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(10,27,42,0.45)',
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: Colors.WHITE,
    fontSize: 10,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    color: Colors.WHITE,
    fontSize: 9,
    fontWeight: '700',
  },
  discountPill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: Colors.RED_50,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountText: {
    color: Colors.RED_600,
    fontSize: 10,
    fontWeight: '700',
  },
  heartButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 48,
    width: 32,
    zIndex: 10,
    shadowColor: '#0A1B2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.65,
  },
  content: {
    gap: 4,
    padding: Spacing.MD,
    paddingTop: Spacing.SM + 2,
    paddingBottom: Spacing.MD,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flex: 1,
    minHeight: 72,
  },
  title: {
    color: Colors.BLACK,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'right',
  },
  titleEn: {
    color: Colors.DARK_GRAY,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    color: Colors.PRIMARY,
    fontSize: 17,
    fontWeight: '800',
  },
  originalPrice: {
    color: Colors.DARK_GRAY,
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  cartButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonAdded: {
    backgroundColor: Colors.EMERALD_600,
  },
});
