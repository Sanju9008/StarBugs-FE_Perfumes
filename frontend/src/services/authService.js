import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = '/api/auth';
const USER_API_URL = '/api/users';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw { message: 'Network error: Cannot reach the server. It might still be starting up.' };
      }
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post(`${API_URL}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('jwt_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
    try {
      await api.post(`${API_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.get(`${API_URL}/verify`, { params: { token } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Verification failed' };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get(`${USER_API_URL}/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  isAuthenticated: () => {
      return !!localStorage.getItem('jwt_token');
  }
};

export default authService;
