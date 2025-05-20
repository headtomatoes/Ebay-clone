import React, { useState, useEffect } from 'react';

// ProductForm component for both creating and updating products
export default function ProductForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: '',
  });

  // Pre-fill the form when initialData is available (used for update mode)
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        stock: initialData.stockQuantity || '',
        imageUrl: initialData.imageUrl || '',
      });
    }
  }, [initialData]);

  //Handle changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stock),
      categoryId: parseInt(form.categoryId),
    };
    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-medium">Name</label>
        <input
          name="name"
          onChange={handleChange}
          value={form.name}
          placeholder="Name"
          className="border p-2 flex-1 rounded"
        />
      </div>

      {/* Description */}
      <div className="flex items-start gap-4">
        <label className="w-32 font-medium pt-2">Description</label>
        <textarea
          name="description"
          onChange={handleChange}
          value={form.description}
          placeholder="Description"
          rows="2"
          className="border p-2 flex-1 rounded"
        />
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-medium">Price ($)</label>
        <input
          name="price"
          onChange={handleChange}
          value={form.price}
          type="number"
          className="border p-2 flex-1 rounded"
        />
      </div>

      {/* Stock */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-medium">Stock</label>
        <input
          name="stock"
          onChange={handleChange}
          value={form.stock}
          type="number"
          className="border p-2 flex-1 rounded"
        />
      </div>

      {/* Image URL */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-medium">Image URL</label>
        <input
          name="imageUrl"
          onChange={handleChange}
          value={form.imageUrl}
          placeholder="Image URL"
          className="border p-2 flex-1 rounded"
        />
      </div>

      {/* Category */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-medium">Category</label>
        <select
          name="categoryId"
          onChange={handleChange}
          value={form.categoryId}
          className="border p-2 flex-1 rounded"
        >
          <option value="">Select Category</option>
          <option value="1">Electronics</option>
          <option value="2">Books</option>
          <option value="3">Clothing</option>
          <option value="4">Home & Kitchen</option>
          <option value="5">Sports</option>
          <option value="6">Toys</option>
          <option value="7">Beauty</option>
          <option value="8">Automotive</option>
          <option value="9">Garden</option>
          <option value="10">Music</option>
        </select>
      </div>

      {/* Submit button */}
      <div className="text-center">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full">
          Submit
        </button>
      </div>
    </form>
  );
}