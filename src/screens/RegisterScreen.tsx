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

import type { RootStackParamList } from '../navigation';
import { register } from '../api';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await register({
        address: address.trim(),
        fullName: name.trim(),
        gmail: email.trim(),
        password,
        shopName: shopName.trim(),
      });
      navigation.navigate('VerifyGmail', { gmail: email.trim() });
    } catch {
      setErrorMessage('Registration failed. Check your details and try again.');
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
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Start building a simpler daily routine.</Text>

        <View style={styles.form}>
          <TextInput
            autoComplete="name"
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor="#8A989F"
            style={styles.input}
            value={name}
          />
          <TextInput
            onChangeText={setShopName}
            placeholder="Shop name"
            placeholderTextColor="#8A989F"
            style={styles.input}
            value={shopName}
          />
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
            autoComplete="new-password"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#8A989F"
            secureTextEntry
            style={styles.input}
            value={password}
          />
          <TextInput
            multiline
            onChangeText={setAddress}
            placeholder="Shop address"
            placeholderTextColor="#8A989F"
            style={[styles.input, styles.addressInput]}
            value={address}
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <Pressable
            accessibilityRole="button"
            onPress={handleRegister}
            style={styles.primaryButton}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
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
  addressInput: {
    minHeight: 84,
    textAlignVertical: 'top',
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
