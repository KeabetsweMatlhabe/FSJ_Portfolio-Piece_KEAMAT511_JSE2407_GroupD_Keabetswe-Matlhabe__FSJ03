'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';

const ProductGrid = ({ products = [] }) => {
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOption, setSortOption] = useState('date-desc');

  useEffect(() => {
    const sortProducts = () => {
      if (!Array.isArray(products)) {
        console.error("The 'products' prop is not an array:", products);
        return;
      }

      const sorted = [...products].sort((a, b) => {
        switch (sortOption) {
          case 'date-asc':
            return new Date(a.latestReview?.date || 0) - new Date(b.latestReview?.date || 0); // Handle missing dates
          case 'date-desc':
            return new Date(b.latestReview?.date || 0) - new Date(a.latestReview?.date || 0); // Handle missing dates
          case 'rating-asc':
            return (a.averageRating || 0) - (b.averageRating || 0); // Handle missing ratings
          case 'rating-desc':
            return (b.averageRating || 0) - (a.averageRating || 0); // Handle missing ratings
          default:
            return 0;
        }
      });

      setSortedProducts(sorted);
    };

    sortProducts();
  }, [products, sortOption]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2">Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="date-desc">Newest Reviews</option>
          <option value="date-asc">Oldest Reviews</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="rating-asc">Lowest Rated</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
