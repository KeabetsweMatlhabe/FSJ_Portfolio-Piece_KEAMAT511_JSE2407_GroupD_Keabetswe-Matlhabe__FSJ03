import { db } from '../../../firebaseConfig'; 
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      res.status(200).json({ id: productSnap.id, ...productSnap.data() });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
}
