'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts, fetchCategories } from '../utils/api';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  const [categories, setCategories] = useState([]);

  // Fetch product categories
  const fetchCategoriesData = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  // Fetch products with filters
  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts({
        search: searchTerm,
        category,
        sort: sortOption,
        page: currentPage,
        limit: itemsPerPage,
      });
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);  // Ensure this value is returned from the API
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
    fetchFilteredProducts();
  }, [searchTerm, category, sortOption, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>

      {/* Filter and search inputs */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-md ml-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded-md ml-2"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Show error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Show loader when fetching data */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-center col-span-4 text-gray-500">No products available.</p>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-2"
            >
              Previous
            </button>
            <span className="self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md ml-2"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
