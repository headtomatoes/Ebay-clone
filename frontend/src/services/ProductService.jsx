import axios from 'axios';

const API_URL = 'http://localhost:8082/api/products';

// Create axios instance with base configuration
const productApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all products
const getAllProducts = async () => {
  // Retrieve token from localStorage and attach it to the request
  const token = localStorage.getItem('token');
  if (token) {
    productApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await productApi.get('');
    return response.data;
  } catch (error) {
    console.error('Get Products Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Get a product detail by product ID
const getProductById = async (id) => {
  const token = localStorage.getItem('token');
  if (token) {
    productApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await productApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Product Detail Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Get all products that belong to a specific category
const getProductsByCategory = async (categoryName) => {
  const token = localStorage.getItem('token');
  if (token) {
    productApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await productApi.get(`/category/${categoryName}`);
    return response.data;
  } catch (error) {
    console.error('Get Category Products Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Create a new product
const createProduct = async (productData) => {
  const token = localStorage.getItem("token");
  if (token) {
    productApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await productApi.post("", productData); // POST /api/products
    return response.data;
  } catch (error) {
    console.error("Create Product Error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Delete a product ...
const deleteProduct = async (productId) => {
  const token = localStorage.getItem("token");
  if (token) {
    productApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  try {
    await productApi.delete(`/${productId}`);
  } catch (error) {
    console.error("Delete Product Error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Export as default service
export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  deleteProduct,
};
