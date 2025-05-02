import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ProductService from '../services/ProductService'; // Import ProductService for cleaner API calls

const SellerPage = () => {
  const { user } = useAuth(); // Get current logged-in user
  const [products, setProducts] = useState([]); // State to store seller's products

  // Fetch products created by the seller
  useEffect(() => {
    const fetchProducts = async () => {
      if (user?.id) {
        try {
          const token = localStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await axios.get(`/api/products/seller/${user.id}`, { headers });
          setProducts(res.data);
        } catch (err) {
          console.error('Failed to fetch seller products:', err);
        }
      }
    };

    fetchProducts(); // 👉 Always fetch when user is available

    // 👉 If a new product was just created, fetch again to update the list
    if (localStorage.getItem('newProductCreated') === 'true') {
      fetchProducts();
      localStorage.removeItem('newProductCreated'); // 👉 Clear the flag after fetching
    }
  }, [user]);

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(productId); // Call API to delete product
        setProducts(prev => prev.filter(p => p.id !== productId)); // Remove product from local list
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  return (
    <div className="p-6">
      {/* Welcome message */}
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h2>

      {/* Link to Create New Product */}
      <div className="mb-4">
        <Link to="/seller/products/new" className="text-blue-500 hover:underline">
          ➕ Create New Product
        </Link>
      </div>

      {/* Seller's products list */}
      <h3 className="text-xl mb-2">Your Products</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-3">
          {products.map(product => (
            <li key={product.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <strong>{product.name}</strong> – ${product.price}
              </div>
              <div className="flex space-x-4">
                {/* Edit button (placeholder for future) */}
                <Link
                  to={`/seller/products/edit/${product.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerPage;