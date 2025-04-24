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
        console.log("AuthService: Attempting registration with data:", userData);
        const response = await api.post('/signup', userData);
        console.log("AuthService: Registration successful:", response.data);
        return response.data;
    } catch (error) {
        // Log detailed error information
        console.error(
            "AuthService: Registration Error:",
            error.response?.status, // Status code
            error.response?.data, // Backend error message/object
            error.message // Axios or network error message
        );
        // Re-throw a structured error for the component to catch
        throw error.response?.data || { message: error.message || 'Registration failed. Network error or server unavailable.' };
    }
};

// Login user and get token + user data with roles
export const loginUser = async (credentials) => {
    try {
        console.log("AuthService: Attempting login with credentials:", credentials.username);
        const response = await api.post('/signin', credentials);
        console.log("AuthService: Login successful:", response.data);
        return response.data; // Expects { accessToken, id, username, email, roles }
    } catch (error) {
        console.error(
            "AuthService: Login Error:",
            error.response?.status,
            error.response?.data,
            error.message
        );
        throw error.response?.data || { message: error.message || 'Login failed. Network error or server unavailable.' };
    }
};

// Function to set auth token for requests
export const setAuthToken = (token) => {
    if (token) {
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