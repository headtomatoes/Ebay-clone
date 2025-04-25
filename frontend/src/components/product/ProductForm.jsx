// src/components/product/ProductForm.jsx

import React, { useState } from 'react';

export default function ProductForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      categoryId: parseInt(form.categoryId),
    };
    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" onChange={handleChange} value={form.name} placeholder="Name" className="border p-2 w-full" />
      <input name="description" onChange={handleChange} value={form.description} placeholder="Description" className="border p-2 w-full" />
      <input name="price" onChange={handleChange} value={form.price} type="number" placeholder="Price" className="border p-2 w-full" />
      <input name="stock" onChange={handleChange} value={form.stock} type="number" placeholder="Stock Quantity" className="border p-2 w-full" />
      <input name="imageUrl" onChange={handleChange} value={form.imageUrl} placeholder="Image URL" className="border p-2 w-full" />
      <input name="categoryId" onChange={handleChange} value={form.categoryId} placeholder="Category ID" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Submit</button>
    </form>
  );
}
