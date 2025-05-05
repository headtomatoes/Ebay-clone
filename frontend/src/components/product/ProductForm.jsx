import React, { useState, useEffect } from 'react';

/**
 * React component for creating or updating a product entry via a controlled form.
 *
 * If `initialData` is provided, the form fields are pre-filled for editing an existing product; otherwise, the form is blank for creating a new product. On submission, the form data is normalized and passed to the provided `onSubmit` callback.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback invoked with the product data when the form is submitted.
 * @param {Object} [props.initialData] - Optional initial product data for editing mode.
 *
 * @returns {JSX.Element} The product form component.
 */
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
      <input name="name" onChange={handleChange} value={form.name} placeholder="Name" className="border p-2 w-full" />
      <input name="description" onChange={handleChange} value={form.description} placeholder="Description" className="border p-2 w-full" />
      <input name="price" onChange={handleChange} value={form.price} type="number" placeholder="Price" className="border p-2 w-full" />
      <input name="stock" onChange={handleChange} value={form.stock} type="number" placeholder="Stock Quantity" className="border p-2 w-full" />
      <input name="imageUrl" onChange={handleChange} value={form.imageUrl} placeholder="Image URL" className="border p-2 w-full" />
       <select
          name="categoryId"
          onChange={handleChange}
          value={form.categoryId}
          className="border p-2 w-full"
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
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Submit</button>
    </form>
  );
}