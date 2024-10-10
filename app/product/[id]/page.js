'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProductById } from '../../utils/api';

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // State for sorting criteria
  const router = useRouter();
  const { id } = params || router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const fetchedProduct = await fetchProductById(id);
        setProduct(fetchedProduct);
      } catch (err) {
        setError('Failed to fetch product');
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const sortReviews = (reviews) => {
    if (sortBy === 'date') {
      return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    } else if (sortBy === 'rating') {
      return [...reviews].sort((a, b) => b.rating - a.rating); // Sort by rating descending
    }
    return reviews;
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 bg-red-100 border border-red-400 text-lg font-semibold p-4 rounded-lg shadow-lg">
          {error}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-600 bg-blue-100 border border-blue-400 text-lg font-semibold p-4 rounded-lg shadow-lg">
          Loading product details...
        </p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-block mb-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        Back to Products
      </Link>

      <div className="flex flex-col md:flex-row">
        {/* Product Images */}
        <div className="relative w-full md:w-1/2">
          <img
            src={product.images[currentImage] || '/placeholder-image.jpg'}
            alt={product.title}
            className="w-full h-90 object-cover rounded-lg shadow-lg"
          />
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-2xl hover:bg-gray-100 transition-colors focus:outline-none"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-2xl hover:bg-gray-100 transition-colors focus:outline-none"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Product Details */}
        <div className="md:ml-8 w-full md:w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.title}</h1>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            ${product.price.toFixed(2)}
            {product.discountPercentage > 0 && (
              <span className="text-lg text-red-500 ml-2">
                (Now ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)} - {product.discountPercentage.toFixed(2)}% OFF)
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">SKU:</span> {product.sku || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Brand:</span> {product.brand || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Stock:</span>{' '}
            {product.stock > 0 ? `${product.stock} left in stock` : 'Out of stock'}
          </p>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Sorting Options */}
          <div className="mb-4">
            <label className="font-semibold mr-2">Sort Reviews By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="date">Date</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Reviews */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              sortReviews(product.reviews).map((review, index) => (
                <div key={index} className="border-b border-gray-200 py-2 mb-4">
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <p className="text-sm text-gray-600">{review.date}</p>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500">Rating: {review.rating}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
