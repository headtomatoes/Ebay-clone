import React, { useEffect, useState } from 'react';
import AuctionService from '../services/AuctionService';
import { Link } from 'react-router-dom';

export default function AuctionPage() {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await AuctionService.getAllAuctions();
        setAuctions(data.content || data);
      } catch (err) {
        console.error('Failed to fetch auctions:', err);
        setError(err.message || 'Failed to load auctions.');
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">All Auctions</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <div className="grid gap-4">
        {auctions.map((auction) => (
          <div key={auction.id} className="border rounded p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Product ID: {auction.productId}</h2>
            <p>Start Time: {auction.startTime}</p>
            <p>End Time: {auction.endTime}</p>
            <p>Start Price: ${auction.startPrice}</p>
            <p>Current Price: ${auction.currentPrice}</p>
            <p>Status: {auction.status}</p>
            {auction.highestBidAmount && <p>Highest Bid: ${auction.highestBidAmount}</p>}
            <p>Total Bids: {auction.totalBids}</p>

            <Link to={`/auctions/${auction.id}`}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
