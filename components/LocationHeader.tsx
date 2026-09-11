import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/colors';

interface LocationHeaderProps {
  address?: string;
}

export default function LocationHeader({ address = 'كرست — Krust' }: LocationHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationBtn} activeOpacity={0.7}>
        <Text style={styles.label}>مرحبًا بك في</Text>
        <View style={styles.addressRow}>
          <Text style={styles.address} numberOfLines={1}>{address}</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.BRAND} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileBtn} activeOpacity={0.7}>
        <Ionicons name="person-circle-outline" size={32} color={Colors.BRAND} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.SM,
  },
  locationBtn: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.DARK_GRAY,
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  address: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.BRAND,
    marginRight: 4,
  },
  profileBtn: {
    padding: 4,
  },
});
