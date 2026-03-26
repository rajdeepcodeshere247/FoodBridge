// Base axios instance — all API calls go through this
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',     // proxied to http://localhost:5000 via package.json "proxy"
  withCredentials: true, // send session cookies
  headers: { 'Content-Type': 'application/json' }
});

// Global error interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
