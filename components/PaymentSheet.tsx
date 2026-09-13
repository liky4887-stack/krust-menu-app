import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

export type PaymentMethodKey = 'sedad' | 'edfaely' | 'cash';

interface PaymentSheetProps {
  visible: boolean;
  selected: PaymentMethodKey | null;
  onSelect: (method: PaymentMethodKey) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const paymentMethods: { key: PaymentMethodKey; label: string; image: number }[] = [
  { key: 'sedad', label: 'الدفع عبر سداد', image: require('@/assets/images/payment/sedad.png') },
  { key: 'edfaely', label: 'الدفع عبر ادفعي', image: require('@/assets/images/payment/edfaely.png') },
  { key: 'cash', label: 'الدفع كاش', image: require('@/assets/images/payment/cash.png') },
];

export default function PaymentSheet({
  visible,
  selected,
  onSelect,
  onClose,
  onConfirm,
}: PaymentSheetProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    onClose();
  };

  const handleSelect = (method: PaymentMethodKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(method);
  };

  return (
    <Modal
      visible={visible && !isClosing}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      onShow={() => setIsClosing(false)}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Animated.View entering={FadeInDown.duration(260)} style={styles.sheet}>
          <Pressable onPress={(event) => event.stopPropagation()}>
            <View style={styles.handle} />
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="إغلاق">
              <X size={24} color="#111" strokeWidth={2.2} />
            </TouchableOpacity>
            <Text style={styles.title}>اختر طريقة الدفع</Text>

            {paymentMethods.map((method) => (
              <Pressable
                key={method.key}
                onPress={() => handleSelect(method.key)}
                style={[styles.pillRow, selected === method.key && styles.pillSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected: selected === method.key }}
                accessibilityLabel={method.label}
              >
                <Image source={method.image} style={styles.pillImage} resizeMode="contain" />
              </Pressable>
            ))}

            <TouchableOpacity
              onPress={onConfirm}
              disabled={!selected}
              style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmText}>اختر</Text>
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    textAlign: 'right',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  pillRow: { width: '100%', paddingHorizontal: 20, marginBottom: 12 },
  pillImage: { width: '100%', height: 90 },
  pillSelected: {
    borderWidth: 2,
    borderColor: '#1E3A8A',
    borderRadius: 999,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  confirmBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0F4C3A',
    marginHorizontal: 20,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
