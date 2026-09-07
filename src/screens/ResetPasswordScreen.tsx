import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resetPassword } from '../api';
import type { RootStackParamList } from '../navigation';
import { FormInput } from '../components/FormInput';
import { OtpInput } from '../components/OtpInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { fonts, palette, radius, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const STITCH_COUNT = 3;

export function ResetPasswordScreen({ navigation, route }: Props) {
  const { s } = useScale();
  const styles = createStyles(s);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleResetPassword() {
    if (!code.trim() || !password || !confirmPassword) {
      setErrorMessage('Complete all fields to continue.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await resetPassword(route.params.gmail, code.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage('That reset code is invalid or expired.');
      } else if (axios.isAxiosError(error) && !error.response) {
        setErrorMessage('Unable to reach the server. Check your connection.');
      } else {
        setErrorMessage('Password reset failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View>
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

          <Text style={styles.title}>Set a new password</Text>
          <Text style={styles.subtitle}>
            Enter the code sent to {route.params.gmail}, then choose a new password.
          </Text>

          {/* Reassurance card, same stitched-spine motif used across the auth flow */}
          <View style={styles.reassuranceCard}>
            <View style={styles.reassuranceStitchRail}>
              {Array.from({ length: STITCH_COUNT }).map((_, index) => (
                <View key={index} style={styles.reassuranceStitchDot} />
              ))}
            </View>
            <Text style={styles.reassuranceText}>
              The code expires in 10 minutes. Check spam if it hasn't arrived, or go back to
              request a new one.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.otpField}>
              <Text style={styles.otpLabel}>Reset code</Text>
              <OtpInput autoFocus length={6} onChangeText={setCode} value={code} />
            </View>
            <FormInput
              autoCapitalize="none"
              autoComplete="new-password"
              label="New password"
              onChangeText={setPassword}
              placeholder="Create a new password"
              secureTextEntry
              value={password}
            />
            <FormInput
              autoCapitalize="none"
              autoComplete="new-password"
              label="Confirm new password"
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your new password"
              secureTextEntry
              value={confirmPassword}
            />

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <PrimaryButton
              label={isSubmitting ? 'Updating password...' : 'Update password'}
              disabled={isSubmitting}
              onPress={handleResetPassword}
              style={isSubmitting ? styles.disabledButton : undefined}
            />
          </View>
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
    container: {
      backgroundColor: palette.background,
      flex: 1,
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
      fontSize: s(34),
      marginTop: s(spacing.xl),
    },
    subtitle: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(17),
      lineHeight: s(25),
      marginTop: s(spacing.sm),
    },

    // Reassurance card: same stitched-spine language as the rest of the auth flow
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

    form: {
      gap: s(spacing.md),
      marginTop: s(28),
    },
    otpField: {
      gap: s(6),
    },
    otpLabel: {
      color: palette.ink,
      fontFamily: fonts.medium,
      fontSize: s(13),
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
  });
}