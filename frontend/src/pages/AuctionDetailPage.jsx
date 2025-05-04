import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BidService from '../services/BidService';
import BidHistory from '../components/auction/BidHistory';

export default function AuctionDetailPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load auction info + bids
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auctionRes = await fetch(`http://localhost:8082/api/public/auctions/${id}`);
        const auctionData = await auctionRes.json();
        setAuction(auctionData);

        const bidData = await BidService.getBidHistory(id);
        setBids(bidData);
      } catch (err) {
        console.error(err);
        setError('Failed to load auction.');
      }
    };

    fetchData();
  }, [id]);

  const handlePlaceBid = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setMessage('You must be logged in to bid.');

    try {
      await BidService.placeBid(id, bidAmount);
      setMessage('✅ Bid placed!');
      setBidAmount('');
      const updatedBids = await BidService.getBidHistory(id);
      setBids(updatedBids);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setMessage(`❌ ${msg}`);
    }
  };

  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;
  if (!auction) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Auction Details</h1>

      {/* Auction Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 border rounded-lg shadow-md">
        <div className="md:col-span-1 flex justify-center items-start">
          <img
            src={auction.productImageUrl || '/placeholder.png'}
            alt="Product"
            className="w-64 h-64 object-cover rounded-md border"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <p><strong>Product ID:</strong> {auction.productId}</p>
          <p><strong>Start:</strong> {auction.startTime}</p>
          <p><strong>End:</strong> {auction.endTime}</p>
          <p><strong>Seller:</strong> {auction.sellerUsername || 'N/A'}</p>
          <p><strong>Start Price:</strong> ${auction.startPrice}</p>
          <p><strong>Current Price:</strong> ${auction.currentPrice}</p>
          <p><strong>Status:</strong> {auction.status}</p>
          <p><strong>Total Bids:</strong> {auction.totalBids}</p>
          <p><strong>Highest Bid:</strong> {auction.highestBidAmount || 'N/A'}</p>
        </div>
      </div>

      {/* Bid Form */}
      <div className="mt-10 bg-white p-6 border rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Place a Bid</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePlaceBid();
          }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter your bid"
            className="border p-2 flex-1"
            required
            min="0.01"
            step="0.01"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Place Bid
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-center text-red-600">{message}</p>}
      </div>

      {/* Bid History */}
      <BidHistory bids={bids} />

      <div className="mt-6 text-center">
        <Link to="/auctions" className="text-blue-600 hover:underline">← Back to all auctions</Link>
      </div>
    </div>
  );
}
