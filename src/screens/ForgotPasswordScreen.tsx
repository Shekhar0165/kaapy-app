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

import { forgotPassword } from '../api';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View>
        <Text style={styles.title}>Forgot password?</Text>
        <Text style={styles.subtitle}>
          Enter your Gmail address and we will send you a reset code.
        </Text>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setGmail}
            placeholder="Email address"
            placeholderTextColor="#8A989F"
            style={styles.input}
            value={gmail}
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleSendCode}
            style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Sending code...' : 'Send reset code'}
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
