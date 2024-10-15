// pages/api/products.js
import { db } from '../../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
    // Reference to the products collection
    const productsRef = collection(db, 'products');
    let productsSnapshot;

    // Apply Firestore queries for filtering if category is provided
    if (category) {
      const categoryQuery = query(productsRef, where('category', '==', category));
      productsSnapshot = await getDocs(categoryQuery);
    } else {
      productsSnapshot = await getDocs(productsRef);
    }

    // Map the documents to an array
    let products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Apply Fuse.js for searching if a search term is provided
    if (search) {
      const fuse = new Fuse(products, {
        keys: ['title'], // Specify the fields to search
        threshold: 0.3, // Adjust sensitivity (lower is more strict)
      });
      const searchResults = fuse.search(search);
      products = searchResults.map((result) => result.item); // Extract matched items
    }

    // Apply sorting if a sort parameter is provided
    if (sort) {
      products.sort((a, b) => {
        if (sort === 'price-asc') {
          return a.price - b.price; // Ascending price
        } else if (sort === 'price-desc') {
          return b.price - a.price; // Descending price
        }
        return 0; // No sorting
      });
    }

    // Pagination logic
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limitParam);
    const offset = (page - 1) * limitParam;
    const paginatedProducts = products.slice(offset, offset + limitParam);

    // Return the processed products
    return NextResponse.json({
      products: paginatedProducts,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Error fetching products', error: error.message },
      { status: 500 }
    );
  }
}
