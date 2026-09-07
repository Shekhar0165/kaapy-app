import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { register } from '../api';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { fonts, palette, radius, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { s } = useScale();
  const styles = createStyles(s);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await register({
        address: address.trim(),
        fullName: name.trim(),
        gmail: email.trim(),
        password,
        shopName: shopName.trim(),
      });
      navigation.navigate('VerifyGmail', { gmail: email.trim() });
    } catch {
      setErrorMessage('Registration failed. Check your details and try again.');
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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

          <Text style={styles.title}>Create your account</Text>
          {/* <Text style={styles.subtitle}>Start tracking your khata digitally.</Text> */}

          {/* Reassurance card, same stitched-spine motif used on Welcome and Login */}
          {/* <View style={styles.reassuranceCard}>
            <View style={styles.reassuranceStitchRail}>
              {Array.from({ length: STITCH_COUNT }).map((_, index) => (
                <View key={index} style={styles.reassuranceStitchDot} />
              ))}
            </View>
            <Text style={styles.reassuranceText}>
              Two minutes to set up. Once your shop details are in, every udhar entry and reminder
              is ready to go.
            </Text>
          </View> */}

          <View style={styles.form}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionLabel}>Your details</Text>
            </View>
            <FormInput
              autoComplete="name"
              label="Full name"
              onChangeText={setName}
              placeholder="Ramesh Kumar"
              value={name}
            />
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
              autoComplete="new-password"
              label="Password"
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              value={password}
            />

            <View style={[styles.sectionLabelRow, styles.sectionLabelSpacing]}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionLabel}>Shop details</Text>
            </View>
            <FormInput
              label="Shop name"
              onChangeText={setShopName}
              placeholder="Kumar General Store"
              value={shopName}
            />
            <FormInput
              label="Shop address"
              multiline
              onChangeText={setAddress}
              placeholder="Street, area, city"
              style={styles.addressInput}
              textAlignVertical="top"
              value={address}
            />
            <Text style={styles.helperText}>
              Your shop name and address appear on the WhatsApp and SMS reminders your customers
              receive.
            </Text>

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <PrimaryButton
              label={isSubmitting ? 'Creating account...' : 'Create account'}
              disabled={isSubmitting}
              onPress={handleRegister}
              style={isSubmitting ? styles.disabledButton : undefined}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
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
    container: {
      backgroundColor: palette.background,
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: s(spacing.xl),
      paddingTop: s(spacing.sm),
      paddingBottom: s(spacing.xl),
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
      fontSize: s(28),
      marginTop: s(spacing.lg),
    },
    subtitle: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(15),
      marginTop: s(spacing.xs),
    },

    // Reassurance card: same stitched-spine language as Welcome and Login
    reassuranceCard: {
      backgroundColor: palette.featureBg,
      borderColor: palette.featureBorder,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      marginTop: s(20),
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
    sectionLabelRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: s(8),
    },
    sectionDot: {
      backgroundColor: palette.accent,
      borderRadius: s(3),
      height: s(6),
      width: s(6),
    },
    sectionLabel: {
      color: palette.ink,
      fontFamily: fonts.semiBold,
      fontSize: s(13),
    },
    sectionLabelSpacing: {
      marginTop: s(spacing.sm),
    },
    addressInput: {
      minHeight: s(84),
    },
    helperText: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(11),
      lineHeight: s(16),
      marginTop: s(-4),
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
    footer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'center',
      paddingBottom: s(spacing.md),
      paddingHorizontal: s(spacing.xl),
      paddingTop: s(spacing.sm),
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