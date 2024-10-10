'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProductById } from '../../utils/api';
import ReviewForm from '../../components/ReviewForm'; // Import the ReviewForm component

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = params;

  const fetchProductDetails = async () => {
    try {
      const productData = await fetchProductById(id);
      setProduct(productData);
    } catch (err) {
      setError('Failed to fetch product details');
      setProduct(null);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 mb-4 inline-block">Back to Products</Link>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2">
          <div className="relative">
            <img src={product.images[currentImage]} alt={product.title} className="w-full h-auto" />
            <div className="flex space-x-2 mt-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index}`}
                  onClick={() => handleImageChange(index)}
                  className={`w-24 h-24 object-cover cursor-pointer ${currentImage === index ? 'border-2 border-blue-500' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 lg:pl-8 mt-4 lg:mt-0">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-lg text-gray-700 mt-2">{product.description}</p>
          <p className="text-xl font-semibold mt-4">Price: ${product.price}</p>
          <p className="mt-2">Rating: {product.rating}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8">Reviews</h2>
      <div className="space-y-4 mt-4">
        {product.reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded-md">
            <div className="font-semibold">{review.reviewerName} ({review.rating}/5)</div>
            <div className="mt-2">{review.comment}</div>
            <div className="text-sm text-gray-500 mt-1">{new Date(review.date).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      <ReviewForm productId={id} />
    </div>
  );
}
