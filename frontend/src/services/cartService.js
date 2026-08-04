import axios from 'axios';

const API_URL = '/api/cart';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

const cartService = {
  getCart: async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axios.post(`${API_URL}/add`, {
        productId,
        quantity
      }, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      const response = await axios.put(`${API_URL}/${cartItemId}`, {
        quantity
      }, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      const response = await axios.delete(`${API_URL}/${cartItemId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
};

export default cartService;
