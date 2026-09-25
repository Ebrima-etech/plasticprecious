import axios from 'axios';
import { clearTokens, getAccessToken } from './auth';

let isRedirecting = false;

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      clearTokens();

      if (typeof window !== 'undefined') {
        // Check if we're in admin or regular user area
        const currentPath = window.location.pathname;
        const redirectPath = currentPath.startsWith('/admin') ? '/auth/login' : '/auth/login';

        window.location.href = redirectPath;
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
