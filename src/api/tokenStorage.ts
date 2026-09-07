import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const TOKENS_STORAGE_KEY = '@kaapy/auth-tokens';

export async function getStoredTokens(): Promise<AuthTokens | null> {
  const value = await AsyncStorage.getItem(TOKENS_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthTokens;
  } catch {
    await clearStoredTokens();
    return null;
  }
}

export function storeTokens(tokens: AuthTokens): Promise<void> {
  return AsyncStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens(): Promise<void> {
  return AsyncStorage.removeItem(TOKENS_STORAGE_KEY);
}
