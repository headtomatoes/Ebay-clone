import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/cart'; // Ensure this is your correct backend URL

// This initial cartApi object can store common headers, but for DELETE with body,
// we'll construct the config more explicitly in the function.
const baseApiConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const setAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        // We'll add the Authorization header directly to the request config
        // to avoid mutating a shared object 'cartApi.headers' if it were used globally by simultaneous requests.
        return `Bearer ${token}`;
    }
    return null; // Return null if no token
};

const getAllCartItems = async () => {
    const authToken = setAuthHeader();
    const config = { ...baseApiConfig };
    if (authToken) {
        config.headers['Authorization'] = authToken;
    }

    try {
        const response = await axios.get(BASE_URL, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
};

const addToCart = async (productId, quantity) => {
    const authToken = setAuthHeader();
    const config = { ...baseApiConfig };
    if (authToken) {
        config.headers['Authorization'] = authToken;
    }

    try {
        const response = await axios.post(`${BASE_URL}/add`, { productId, quantity }, config);
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
};

const removeFromCart = async (productId, quantity) => { // Added quantity parameter
    const authToken = setAuthHeader();
    const config = {
        headers: { ...baseApiConfig.headers }, // Start with base headers
        data: { // Add the request body here
            productId: productId,
            quantity: quantity
        }
    };
    if (authToken) {
        config.headers['Authorization'] = authToken;
    }

    if (typeof productId === 'undefined' || typeof quantity === 'undefined') {
        const errorMsg = "productId and quantity are required for removeFromCart.";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    if (quantity <= 0) {
        const errorMsg = "Quantity must be a positive number to remove.";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        // For DELETE with body, the config object (which includes 'data' and 'headers') is the second argument.
        const response = await axios.delete(`${BASE_URL}/remove`, config);
        return response.data; // Backend returns Void, so data might be undefined/null
    } catch (error) {
        console.error('Error removing from cart:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message || 'Failed to remove item from cart' };
    }
};

const clearCart = async () => {
    const authToken = setAuthHeader();
    const config = { ...baseApiConfig };
    if (authToken) {
        config.headers['Authorization'] = authToken;
    }

    try {
        // For DELETE operations that don't have a body but might need auth headers.
        const response = await axios.delete(`${BASE_URL}/clear`, config);
        return response.data;
    } catch (error) {
        console.error('Error clearing cart:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message };
    }
};

export default {
    getAllCartItems,
    addToCart,
    removeFromCart,
    clearCart,
};
