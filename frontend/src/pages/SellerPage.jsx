import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ProductService from '../services/ProductService'; // Import ProductService for cleaner API calls

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

  // Handle product deletion
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

  return (
      <div className="p-6">
        {/* Welcome message */}
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h2>

        {/* Link to Create New Product */}
        <div className="mb-4">
          <Link to="/seller/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create New Product
          </Link>
        </div>

        {/* Seller's products list */}
        <h3 className="text-xl mb-4">Your Products</h3>
        {products.length === 0 ? (
            <p>No products found. Create your first product to get started!</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                  <div key={product.productId} className="border rounded-lg p-4 shadow-sm">
                    <img
                        src={product.imageUrl || 'https://placehold.co/300x200?text=No+Image'}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-700 mb-2">${parseFloat(product.price).toFixed(2)}</p>

                    <div className="flex space-x-2 mt-4">
                      <Link
                          to={`/seller/products/update/${product.productId}`}
                          className="flex-1 bg-gray-200 text-gray-800 text-center py-2 rounded hover:bg-gray-300"
                      >
                        Edit
                      </Link>
                      <button
                          onClick={() => handleDelete(product.productId)}
                          className="flex-1 bg-red-600 text-white text-center py-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <Link
                          to={`/seller/auction/create/${product.productId}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                      >
                        Auction
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default SellerPage;