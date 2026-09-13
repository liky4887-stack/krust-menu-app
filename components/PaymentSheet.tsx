import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export type PaymentKey = 'sedad' | 'edfaely' | 'cash';

interface PaymentSheetProps {
  visible: boolean;
  selected: PaymentKey | null;
  onSelect: (m: PaymentKey) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const METHODS: { key: PaymentKey; image: any }[] = [
  { key: 'sedad',   image: require('@/assets/images/payment/sedad.png') },
  { key: 'edfaely', image: require('@/assets/images/payment/edfaely.png') },
  { key: 'cash',    image: require('@/assets/images/payment/cash.png') },
];

export default function PaymentSheet({
  visible,
  selected,
  onSelect,
  onClose,
  onConfirm,
}: PaymentSheetProps) {
  const { width: screenWidth } = useWindowDimensions();
  // Cap so pill height stays reasonable: width = 2.14 × height
  // At 340px wide → 159px tall. At 400px → 187px tall.
  const pillWidth = Math.min(screenWidth - 60, 360);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          entering={SlideInDown.springify().damping(20).stiffness(200)}
          style={styles.sheet}
        >
          <Pressable onPress={() => {}} style={styles.sheetInner}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#111" />
              </Pressable>
              <Text style={styles.title}>اختر طريقة الدفع</Text>
            </View>

            {METHODS.map((m) => {
              const isSel = selected === m.key;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onSelect(m.key);
                  }}
                  style={({ pressed }) => [
                    styles.pillRow,
                    { width: pillWidth },
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <Image
                    source={m.image}
                    style={styles.pillImage}
                    resizeMode="stretch"
                  />
                  {isSel && <View style={styles.selectedRing} />}
                </Pressable>
              );
            })}

            <Pressable
              style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onConfirm();
              }}
              disabled={!selected}
            >
              <Text style={styles.confirmText}>اختر</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingBottom: 32,
  },
  sheetInner: { width: '100%' },
  handle: {
    width: 44, height: 5, borderRadius: 3,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center', marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 20,
  },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#111', textAlign: 'right' },
  pillRow: {
    alignSelf: 'center',
    aspectRatio: 2.14,
    marginBottom: 14,
    justifyContent: 'center',
    borderRadius: 999,
    overflow: 'hidden',
  },
  pillImage: { width: '100%', height: '100%' },
  selectedRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#1E3A8A',
    opacity: 0.9,
  },
  confirmBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#0F4C3A',
    marginHorizontal: 20, marginTop: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmBtnDisabled: { backgroundColor: '#B8C7C1' },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
