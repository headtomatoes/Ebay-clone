import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductService from '../services/ProductService';

export default function SearchResultsPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const category = queryParams.get('category');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // base URL for searching by keyword
        let url = `/api/public/products/search?query=${encodeURIComponent(query)}`;
        const res = await ProductService.searchProducts(url);

        // filter by category name
        const filtered = res.filter(p =>
          !category || category === 'All Categories' || p.categoryName === category
        );

        // Update product list in state
        setProducts(filtered);
      } catch (err) {
        console.error('Search failed:', err);
      }
    };

    if (query) fetchResults();
  }, [query, category]); // Re-run if query or category changes

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Search Results for: "{query}"</h2>

      {/* Show message if no matching products found */}
      {Array.isArray(products) && products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      {/* Display matching products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <Link
            to={`/products/${product.productId}`}
            key={product.productId}
            className="border rounded p-2 shadow-sm hover:shadow-lg transition duration-200"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover mb-2"
            />
            <div className="font-semibold">{product.name}</div>
            <div className="text-blue-600">${product.price.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{product.categoryName}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
