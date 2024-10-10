import { getAuth } from 'firebase-admin/auth';
import { firestore } from '../../../firebaseAdmin';

const editReview = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { productId, reviewId, rating, comment } = req.body;

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);

      if (!decodedToken) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Update the review in Firestore
      const reviewRef = firestore.collection('products').doc(productId).collection('reviews').doc(reviewId);

      await reviewRef.update({
        rating,
        comment,
        date: new Date().toISOString(), // Update with new date
      });

      return res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({ message: 'Failed to update review' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default editReview;
