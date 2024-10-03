export async function fetchProducts({ page = 1, limit = 20, search = '', category = '', sort = '' }) {
  const skip = (page - 1) * limit;
  const params = new URLSearchParams();

  params.append('skip', skip);
  params.append('limit', limit);

  // Add search and category filters if present
  if (search) params.append('title', search); 
  if (category) params.append('category', category); 

  // Add sorting
  if (sort === 'price-asc') {
    params.append('sort', 'price');
    params.append('order', 'asc');
  } else if (sort === 'price-desc') {
    params.append('sort', 'price');
    params.append('order', 'desc');
  }

  try {
    const response = await fetch(`/api/products?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
export async function fetchCategories() {
  try {
    const response = await fetch(`https://next-ecommerce-api.vercel.app/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}