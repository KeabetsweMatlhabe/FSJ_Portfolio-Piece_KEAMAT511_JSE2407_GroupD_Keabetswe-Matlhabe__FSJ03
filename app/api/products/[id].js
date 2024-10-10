import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { id } = req.query;

    try {
      if (Array.isArray(id)) {
        // If id is an array, fetch multiple products
        const products = await Promise.all(
          id.map(async (productId) => {
            const productRef = doc(db, 'products', productId);
            const productSnapshot = await getDoc(productRef);
            return productSnapshot.exists() ? { id: productSnapshot.id, ...productSnapshot.data() } : null;
          })
        );

        // Filter out null values for products that do not exist
        const filteredProducts = products.filter(product => product !== null);

        res.status(200).json(filteredProducts);
      } else {
        // If id is a single string, fetch a single product
        const productRef = doc(db, 'products', id);
        const productSnapshot = await getDoc(productRef);

        if (!productSnapshot.exists()) {
          res.status(404).json({ message: 'Product not found' });
        } else {
          res.status(200).json({ id: productSnapshot.id, ...productSnapshot.data() });
        }
      }
    } catch (error) {
      console.error('Error fetching product(s):', error);
      res.status(500).json({ message: 'Error fetching product(s)', error: error.message });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
