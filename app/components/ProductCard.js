"use client"; // This ensures it's treated as a client component

import { useState } from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [sortOption, setSortOption] = useState('date'); // Track sorting state

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Ensure product.reviews is an array or default to an empty array if undefined
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

  // Sort reviews by selected option (either 'date' or 'rating')
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === 'date') {
      return new Date(b.date) - new Date(a.date); // Newest first
    } else if (sortOption === 'rating') {
      return b.rating - a.rating; // Highest rating first
    }
  });

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
      <div className="relative">
        <img
          src={product.images[currentImage] || '/placeholder-image.jpg'}
          alt={product.title}
          className="w-full h-49 object-cover"
        />
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md"
            >
              →
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-2 text-gray-800">{product.title}</h2>
        <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>
        <p className="font-bold text-xl text-gray-800 mb-2">${product.price.toFixed(2)}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Rating: {product.rating.rate}</span>
          <span className="text-sm text-gray-600">({product.rating.count} reviews)</span>
        </div>
        <p className="text-sm text-gray-600">{product.stock > 0 ? `${product.stock} left in stock` : 'Out of stock'}</p>
        <Link href={`/product/${product.id}`} className="bg-blue-500 text-white px-4 py-2 mt-4 block text-center rounded hover:bg-blue-600 transition-colors">
          View Details
        </Link>

        {/* Sorting Controls */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSortOption('date')}
              className={`px-4 py-2 rounded ${sortOption === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              Sort by Date
            </button>
            <button
              onClick={() => setSortOption('rating')}
              className={`px-4 py-2 rounded ${sortOption === 'rating' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              Sort by Rating
            </button>
          </div>

          {/* Display Sorted Reviews */}
          {sortedReviews.length > 0 ? (
            <ul className="space-y-4">
              {sortedReviews.map((review) => (
                <li key={review.id} className="border p-4 rounded-lg">
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(review.date).toLocaleDateString()}</p>
                  <p className="text-sm">Rating: {review.rating}/5</p>
                  <p className="mt-2">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
