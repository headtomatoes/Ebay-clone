<llm-snippet-file>src/pages/AuctionDetailPage.js</llm-snippet-file>
import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Client } from '@stomp/stompjs'; // Import STOMP Client
import SockJS from 'sockjs-client'; // Import SockJS
import BidService from '../services/BidService';
import AuctionService from '../services/AuctionService';
import ProductService from '../services/ProductService';
import BidHistory from '../components/auction/BidHistory';

// Base URL for the WebSocket endpoint - adjust if your backend runs elsewhere
const SOCKET_URL = 'http://localhost:8082/ws'; // Uses the proxy setup by Vite usually

export default function AuctionDetailPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const stompClientRef = useRef(null); // Ref to hold the STOMP client instance

  // Load initial auction info, product details, and bids
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading true at the start of fetch
      setError(''); // Clear previous errors
      try {
        // Get auction details
        const auctionData = await AuctionService.getAuctionById(id);
        setAuction(auctionData);

        // Get bid history
        const bidData = await BidService.getBidHistory(id);
        setBids(bidData);

        // Get product details
        if (auctionData.productId) {
          const productData = await ProductService.getProductById(auctionData.productId);
          setProduct(productData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching auction details:', err);
        setError('Failed to load auction details.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  // WebSocket Connection and Subscription Effect
  useEffect(() => {
    if (!id) return; // Don't connect if no auction ID

    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL), // Use SockJS for transport
      debug: (str) => { // Uncomment for connection debugging
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000, // Try to reconnect every 5 seconds
      heartbeatIncoming: 10000, // Expect heartbeats from server
      heartbeatOutgoing: 10000, // Send heartbeats to server
    });

    client.onConnect = (frame) => {
      console.log('STOMP: Connected:', frame);
      // Subscribe to the specific auction's bid topic
      const subscription = client.subscribe(`/topic/auctions/${id}/bids`, (message) => {
        try {
          const newBid = JSON.parse(message.body);
          console.log('STOMP: Received bid:', newBid);

          // Update auction's current price and potentially bid count
          setAuction((prevAuction) => {
            if (!prevAuction) return null;
            return {
              ...prevAuction,
              currentPrice: newBid.bidAmount, // Update price from the new bid
              totalBids: (prevAuction.totalBids || 0) + 1, // Increment bid count
            };
          });

          // Add the new bid to the bid history (at the beginning)
          setBids((prevBids) => [newBid, ...prevBids]);

        } catch (e) {
          console.error("Error processing incoming bid message:", e);
        }
      });

      // Store subscription to unsubscribe later if needed, though client deactivate handles it
    };

    client.onStompError = (frame) => {
      console.error('STOMP: Broker reported error:', frame.headers['message']);
      console.error('STOMP: Additional details:', frame.body);
      setError(`WebSocket connection error: ${frame.headers['message']}`);
    };

    client.onWebSocketError = (event) => {
      console.error('STOMP: WebSocket error:', event);
      // Maybe set an error state here to inform the user
      setError('WebSocket connection failed. Real-time updates may not work.');
    };

    client.onDisconnect = () => {
      console.log('STOMP: Disconnected');
      // Optional: Add logic if you need to know when it's explicitly disconnected
    };

    // Activate the client
    console.log('STOMP: Activating client...');
    client.activate();
    stompClientRef.current = client; // Store client in ref

    // Cleanup function: Deactivate the client when component unmounts or ID changes
    return () => {
      if (stompClientRef.current) {
        console.log('STOMP: Deactivating client...');
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        console.log('STOMP: Client deactivated.');
      }
    };

  }, [id]); // Rerun effect if auction ID changes

  // Update time remaining every second
  useEffect(() => {
    if (!auction || auction.status !== 'ACTIVE') return;

    const calculateTimeRemaining = () => {
      const endTime = new Date(auction.endTime);
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining('Auction ended');
        // Optionally update auction status if WebSocket didn't already
        setAuction(prev => prev && prev.status === 'ACTIVE' ? {...prev, status: 'ENDED_MET_RESERVE'} : prev); // Or another appropriate status
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeRemaining(); // Initial calculation
    const timer = setInterval(calculateTimeRemaining, 1000);

    // Cleanup timer
    return () => clearInterval(timer);
  }, [auction]); // Rerun when auction data changes (e.g., status or end time)

  // Format date for display
  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      console.warn("Could not format date:", dateString, error);
      return dateString; // Return original string if formatting fails
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'ENDED_MET_RESERVE':
        return 'bg-purple-100 text-purple-800';
      case 'ENDED_NO_RESERVE':
      case 'ENDED_NO_BIDS':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' }); // Clear previous message

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({
        text: 'You must be logged in to place a bid.',
        type: 'error'
      });
      return;
    }

    // Validate bid amount against the *current* auction state
    if (!auction || parseFloat(bidAmount) <= parseFloat(auction.currentPrice)) {
      setMessage({
        text: `Your bid must be higher than the current price ($${auction?.currentPrice?.toFixed(2) ?? 'N/A'})`,
        type: 'error'
      });
      return;
    }

    try {
      // Call the backend to place the bid. The backend will handle broadcasting.
      await BidService.placeBid(id, bidAmount);

      // Update UI with *temporary* success message
      setMessage({
        text: 'Bid placed successfully! Waiting for confirmation...', // Adjusted message
        type: 'success'
      });
      setBidAmount(''); // Clear input field

      // Clear success message after a few seconds - the WebSocket update will be the final confirmation
      setTimeout(() => setMessage((prev) => (prev.type === 'success' ? { text: '', type: '' } : prev)), 3000);

      // --- REMOVED ---
      // No need to manually refresh auction and bid data here anymore.
      // The WebSocket listener will handle updates pushed from the server.
      // const [updatedAuction, updatedBids] = await Promise.all([
      //   AuctionService.getAuctionById(id),
      //   BidService.getBidHistory(id)
      // ]);
      // setAuction(updatedAuction);
      // setBids(updatedBids);
      // --- REMOVED ---

    } catch (err) {
      const errorData = err.response?.data;
      const msg = errorData?.message || errorData || err.message || 'Failed to place bid.';
      console.error('Error placing bid:', err);
      setMessage({ text: `Error: ${msg}`, type: 'error' });
    }
  };

  // --- Keep the rest of the component rendering logic as is ---
  // (Loading indicator, error display, main layout, bid form, bid history etc.)

  if (loading) return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading auction details...</p>
        </div>
      </div>
  );

  // Display WebSocket connection errors along with fetch errors
  if (error) return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          <p className="text-center">{error}</p>
        </div>
        {/* Optionally keep the link even on WS error */}
        <div className="text-center mt-4">
          <Link to="/auctions" className="text-blue-600 hover:underline">
            ← Back to all auctions
          </Link>
        </div>
      </div>
  );


  if (!auction && !loading) return ( // Check loading flag too
      <div className="max-w-4xl mx-auto p-6 text-center">
        Auction not found or failed to load.
        <div className="text-center mt-4">
          <Link to="/auctions" className="text-blue-600 hover:underline">
            ← Back to all auctions
          </Link>
        </div>
      </div>
  );

  if (!auction) return null; // Should be covered by loading/error, but good fallback


  // --- Render the main component UI ---
  return (
      <div className="max-w-4xl mx-auto p-6">
        {/* ... (rest of the JSX structure remains the same) ... */}

        <div className="mb-6">
          <Link to="/auctions" className="inline-flex items-center text-blue-600 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all auctions
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Auction Header */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {product?.name || `Auction #${auction.id}`}
              </h1>
              <span
                  className={`text-sm px-3 py-1 rounded-full ${getStatusBadgeClass(auction.status)}`}
              >
                {auction.status}
              </span>
            </div>

            {auction.status === 'ACTIVE' && (
                <div className="mt-2 text-sm font-medium text-gray-500">
                  Time remaining: <span className="text-blue-700">{timeRemaining}</span>
                </div>
            )}
          </div>

          {/* Auction Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product Image */}
              <div className="md:col-span-1">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                  {product?.imageUrl ? (
                      <img
                          src={product.imageUrl}
                          alt={product.name || 'Product Image'}
                          className="w-full h-full object-cover"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image available
                      </div>
                  )}
                </div>

                {/* Product Details */}
                {product && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-gray-700 mb-2">Product Details</h3>
                      <p className="text-sm mb-2">{product.description}</p>
                      {product.categoryName && (
                          <div className="text-sm text-gray-500">
                            Category: {product.categoryName}
                          </div>
                      )}
                    </div>
                )}
              </div>

              {/* Auction Details */}
              <div className="md:col-span-2 space-y-6">
                {/* Price Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-700">Current Price</h2>
                    <div className="text-2xl font-bold text-blue-700">
                      ${parseFloat(auction.currentPrice).toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Starting Price</div>
                      <div className="font-medium">${parseFloat(auction.startPrice).toFixed(2)}</div>
                    </div>

                    <div>
                      <div className="text-gray-500">Total Bids</div>
                      <div className="font-medium">{auction.totalBids || 0}</div>
                    </div>

                    <div>
                      <div className="text-gray-500">Start Time</div>
                      <div className="font-medium">{formatDateTime(auction.startTime)}</div>
                    </div>

                    <div>
                      <div className="text-gray-500">End Time</div>
                      <div className="font-medium">{formatDateTime(auction.endTime)}</div>
                    </div>
                  </div>
                </div>

                {/* Bid Form - Only show for active auctions */}
                {auction.status === 'ACTIVE' && (
                    <div className="bg-white border rounded-lg p-4">
                      <h2 className="text-lg font-bold mb-3">Place Your Bid</h2>

                      <form onSubmit={handlePlaceBid} className="space-y-4">
                        <div>
                          <label htmlFor={`bidAmount-${id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Bid Amount ($)
                          </label>
                          <div className="flex">
                        <span className="inline-flex items-center px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                          $
                        </span>
                            <input
                                id={`bidAmount-${id}`} // Add unique id for label association
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder={`Min bid: $${(parseFloat(auction.currentPrice) + 0.01).toFixed(2)}`}
                                min={(parseFloat(auction.currentPrice) + 0.01).toFixed(2)} // Set min attribute
                                step="0.01"
                                required
                                className="flex-1 border rounded-r-md p-2 focus:ring focus:ring-blue-200 focus:outline-none w-full" // Ensure full width
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Enter an amount greater than ${parseFloat(auction.currentPrice).toFixed(2)}
                          </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                            disabled={!bidAmount || parseFloat(bidAmount) <= parseFloat(auction.currentPrice)} // Disable if invalid
                        >
                          Place Bid
                        </button>

                        {message.text && (
                            <div className={`text-sm p-2 rounded ${
                                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {message.text}
                            </div>
                        )}
                      </form>
                    </div>
                )}

                {/* Auction Results - Show for ended auctions */}
                {['ENDED_MET_RESERVE', 'ENDED_NO_RESERVE', 'ENDED_NO_BIDS'].includes(auction.status) && (
                    <div className="bg-white border rounded-lg p-4">
                      <h2 className="text-lg font-bold mb-3">Auction Results</h2>

                      <div className="space-y-2">
                        {auction.status === 'ENDED_NO_BIDS' ? (
                            <p className="text-gray-600">This auction ended with no bids.</p>
                        ) : (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Winning Bid:</span>
                                <span className="font-bold">${parseFloat(auction.currentPrice).toFixed(2)}</span>
                              </div>

                              {auction.winnerUsername && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Winner:</span>
                                    <span className="font-medium">{auction.winnerUsername}</span>
                                  </div>
                              )}

                              <div className="flex justify-between">
                                <span className="text-gray-600">Reserve Price Met:</span>
                                <span className={`font-medium ${
                                    auction.status === 'ENDED_MET_RESERVE' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {auction.status === 'ENDED_MET_RESERVE' ? 'Yes' : 'No'}
                              </span>
                              </div>
                            </>
                        )}
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bid History */}
        <div className="mt-8">
          {/* Pass bids state which is now updated by WebSocket */}
          <BidHistory bids={bids} />
        </div>
      </div>
  );
}