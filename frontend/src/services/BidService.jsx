import axios from 'axios';

// Base URL
const BASE_URL = 'http://localhost:8082/api/public/auctions';

const BidService = {
  placeBid: async (auctionId, bidAmount) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/${auctionId}/bids`,
      { bidAmount: parseFloat(bidAmount) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

// Return the bid response
    return response.data;
  },

   /**
   * Get the bid history for a specific auction
   * @param {number|string} auctionId - The ID of the auction
   * @returns {Promise<Array>} - A list of bid records
   */
  getBidHistory: async (auctionId) => {
    const response = await axios.get(`${BASE_URL}/${auctionId}/bids`);
    return response.data.content || response.data;
  },
};

export default BidService;
