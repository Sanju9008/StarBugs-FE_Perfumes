import axios from 'axios';

const API_URL = '/api/addresses';

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

const addressService = {
  getUserAddresses: async () => {
    try {
      const response = await api.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch addresses' };
    }
  },

  addAddress: async (addressData) => {
    try {
      const response = await api.post(API_URL, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add address' };
    }
  },

  updateAddress: async (id, addressData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update address' };
    }
  },

  deleteAddress: async (addressId) => {
    try {
      await api.delete(`${API_URL}/${addressId}`);
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete address' };
    }
  }
};

export default addressService;
