import { useEffect, useRef } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AccessibilityInfo,
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import type { RootStackParamList } from '../navigation';
import { fonts, palette, radius, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const FEATURES = [
  {
    glyph: '₹',
    title: 'Track every udhar',
    description: 'Record credit given to each customer in a few taps.',
  },
  {
    glyph: '✓',
    title: 'Send reminders',
    description: 'Automatic WhatsApp and SMS nudges when payment is due.',
  },
  {
    glyph: '↻',
    title: 'Real-time reports',
    description: 'See who owes what, updated the moment you add an entry.',
  },
] as const;

const LEDGER_ENTRIES = [
  {
    name: 'Ramesh Kirana Store',
    amount: 1240,
    status: 'upcoming' as const,
    meta: 'Due in 3 days',
  },
  {
    name: 'Sunita General Store',
    amount: 3850,
    status: 'overdue' as const,
    meta: 'Overdue by 2 days',
  },
];

const STITCH_COUNT = 6;

// Indian digit grouping: 1,48,500 rather than 148,500.
function formatINR(amount: number) {
  const rounded = Math.round(Math.abs(amount)).toString();
  const lastThree = rounded.slice(-3);
  const rest = rounded.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d)$)/g, ',') + ',' + lastThree : lastThree;
  return `${amount < 0 ? '-' : ''}₹${grouped}`;
}

// Baseline is a 390pt-wide design; OnePlus screens range ~360dp (Nord) to
// ~412dp (11/12/13 series), so we scale off the current device.
export function WelcomeScreen({ navigation }: Props) {
  const { s, isCompactHeight } = useScale();
  const styles = createStyles(s, isCompactHeight);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((reduced) => {
      if (!isMounted) return;
      if (reduced) {
        fade.setValue(1);
        translateY.setValue(0);
        return;
      }
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]).start();
    });
    return () => {
      isMounted = false;
    };
  }, [fade, translateY]);

  const totalToCollect = LEDGER_ENTRIES.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>₹</Text>
          </View>
          <Text style={styles.brandName}>Kaapy</Text>
        </View>

        <Text style={styles.title}>Your udhar book,{'\n'}now digital.</Text>
        <Text style={styles.subtitle}>
          Everything you used a paper khata for — safer, faster, and always with you.
        </Text>

        {/* Hero: styled after a bahi-khata page, stitched spine and all */}
        <View style={styles.ledgerCard}>
          <View style={styles.stitchRail}>
            {Array.from({ length: STITCH_COUNT }).map((_, index) => (
              <View key={index} style={styles.stitchDot} />
            ))}
          </View>

          <View style={styles.ledgerInner}>
            <Text style={styles.ledgerLabel}>This week</Text>

            {LEDGER_ENTRIES.map((entry, index) => (
              <View
                key={entry.name}
                style={[styles.ledgerRow, index > 0 && styles.ledgerRowDivider]}
              >
                <View style={styles.ledgerAvatar}>
                  <Text style={styles.ledgerAvatarText}>{entry.name.charAt(0)}</Text>
                </View>
                <View style={styles.ledgerIdentity}>
                  <Text style={styles.ledgerName}>{entry.name}</Text>
                  <Text
                    style={[
                      styles.ledgerMeta,
                      entry.status === 'overdue' && styles.ledgerMetaOverdue,
                    ]}
                  >
                    {entry.meta}
                  </Text>
                </View>
                <Text style={styles.ledgerAmount}>{formatINR(entry.amount)}</Text>
              </View>
            ))}

            <View style={styles.ledgerDivider} />

            <View style={styles.ledgerFooterRow}>
              <Text style={styles.ledgerFooterLabel}>To collect</Text>
              <Text style={styles.ledgerFooterAmount}>{formatINR(totalToCollect)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.featureList}>
          {FEATURES.map((feature, index) => (
            <View
              key={feature.title}
              style={[styles.featureRow, index > 0 && styles.featureRowDivider]}
            >
              <Text style={styles.featureGlyph}>{feature.glyph}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Login"
          onPress={() => navigation.navigate('Login')}
          style={styles.primaryButton}
        />

        <SecondaryButton
          label="Create an account"
          onPress={() => navigation.navigate('Register')}
          style={styles.secondaryButton}
        />

        <Text style={styles.trustLine}>Free to start. No card needed.</Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(s: (value: number) => number, isCompactHeight: boolean) {
  return StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: s(spacing.xl),
      paddingTop: isCompactHeight ? s(16) : s(28),
      paddingBottom: s(20),
    },

    brandRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: s(8),
      marginBottom: s(spacing.lg),
    },
    brandMark: {
      alignItems: 'center',
      backgroundColor: palette.accent,
      borderRadius: radius.sm,
      height: s(24),
      justifyContent: 'center',
      width: s(24),
    },
    brandMarkText: {
      color: '#FFFFFF',
      fontFamily: fonts.bold,
      fontSize: s(13),
    },
    brandName: {
      color: palette.ink,
      fontFamily: fonts.bold,
      fontSize: s(15),
    },

    title: {
      color: palette.ink,
      fontFamily: fonts.bold,
      fontSize: s(26),
      lineHeight: s(33),
      maxWidth: 320,
    },
    subtitle: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(13),
      lineHeight: s(20),
      marginTop: s(10),
      maxWidth: 300,
    },

    // Hero card: a page from the digital khata, spine and all
    ledgerCard: {
      backgroundColor: palette.featureBg,
      borderColor: palette.featureBorder,
      borderRadius: radius.lg,
      borderWidth: 1,
      marginTop: isCompactHeight ? s(20) : s(26),
      overflow: 'hidden',
      position: 'relative',
    },
    stitchRail: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'space-evenly',
      left: s(10),
      position: 'absolute',
      paddingVertical: s(16),
      top: 0,
      width: s(4),
    },
    stitchDot: {
      backgroundColor: palette.accent,
      borderRadius: s(2),
      height: s(4),
      opacity: 0.45,
      width: s(4),
    },
    ledgerInner: {
      paddingLeft: s(28),
      paddingRight: s(16),
      paddingVertical: s(16),
    },
    ledgerLabel: {
      color: palette.subink,
      fontFamily: fonts.semiBold,
      fontSize: s(11),
      marginBottom: s(8),
    },
    ledgerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: s(10),
      paddingVertical: s(8),
    },
    ledgerRowDivider: {
      borderTopColor: palette.featureBorder,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    ledgerAvatar: {
      alignItems: 'center',
      backgroundColor: palette.accent,
      borderRadius: radius.lg,
      height: s(32),
      justifyContent: 'center',
      width: s(32),
    },
    ledgerAvatarText: {
      color: '#FFFFFF',
      fontFamily: fonts.bold,
      fontSize: s(13),
    },
    ledgerIdentity: {
      flex: 1,
    },
    ledgerName: {
      color: palette.ink,
      fontFamily: fonts.semiBold,
      fontSize: s(13),
    },
    ledgerMeta: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(11),
      marginTop: s(1),
    },
    ledgerMetaOverdue: {
      color: palette.accent,
      fontFamily: fonts.semiBold,
    },
    ledgerAmount: {
      color: palette.ink,
      fontFamily: fonts.bold,
      fontSize: s(14),
    },
    ledgerDivider: {
      backgroundColor: palette.featureBorder,
      height: 1,
      marginTop: s(4),
      marginBottom: s(10),
    },
    ledgerFooterRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    ledgerFooterLabel: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(12),
    },
    ledgerFooterAmount: {
      color: palette.accent,
      fontFamily: fonts.bold,
      fontSize: s(15),
    },

    featureList: {
      marginTop: isCompactHeight ? s(18) : s(24),
    },
    featureRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: s(14),
      paddingVertical: s(12),
    },
    featureRowDivider: {
      borderTopColor: palette.featureBorder,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    featureGlyph: {
      color: palette.accent,
      fontFamily: fonts.bold,
      fontSize: s(18),
      width: s(22),
    },
    featureText: {
      flex: 1,
    },
    featureTitle: {
      color: palette.ink,
      fontFamily: fonts.semiBold,
      fontSize: s(15),
    },
    featureDescription: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(12),
      lineHeight: s(17),
      marginTop: s(2),
    },

    actions: {
      gap: s(10),
    },
    primaryButton: { marginTop: 0 },
    secondaryButton: { marginTop: 0 },
    trustLine: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(11),
      textAlign: 'center',
      marginTop: s(2),
    },
  });
}