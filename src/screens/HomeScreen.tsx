import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../auth';
import { SecondaryButton } from '../components/SecondaryButton';
import { fonts, palette, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

export function HomeScreen() {
  const { logout } = useAuth();
  const { s } = useScale();
  const styles = createStyles(s);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome to Kaapy</Text>
      <Text style={styles.title}>You are all set.</Text>
      <Text style={styles.subtitle}>
        This is your home screen. Your signed-in experience starts here.
      </Text>
      <SecondaryButton label="Log out" onPress={logout} style={styles.logoutButton} />
    </View>
  );
}

function createStyles(s: (value: number) => number) {
  return StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    flex: 1,
    padding: s(spacing.xl),
    paddingTop: s(56),
  },
  greeting: {
    color: palette.accent,
    fontFamily: fonts.bold,
    fontSize: s(15),
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.ink,
    fontFamily: fonts.bold,
    fontSize: s(34),
    marginTop: s(spacing.md),
  },
  subtitle: {
    color: palette.subink,
    fontFamily: fonts.regular,
    fontSize: s(17),
    lineHeight: s(26),
    marginTop: s(spacing.md),
    maxWidth: s(320),
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: s(spacing.xxl),
  },
  });
}
