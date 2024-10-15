export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { productId, reviewId } = req.query;

  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.split(' ')[1];
  if (!idToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    if (!decodedToken) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Delete the review in Firebase
    await firestore
      .collection('products')
      .doc(productId)
      .collection('reviews')
      .doc(reviewId)
      .delete();

    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ message: 'Failed to delete review' });
  }
}
