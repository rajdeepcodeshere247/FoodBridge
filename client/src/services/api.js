// Base axios instance — all API calls go through this
import axios from 'axios';

const sanitizeBaseUrl = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value.trim().replace(/\/+$/, '');
};

export const resolveBaseURL = () => {
  const fromEnv = sanitizeBaseUrl(process.env.REACT_APP_API_BASE_URL);
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    const isVercelHost = host.endsWith('.vercel.app');

    // Production fallback so API calls still work if env vars were missed in Vercel.
    if (isVercelHost) {
      return 'https://foodbridge-backend.vercel.app/api';
    }
  }

  // Local development (CRA proxy) fallback.
  return '/api';
};

const baseURL = resolveBaseURL();

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Global error interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
