'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts, fetchCategories } from '../utils/api';

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Fetch available categories
  const fetchCategoryData = async () => {
    try {
      const categoryData = await fetchCategories();
      setCategories([{ value: '', label: 'All Categories' }, ...categoryData.map(cat => ({ value: cat, label: cat }))]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch and filter products based on search, category, and sort options
  const fetchFilteredProducts = async () => {
    try {
      const data = await fetchProducts({
        search: searchTerm,
        category,
        sort: sortOption,
        page: currentPage,
        limit: itemsPerPage,
      });
      setProducts(data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Effect to fetch products when filters change
  useEffect(() => {
    fetchCategoryData();
    fetchFilteredProducts();
  }, [searchTerm, category, sortOption, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1); // Reset to first page
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setSortOption('default');
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Products</h2>
        <div>
          <button
            onClick={handleResetFilters}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by title..."
          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Select
          value={category}
          onChange={handleCategoryChange}
          options={categories}
        />
        <Select
          value={sortOption}
          onChange={handleSortChange}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'price-asc', label: 'Price (Low to High)' },
            { value: 'price-desc', label: 'Price (High to Low)' },
          ]}
        />
      </div>

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
    </div>
  );
}
