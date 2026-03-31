import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE,
});

// Automatically add token to every request if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const register = (email, password) =>
  api.post('/auth/register', { email, password })

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

// URLs
export const shortenUrl = (original_url, custom_alias = null, expires_at = null) =>
  api.post('/shorten', { original_url, custom_alias, expires_at });

export const getDashboard = () =>
  api.get('/dashboard/');

export const getAnalytics = (short_code) =>
  api.get(`/analytics/${short_code}`);

export const getQRCode = (short_code) =>
  `${API_BASE}/qr/${short_code}`;

export default api;
