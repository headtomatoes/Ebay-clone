import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../services/ProductService';
import { useAuth } from '../contexts/AuthContext';
import ReviewService from '../services/ReviewService';

export default function ProductPage() {
  const { user } = useAuth(); // Get logged in user

  // States for products, loading status, error messages, and pagination
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;  // Display 20 products per page
  const [productRatings, setProductRatings] = useState({}); // State to store average ratings for each product

 useEffect(() => {
   const fetchProducts = async () => {
     try {
       const data = await ProductService.getAllProducts();
       setProducts(data);

       const ratings = {};

       // Use Promise.all to wait for all average ratings
       await Promise.all(
         data.map(async (product) => {
           try {
             // Fetch average rating from API
             const avgRating = await ReviewService.getAverageRating(product.productId);
             console.log(`Product ${product.productId} - Average Rating:`, avgRating);

             // Handle invalid ratings
             if (avgRating !== null && avgRating !== undefined) {
               ratings[product.productId] = Number(avgRating).toFixed(1);
             } else {
               ratings[product.productId] = '0.0'; // Default to 0 if no rating found
             }
           } catch (err) {
             console.error(`Error fetching rating for product ${product.productId}`, err);
             ratings[product.productId] = '0.0'; // Default to 0 in case of error
           }
         })
       );

       setProductRatings(ratings);
     } catch (err) {
       console.error('Error fetching products:', err);
       setError('Failed to load products.');
     } finally {
       setLoading(false);
     }
   };

   fetchProducts();
 }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handle changing pages
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-left">All Products</h1>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map(product => (
          <div
            key={product.productId}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white flex flex-col"
          >
            {/* Product image */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            {/* Product details */}
            <div className="p-4 flex flex-col flex-grow">
              {/* Name clickable */}
              <Link
                to={`/products/${product.productId}`}
                className="text-lg font-semibold text-gray-800 hover:underline mb-2"
              >
                {product.name}
              </Link>

              <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{product.categoryName}</p>

              {/* Display average rating */}
              <div className="flex items-center mt-2">
                <div className="w-24 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-yellow-400 rounded"
                    style={{
                      width: `${(parseFloat(productRatings[product.productId] || 0) / 5) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-xs ml-2">{productRatings[product.productId] || '0.0'} / 5</span>
              </div>

              {product.status === 'ACTIVE' && (
                <span className="text-green-500 text-xs font-semibold mt-1">Available</span>
              )}

              {product.status === 'SOLD_OUT' && (
                <span className="text-red-500 text-xs font-semibold mt-1">Sold Out</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
