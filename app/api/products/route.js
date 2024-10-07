import { db } from '../../../firebaseConfig'; // Ensure the path is correct
import { collection, query, where, orderBy, limit as fbLimit, startAfter, getDocs } from 'firebase/firestore';
import Fuse from 'fuse.js';
import { NextResponse } from 'next/server';

// Handle GET request
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  const productsRef = collection(db, 'products');

  try {
    let q = query(productsRef);

    // Filter by category
    if (category) {
      q = query(q, where('category', '==', category));
    }

    // Sort by price
    if (sort === 'price-asc') {
      q = query(q, orderBy('price', 'asc'));
    } else if (sort === 'price-desc') {
      q = query(q, orderBy('price', 'desc'));
    }

    // Fetch all products to filter/search
    const allProductsSnapshot = await getDocs(q);
    let products = allProductsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Apply search filtering using Fuse.js
    if (search) {
      const fuse = new Fuse(products, { keys: ['title'], threshold: 0.3 });
      products = fuse.search(search).map((result) => result.item);
    }

    // Handle pagination
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = products.slice(offset, offset + limit);

    return NextResponse.json({ products: paginatedProducts, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products', error: error.message }, { status: 500 });
  }
}
