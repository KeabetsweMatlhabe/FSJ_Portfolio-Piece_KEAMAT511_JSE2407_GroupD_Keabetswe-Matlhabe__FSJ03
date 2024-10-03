import { db } from '../../firebaseConfig';  
import { collection, query, where, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import Fuse from 'fuse.js'; // For searching

export default async function handler(req, res) {
  const { page = 1, limit = 20, search = '', category = '', sort = '' } = req.query;
  const productsRef = collection(db, 'products');
  const offset = (page - 1) * limit;

  try {
    let q = query(productsRef, limit(Number(limit)));

    // Add category filtering
    if (category) {
      q = query(productsRef, where('category', '==', category));
    }

    // Sorting by price
    if (sort === 'price-asc') {
      q = query(q, orderBy('price', 'asc'));
    } else if (sort === 'price-desc') {
      q = query(q, orderBy('price', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply search filtering using Fuse.js
    if (search) {
      const fuse = new Fuse(products, { keys: ['title'], threshold: 0.3 });
      products = fuse.search(search).map(result => result.item);
    }

    res.status(200).json({ products, page, limit });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
}
