import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../services/ProductService';

export default function ProductPage() {
  const [products, setProducts] = useState([]); //State to hold product data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch product data from API
    const fetchProducts = async () => {
      try {
        //Call the real API to get all products
        const data = await ProductService.getAllProducts();
        console.log("🔍 Products loaded:", data);
        setProducts(data);
      } catch (err) {
        //Handle errors during API call
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    //Call the fetch function on component mount
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  //error message if there's a problem
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Loop through each product and create a card */}
        {products.map(product => (
          <Link
            key={product.productId}
            to={`/products/${product.productId}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white"
          >
            {/* Product image */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            {/* Product details */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{product.categoryName}</p>

              {/* Sold out badge */}
              {product.status === 'SOLD_OUT' && (
                <span className="text-red-500 text-xs font-semibold">Sold Out</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
