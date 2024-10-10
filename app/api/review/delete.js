import { getAuth } from 'firebase-admin/auth';
import { firestore } from '../../../firebaseAdmin';

const deleteReview = async (req, res) => {
  if (req.method === 'DELETE') {
    try {
      const { productId, reviewId } = req.body;

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);

      if (!decodedToken) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Delete the review from Firestore
      const reviewRef = firestore.collection('products').doc(productId).collection('reviews').doc(reviewId);

      await reviewRef.delete();

      return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      return res.status(500).json({ message: 'Failed to delete review' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default deleteReview;
