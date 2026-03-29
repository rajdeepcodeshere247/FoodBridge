import api, { resolveBaseURL } from './api';

export const getCurrentUser = () => api.get('/auth/me');
export const login = (payload) => api.post('/auth/login', payload);
export const register = (payload) => api.post('/auth/register', payload);
export const logout = () => api.post('/auth/logout');

export const loginWithGoogle = (returnPath = '/dashboard') => {
  const safePath = returnPath.startsWith('/') ? returnPath : '/dashboard';
  const redirect = encodeURIComponent(safePath);
  const apiBase = resolveBaseURL();
  const authBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
  window.location.href = `${authBase}/api/auth/google?redirect=${redirect}`;
};
