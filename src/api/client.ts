import type { AxiosRequestConfig } from 'axios';

import { axiosClient } from './axiosClient';

export async function apiRequest<T>(
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> {
  const response = await axiosClient.request<T>({
    ...options,
    url: path,
  });

  return response.data;
}
