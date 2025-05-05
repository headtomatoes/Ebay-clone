import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductService from '../services/ProductService';
import CategoryService from '../services/CategoryService';

// CategoryProductPage: Displays products filtered by category
export default function CategoryProductPage() {
  const { categoryName } = useParams(); //Get the category name from the URL

  // States for products, loading status, and error message
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products when the category name changes
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const categories = await CategoryService.getAllCategories();

        // Find the category that matches the categoryName from the URL
        const matchedCategory = categories.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        // If no matching category is found
        if (!matchedCategory) {
          setError('Category not found.');
          setLoading(false);
          return;
        }

        // Fetch products belonging to the matched category ID
        const productsData = await CategoryService.getProductsByCategoryId(matchedCategory.id);
        setProducts(productsData);
      } catch (err) {
        console.error('Error loading category products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-center">{categoryName} Products</h1>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            to={`/products/${product.productId}`}
            key={product.productId}
            className="border rounded-lg shadow hover:shadow-lg transition bg-white"
          >
            {/* Product image */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            {/* Product details */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}