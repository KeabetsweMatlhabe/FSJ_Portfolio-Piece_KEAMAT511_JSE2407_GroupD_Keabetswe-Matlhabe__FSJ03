import { db } from '../../firebaseConfig'; 
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const categoriesRef = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesRef);

    const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
}
