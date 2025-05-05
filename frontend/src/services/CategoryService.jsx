import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/public/categories';
const PRODUCT_API = 'http://localhost:8082/api/public/products';

const getAllCategories = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios.get(BASE_URL, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

const getProductsByCategoryId = async (categoryId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios.get(`${PRODUCT_API}?categoryId=${categoryId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export default {
  getAllCategories,
  getProductsByCategoryId,
};