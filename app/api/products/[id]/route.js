// /app/api/products/[id]/route.js
import { db } from '../../../../firebaseConfig'; // Ensure the path is correct
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params; // Get the product ID from the URL parameters

  try {
    const productRef = doc(db, 'products', id);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ id: productSnapshot.id, ...productSnapshot.data() });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Error fetching product', error: error.message }, { status: 500 });
  }
}
