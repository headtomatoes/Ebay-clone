import axios from 'axios';

const API_URL = '/api/auth'; // Base API endpoint

/**
 * Send a POST request to log in the user
 * @param {Object} credentials - { username, password }
 * @returns {Object} - { token, user }
 * @throws Error - if login fails
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // { token, user }
  } catch (error) {
    // Rethrow error so caller (LoginForm) can handle and display message
    throw error.response?.data || error;
  }
};

/**
 * Send a POST request to register a new user
 * @param {Object} userData - { username, email, password }
 * @returns {Object} - response from server (e.g. user or message)
 * @throws Error - if registration fails
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const setJWTToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
