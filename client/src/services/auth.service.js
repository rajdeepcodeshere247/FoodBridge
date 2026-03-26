// Auth API calls
import api from './api';

export const getCurrentUser = () => api.get('/auth/me');
export const logout = () => api.get('/auth/logout');
// Login is done by redirecting to: /api/auth/google
export const loginWithGoogle = () => { window.location.href = '/api/auth/google'; };
