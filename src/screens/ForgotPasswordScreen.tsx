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

import { forgotPassword } from '../api';
import type { RootStackParamList } from '../navigation';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { fonts, palette, radius, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const STITCH_COUNT = 3;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { s } = useScale();
  const styles = createStyles(s);
  const [gmail, setGmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSendCode() {
    const normalizedGmail = gmail.trim();

    if (!normalizedGmail) {
      setErrorMessage('Enter your Gmail address to continue.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await forgotPassword(normalizedGmail);
      navigation.navigate('ResetPassword', { gmail: normalizedGmail });
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        setErrorMessage('Unable to reach the server. Check your connection.');
      } else {
        setErrorMessage('We could not send a reset code. Please try again.');
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

          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter your Gmail address and we will send you a reset code.
          </Text>

          {/* Reassurance card, same stitched-spine motif used across the auth flow */}
          <View style={styles.reassuranceCard}>
            <View style={styles.reassuranceStitchRail}>
              {Array.from({ length: STITCH_COUNT }).map((_, index) => (
                <View key={index} style={styles.reassuranceStitchDot} />
              ))}
            </View>
            <Text style={styles.reassuranceText}>
              We only use this to send your one-time reset code. Your khata data stays put.
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              label="Gmail address"
              onChangeText={setGmail}
              placeholder="you@example.com"
              value={gmail}
            />

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <PrimaryButton
              label={isSubmitting ? 'Sending code...' : 'Send reset code'}
              disabled={isSubmitting}
              onPress={handleSendCode}
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