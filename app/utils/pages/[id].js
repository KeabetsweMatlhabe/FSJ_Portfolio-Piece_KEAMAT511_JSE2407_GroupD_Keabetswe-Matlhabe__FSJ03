import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReviewForm from '../../components/ReviewForm'; // Import the ReviewForm
import { fetchProductById } from '../../utils/api'; // Your API helper to fetch product details

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Get product ID from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id).then((data) => setProduct(data));
    }
  }, [id]);
  
  const handleNewReview = async () => {
    const updatedProduct = await fetchProductById(id); // Fetch updated reviews
    setProduct(updatedProduct);
  };
  
  // Pass handleNewReview to ReviewForm to trigger when a new review is added
//   <ReviewForm productId={id} onReviewAdded={handleNewReview} />
  
  return (
    <div>
      {/* Product Details */}
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>

      {/* Reviews Section */}
      <div>
        <h2>Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index}>
              <p>{review.reviewerName} - {review.date}</p>
              <p>Rating: {review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}

        {/* Review Form */}
        <ReviewForm productId={id} onReviewAdded={handleNewReview}  /> {/* Place the form here */}
      </div>
    </div>
  );
};

export default ProductDetail;
