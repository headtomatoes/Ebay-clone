    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import ProductService from '../services/ProductService';
    import { useAuth } from '../contexts/AuthContext';
    import CartService from "../services/CartService";
    import { toast } from 'react-toastify';
    import RandomProductList from '../components/product/RandomProductList';
    import ReviewService from '../services/ReviewService.jsx';

    export default function ProductDetailPage() {
      const { productId } = useParams();
      const navigate = useNavigate();
      const { user } = useAuth();

      const [product, setProduct] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [isAdding, setIsAdding] = useState(false);
      const [quantity, setQuantity] = useState(1);

      const [reviews, setReviews] = useState([]);
      const [averageRating, setAverageRating] = useState(0);
      const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

      useEffect(() => {
        const fetchProductAndReviews = async () => {
          try {
            const data = await ProductService.getProductById(productId);
            setProduct(data);

            const reviewsData = await ReviewService.getReviewsByProduct(productId);
            setReviews(reviewsData);

            const avgRating = await ReviewService.getAverageRating(productId);
            setAverageRating(avgRating);
          } catch (err) {
            console.error('Error loading product or reviews:', err);
            setError('Product not found or failed to load.');
          } finally {
            setLoading(false);
          }
        };

        fetchProductAndReviews();
      }, [productId]);

      const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
          try {
            await ProductService.deleteProduct(product.productId);
            toast.success('Product deleted successfully!');
            navigate('/products');
          } catch (err) {
            toast.error('Failed to delete product.');
          }
        }
      };

      const handleAddToCart = async () => {
        if (!user) {
          toast.error('Please log in to add items to your cart.');
          return;
        }

        if (!product || !product.productId) return;

        if (quantity > product.stockQuantity) {
          toast.error('Selected quantity exceeds available stock.');
          return;
        }

        try {
          setIsAdding(true);
          await CartService.addToCart(product.productId, quantity);
          toast.success(`${product.name} added to cart!`);
        } catch (err) {
          toast.error(`Failed to add to cart: ${err.message}`);
        } finally {
          setIsAdding(false);
        }
      };

      const handleBuyNow = () => {
        if (!user) {
          toast.error('Please log in to purchase this product.');
          return;
        }

        if (!product || !product.productId) return;

        navigate('/checkout', {
          state: {
            mode: 'buynow',
            product,
            quantity,
          },
        });
      };

      const handleReviewSubmit = async () => {
        if (!newReview.rating || !newReview.comment.trim()) {
          toast.error('Please provide both a rating and a comment.');
          return;
        }

        try {
          const createdReview = await ReviewService.createReview({
            productId,
            rating: newReview.rating,
            comment: newReview.comment,
          });

          const updatedReviews = [createdReview, ...reviews];
          setReviews(updatedReviews);

          const avgRating = await ReviewService.getAverageRating(productId);
          setAverageRating(avgRating);

          setNewReview({ rating: 0, comment: '' });
          toast.success('Review submitted!');
        } catch (err) {
          toast.error('Failed to submit review.');
        }
      };

      const StarRating = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;

        return (
          <div className="flex">
            {[...Array(fullStars)].map((_, i) => (
              <span key={`full-${i}`} className="text-yellow-400 text-lg">★</span>
            ))}
            {[...Array(emptyStars)].map((_, i) => (
              <span key={`empty-${i}`} className="text-gray-300 text-lg">★</span>
            ))}

          </div>
        );
      };

      if (loading) return <div className="text-center mt-20">Loading product details...</div>;
      if (error || !product) return <div className="text-center text-red-500 mt-20">{error}</div>;

      return (
        <div className="max-w-6xl mx-auto p-6">
          <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 hover:underline">← Back</button>

          {/* Product Info */}
          <div className="flex flex-col md:flex-row gap-6 items-start p-6">
            <div className="w-full md:w-1/2 flex justify-center">
              <img src={product.imageUrl} alt={product.name} className="w-[500px] h-[500px] object-cover rounded shadow" />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between min-h-[500px]">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-red-600 mb-4">${product.price}</p>
              <p className="text-gray-700 text-sm mb-6">Stock: {product.stockQuantity}</p>

              {/* Quantity + Buttons */}
              <div className="mb-4 space-y-2">
                <div className="w-fit">
                  <label htmlFor="quantity" className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-16 h-9 text-sm px-2 border rounded-full text-center"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="rounded-full px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium"
                  >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </button>

              {/* Add to Cart & Buy Now */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="rounded-full px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium"
                >
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="rounded-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Buy Now
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 w-[360px] space-y-2">
                <Accordion title="Product Info">
                  <p className="mb-4 pl-4">{product.description}</p>
                  <p className="mb-4 pl-4">Seller: {product.sellerUsername}</p>
                  <p className="mb-4 pl-4">Category: {product.categoryName}</p>
                </Accordion>
                <Accordion title="Shipping Times & Costs">
                  <p className="mb-4 pl-4">Ships within 2–5 business days. Free shipping on orders over $50.</p>
                </Accordion>
                <Accordion title="Returns Policy">
                  <p className="mb-4 pl-4">Returnable within 15 days of delivery in original condition.</p>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Seller Actions */}
          {user?.roles?.includes('ROLE_SELLER') && user?.username === product.sellerUsername && (
            <div className="flex space-x-4 mt-6">
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
              <button onClick={() => navigate(`/seller/products/update/${product.productId}`)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Update</button>
              <button onClick={() => navigate(`/seller/auction/create/${product.productId}`)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Auction</button>
            </div>
          )}

          {/* Review Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>

            {/* Average Rating Visual Bar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-40 h-2 bg-gray-200 rounded">
                <div className="h-full bg-yellow-400 rounded" style={{ width: `${(averageRating / 5) * 100}%` }}></div>
              </div>
              <span className="text-lg font-medium text-gray-800">{averageRating} / 5</span>
              <StarRating rating={averageRating} />
            </div>

            {/* Leave a Review */}
            {user ? (
              <div className="mb-6">
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Write your review..."
                  className="w-full p-3 border border-gray-300 rounded mb-3"
                />
                <div className="flex gap-3 items-center mb-4">
                  <label className="text-sm">Rating:</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="border border-gray-300 p-2 rounded-md"
                  >
                    {[1, 2, 3, 4, 5].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleReviewSubmit} className="py-2 px-6 bg-blue-600 text-white rounded-md">Submit Review</button>
              </div>
            ) : (
              <p className="text-gray-600">You must be logged in to leave a review.</p>
            )}

            {/* Display Reviews */}
            <div className="mt-6 space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b py-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{review.username}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <RandomProductList excludeId={product.productId} />
        </div>
      );
    }

    function Accordion({ title, children }) {
      const [open, setOpen] = useState(false);

      return (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-800"
          >
            <span>{title}</span>
            <span className="text-xl">{open ? "−" : "+"}</span>
          </button>
          <div className={`transition-all duration-300 ease-in-out px-4 text-sm text-gray-700 ${open ? 'max-h-[500px] py-3 opacity-100' : 'max-h-0 py-0 opacity-0'} overflow-hidden`}>
            {children}
          </div>
        </div>
      );
    }
