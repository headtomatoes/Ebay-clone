import React from 'react';

export default function ProductDetailSection({ product }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Image Gallery + Main Image */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Thumbnail Column */}
        <div className="flex md:flex-col gap-2">
          {[product.image_url, product.image_url, product.image_url].map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="thumb"
              className="w-16 h-16 object-cover rounded border hover:scale-105 transition"
            />
          ))}
        </div>

        {/* Main Image */}
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-[400px] h-[400px] object-cover rounded shadow"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-sm text-gray-600 mb-4">Condition: <span className="uppercase">{product.status}</span></p>
        <p className="text-2xl font-semibold text-red-600 mb-4">${product.price}</p>
        <p className="text-gray-700 text-sm mb-6">{product.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-[250px]">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Buy It Now</button>
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded">Add to Cart</button>
          <button className="text-blue-600 underline text-sm">Add to Watchlist</button>
        </div>
      </div>
    </div>
  );
}
