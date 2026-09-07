import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../auth';

export function HomeScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome to Kaapy</Text>
      <Text style={styles.title}>You are all set.</Text>
      <Text style={styles.subtitle}>
        This is your home screen. Your signed-in experience starts here.
      </Text>
      <Pressable accessibilityRole="button" onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F4EE',
    flex: 1,
    padding: 28,
    paddingTop: 56,
  },
  greeting: {
    color: '#B85C38',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#213547',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 12,
  },
  subtitle: {
    color: '#60717C',
    fontSize: 17,
    lineHeight: 26,
    marginTop: 12,
    maxWidth: 320,
  },
  logoutButton: {
    alignItems: 'center',
    borderColor: '#213547',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 32,
    paddingVertical: 15,
  },
  logoutText: {
    color: '#213547',
    fontSize: 16,
    fontWeight: '700',
  },
});
