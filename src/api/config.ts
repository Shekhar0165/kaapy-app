import { API_BASE_URL } from '@env';

export const apiConfig = {
  baseUrl: API_BASE_URL.replace(/\/$/, ''),
};
