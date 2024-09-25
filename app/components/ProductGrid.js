'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';

// Custom Select component
const Select = ({ value, onChange, options }) => {
  return (
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
};

export default function ProductGrid({ products }) {
  const [sortOption, setSortOption] = useState('default');
  
  // Ensure products is always an array, even if undefined or null
  const safeProducts = Array.isArray(products) ? products : [];

  // Sort products based on the selected option
  const sortedProducts = [...safeProducts].sort((a, b) => {
    switch (sortOption) {
      case 'date-asc':
        return new Date(a.latestReview.date) - new Date(b.latestReview.date);
      case 'date-desc':
        return new Date(b.latestReview.date) - new Date(a.latestReview.date);
      case 'rating-asc':
        return a.averageRating - b.averageRating;
      case 'rating-desc':
        return b.averageRating - a.averageRating;
      default:
        return 0;
    }
  });

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'date-asc', label: 'Review Date (Oldest First)' },
    { value: 'date-desc', label: 'Review Date (Newest First)' },
    { value: 'rating-asc', label: 'Rating (Low to High)' },
    { value: 'rating-desc', label: 'Rating (High to Low)' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Products</h2>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          options={sortOptions}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-4 text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
}