import axios, { type InternalAxiosRequestConfig } from 'axios';

import { apiConfig } from './config';
import { refreshTokens } from './auth';
import { clearStoredTokens, getStoredTokens } from './tokenStorage';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async config => {
  const tokens = await getStoredTokens();

  if (tokens) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config as RetriableRequestConfig | undefined;
    const isAuthRequest = config?.url?.includes('/auth/');

    if (error.response?.status !== 401 || !config || config._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    config._retry = true;
    const tokens = await getStoredTokens();

    if (!tokens) {
      return Promise.reject(error);
    }

    try {
      const refreshedTokens = await refreshTokens(tokens.refreshToken);
      config.headers.Authorization = `Bearer ${refreshedTokens.accessToken}`;
      return axiosClient(config);
    } catch (refreshError) {
      await clearStoredTokens();
      return Promise.reject(refreshError);
    }
  },
);
