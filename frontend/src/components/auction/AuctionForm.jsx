import React, { useState } from 'react';

export default function AuctionForm({ onSubmit }) {
  const [form, setForm] = useState({
    productId: '',
    startTime: '',
    endTime: '',
    startPrice: '',
    reservePrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare payload before sending
    const auctionData = {
      productId: parseInt(form.productId),
      startTime: form.startTime + ':00',
      endTime: form.endTime + ':00',
      startPrice: parseFloat(form.startPrice),
      reservePrice: form.reservePrice ? parseFloat(form.reservePrice) : null,
    };

    console.log("Sending auction data:", auctionData);
    onSubmit(auctionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="productId"
        type="number"
        value={form.productId}
        onChange={handleChange}
        placeholder="Product ID"
        className="border p-2 w-full"
        required
      />
      <input
        name="startTime"
        type="datetime-local"
        value={form.startTime}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="endTime"
        type="datetime-local"
        value={form.endTime}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="startPrice"
        type="number"
        value={form.startPrice}
        onChange={handleChange}
        placeholder="Start Price"
        className="border p-2 w-full"
        required
      />
      <input
        name="reservePrice"
        type="number"
        value={form.reservePrice}
        onChange={handleChange}
        placeholder="Reserve Price (optional)"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Create Auction</button>
    </form>
  );
}
