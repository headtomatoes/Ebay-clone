import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryService from '../services/CategoryService';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        console.log('Fetched categories:', data);
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading categories...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
        {categories.map((category) => (
          <Link
            to={`/categories/${category.name}`}
            key={`${category.categoryId}-${category.name}`}
            className="border p-4 rounded shadow hover:shadow-md transition cursor-pointer text-lg font-semibold"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
