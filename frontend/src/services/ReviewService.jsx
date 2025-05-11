import axios from 'axios';

const API_URL = 'http://localhost:8082/api/reviews';

// Helper to get the auth headers (for other requests that require authentication)
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
      `${API_URL}/product/public/${productId}`,
      { productId, comment, rating },
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error.response?.data || error.message);
    throw error;
  }
};

// Get average rating for a product (no auth needed)
const getAverageRating = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/product/public/${productId}/average-rating`
      // No auth headers here because the endpoint doesn't require authentication
    );
    console.log('Average rating response:', response.data);  // Log the response for debugging
    return response.data;  // Adjust based on the actual backend response structure
  } catch (error) {
    console.error('Error fetching average rating:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch reviews by product ID
const getReviewsByProduct = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/product/public/${productId}`
      // No auth needed
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
