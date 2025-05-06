import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/public/auctions';

/**
   * Create a new auction
   * @param {Object} auctionData - The auction form data (productId, startTime, etc.)
   * @returns {Promise<Object>} - The created auction details
   */
const createAuction = async (auctionData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(BASE_URL, auctionData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const getAllAuctions = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

/**
   * Get full details of a specific auction by ID
   * @param {number|string} auctionId - The auction ID to fetch
   * @returns {Promise<Object>} - Full details of the auction
   */

const getAuctionById = async (auctionId) => {
  const response = await axios.get(`${BASE_URL}/${auctionId}`);
  return response.data;
};

const AuctionService = {
  createAuction,
  getAllAuctions,
  getAuctionById,
};

export default AuctionService;
