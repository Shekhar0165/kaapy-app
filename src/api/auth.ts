import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { apiConfig } from './config';
import {
  clearStoredTokens,
  getStoredTokens,
  storeTokens,
  type AuthTokens,
} from './tokenStorage';

type LoginResponse = AuthTokens;

export type RegisterDetails = {
  gmail: string;
  password: string;
  fullName: string;
  shopName: string;
  address: string;
};

type RegisterResponse = {
  message: string;
  verificationCode?: string;
};

type VerifyGmailResponse = {
  message: string;
};

type ForgotPasswordResponse = {
  message: string;
  resetCode?: string;
};

type ResetPasswordResponse = {
  message: string;
};

function isAccessTokenValid(accessToken: string): boolean {
  try {
    const decodedPayload = jwtDecode<{ exp?: number }>(accessToken);

    return typeof decodedPayload.exp === 'number' && decodedPayload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const url = `${apiConfig.baseUrl}/auth/login`;
  console.log('Login request:', { email, url });

  try {
    const { data } = await axios.post<LoginResponse>(
      url,
      { gmail: email, password },
      { timeout: 10000 },
    );

    console.log('Login response:', { hasAccessToken: Boolean(data.accessToken) });

    await storeTokens(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login request failed:', {
        code: error.code,
        message: error.message,
        status: error.response?.status,
        url,
      });
    }

    throw error;
  }
}

export async function register(details: RegisterDetails): Promise<RegisterResponse> {
  const { data } = await axios.post<RegisterResponse>(
    `${apiConfig.baseUrl}/auth/register`,
    details,
  );

  return data;
}

export async function verifyGmail(gmail: string, code: string): Promise<VerifyGmailResponse> {
  const { data } = await axios.post<VerifyGmailResponse>(
    `${apiConfig.baseUrl}/auth/verify-gmail`,
    { gmail, code },
  );

  return data;
}

export async function forgotPassword(gmail: string): Promise<ForgotPasswordResponse> {
  const { data } = await axios.post<ForgotPasswordResponse>(
    `${apiConfig.baseUrl}/auth/forgot-password`,
    { gmail },
    { timeout: 10000 },
  );

  return data;
}

export async function resetPassword(
  gmail: string,
  code: string,
  password: string,
): Promise<ResetPasswordResponse> {
  const { data } = await axios.post<ResetPasswordResponse>(
    `${apiConfig.baseUrl}/auth/reset-password`,
    { gmail, code, password },
    { timeout: 10000 },
  );

  return data;
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const { data } = await axios.post<AuthTokens>(
    `${apiConfig.baseUrl}/auth/refresh-token`,
    { refreshToken },
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  );

  await storeTokens(data);
  return data;
}

export async function restoreSession(): Promise<boolean> {
  const tokens = await getStoredTokens();

  if (!tokens) {
    return false;
  }

  if (isAccessTokenValid(tokens.accessToken)) {
    return true;
  }

  try {
    await refreshTokens(tokens.refreshToken);
    return true;
  } catch {
    await clearStoredTokens();
    return false;
  }
}

export async function logout(): Promise<void> {
  await clearStoredTokens();
}
