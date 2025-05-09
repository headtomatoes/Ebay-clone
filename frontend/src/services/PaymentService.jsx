import axios from 'axios';

const API_URL = 'http://localhost:8082/api/payments';

/**
 * Initiates a payment for a given order.
 * @param {number} orderId - The ID of the order to pay for.
 * @param {string} paymentGateway - The chosen payment gateway (e.g., 'STRIPE', 'COD').
 * @param {string} token - The user's authentication token.
 * @returns {Promise<object>} - The payment initiation response from the backend.
 */
const initiatePayment = async (orderId, paymentGateway, token) => {
    if (!token) {
        // It's better to ensure token presence before calling this service
        console.error("initiatePayment called without a token.");
        throw new Error("Authentication token is required to initiate payment.");
    }
    try {
        const response = await axios.post(`${API_URL}/initiate`,
            {
                orderId: parseInt(orderId, 10), // Ensure orderId is a number
                paymentGateway: paymentGateway
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            (error.response ? JSON.stringify(error.response.data) : error.message);
        console.error("Error initiating payment:", errorMessage, error.response || error);
        // Consistently throw an Error object
        throw new Error(errorMessage || "Failed to initiate payment. Please try again.");
    }
};

const PaymentService = {
    initiatePayment
};

export default PaymentService;