import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation';
import { useAuth } from '../auth';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { fonts, palette, radius, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const TRUST_ITEMS = ['Secure', 'Synced', 'Reminders'] as const;
const STITCH_COUNT = 3;

export function LoginScreen({ navigation }: Props) {
  const { s } = useScale();
  const styles = createStyles(s);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setErrorMessage('Enter your email and password to continue.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        setErrorMessage('Unable to reach the server. Check your connection.');
      } else if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backArrow}>←</Text>
            </Pressable>

            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>K</Text>
            </View>
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to continue to your khata.</Text>

          {/* Reassurance card, same stitched-spine motif as the Welcome hero */}
          <View style={styles.reassuranceCard}>
            <View style={styles.reassuranceStitchRail}>
              {Array.from({ length: STITCH_COUNT }).map((_, index) => (
                <View key={index} style={styles.reassuranceStitchDot} />
              ))}
            </View>
            <Text style={styles.reassuranceText}>
              Your khata is exactly where you left it. Log in to pick up where you stopped.
            </Text>
          </View>

          <View style={styles.trustRow}>
            {TRUST_ITEMS.map((label) => (
              <View key={label} style={styles.trustChip}>
                <View style={styles.trustDot} />
                <Text style={styles.trustLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.form}>
            <FormInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              label="Email address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              value={email}
            />
            <FormInput
              autoCapitalize="none"
              autoComplete="password"
              label="Password"
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
            />

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <PrimaryButton
              label={isSubmitting ? 'Logging in...' : 'Login'}
              disabled={isSubmitting}
              onPress={handleLogin}
              style={isSubmitting ? styles.disabledButton : undefined}
            />

            <Pressable
              hitSlop={8}
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotLink}
            >
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Kaapy?</Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Create an account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(s: (value: number) => number) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: palette.background,
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: s(spacing.xl),
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: s(spacing.md),
    },
    backButton: {
      alignItems: 'center',
      backgroundColor: palette.featureBg,
      borderRadius: radius.sm,
      height: s(38),
      justifyContent: 'center',
      width: s(38),
    },
    backArrow: {
      color: palette.accent,
      fontFamily: fonts.bold,
      fontSize: s(16),
    },
    brandMark: {
      alignItems: 'center',
      backgroundColor: palette.accent,
      borderRadius: radius.md,
      height: s(44),
      justifyContent: 'center',
      width: s(44),
    },
    brandMarkText: {
      color: palette.primaryText,
      fontFamily: fonts.bold,
      fontSize: s(18),
    },
    title: {
      color: palette.ink,
      fontFamily: fonts.bold,
      fontSize: s(30),
      marginTop: s(spacing.lg),
    },
    subtitle: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(15),
      marginTop: s(spacing.xs),
    },

    // Reassurance card: same stitched-spine language as the Welcome hero
    reassuranceCard: {
      backgroundColor: palette.featureBg,
      borderColor: palette.featureBorder,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      marginTop: s(24),
      overflow: 'hidden',
      paddingLeft: s(24),
      paddingRight: s(16),
      paddingVertical: s(14),
      position: 'relative',
    },
    reassuranceStitchRail: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'space-evenly',
      left: s(10),
      paddingVertical: s(12),
      position: 'absolute',
      top: 0,
      width: s(4),
    },
    reassuranceStitchDot: {
      backgroundColor: palette.accent,
      borderRadius: s(2),
      height: s(4),
      opacity: 0.45,
      width: s(4),
    },
    reassuranceText: {
      color: palette.ink,
      flex: 1,
      fontFamily: fonts.regular,
      fontSize: s(13),
      lineHeight: s(19),
    },

    trustRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: s(8),
      marginTop: s(14),
    },
    trustChip: {
      alignItems: 'center',
      backgroundColor: palette.background,
      borderColor: palette.featureBorder,
      borderRadius: s(999),
      borderWidth: 1,
      flexDirection: 'row',
      gap: s(6),
      paddingHorizontal: s(12),
      paddingVertical: s(6),
    },
    trustDot: {
      backgroundColor: palette.accent,
      borderRadius: s(3),
      height: s(6),
      width: s(6),
    },
    trustLabel: {
      color: palette.subink,
      fontFamily: fonts.medium,
      fontSize: s(11),
    },

    form: {
      gap: s(spacing.md),
      marginTop: s(28),
    },
    errorBanner: {
      backgroundColor: palette.featureBg,
      borderColor: palette.secondaryBorder,
      borderRadius: radius.sm,
      borderWidth: 1,
      padding: s(spacing.md),
    },
    errorText: {
      color: palette.accentDark,
      fontFamily: fonts.medium,
      fontSize: s(13),
    },
    disabledButton: {
      opacity: 0.65,
    },
    forgotLink: {
      alignSelf: 'flex-start',
      paddingVertical: s(spacing.xs),
    },
    footer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'center',
      paddingBottom: 12,
      paddingTop: 8,
    },
    footerText: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(15),
    },
    link: {
      color: palette.accent,
      fontFamily: fonts.bold,
      fontSize: s(15),
    },
  });
}