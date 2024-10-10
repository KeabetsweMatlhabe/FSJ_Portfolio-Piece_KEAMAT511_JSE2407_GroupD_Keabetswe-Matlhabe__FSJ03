import { db } from '../../../firebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique review ID
import { verifyIdToken } from '../../utils/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idToken } = req.headers;
    const { productId, rating, comment } = req.body;

    try {
      // Verify user authentication
      const decodedToken = await verifyIdToken(idToken);
      if (!decodedToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { email, name } = decodedToken;

      // Prepare the review data with a unique ID
      const review = {
        id: uuidv4(), // Generate unique ID for the review
        rating,
        comment,
        date: new Date().toISOString(),
        reviewerEmail: email,
        reviewerName: name,
      };

      // Update the product document by adding the review
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        reviews: arrayUnion(review),
      });

      return res.status(200).json({ message: 'Review added successfully', review });
    } catch (error) {
      console.error('Error adding review:', error);
      return res.status(500).json({ message: 'Failed to add review', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
