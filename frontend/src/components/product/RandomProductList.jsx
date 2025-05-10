import React, { useEffect, useState } from 'react';
import ProductService from '../../services/ProductService';
import { Link } from 'react-router-dom';

export default function RandomProductList({ title = "You May Also Like", excludeId, count = 5 }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchRandom = async () => {
      try {
        const all = await ProductService.getAllProducts();
        let filtered = all;
        if (excludeId) {
          filtered = all.filter(p => p.productId !== excludeId);
        }
        const random = filtered.sort(() => 0.5 - Math.random()).slice(0, count);
        setProducts(random);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchRandom();
  }, [excludeId, count]);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {products.map(product => (
          <Link
            key={product.productId}
            to={`/products/${product.productId}`}
            className="border rounded-lg hover:shadow transition"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover rounded-t"
            />
            <div className="p-2 text-center">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-sm text-red-600 font-semibold">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
