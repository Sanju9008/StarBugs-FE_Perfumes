import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = '/api/orders';

const getOrders = async () => {
    const token = localStorage.getItem('jwt_token') || Cookies.get('token') || Cookies.get('jwt_token');
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

const orderService = {
    getOrders
};

export default orderService;
