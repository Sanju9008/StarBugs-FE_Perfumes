import axios from 'axios';

const API_URL = '/api/payments';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

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

const paymentService = {
  createOrder: async (addressId) => {
    try {
      const response = await api.post(`${API_URL}/create-order`, { addressId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  verifyPayment: async (verificationData) => {
    try {
      const response = await api.post(`${API_URL}/verify`, verificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify payment' };
    }
  }
};

export default paymentService;
