import axios from 'axios';

// Define the base URL for the order API
const BASE_URL = 'http://localhost:8082/api/orders';

// Helper function to get the Authorization header object
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Function to get all orders
const getAllOrders = async () => {
    try {
        const response = await axios.get(BASE_URL, { headers: getAuthHeaders() });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message || 'Failed to fetch orders.' };
    }
};

// Function to create a new order from all items in the user's cart
const createOrderFromCart = async () => {
    try {
        // The backend endpoint /from-cart/all implies it uses the authenticated user's cart
        // and doesn't need a request body for cart items or user ID.
        const response = await axios.post(`${BASE_URL}/from-cart/all`, {}, { headers: getAuthHeaders() });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error creating order from cart:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message || 'Failed to create order.' };
    }
};

// This function might be intended for creating an order from specific cart item IDs
// if your backend supports it via POST /from-cart with a body.
// Keep if needed, or remove if /from-cart/all is the only way.
const createOrderFromCartId = async (cartItemIds) => { // Assuming cartItemIds is an array of IDs
    try {
        const response = await axios.post(`${BASE_URL}/from-cart`, cartItemIds, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating order from specific cart items:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message || 'Failed to create order from specific items.' };
    }
};

// Function to cancel an order
const cancelOrder = async (orderId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${orderId}`, { headers: getAuthHeaders() });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error cancelling order:', error.response?.data || error.message);
        throw error.response?.data || { message: error.message || 'Failed to cancel order.' };
    }
};

const getOrderById = async (orderId) => {
    if (!orderId) {
        // It's good practice to throw an error or return a specific value if orderId is missing.
        // The OrderDetailPage already checks for !orderId before calling.
        console.error("Order ID is required to fetch order details.");
        throw new Error("Order ID is required.");
    }
    try {
        // Corrected to use axios, BASE_URL, and include authentication headers
        const response = await axios.get(`${BASE_URL}/${orderId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        // Log the detailed error from Axios if available
        const errorMessage = error.response?.data?.message || error.response?.data || (error.isAxiosError ? error.message : 'An unknown error occurred');
        console.error(`Error fetching order details for order ${orderId}:`, errorMessage, error.response || error);
        // Re-throw a more specific error message or the error object
        throw new Error(`Failed to load order details for order ${orderId}. Backend error: ${errorMessage}`);
    }
};




// Export the functions to be used in other parts of the application
export default {
    getAllOrders,
    createOrderFromCart, // This will be used by CheckoutPage
    createOrderFromCartId, // Keep if you have a use case for creating orders from specific cart items
    cancelOrder,
    getOrderById,
};

