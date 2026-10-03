import axios from 'axios';

// Turn an API error into a readable message, including DRF field errors
export const getErrorMessage = (error: unknown, fallback = 'Failed to save.'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      return Object.entries(data)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`)
        .join(' | ');
    }
    if (error.response) return `Save failed (HTTP ${error.response.status}).`;
    return 'Network error: could not reach the server.';
  }
  return fallback;
};
