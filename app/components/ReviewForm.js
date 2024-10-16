// ReviewForm.js
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { addReviewToProduct, updateReview, deleteReview } from '../utils/api'; // Import API helpers

const ReviewForm = ({ productId, refreshReviews, existingReview }) => {
  const [review, setReview] = useState({
    rating: existingReview?.rating || 0,
    comment: existingReview?.comment || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage('You must be logged in to submit a review.');
      return;
    }

    const reviewData = {
      rating: parseInt(review.rating),
      comment: review.comment,
      reviewerEmail: user.email,
      reviewerName: user.displayName || 'Anonymous',
      date: new Date().toISOString(),
    };

    setLoading(true);
    try {
      if (existingReview) {
        // Update review
        await updateReview(productId, existingReview.id, reviewData);
        setMessage('Review updated successfully!');
      } else {
        // Add new review
        await addReviewToProduct(productId, reviewData);
        setMessage('Review added successfully!');
      }
      setReview({ rating: 0, comment: '' });
      refreshReviews(); // Refresh the review list
    } catch (error) {
      setMessage('Failed to submit review. Please try again.');
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteReview(productId, existingReview.id);
      setMessage('Review deleted successfully!');
      refreshReviews(); // Refresh the review list
    } catch (error) {
      setMessage('Failed to delete review. Please try again.');
      console.error('Error deleting review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{existingReview ? 'Edit Review' : 'Leave a Review'}</h3>
      {message && (
        <p className={`mb-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-gray-700 font-medium mb-1">
            Rating (1-5):
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={review.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
            className="w-full border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="comment" className="block text-gray-700 font-medium mb-1">
            Comment:
          </label>
          <textarea
            id="comment"
            name="comment"
            value={review.comment}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-200 ease-in-out ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {existingReview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full mt-2 py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Delete Review
          </button>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;
