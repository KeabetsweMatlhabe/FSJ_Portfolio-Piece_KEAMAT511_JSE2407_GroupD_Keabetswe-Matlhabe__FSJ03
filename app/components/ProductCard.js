"use client"; // This ensures it's treated as a client component

import { useState } from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

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

        {/* Review Section */}
        {product.latestReview && (
          <div className="mb-2">
            <p className="text-sm text-gray-600">Latest Review: {new Date(product.latestReview.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Review Text: {product.latestReview.text}</p>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Rating: {product.rating?.rate || 'N/A'}</span>
          <span className="text-sm text-gray-600">({product.rating?.count || 0} reviews)</span>
        </div>
        <p className="text-sm text-gray-600">
          {product.stock > 0 ? `${product.stock} left in stock` : 'Out of stock'}
        </p>
        <Link href={`/product/${product.id}`} className="bg-blue-500 text-white px-4 py-2 mt-4 block text-center rounded hover:bg-blue-600 transition-colors">
          View Details
        </Link>
      </div>
    </div>
  );
}
