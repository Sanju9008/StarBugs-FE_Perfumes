import axios from 'axios';

const API_URL = '/api/users';

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

const userService = {
  getCurrentUser: async () => {
    try {
      const response = await api.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  },

  updateUser: async (id, updateData) => {
    try {
      const response = await api.post(`${API_URL}/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  }
};

export default userService;
