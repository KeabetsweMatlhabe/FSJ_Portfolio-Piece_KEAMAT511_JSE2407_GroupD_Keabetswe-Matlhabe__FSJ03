// pages/api/products.js
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Fuse from 'fuse.js';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limitParam = parseInt(searchParams.get('limit')) || 20;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  try {
    const productsRef = collection(db, 'products');
    let productsSnapshot = await getDocs(productsRef);
    let products = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Apply category filter if provided
    if (category) {
      products = products.filter(product => product.category === category);
    }

    // Implement searching with Fuse.js
    if (search) {
      const fuse = new Fuse(products, {
        keys: ['title'],
        includeScore: true,
      });
      const searchResults = fuse.search(search);
      products = searchResults.map(result => result.item);
    }

    // Apply sorting if requested
    if (sort) {
      products.sort((a, b) => {
        if (sort === 'price-asc') {
          return a.price - b.price; // Sort ascending
        } else if (sort === 'price-desc') {
          return b.price - a.price; // Sort descending
        }
        return 0; // Default no sorting
      });
    }

    // Pagination calculation
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limitParam);
    const offset = (page - 1) * limitParam;
    const paginatedProducts = products.slice(offset, offset + limitParam);

    // Return the filtered, sorted, and paginated results
    return NextResponse.json({ products: paginatedProducts, totalProducts, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products', error: error.message }, { status: 500 });
  }
}
