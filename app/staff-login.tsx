import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

export default function StaffLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw new Error('بيانات الدخول غير صحيحة');

      const { data: profile, error: profileError } = await supabase
        .from('staff_profiles')
        .select('role, display_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error('ليس لديك صلاحية الوصول');
      }

      router.replace('/staff-dashboard');
    } catch (e: any) {
      setError(e.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronRight size={24} color={Colors.PRIMARY} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>دخول الموظفين</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={40} color={Colors.WHITE} strokeWidth={2} />
          </View>
          <Text style={styles.title}>لوحة تحكم كرست</Text>
          <Text style={styles.subtitle}>للموظفين المخولين فقط</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Mail size={18} color={Colors.DARK_GRAY} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="البريد الإلكتروني"
                placeholderTextColor={Colors.DARK_GRAY}
                value={email}
                onChangeText={setEmail}
                textAlign="right"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Lock size={18} color={Colors.DARK_GRAY} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="كلمة المرور"
                placeholderTextColor={Colors.DARK_GRAY}
                value={password}
                onChangeText={setPassword}
                textAlign="right"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword
                  ? <EyeOff size={18} color={Colors.DARK_GRAY} strokeWidth={2} />
                  : <Eye size={18} color={Colors.DARK_GRAY} strokeWidth={2} />}
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnLoading]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.WHITE} size="small" />
              ) : (
                <Text style={styles.loginBtnText}>دخول</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.XL,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.LG,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.PRIMARY, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.DARK_GRAY, marginBottom: Spacing.XL },
  form: { width: '100%', gap: Spacing.SM },
  inputGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.MD,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    paddingHorizontal: Spacing.MD,
  },
  inputIcon: { width: 24, alignItems: 'center' },
  input: { flex: 1, paddingVertical: Spacing.MD + 2, fontSize: 15, color: Colors.BLACK, textAlign: 'right' },
  eyeBtn: { width: 40, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 13, color: Colors.RED_500, textAlign: 'right' },
  loginBtn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Radius.CHIP,
    paddingVertical: Spacing.MD + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.SM,
  },
  loginBtnLoading: { backgroundColor: Colors.PRIMARY_DARK },
  loginBtnText: { color: Colors.WHITE, fontSize: 17, fontWeight: '700' },
});
