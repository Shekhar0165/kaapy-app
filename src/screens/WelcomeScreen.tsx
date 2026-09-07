import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const palettes = {
  light: {
    background: '#F7F4EE',
    surface: '#FFFFFF',
    accent: '#B85C38',
    accentSoft: 'rgba(184, 92, 56, 0.12)',
    ink: '#213547',
    subink: '#60717C',
    primaryBg: '#213547',
    primaryText: '#FFFFFF',
    secondaryBorder: 'rgba(33, 53, 71, 0.16)',
    secondaryText: '#213547',
    shadow: '#213547',
  },
  dark: {
    background: '#17140F',
    surface: '#1F1B15',
    accent: '#E08A5F',
    accentSoft: 'rgba(224, 138, 95, 0.16)',
    ink: '#F5EFE6',
    subink: '#A79C8E',
    primaryBg: '#F5EFE6',
    primaryText: '#17140F',
    secondaryBorder: 'rgba(245, 239, 230, 0.2)',
    secondaryText: '#F5EFE6',
    shadow: '#000000',
  },
} as const;

export function WelcomeScreen({ navigation }: Props) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';
  const c = palettes[theme];
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.eyebrow}>KAAPY</Text>
        </View>

        <Text style={styles.title}>Your day,{'\n'}made simpler.</Text>
        <Text style={styles.subtitle}>
          Keep everything you need in one calm, focused place.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Login')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Register')}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryButtonText}>Create an account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(c: typeof palettes.light) {
  return StyleSheet.create({
    container: {
      backgroundColor: c.background,
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 28,
      paddingBottom: 20,
      paddingTop: 40,
    },
    hero: {
      marginTop: 60,
    },
    brandRow: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 28,
    },
    brandDot: {
      backgroundColor: c.accent,
      borderRadius: 4,
      height: 8,
      marginRight: 10,
      width: 8,
    },
    eyebrow: {
      color: c.accent,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 2.5,
    },
    title: {
      color: c.ink,
      fontSize: 42,
      fontWeight: '800',
      letterSpacing: -0.5,
      lineHeight: 48,
      maxWidth: 340,
    },
    subtitle: {
      color: c.subink,
      fontSize: 17,
      lineHeight: 26,
      marginTop: 16,
      maxWidth: 300,
    },
    actions: {
      gap: 12,
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: c.primaryBg,
      borderRadius: 999,
      elevation: 4,
      paddingVertical: 18,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    },
    primaryButtonText: {
      color: c.primaryText,
      fontSize: 16,
      fontWeight: '700',
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: c.accentSoft,
      borderColor: c.secondaryBorder,
      borderRadius: 999,
      borderWidth: 1,
      paddingVertical: 17,
    },
    secondaryButtonText: {
      color: c.secondaryText,
      fontSize: 16,
      fontWeight: '700',
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
  });
}