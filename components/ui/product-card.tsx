import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Check, Heart, ShoppingCart, Star } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/colors';
import SmoothButton from '@/components/ui/smooth-button';
import { useRouter } from 'expo-router';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export interface ProductCardProps {
  badge?: string;
  style?: import('react-native').StyleProp<ViewStyle>;
  currency?: string;
  image: string;
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

function Rating({ value }: { value: number }) {
  const filledStars = Math.round(value);
  return (
    <View style={styles.ratingRow}>
      <View style={styles.stars}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={`rating-${index}`} size={12} color={index < filledStars ? Colors.AMBER : Colors.LIGHT_GRAY} fill={index < filledStars ? Colors.AMBER : 'transparent'} strokeWidth={1.5} />
        ))}
      </View>
      <Text style={styles.ratingText}>{value.toFixed(1)}</Text>
    </View>
  );
}

export default function ProductCard({
  badge, currency = 'د.ل ', image, title, titleEn, productId, onAddToCart, onWishlist, onOpenProduct, originalPrice, price, rating, style,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const wishlisted = productId ? favoriteIds.includes(productId) : false;
  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const badgeColor = badge ? badgeColors[badge] ?? Colors.BLACK : Colors.BLACK;

  const handleAdd = () => { if (added) return; setAdded(true); onAddToCart?.(); setTimeout(() => setAdded(false), 1800); };
  const handleWishlist = () => { if (productId) toggleFavorite(productId); onWishlist?.(); };
  const handleOpen = () => { if (onOpenProduct) { onOpenProduct(); } else if (productId) { router.push(`/product/${productId}`); } };

  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity style={styles.imageArea} activeOpacity={0.85} onPress={handleOpen} accessibilityRole="button" accessibilityLabel={`عرض تفاصيل ${title}`}>
        <Text style={styles.imageText} numberOfLines={2}>{image}</Text>
        {badge ? (<View style={[styles.badge, { backgroundColor: badgeColor }]}><Text style={styles.badgeText}>{badge}</Text></View>) : null}
        {discount ? (<View style={styles.discountPill}><Text style={styles.discountText}>-{discount}%</Text></View>) : null}
      </TouchableOpacity>
      <Pressable accessibilityLabel={wishlisted ? `إزالة ${title} من المفضلة` : `إضافة ${title} إلى المفضلة`} accessibilityRole="button" onPress={handleWishlist} style={({ pressed }) => [styles.heartButton, pressed && styles.pressed]}>
        <Heart size={16} color={wishlisted ? Colors.RED_500 : Colors.DARK_GRAY} fill={wishlisted ? Colors.RED_500 : 'transparent'} strokeWidth={2} />
      </Pressable>
      <TouchableOpacity style={styles.content} activeOpacity={0.85} onPress={handleOpen}>
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
        {titleEn ? <Text style={styles.titleEn} numberOfLines={1}>{titleEn}</Text> : null}
        {rating !== undefined ? <Rating value={rating} /> : null}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{currency}{price.toFixed(2)}</Text>
          {originalPrice && originalPrice > price ? (<Text style={styles.originalPrice}>{currency}{originalPrice.toFixed(2)}</Text>) : null}
        </View>
        <SmoothButton accessibilityLabel={added ? `${title} تمت الإضافة إلى السلة` : `أضف ${title} إلى السلة`} disabled={added} onPress={handleAdd} style={[styles.addButton, added && styles.addedButton]} variant="default">
          {added ? <Check color={Colors.WHITE} size={15} strokeWidth={2.5} /> : <ShoppingCart color={Colors.WHITE} size={15} strokeWidth={2} />}
          <Text style={styles.addButtonText}>{added ? 'تمت الإضافة' : 'أضف إلى السلة'}</Text>
        </SmoothButton>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: Colors.WHITE, borderColor: Colors.BORDER, borderRadius: Radius.CARD, borderWidth: 1, overflow: 'hidden', shadowColor: '#0A1B2A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  imageArea: { height: 110, backgroundColor: Colors.PRIMARY_LIGHT, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  imageText: { fontSize: 14, fontWeight: '700', color: Colors.PRIMARY, textAlign: 'center', paddingHorizontal: 10 },
  badge: { position: 'absolute', right: 8, top: 8, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { color: Colors.WHITE, fontSize: 9, fontWeight: '700' },
  discountPill: { position: 'absolute', bottom: 8, left: 8, backgroundColor: Colors.RED_50, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  discountText: { color: Colors.RED_600, fontSize: 10, fontWeight: '700' },
  heartButton: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, height: 32, justifyContent: 'center', position: 'absolute', left: 8, top: 8, width: 32, zIndex: 10, shadowColor: '#0A1B2A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  pressed: { opacity: 0.65 },
  content: { gap: 6, padding: Spacing.MD },
  title: { color: Colors.BLACK, fontSize: 14, fontWeight: '700', lineHeight: 18, minHeight: 18, textAlign: 'right' },
  titleEn: { color: Colors.DARK_GRAY, fontSize: 11, fontWeight: '500', textAlign: 'right' },
  ratingRow: { alignItems: 'center', flexDirection: 'row-reverse' },
  stars: { flexDirection: 'row', gap: 1 },
  ratingText: { color: Colors.DARK_GRAY, fontSize: 11, marginRight: 4 },
  priceRow: { alignItems: 'baseline', flexDirection: 'row-reverse', gap: 6, minHeight: 22 },
  price: { color: Colors.PRIMARY, fontSize: 17, fontWeight: '800' },
  originalPrice: { color: Colors.DARK_GRAY, fontSize: 11, textDecorationLine: 'line-through' },
  addButton: { backgroundColor: Colors.PRIMARY, borderRadius: Radius.SM, height: 36, paddingHorizontal: 8, width: '100%' },
  addedButton: { backgroundColor: Colors.EMERALD_600 },
  addButtonText: { color: Colors.WHITE, fontSize: 12, fontWeight: '700' },
});
