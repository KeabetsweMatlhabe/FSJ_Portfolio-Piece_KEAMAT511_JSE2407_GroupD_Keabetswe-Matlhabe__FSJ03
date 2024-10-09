import { db } from '../../../firebaseConfig'; // Ensure the path is correct
import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  try {
    // Fetch categories from Firestore
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    const categories = categoriesSnapshot.docs[0].data().categories || [];

    // Fetch products
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    let products = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Filter by category if provided
    if (category) {
      products = products.filter((product) => product.category === category);
    }

    // Apply search filtering if search term is provided
    if (search) {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort products by price
    if (sort === 'price-asc') {
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sort === 'price-desc') {
      products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    // Pagination logic
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = products.slice(offset, offset + limit);

    return NextResponse.json({
      products: paginatedProducts,
      totalPages,
      categories
    });
  } catch (error) {
    console.error('Error fetching products and categories:', error);
    return NextResponse.json({ message: 'Error fetching products and categories', error: error.message }, { status: 500 });
  }
}