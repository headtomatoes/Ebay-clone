import React from 'react';
import { format } from 'date-fns';

/**
 * Displays a styled table of auction bid history, highlighting the top bid.
 *
 * Renders a list of bids with rank, bidder username, bid amount, and formatted bid time. If no bids are present, shows a message indicating no bids have been placed.
 *
 * @param {Object[]} bids - Array of bid objects to display.
 * @param {string|number} bids[].bidId - Unique identifier for each bid.
 * @param {string} bids[].bidderUsername - Username of the bidder.
 * @param {string|number} bids[].bidAmount - Amount of the bid.
 * @param {string|Date} bids[].bidTime - Date and time the bid was placed.
 */
export default function BidHistory({ bids }) {
    // Format bid date and time
    const formatBidTime = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy - h:mm:ss a');
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Bid History</h2>
            </div>

            <div className="p-6">
                {bids.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No bids have been placed on this auction yet.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bidder
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {bids.map((bid, index) => (
                                <tr key={bid.bidId} className={index === 0 ? "bg-blue-50" : ""}>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                        <span className={`
                          flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs
                          ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                        `}>
                          {index + 1}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {bid.bidderUsername}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${index === 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                                            ${parseFloat(bid.bidAmount).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {formatBidTime(bid.bidTime)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
