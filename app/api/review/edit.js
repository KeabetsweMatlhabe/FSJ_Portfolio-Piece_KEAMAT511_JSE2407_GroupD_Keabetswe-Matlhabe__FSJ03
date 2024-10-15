export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { productId, reviewId, rating, comment, date } = req.body;

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

    // Update the review in Firebase
    await firestore
      .collection('products')
      .doc(productId)
      .collection('reviews')
      .doc(reviewId)
      .update({
        rating,
        comment,
        date,
      });

    return res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ message: 'Failed to update review' });
  }
}
