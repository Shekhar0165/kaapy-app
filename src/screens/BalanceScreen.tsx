import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, palette, radius, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

export function BalanceScreen() {
  const { s } = useScale();
  const styles = createStyles(s);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>Your ledger</Text>
      <Text style={styles.title}>Balance</Text>
      <Text style={styles.subtitle}>A clear view of what is owed to your shop.</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.cardLabel}>Total outstanding</Text>
        <Text style={styles.amount}>₹0</Text>
        <Text style={styles.cardHint}>No entries yet</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>0</Text>
          <Text style={styles.summaryLabel}>Customers</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>₹0</Text>
          <Text style={styles.summaryLabel}>Collected</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(s: (value: number) => number) {
  return StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      flex: 1,
      padding: s(spacing.xl),
    },
    eyebrow: {
      color: palette.accent,
      fontFamily: fonts.bold,
      fontSize: s(13),
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    title: {
      color: palette.ink,
      fontFamily: fonts.bold,
      fontSize: s(32),
      marginTop: s(spacing.xs),
    },
    subtitle: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(15),
      lineHeight: s(22),
      marginTop: s(spacing.sm),
    },
    balanceCard: {
      backgroundColor: palette.accent,
      borderRadius: radius.lg,
      marginTop: s(spacing.xxl),
      padding: s(spacing.xl),
    },
    cardLabel: {
      color: palette.featureBg,
      fontFamily: fonts.medium,
      fontSize: s(14),
    },
    amount: {
      color: palette.primaryText,
      fontFamily: fonts.bold,
      fontSize: s(40),
      marginTop: s(spacing.sm),
    },
    cardHint: {
      color: palette.featureBg,
      fontFamily: fonts.regular,
      fontSize: s(13),
      marginTop: s(spacing.sm),
    },
    summaryRow: {
      flexDirection: 'row',
      gap: s(spacing.md),
      marginTop: s(spacing.md),
    },
    summaryItem: {
      backgroundColor: palette.featureBg,
      borderColor: palette.featureBorder,
      borderRadius: radius.md,
      borderWidth: 1,
      flex: 1,
      padding: s(spacing.lg),
    },
    summaryValue: {
      color: palette.ink,
      fontFamily: fonts.bold,
      fontSize: s(20),
    },
    summaryLabel: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(13),
      marginTop: s(spacing.xs),
    },
  });
}
