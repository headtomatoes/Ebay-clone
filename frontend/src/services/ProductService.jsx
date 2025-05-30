import axios from 'axios';

const API_URL = 'http://localhost:8082/api/public/products';

// Create axios instance with base configuration
const productApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper: Set Authorization token if available
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    productApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Get all products
const getAllProducts = async () => {
  setAuthHeader();
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
  setAuthHeader();
  try {
    const response = await productApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Product Detail Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Create a new product
const createProduct = async (productData) => {
  setAuthHeader();
  try {
    const response = await productApi.post('', productData);
    return response.data;
  } catch (error) {
    console.error('Create Product Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Update an existing product
const updateProduct = async (productId, productData) => {
  setAuthHeader();
  try {
    const response = await productApi.put(`/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Update Product Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Delete a product by ID
const deleteProduct = async (productId) => {
  setAuthHeader();
  try {
    await productApi.delete(`/${productId}`);
  } catch (error) {
    console.error('Delete Product Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// Get products created by a specific seller
const getSellerProducts = async () => {
  setAuthHeader();
  try {
    const response = await productApi.get('/seller');
    return response.data;
  } catch (error) {

    console.error('Get Seller Products Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

// change the status of a product
const changeProductStatus = async (productId, status) => {
  setAuthHeader();
  try {
    const response = await productApi.put(`/${productId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Change Product Status Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }

}


// Search products
const searchProducts = async (url) => {
  const fullUrl = `http://localhost:8082${url}`;
  const res = await fetch(fullUrl);
  if (!res.ok) throw new Error('Failed to search');
  return await res.json();
};

// Export all service functions
export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getSellerProducts,
};