import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../services/mockProduct';
import ProductDetailSection from "../components/product/ProductDetailSection";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.productId === parseInt(productId));
    setProduct(foundProduct);
  }, [productId]);

  if (!product) {
    return <div className="text-center text-red-500 mt-20">Product not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 hover:underline">← Back</button>
      <ProductDetailSection product={product} /> {/* ⬅️ Sử dụng component của bạn */}
    </div>
  );
}
