import axios from 'axios';

const API_URL = 'http://localhost:8082/api/reviews';

// Helper to get the auth headers
const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  }
});

// Submit a new review for a product
const createReview = async ({ productId, comment, rating }) => {
  try {
    const response = await axios.post(
      'http://localhost:8082/api/reviews',
      { productId, comment, rating },
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error.response?.data || error.message);
    throw error;
  }
};


// Fetch reviews by product ID
const getReviewsByProduct = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/product/${productId}`,
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export default {
  createReview,
  getReviewsByProduct,
};
