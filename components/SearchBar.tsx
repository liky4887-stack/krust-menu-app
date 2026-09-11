import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/colors';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchBar({ placeholder = 'ابحث عن مشروباتك المفضلة...', value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={20} color={Colors.DARK_GRAY} strokeWidth={2} style={styles.icon} />
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        cursorColor={Colors.PRIMARY}
        selectionColor={Colors.PRIMARY}
        placeholder={placeholder}
        placeholderTextColor={Colors.DARK_GRAY}
        value={value}
        onChangeText={onChangeText}
        textAlign="right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.MD,
    paddingHorizontal: Spacing.MD,
    height: 54,
    marginHorizontal: Spacing.LG,
    marginVertical: Spacing.SM,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    shadowColor: '#0A1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: Spacing.SM,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.BLACK,
    textAlign: 'right',
  },
});
