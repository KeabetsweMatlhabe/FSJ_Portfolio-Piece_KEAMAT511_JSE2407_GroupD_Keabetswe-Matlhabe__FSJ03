import { fetchProducts } from './utils/api';
import Layout from './components/Layout';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';

export default async function Home({ searchParams }) {
  const page = searchParams.page || 1;
  // const limit = 20;

  try {
    const data = await fetchProducts(page);
    const products = data || []; 
    // const total = data.total || 0;
    // const totalPages = Math.ceil(total / limit);

    return (
      <Layout>
        {/* <h1>BlackCurrent Store</h1> */}
        <ProductGrid/>
        <Pagination 
          currentPage={page} 
          // totalPages={totalPages} 
          // hasNextPage={page < totalPages}
          // hasPrevPage={page > 1}
        />
      </Layout>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    return (
      <Layout>
        <div>
          <h2>Oops! Something went wrong.</h2>
          <p>We're having trouble loading the products. Please try again later.</p>
        </div>
      </Layout>
    );
  }
}