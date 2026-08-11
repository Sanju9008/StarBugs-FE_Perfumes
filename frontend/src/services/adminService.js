import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token') || Cookies.get('jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const adminService = {
  // ─── Product Management ──────────────────────────────────────────────────
  addProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE}/products`, productData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await axios.put(`${API_BASE}/products/${productId}`, productData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE}/products/${productId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },

  // ─── User Management ─────────────────────────────────────────────────────
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE}/users`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_BASE}/users/${userId}`, userData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE}/users/${userId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  // ─── Business Analytics ──────────────────────────────────────────────────
  getDailyAnalytics: async (date) => {
    try {
      const params = date ? { date } : {};
      const response = await axios.get(`${API_BASE}/admin/analytics/daily`, {
        headers: getAuthHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch daily analytics' };
    }
  },

  getMonthlyAnalytics: async (year, month) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (month) params.month = month;
      const response = await axios.get(`${API_BASE}/admin/analytics/monthly`, {
        headers: getAuthHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch monthly analytics' };
    }
  },

  getYearlyAnalytics: async (year) => {
    try {
      const params = year ? { year } : {};
      const response = await axios.get(`${API_BASE}/admin/analytics/yearly`, {
        headers: getAuthHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch yearly analytics' };
    }
  },

  getOverallAnalytics: async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/analytics/overall`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch overall analytics' };
    }
  },

  // ─── Order Status Management ─────────────────────────────────────────────
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.put(`${API_BASE}/admin/orders/${orderId}/status`, { status }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  }
};

export default adminService;
