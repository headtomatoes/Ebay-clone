import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import AuctionService from '../services/AuctionService';
import AuctionForm from '../components/auction/AuctionForm';

const AddAuctionPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // Product details state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await ProductService.getProductById(productId);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setError('Could not load product details. Please try again.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Handle form submission
  const handleCreateAuction = async (auctionData) => {
    try {
      await AuctionService.createAuction(auctionData);
      alert('Auction created successfully!');
      navigate('/auctions');
    } catch (err) {
      console.error('Failed to create auction:', err);
      alert(`Failed to create auction: ${err.response?.data?.message || err.message}`);
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

        {/* Auction Form Component */}
        <AuctionForm
            product={product}
            onSubmit={handleCreateAuction}
            onCancel={() => navigate('/seller')}
        />
      </div>
  );
};

export default AddAuctionPage;
