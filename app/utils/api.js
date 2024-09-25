export async function fetchProducts(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  try {
    const response = await fetch(`https://next-ecommerce-api.vercel.app/products?skip=${skip}&limit=${limit}`);
    
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

