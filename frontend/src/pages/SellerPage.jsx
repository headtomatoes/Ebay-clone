import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ProductService from '../services/ProductService';

const SellerPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getSellerProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch seller products:', err);
        setError('Failed to load your products');
        setLoading(false);
      }
    };

    fetchProducts();

    // Clear newProductCreated flag if it exists
    if (localStorage.getItem('newProductCreated') === 'true') {
      localStorage.removeItem('newProductCreated');
    }
  }, [user]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.productId !== productId));
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  if (loading) return <div className="p-6">Loading your products...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SOLD_OUT':
        return 'bg-red-100 text-blue-800';
      case 'INACTIVE':
        return 'bg-yellow-100 text-purple-800';
      case 'DRAFT':
        return 'bg-gray-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Welcome message */}
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}</h2>

      {/* Create New Product button */}
      <div className="mb-4">
        <Link to="/seller/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
          Create New Product
        </Link>
      </div>

      {/* Product list */}
      <h2 className="text-2xl font-bold mb-4">Your Products</h2>

      {products.length === 0 ? (
        <p>No products found. Create your first product to get started!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.productId}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-transform duration-200"
            >
              {/* Product Image */}
              <img
                src={product.imageUrl || 'https://placehold.co/300x200?text=No+Image'}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-3"
                onError={(e) => e.target.src = 'https://placehold.co/300x200?text=No+Image'}
              />

              {/* Product Info */}
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-700 mb-2">${parseFloat(product.price).toFixed(2)}</p>
              {/* Status tags */}
              <div className="flex items-center mt-2">
                  <span
                      className={`text-sm px-3 py-1 rounded-full ${getStatusBadgeClass(product.status)}`}
                  >
                    {product.status}
                  </span>
              </div>
              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <Link
                  to={`/seller/products/update/${product.productId}`}
                  className="bg-gray-200 text-gray-800 text-sm font-semibold text-center py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.productId)}
                  className="bg-red-600 text-white text-sm font-semibold text-center py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
                <Link
                  to={`/seller/auction/create/${product.productId}`}
                  className="bg-blue-600 text-white text-sm font-semibold text-center py-2 rounded-md hover:bg-blue-800 transition-colors duration-200"
                >
                  Auction
                </Link>
                <button
                    onClick={() => handleSetStatus(product.productId)}
                    className="bg-green-600 text-white text-sm font-semibold text-center py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Set Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerPage;
