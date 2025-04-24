import axios from 'axios';
// Define the base URL for the API
const API_URL = 'http://localhost:8082/api/auth';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/signup', userData);
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        throw error.response?.data || { message: error.message || 'Registration failed' };
    }
};

// Login user and get token + user data with roles
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/signin', credentials);
        return response.data; // Contains token, user details, and roles
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error.response?.data || { message: error.message || 'Login failed' };
    }
};

// Function to set auth token for requests
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Export the service object
const authService = {
    registerUser,
    loginUser,
    setAuthToken
};

export default authService;

