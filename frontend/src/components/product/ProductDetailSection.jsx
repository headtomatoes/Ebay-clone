import React from 'react';
import {handleAddToCart} from "../../services/CartService.jsx"; // Adjust the import path as needed
export default function ProductDetailSection({ product }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Image Gallery + Main Image */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* Main Image */}
        <div>

          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-[400px] h-[400px] object-cover rounded shadow"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-semibold text-red-600 mb-4">${product.price}</p>
        <p className="text-gray-700 text-sm mb-6">{product.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-[250px]">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Buy It Now</button>
          <button
              onClick={handleAddToCart}
              className="border border-blue-600 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded">Add to Cart</button>
          <button className="text-blue-600 underline text-sm">Add to Watchlist</button>
        </div>
      </div>
    </div>
  );
}