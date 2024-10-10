import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { verifyIdToken } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { idToken } = req.headers;
    const { productId, reviewId } = req.body;

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

      // Filter out the review to delete
      const updatedReviews = reviews.filter(
        (review) => !(review.reviewerEmail === email && review.id === reviewId)
      );

      // Update the product document with the new reviews array
      await updateDoc(productRef, { reviews: updatedReviews });

      return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      return res.status(500).json({ message: 'Failed to delete review', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
