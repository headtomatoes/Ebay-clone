import axios from 'axios';

const API_URL = 'http://localhost:8082/api/public/reviews';

// Helper to get the auth headers (for requests that require authentication)
const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  }
});

//  POST /api/public/reviews
const createReview = async ({ productId, comment, rating }) => {
  try {
    const response = await axios.post(
      API_URL,
      { productId, comment, rating },
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error.response?.data || error.message);
    throw error;
  }
};

//  GET /api/public/reviews/product/{productId}/average-rating
const getAverageRating = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/product/${productId}/average-rating`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching average rating:', error.response?.data || error.message);
    throw error;
  }
};

//  GET /api/public/reviews/product/{productId}
const getReviewsByProduct = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/product/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  createReview,
  getReviewsByProduct,
  getAverageRating,
};
