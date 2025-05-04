import React from 'react';

export default function BidHistory({ bids }) {
  return (
    <div className="mt-10 bg-white p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Bid History</h2>
      {bids.length === 0 ? (
        <p className="text-gray-500">No bids yet.</p>
      ) : (
        <ul className="space-y-2">
          {bids.map((bid, index) => (
            <li key={bid.bidId} className="border-b pb-2">
              #{index + 1} - <strong>{bid.bidderUsername}</strong> bid ${bid.bidAmount} at {bid.bidTime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
