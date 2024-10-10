'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then(response => response.json())
        .then(data => setProduct(data))
        .catch(error => console.error('Error fetching product:', error));
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-block mb-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
        Back to Products
      </Link>

      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2">
          <img
            src={product.images[currentImage] || '/placeholder-image.jpg'}
            alt={product.title}
            className="w-full h-80 object-cover rounded-lg"
          />
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              >
                →
              </button>
            </>
          )}
        </div>

        <div className="md:ml-8 w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.title}</h1>
          <p className="text-xl font-bold text-gray-800 mb-4">${product.price.toFixed(2)}</p>
          {product.discountPercentage && (
            <p className="text-lg font-semibold text-red-500 mb-4">
              Discounted Price: ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)} ({product.discountPercentage}% OFF)
            </p>
          )}
          <p className="text-sm text-gray-600 mb-2">SKU: {product.sku || 'N/A'}</p>
          <p className="text-sm text-gray-600 mb-4">Category: {product.category}</p>
          <p className="text-sm text-gray-600 mb-4">Brand: {product.brand}</p>
          <p className="text-sm text-gray-600 mb-4">{product.stock > 0 ? `${product.stock} left in stock` : 'Out of stock'}</p>
          <p className="text-sm text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 py-2">
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
