import { db } from '../../../firebaseConfig';
import { collection, query, getDocs, limit, where, orderBy } from 'firebase/firestore';
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
    let q = query(productsRef, limit(limitParam));

    // Apply category filter if provided
    if (category) {
      q = query(productsRef, where('category', '==', category), limit(limitParam));
    }

    // Apply search filtering by product title
    if (search) {
      q = query(productsRef, where('title', '>=', search), where('title', '<=', search + '\uf8ff'), limit(limitParam));
    }

    // Apply sorting by price if requested
    if (sort === 'price-asc') {
      q = query(productsRef, orderBy('price', 'asc'), limit(limitParam));
    } else if (sort === 'price-desc') {
      q = query(productsRef, orderBy('price', 'desc'), limit(limitParam));
    }

    // Fetch products with pagination
    const productsSnapshot = await getDocs(q);
    const products = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Pagination calculation
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limitParam);
    const offset = (page - 1) * limitParam;
    const paginatedProducts = products.slice(offset, offset + limitParam);

    return NextResponse.json({ products: paginatedProducts, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products', error: error.message }, { status: 500 });
  }
}
