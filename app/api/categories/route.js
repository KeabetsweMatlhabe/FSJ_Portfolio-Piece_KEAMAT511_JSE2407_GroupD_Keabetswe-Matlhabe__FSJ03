// app/api/categories/route.js
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig'; // Assuming firebaseConfig is initialized in this file

export async function GET() {
  try {
    // Fetch the document containing the categories array
    const categoriesRef = doc(db, 'categories', 'allCategories');
    const categoriesSnap = await getDoc(categoriesRef);

    if (!categoriesSnap.exists()) {
      return NextResponse.json({ error: 'Categories not found' }, { status: 404 });
    }

    // Assuming the document contains an array of category names
    const categoriesData = categoriesSnap.data();
    const categories = categoriesData.categories.map((category, index) => ({
      id: index,      // Use the index as a unique id
      name: category, // The category string itself
    }));

    // Return the fetched categories as JSON
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
