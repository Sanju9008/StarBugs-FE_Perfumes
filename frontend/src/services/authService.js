import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = '/api/auth';
const USER_API_URL = '/api/users';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to check token validity string
const isValidToken = (token) => {
  return token && typeof token === 'string' && token.trim() !== '' && token !== 'null' && token !== 'undefined';
};

// Helper to clear token from everywhere
const clearAuthFromEverywhere = () => {
  try {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove('jwt_token', { path: '/' });
    Cookies.set('jwt_token', '', { expires: -1, path: '/' });
    document.cookie = "jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete api.defaults.headers.common['Authorization'];
  } catch (e) {
    console.error('Error clearing storage/cookies:', e);
  }
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token') || Cookies.get('jwt_token');
    if (isValidToken(token)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleUnauthorizedRedirect = () => {
  const publicPaths = ['/login', '/register', '/admin/login', '/admin/register', '/verify'];
  if (!publicPaths.includes(window.location.pathname)) {
    clearAuthFromEverywhere();
    if (window.location.pathname.startsWith('/admin')) {
      window.location.replace('/admin/login');
    } else {
      window.location.replace('/login');
    }
  }
};

// Response interceptor to catch 401/403 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      handleUnauthorizedRedirect();
    }
    return Promise.reject(error);
  }
);

// Global axios interceptor as well for any standalone service calls
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      handleUnauthorizedRedirect();
    }
    return Promise.reject(error);
  }
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

  registerAdmin: async (adminData) => {
    try {
      const response = await api.post(`${API_URL}/register-admin`, adminData);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw { message: 'Network error: Cannot reach the server. It might still be starting up.' };
      }
      throw error.response?.data || { message: 'Admin registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post(`${API_URL}/login`, credentials);
      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        Cookies.set('jwt_token', token, { expires: 7, path: '/' });
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
      console.error('Logout API call error:', error);
    } finally {
      clearAuthFromEverywhere();
      if (window.location.pathname.startsWith('/admin')) {
        window.location.replace('/admin/login');
      } else {
        window.location.replace('/login');
      }
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
    const token = localStorage.getItem('jwt_token') || Cookies.get('jwt_token');
    return isValidToken(token);
  }
};

export default authService;
