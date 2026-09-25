import axios from 'axios';
import { clearTokens, getAccessToken } from './auth';

let isRedirecting = false;

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !isRedirecting) {
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        isRedirecting = true;
        clearTokens();
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Add auth token to all requests
axios.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axios;
