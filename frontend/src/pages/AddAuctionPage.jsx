import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuctionForm from '../components/auction/AuctionForm';

export default function AddAuctionPage() {
  const navigate = useNavigate();

  const handleCreateAuction = async (auctionData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as a seller to create an auction.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8082/api/public/auctions',
        auctionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Auction created successfully!');
      //Redirect to auction detail page
      navigate(`/auctions/${response.data.id}`);
    } catch (err) {
      console.error('Error creating auction:', err);
      const backendMsg = err.response?.data?.message || err.message;
      alert(`Failed to create auction: ${backendMsg}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Create New Auction</h1>
      <AuctionForm onSubmit={handleCreateAuction} />
    </div>
  );
}
