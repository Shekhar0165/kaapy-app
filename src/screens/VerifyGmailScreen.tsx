import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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

import { verifyGmail } from '../api';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyGmail'>;

export function VerifyGmailScreen({ navigation, route }: Props) {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleVerification() {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await verifyGmail(route.params.gmail, code.trim());
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch {
      setErrorMessage('That code is invalid or expired. Try again.');
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
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to {route.params.gmail}.
        </Text>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={setCode}
            placeholder="Verification code"
            placeholderTextColor="#8A989F"
            style={styles.input}
            value={code}
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleVerification}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Verifying...' : 'Verify email'}
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
    fontSize: 18,
    letterSpacing: 3,
    paddingHorizontal: 16,
    paddingVertical: 15,
    textAlign: 'center',
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
  error: {
    color: '#B33A3A',
    fontSize: 14,
  },
});
