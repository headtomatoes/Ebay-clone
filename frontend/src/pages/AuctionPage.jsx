import React, { useEffect, useState } from 'react';
import AuctionService from '../services/AuctionService';
import ProductService from '../services/ProductService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

/**
 * Displays a list of auctions with associated product details, allowing users to view and interact with active and past auctions.
 *
 * Fetches auction data and related product information on mount, handles loading and error states, and renders each auction in a responsive grid with status, time remaining, and key details. Provides navigation to individual auction pages.
 *
 * @returns {JSX.Element} The rendered auction page component.
 *
 * @remark If product details fail to load for some auctions, those auctions are still displayed with limited information.
 */
export default function AuctionPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await AuctionService.getAllAuctions();
        setAuctions(data.content || data);

        // After getting auctions, fetch product details for each
        const productIds = (data.content || data).map(auction => auction.productId);
        fetchProductDetails(productIds);
      } catch (err) {
        console.error('Failed to fetch auctions:', err);
        setError(err.message || 'Failed to load auctions.');
        setLoading(false);
      }
    };

    const fetchProductDetails = async (productIds) => {
      try {
        const uniqueProductIds = [...new Set(productIds)]; // Remove duplicates
        const productData = {};

        // Fetch details for each product
        await Promise.all(
            uniqueProductIds.map(async (id) => {
              try {
                const product = await ProductService.getProductById(id);
                productData[id] = product;
              } catch (err) {
                console.error(`Failed to fetch product ${id}:`, err);
                // Continue with other products even if one fails
              }
            })
        );

        setProductDetails(productData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Format date for display
  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  // Calculate time remaining
  const getTimeRemaining = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const timeDiff = end - now;

    if (timeDiff <= 0) return "Ended";

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'ENDED_MET_RESERVE':
        return 'bg-purple-100 text-purple-800';
      case 'ENDED_NO_RESERVE':
      case 'ENDED_NO_BIDS':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading auctions...</p>
        </div>
      </div>
  );

  return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Active Auctions</h1>

        {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
        )}

        {auctions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-600">No auctions available at the moment.</p>
              <p className="mt-2">Check back later or create your own auction!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => {
                const product = productDetails[auction.productId] || {};

                return (
                    <div key={auction.id} className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
                      {/* Product Image */}
                      <div className="h-48 overflow-hidden bg-gray-100">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name || 'Product image'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image available
                            </div>
                        )}
                      </div>

                      {/* Auction Content */}
                      <div className="p-4">
                        {/* Status Badge */}
                        <div className="flex justify-between items-start mb-2">
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(auction.status)}`}
                    >
                      {auction.status}
                    </span>

                          {/* Time Remaining Badge */}
                          {auction.status === 'ACTIVE' && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {getTimeRemaining(auction.endTime)}
                      </span>
                          )}
                        </div>

                        {/* Product Name */}
                        <h2 className="text-lg font-bold mb-2 text-gray-800">
                          {product.name || `Product #${auction.productId}`}
                        </h2>

                        {/* Auction Details */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Current Bid:</span>
                            <span className="font-bold text-blue-600">${auction.currentPrice?.toFixed(2) || '0.00'}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Starting Bid:</span>
                            <span>${auction.startPrice?.toFixed(2) || '0.00'}</span>
                          </div>

                          {auction.highestBidAmount && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Highest Bid:</span>
                                <span className="font-semibold">${auction.highestBidAmount.toFixed(2)}</span>
                              </div>
                          )}

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Bids:</span>
                            <span>{auction.totalBids}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Category:</span>
                            <span>{product.categoryName || 'N/A'}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Ends:</span>
                            <span>{formatDateTime(auction.endTime)}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-4">
                          <Link
                              to={`/auctions/${auction.id}`}
                              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full"
                          >
                            {auction.status === 'ACTIVE' ? 'Bid Now' : 'View Details'}
                          </Link>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}
