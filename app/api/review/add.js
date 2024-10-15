import { getAuth } from 'firebase-admin/auth';
import { firestore } from '../../../firebaseConfig'; // Initialize your Firebase Admin SDK

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { productId, rating, comment, reviewerEmail, reviewerName, date } = req.body;

  // Verify the user's authentication token
  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.split(' ')[1];
  if (!idToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(idToken);
    if (!decodedToken) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Add the review to the specified product in Firebase Firestore
    const reviewData = {
      rating,
      comment,
      reviewerEmail,
      reviewerName,
      date,
    };
    await firestore
      .collection('products')
      .doc(productId)
      .collection('reviews')
      .add(reviewData);

    return res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ message: 'Failed to add review' });
  }
}
