import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../auth';
import { SecondaryButton } from '../components/SecondaryButton';
import { fonts, palette, radius, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

export function ProfileScreen() {
  const { logout } = useAuth();
  const { s } = useScale();
  const styles = createStyles(s);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>Account</Text>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your Kaapy account and shop details.</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>K</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>Kaapy owner</Text>
          <Text style={styles.email}>Your account details will appear here.</Text>
        </View>
      </View>

      <SecondaryButton label="Log out" onPress={logout} style={styles.logoutButton} />
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
    profileCard: {
      alignItems: 'center',
      backgroundColor: palette.featureBg,
      borderColor: palette.featureBorder,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      marginTop: s(spacing.xxl),
      padding: s(spacing.lg),
    },
    avatar: {
      alignItems: 'center',
      backgroundColor: palette.accent,
      borderRadius: radius.md,
      height: s(48),
      justifyContent: 'center',
      width: s(48),
    },
    avatarText: {
      color: palette.primaryText,
      fontFamily: fonts.bold,
      fontSize: s(20),
    },
    profileCopy: {
      flex: 1,
      marginLeft: s(spacing.md),
    },
    name: {
      color: palette.ink,
      fontFamily: fonts.semiBold,
      fontSize: s(16),
    },
    email: {
      color: palette.subink,
      fontFamily: fonts.regular,
      fontSize: s(13),
      lineHeight: s(19),
      marginTop: s(spacing.xs),
    },
    logoutButton: {
      marginTop: s(spacing.xl),
    },
  });
}
