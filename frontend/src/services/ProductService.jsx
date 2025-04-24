// src/services/ProductService.jsx
import axios from 'axios';

// Base URL cho API sản phẩm
const API_URL = 'http://localhost:8082/api/products';

// Tạo axios instance riêng cho sản phẩm
const productApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm lấy tất cả sản phẩm
export const fetchAllProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('📦 Token used in ProductService:', token); // Debug token

    if (!token) throw new Error('No token found in localStorage');

    const response = await productApi.get('/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Fetch Products Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Something went wrong' };
  }
};
