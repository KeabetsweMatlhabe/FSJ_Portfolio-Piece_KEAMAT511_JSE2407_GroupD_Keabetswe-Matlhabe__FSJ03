
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    const productRef = doc(db, 'products', id);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({ id: productSnapshot.id, ...productSnapshot.data() });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
}
