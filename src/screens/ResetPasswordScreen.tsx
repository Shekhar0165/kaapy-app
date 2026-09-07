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

import { resetPassword } from '../api';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen({ navigation, route }: Props) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View>
        <Text style={styles.title}>Set a new password</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to {route.params.gmail}, then choose a new password.
        </Text>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={setCode}
            placeholder="Reset code"
            placeholderTextColor="#8A989F"
            style={styles.input}
            value={code}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={setPassword}
            placeholder="New password"
            placeholderTextColor="#8A989F"
            secureTextEntry
            style={styles.input}
            value={password}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#8A989F"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleResetPassword}
            style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Updating password...' : 'Update password'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F4EE',
    flex: 1,
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
    lineHeight: 25,
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
  error: {
    color: '#B33A3A',
    fontSize: 14,
  },
});
