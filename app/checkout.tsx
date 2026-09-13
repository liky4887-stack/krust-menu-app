import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Store, Bike, User, Phone, MapPin, Check } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';
import { useCustomerStore, CustomerProfile } from '@/store/useCustomerStore';
import { FulfillmentType } from '@/store/useOrdersStore';

export default function CheckoutScreen() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const profile = useCustomerStore((s) => s.profile);
  const setProfile = useCustomerStore((s) => s.setProfile);

  const [name, setName] = useState(profile?.name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [address, setAddress] = useState(profile?.address ?? '');
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('pickup');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [pickedRegion, setPickedRegion] = useState<Region>({
    latitude: 32.1194,
    longitude: 20.0868,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = fulfillment === 'delivery' ? 1.50 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'الرجاء إدخال الاسم';
    const phoneClean = phone.replace(/\s/g, '');
    if (!phoneClean) {
      e.phone = 'الرجاء إدخال رقم الهاتف';
    } else if (!/^09\d{8}$/.test(phoneClean)) {
      e.phone = 'رقم الهاتف يجب أن يبدأ بـ 09 ويتكون من 10 أرقام';
    }
    if (fulfillment === 'delivery' && !address.trim()) {
      e.address = 'الرجاء إدخال عنوان التوصيل';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function useCurrentLocation() {
    try {
      setLoadingLocation(true);
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'خدمة الموقع مغلقة',
          'يرجى تشغيل خدمة GPS من إعدادات الهاتف ثم المحاولة مرة أخرى'
        );
        return;
      }
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const req = await Location.requestForegroundPermissionsAsync();
        status = req.status;
      }
      if (status !== 'granted') {
        Alert.alert(
          'الإذن مرفوض',
          'يحتاج التطبيق إلى إذن الموقع لتوصيل طلبك تلقائياً',
          [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'فتح الإعدادات', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });
      let formatted = '';
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        if (results.length > 0) {
          const r: any = results[0];
          if (r.formattedAddress && r.formattedAddress.length > 0) {
            formatted = r.formattedAddress;
          } else {
            const parts: string[] = [];
            if (r.name && r.name !== r.street) parts.push(r.name);
            if (r.street) parts.push(r.street);
            if (r.streetNumber) parts.push(r.streetNumber);
            if (r.district) parts.push(r.district);
            if (r.subregion && r.subregion !== r.city) parts.push(r.subregion);
            if (r.city) parts.push(r.city);
            if (r.region && r.region !== r.city) parts.push(r.region);
            if (parts.length === 0) {
              parts.push('بنغازي');
              parts.push(pos.coords.latitude.toFixed(6) + '، ' + pos.coords.longitude.toFixed(6));
            }
            formatted = parts.join('، ');
          }
        }
      } catch (geoErr) {
        formatted = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      }
      if (formatted) {
        setAddress(formatted);
      }
    } catch (e: any) {
      Alert.alert('خطأ', 'تعذّر الحصول على الموقع. تأكد من تشغيل GPS والسماح بالإذن');
    } finally {
      setLoadingLocation(false);
    }
  }

  async function reverseGeocodePin(region: Region) {
    const results = await Location.reverseGeocodeAsync({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    if (results.length > 0) {
      const r: any = results[0];
      if (r.formattedAddress && r.formattedAddress.length > 0) {
        setAddress(r.formattedAddress);
      } else {
        const parts: string[] = [];
        if (r.name && r.name !== r.street) parts.push(r.name);
        if (r.street) parts.push(r.street);
        if (r.streetNumber) parts.push(r.streetNumber);
        if (r.district) parts.push(r.district);
        if (r.subregion && r.subregion !== r.city) parts.push(r.subregion);
        if (r.city) parts.push(r.city);
        if (parts.length === 0) {
          parts.push('بنغازي');
          parts.push(region.latitude.toFixed(6) + '، ' + region.longitude.toFixed(6));
        }
        setAddress(parts.join('، '));
      }
    }
  }

  const handleProceed = () => {
    setSubmitted(true);
    if (!validate()) return;
    const customerData: CustomerProfile = {
      name: name.trim(),
      phone: phone.replace(/\s/g, ''),
      address: address.trim(),
    };
    setProfile(customerData);
    router.push({
      pathname: '/payment',
      params: {
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        fulfillment,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      },
    });
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronRight size={24} color={Colors.PRIMARY} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>إتمام الطلب</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>سلتك فارغة</Text>
          <TouchableOpacity onPress={() => router.navigate('/')} activeOpacity={0.85}>
            <Text style={styles.emptyLink}>تصفح القائمة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronRight size={24} color={Colors.PRIMARY} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>إتمام الطلب</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Fulfillment choice */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>طريقة الاستلام</Text>
            <View style={styles.fulfillmentRow}>
              <TouchableOpacity
                style={[styles.fulfillmentCard, fulfillment === 'pickup' && styles.fulfillmentCardActive]}
                onPress={() => setFulfillment('pickup')}
                activeOpacity={0.7}
              >
                <Store size={26} color={fulfillment === 'pickup' ? Colors.PRIMARY : Colors.DARK_GRAY} strokeWidth={2} />
                <Text style={[styles.fulfillmentLabel, fulfillment === 'pickup' && styles.fulfillmentLabelActive]}>استلام من الفرع</Text>
                <Text style={styles.fulfillmentDesc}>احضر إلى المتجر واستلم طلبك</Text>
                {fulfillment === 'pickup' && (
                  <View style={styles.fulfillmentCheck}>
                    <Check size={14} color={Colors.WHITE} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.fulfillmentCard, fulfillment === 'delivery' && styles.fulfillmentCardActive]}
                onPress={() => setFulfillment('delivery')}
                activeOpacity={0.7}
              >
                <Bike size={26} color={fulfillment === 'delivery' ? Colors.PRIMARY : Colors.DARK_GRAY} strokeWidth={2} />
                <Text style={[styles.fulfillmentLabel, fulfillment === 'delivery' && styles.fulfillmentLabelActive]}>توصيل</Text>
                <Text style={styles.fulfillmentDesc}>يوصلك الطلب إلى عنوانك</Text>
                {fulfillment === 'delivery' && (
                  <View style={styles.fulfillmentCheck}>
                    <Check size={14} color={Colors.WHITE} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Customer info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات العميل</Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={18} color={Colors.DARK_GRAY} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="الاسم الكامل"
                placeholderTextColor={Colors.DARK_GRAY}
                value={name}
                onChangeText={(v) => { setName(v); if (submitted) validate(); }}
                textAlign="right"
                textContentType="name"
              />
            </View>
            {submitted && errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Phone size={18} color={Colors.DARK_GRAY} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="رقم الهاتف (09xxxxxxxx)"
                placeholderTextColor={Colors.DARK_GRAY}
                value={phone}
                onChangeText={(v) => { setPhone(v); if (submitted) validate(); }}
                textAlign="right"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                maxLength={10}
              />
            </View>
            {submitted && errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

            {fulfillment === 'delivery' && (
              <>
                <View style={styles.addressRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="مثال: بنغازي، شارع دبي، مبنى 12"
                    placeholderTextColor={Colors.DARK_GRAY}
                    value={address}
                    onChangeText={(v) => { setAddress(v); if (submitted) validate(); }}
                    textAlign="right"
                  />
                  <TouchableOpacity
                    onPress={useCurrentLocation}
                    disabled={loadingLocation}
                    style={styles.locationBtn}
                  >
                    {loadingLocation ? (
                      <ActivityIndicator size="small" color={Colors.PRIMARY} />
                    ) : (
                      <Ionicons name="navigate" size={20} color={Colors.PRIMARY} />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.pickOnMapBtn}
                  onPress={useCurrentLocation}
                >
                  <Ionicons name="map-outline" size={18} color={Colors.PRIMARY} />
                  <Text style={styles.pickOnMapText}>تحديد موقعي تلقائياً</Text>
                </TouchableOpacity>
                {submitted && errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
              </>
            )}
          </View>

          {/* Order summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ملخص الطلب</Text>
            <View style={styles.summaryCard}>
              {items.map((item) => (
                <View key={item.id + (item.options ?? '')} style={styles.summaryRow}>
                  <Text style={styles.summaryItem}>{item.name} × {item.quantity}</Text>
                  <Text style={styles.summaryPrice}>{(item.price * item.quantity).toFixed(2)} د.ل</Text>
                </View>
              ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>المجموع الفرعي</Text>
                <Text style={styles.summaryValue}>{subtotal.toFixed(2)} د.ل</Text>
              </View>
              {fulfillment === 'delivery' && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>رسوم التوصيل</Text>
                  <Text style={styles.summaryValue}>{deliveryFee.toFixed(2)} د.ل</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>الضريبة (٨٪)</Text>
                <Text style={styles.summaryValue}>{tax.toFixed(2)} د.ل</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>الإجمالي</Text>
                <Text style={styles.summaryTotalValue}>{total.toFixed(2)} د.ل</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleProceed} activeOpacity={0.85}>
            <Text style={styles.checkoutBtnText}>المتابعة للدفع · {total.toFixed(2)} د.ل</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Map picker modal */}
      <Modal
        visible={mapVisible}
        animationType="slide"
        onRequestClose={() => setMapVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setMapVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>اختر موقع التوصيل</Text>
            <View style={{ width: 24 }} />
          </View>
          <MapView
            style={{ flex: 1 }}
            initialRegion={pickedRegion}
            onRegionChangeComplete={(r) => setPickedRegion(r)}
          >
            <Marker coordinate={pickedRegion} pinColor="#1E3A8A" />
          </MapView>
          <View style={styles.mapFooter}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={async () => {
                await reverseGeocodePin(pickedRegion);
                setMapVisible(false);
              }}
            >
              <Text style={styles.confirmBtnText}>تأكيد الموقع</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: Colors.PRIMARY },
  container: { flex: 1 },
  section: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.BLACK, marginBottom: Spacing.MD, textAlign: 'right' },
  fulfillmentRow: { flexDirection: 'row-reverse', gap: Spacing.MD },
  fulfillmentCard: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.CARD,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    padding: Spacing.MD,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  fulfillmentCardActive: { borderColor: Colors.PRIMARY, backgroundColor: Colors.PRIMARY_LIGHT },
  fulfillmentLabel: { fontSize: 14, fontWeight: '700', color: Colors.BLACK, textAlign: 'center' },
  fulfillmentLabelActive: { color: Colors.PRIMARY },
  fulfillmentDesc: { fontSize: 11, color: Colors.DARK_GRAY, textAlign: 'center', lineHeight: 16 },
  fulfillmentCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.MD,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    marginBottom: Spacing.SM,
    paddingHorizontal: Spacing.MD,
  },
  inputIcon: { width: 24, alignItems: 'center' },
  input: { flex: 1, paddingVertical: Spacing.MD + 2, fontSize: 15, color: Colors.BLACK, textAlign: 'right' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationBtn: { padding: 10, borderRadius: 10, backgroundColor: '#EFF6FF' },
  pickOnMapBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, marginTop: 8,
    borderWidth: 1, borderColor: Colors.PRIMARY, borderRadius: 12,
  },
  pickOnMapText: { color: Colors.PRIMARY, fontWeight: '600', fontSize: 14 },
  mapHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mapTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  mapFooter: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  confirmBtn: {
    backgroundColor: '#1E3A8A', paddingVertical: 14, borderRadius: 14,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  errorText: { fontSize: 12, color: Colors.RED_500, marginBottom: Spacing.SM, textAlign: 'right' },
  summaryCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.CARD,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: Spacing.MD,
  },
  summaryRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  summaryItem: { fontSize: 14, color: Colors.BLACK, flex: 1, textAlign: 'right' },
  summaryPrice: { fontSize: 14, color: Colors.DARK_GRAY, fontWeight: '500' },
  summaryLabel: { fontSize: 14, color: Colors.DARK_GRAY },
  summaryValue: { fontSize: 14, color: Colors.BLACK, fontWeight: '600' },
  summaryTotalLabel: { fontSize: 17, fontWeight: '700', color: Colors.BLACK },
  summaryTotalValue: { fontSize: 17, fontWeight: '800', color: Colors.PRIMARY },
  summaryDivider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Spacing.SM },
  footer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: Spacing.LG,
    paddingTop: Spacing.MD,
    paddingBottom: Spacing.XL,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  checkoutBtn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radius.CHIP,
    paddingVertical: Spacing.MD + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: { color: Colors.WHITE, fontSize: 17, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.MD },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.PRIMARY },
  emptyLink: { fontSize: 16, color: Colors.PRIMARY, fontWeight: '600' },
  bottomPadding: { height: 120 },
});
