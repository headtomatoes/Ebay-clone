import axios from 'axios';

const API_URL = 'http://localhost:8082/api/categories';

const categoryApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all categories
const getAllCategories = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    categoryApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await categoryApi.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export default {
  getAllCategories,
};
