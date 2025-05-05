import React, { useState, useEffect } from 'react';

/**
 * Renders a form for creating an auction for a given product, allowing users to set starting price, reserve price, start and end times, and a description.
 *
 * When a product is provided, the form pre-fills fields with default values based on the product's details. On submission, the form collects and parses the input values, then invokes the provided {@link onSubmit} callback with the auction data. The cancel button triggers the {@link onCancel} callback.
 *
 * @param {Object} props
 * @param {Object} props.product - Product details used to pre-fill the form fields.
 * @param {Function} props.onSubmit - Callback invoked with auction data when the form is submitted.
 * @param {Function} props.onCancel - Callback invoked when the cancel button is clicked.
 *
 * @returns {JSX.Element} The auction creation form component.
 */
export default function AuctionForm({ product, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        productId: '',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default 24h from now
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default 7 days from now
        startPrice: '',
        reservePrice: '',
        description: ''
    });

    // Fill the form with product data when product changes
    useEffect(() => {
        if (product) {
            setForm(prev => ({
                ...prev,
                productId: product.productId,
                startPrice: product.price * 0.5, // Default to 50% of product price
                reservePrice: product.price * 2, // Default to 200% of product price
                description: `Auction for ${product.name}: ${product.description || ''}` // Pre-fill description
            }));
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare payload before sending
        const auctionData = {
            productId: parseInt(form.productId),
            startTime: form.startTime,
            endTime: form.endTime,
            startPrice: parseFloat(form.startPrice), // Note: This field name must match what the API expects
            reservePrice: parseFloat(form.reservePrice),
            description: form.description
        };

        console.log("Sending auction data:", auctionData);
        onSubmit(auctionData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border space-y-4">
            <h2 className="text-xl font-bold mb-4">Auction Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Starting Price ($) (default is 50% original price)</label>
                    <input
                        type="number"
                        name="startPrice" // Important: This needs to match the backend field name
                        value={form.startPrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0.01"
                        required
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Reserve Price ($) (default is 200% original price)</label>
                    <input
                        type="number"
                        name="reservePrice"
                        value={form.reservePrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum price you're willing to accept</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                        type="datetime-local"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create Auction
                </button>
            </div>
        </form>
    );
}