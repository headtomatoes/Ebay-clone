import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const SellerPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  // Fetch seller's products
  useEffect(() => {
    if (user?.id) {
      axios.get(`/api/products/seller/${user.id}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // Handle delete product
  const handleDelete = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      axios.delete(`/api/products/${productId}`)
        .then(() => {
          setProducts(prev => prev.filter(p => p.id !== productId));
        })
        .catch(err => {
          console.error(err);
          alert("Failed to delete product.");
        });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h2>

      <div className="mb-4">
        <Link to="/seller/products/new" className="text-blue-500 hover:underline">
          ➕ Create New Product
        </Link>
      </div>

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
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerPage;
