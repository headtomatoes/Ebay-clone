import axios from 'axios';

const API_URL = 'http://localhost:8082/api/user';

export const getProfile = async (token) => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateProfile = async (token, data) => {
  const res = await axios.put(`${API_URL}/me`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const changePassword = async (token, data) => {
  const res = await axios.post(`${API_URL}/change-password`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};