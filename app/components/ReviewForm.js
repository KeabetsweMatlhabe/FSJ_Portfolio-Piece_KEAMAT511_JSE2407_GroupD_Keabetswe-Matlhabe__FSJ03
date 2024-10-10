import { useState } from 'react';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { addReviewToProduct } from '../utils/api'; // Import API helper for adding reviews

const ReviewForm = ({ productId }) => {
  const [review, setReview] = useState({ rating: 0, comment: '' });
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
    const user = auth.currentUser; // Get the logged-in user

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
      await addReviewToProduct(productId, reviewData);
      setMessage('Review added successfully!');
      setReview({ rating: 0, comment: '' }); // Reset form
    } catch (error) {
      setMessage('Failed to add review. Please try again.');
      console.error('Error adding review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Leave a Review</h3>
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
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
