import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/lib/auth';
import { API_BASE_URL } from '@/config/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (endpoint: string, config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const headers: any = {
        ...config?.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        ...config,
        headers,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'An error occurred';

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(
    async (endpoint: string, config?: AxiosRequestConfig) => {
      return request(endpoint, { ...config, method: 'GET' });
    },
    [request]
  );

  const post = useCallback(
    async (endpoint: string, data?: any, config?: AxiosRequestConfig) => {
      return request(endpoint, { ...config, method: 'POST', data });
    },
    [request]
  );

  const patch = useCallback(
    async (endpoint: string, data?: any, config?: AxiosRequestConfig) => {
      return request(endpoint, { ...config, method: 'PATCH', data });
    },
    [request]
  );

  const put = useCallback(
    async (endpoint: string, data?: any, config?: AxiosRequestConfig) => {
      return request(endpoint, { ...config, method: 'PUT', data });
    },
    [request]
  );

  const delete_ = useCallback(
    async (endpoint: string, config?: AxiosRequestConfig) => {
      return request(endpoint, { ...config, method: 'DELETE' });
    },
    [request]
  );

  return { loading, error, get, post, patch, put, delete: delete_ };
}
