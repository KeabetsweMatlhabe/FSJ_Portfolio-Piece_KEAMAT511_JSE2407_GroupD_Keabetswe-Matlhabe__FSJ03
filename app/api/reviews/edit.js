import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { verifyIdToken } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { idToken } = req.headers;
    const { productId, reviewId, newRating, newComment } = req.body;

    try {
      // Verify user authentication
      const decodedToken = await verifyIdToken(idToken);
      if (!decodedToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { email } = decodedToken;

      // Fetch the product's reviews
      const productRef = doc(db, 'products', productId);
      const productSnapshot = await getDoc(productRef);
      const reviews = productSnapshot.data().reviews;

      // Find and update the review
      const updatedReviews = reviews.map((review) =>
        review.reviewerEmail === email && review.id === reviewId
          ? { ...review, rating: newRating, comment: newComment, date: new Date().toISOString() }
          : review
      );

      // Update the product document with the new reviews array
      await updateDoc(productRef, { reviews: updatedReviews });

      return res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({ message: 'Failed to update review', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
