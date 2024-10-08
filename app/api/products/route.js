import { db } from '../../../firebaseConfig'; // Ensure the path is correct
import { collection, getDocs } from 'firebase/firestore';
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
    // Fetch all products to extract categories
    const allProductsSnapshot = await getDocs(productsRef);
    let products = allProductsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Extract unique categories
    const categories = [...new Set(products.map(product => product.category))];

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

    // Sort products by price if sort option is provided
    if (sort === 'price-asc') {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products = products.sort((a, b) => b.price - a.price);
    }

    // Pagination logic
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = products.slice(offset, offset + limit);

    // Return the paginated products and available categories
    return NextResponse.json({ 
      products: paginatedProducts, 
      totalPages, 
      categories  // Send categories to the frontend
    });
  } catch (error) {
    console.error('Error fetching products and categories:', error);
    return NextResponse.json({ message: 'Error fetching products and categories', error: error.message }, { status: 500 });
  }
}
