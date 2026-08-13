import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

const productService = {
  getAllProducts: async () => {
    try {
      const token = localStorage.getItem('jwt_token');

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getAllCategories: async () => {
    try {
      const token = localStorage.getItem('jwt_token');

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

export default productService;