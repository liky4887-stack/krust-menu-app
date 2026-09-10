import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/colors';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchBar({ placeholder = 'ابحث في القائمة...', value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={Colors.DARK_GRAY} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.DARK_GRAY}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240,246,255,0.72)',
    borderRadius: Radius.CHIP,
    paddingHorizontal: Spacing.MD,
    height: 50,
    marginHorizontal: Spacing.LG,
    marginVertical: Spacing.SM,
    borderWidth: 1,
    borderColor: 'rgba(214,228,240,0.8)',
    shadowColor: '#0A1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    marginRight: Spacing.SM,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.BLACK,
    textAlign: 'left',
  },
});
