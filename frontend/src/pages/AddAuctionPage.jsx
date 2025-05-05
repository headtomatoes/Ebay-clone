import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import AuctionService from '../services/AuctionService';

const AddAuctionPage = () => {
  const { id: productId } = useParams(); // Get product ID from URL params
  const navigate = useNavigate();

  // Product details state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auction form state
  const [auctionData, setAuctionData] = useState({
    startingPrice: 0,
    reservePrice: 0, // Optional minimum price to accept
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default 24h from now
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default 7 days from now
    description: ''
  });

  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await ProductService.getProductById(productId);
        setProduct(data);

        // Pre-fill auction data with product information
        setAuctionData(prev => ({
          ...prev,
          startingPrice: data.price*(0.5), // Use 50& product price as default starting price
          reservePrice: data.price*2, // Use 200% product price as default reserve price
          description: `Auction for ${data.name}: ${data.description}`, // Pre-fill description
        }));

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setError('Could not load product details. Please try again.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuctionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auctionPayload = {
        productId: parseInt(productId),
        startingPrice: parseFloat(auctionData.startingPrice),
        reservePrice: parseFloat(auctionData.reservePrice),
        startTime: auctionData.startTime,
        endTime: auctionData.endTime,
        description: auctionData.description
      };

      await AuctionService.createAuction(auctionPayload);
      alert('Auction created successfully!');
      navigate('/auctions'); // Redirect to auctions page
    } catch (err) {
      console.error('Failed to create auction:', err);
      alert('Failed to create auction. Please try again.');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading product details...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create Auction for {product.name}</h1>

        {/* Product Details Card */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
          <div className="flex flex-col md:flex-row">
            {product.imageUrl && (
                <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                  <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-auto object-cover rounded"
                  />
                </div>
            )}
            <div className="md:w-3/4">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-600 mb-2">Regular Price: ${parseFloat(product.price).toFixed(2)}</p>
              <p className="text-gray-700">{product.description}</p>
              {product.categoryName && (
                  <p className="mt-2 text-sm text-gray-500">Category: {product.categoryName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Auction Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Auction Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Starting Price ($) (default is 50% original price)</label>
              <input
                  type="number"
                  name="startingPrice"
                  value={auctionData.startingPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  required
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reserve Price ($) (default is 200% original price)<span className="text-gray-500 text-xs">(Optional)</span></label>
              <input
                  type="number"
                  name="reservePrice"
                  value={auctionData.reservePrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum price you're willing to accept</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                  type="datetime-local"
                  name="startTime"
                  value={auctionData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                  type="datetime-local"
                  name="endTime"
                  value={auctionData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
                name="description"
                value={auctionData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
                type="button"
                onClick={() => navigate('/seller')}
                className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>
  );
};

export default AddAuctionPage;
