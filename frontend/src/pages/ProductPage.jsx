import React from 'react';
import { Link } from 'react-router-dom';
import { mockProducts } from '../services/mockProduct';

export default function ProductPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Loop through all mock products */}
        {mockProducts.map(product => (
          <Link
            key={product.productId}
            to={`/products/${product.productId}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white"
          >
            {/* Product Image */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            {/* Product Info Block */}
            <div className="p-4">
              {/* Product Name */}
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>

              {/* Product Price */}
              <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>

              {/* Product Category */}
              <p className="text-xs text-gray-500 mt-1">{product.categoryName}</p>

              {/* Sold Out Status (if applicable) */}
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
