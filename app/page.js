import { fetchProducts } from './utils/api';
import Layout from './components/Layout';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import Header from './components/Header';
import Navbar from './components/Navbar'; // Import the Navbar component

export default async function Home({ searchParams }) {
  const page = searchParams.page || 1;

  try {
    const data = await fetchProducts(page);
    const products = data || []; 

    return (
      <Layout>
        <Header />
        <Navbar />
        
        {/* Main content: Product Grid and Pagination */}
        <ProductGrid products={products} />
        <Pagination 
          currentPage={page} 
        />
      </Layout>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    return (
      <Layout>
        <Header />
        <Navbar />
        <div>
          <h2>Oops! Something went wrong.</h2>
          <p>Were having trouble loading the products. Please try again later.</p>
        </div>
      </Layout>
    );
  }
}
