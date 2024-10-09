// utils/api.js
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
    return data;
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
