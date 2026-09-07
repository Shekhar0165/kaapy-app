import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { RootStackParamList } from '../navigation';
import { useAuth } from '../auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue to your account.</Text>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#8A989F"
            style={styles.input}
            value={email}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#8A989F"
            secureTextEntry
            style={styles.input}
            value={password}
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleLogin}
            style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>New to Kaapy?</Text>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Create an account</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F4EE',
    flex: 1,
    justifyContent: 'space-between',
    padding: 28,
  },
  title: {
    color: '#213547',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 28,
  },
  subtitle: {
    color: '#60717C',
    fontSize: 17,
    marginTop: 10,
  },
  form: {
    gap: 14,
    marginTop: 36,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DDD8',
    borderRadius: 10,
    borderWidth: 1,
    color: '#213547',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#213547',
    borderRadius: 10,
    marginTop: 8,
    paddingVertical: 17,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.65,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    paddingBottom: 12,
  },
  footerText: {
    color: '#60717C',
    fontSize: 15,
  },
  link: {
    color: '#B85C38',
    fontSize: 15,
    fontWeight: '700',
  },
  error: {
    color: '#B33A3A',
    fontSize: 14,
  },
});
