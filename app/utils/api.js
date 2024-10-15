// utils/api.js

// Utility function to format ID as three digits
const formatId = (id) => {
  return id.toString().padStart(3, '0');
};

export const fetchProducts = async ({ page = 1, limit = 20, search = '', category = '', sort = '' }) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (sort === 'price-asc') {
      params.append('sort', 'price');
      params.append('order', 'asc');
    } else if (sort === 'price-desc') {
      params.append('sort', 'price');
      params.append('order', 'desc');
    }

    const url = `/api/products?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    
    // Format the product IDs
    const formattedProducts = data.products.map(product => ({
      ...product,
      id: formatId(product.id), // Format the ID
    }));

    return {
      products: formattedProducts,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalPages: 1 };
  }
};

export async function fetchCategories() {
  try {
    const response = await fetch(`/api/categories`);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Response status:', response.status);
      console.error('Response body:', errorBody);
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function fetchProductById(id) {
  console.log(`Fetching product with ID: ${id}`);
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}
export const addReviewToProduct = async (productId, reviewData) => {
  const token = await getAuth().currentUser.getIdToken(); // Get Firebase ID token
  const response = await fetch(`/api/review/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, ...reviewData }),
  });

  if (!response.ok) {
    throw new Error('Failed to add review');
  }

  return await response.json();
};

// utils/api.js

// Add a new review
// export const addReviewToProduct = async (productId, reviewData) => {
//   try {
//     const response = await fetch(`/api/reviews/add`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ productId, ...reviewData }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to add the review');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Failed to add the review');
//   }
// };

// Update an existing review
export const updateReview = async (productId, reviewId, reviewData) => {
  try {
    const response = await fetch(`/api/reviews/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, reviewId, ...reviewData }),
    });

    if (!response.ok) {
      throw new Error('Failed to update the review');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to update the review');
  }
};

// Delete a review
export async function deleteReview(reviewId) {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete the review');
    }

    return await response.json(); // or response.text() depending on the API response
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}