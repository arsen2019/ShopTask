import { useEffect, useState, useRef } from 'react';
import  authFetch  from '../api/fetcher.ts';
import ProductModal from '../components/ProductModal.tsx';
import Navbar from  '../layouts/Navbar.tsx';

interface IProduct {
  id: number;
  name: string;
  picture: string;
  price: number;
  description: string;
}

const Dashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const [products, setProducts] = useState<IProduct[]>([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const hasFetchedOnce = useRef(false);

useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await authFetch(`/api/products/paginate?page=${page}`);

      setProducts(prev => [...prev, ...res.data]);
      setHasMore(res.current_page < res.last_page);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  // 🔒 StrictMode guard (DEV only)
  if (page === 1 && hasFetchedOnce.current) return;
  hasFetchedOnce.current = true;

  loadProducts();
}, [page]);
  
  
    
      
  

  

  return (
    <div className="flex flex-col ">
    <Navbar/>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow ">
            <img
              src={`http://localhost:4000${product.picture}`}
              alt={product.name}
              className="h-40 w-full  rounded object-contain"
            />
            <h3 className="mt-2 font-semibold text-gray-800">{product.name}</h3>
            <div className="flex justify-around items-center mt-4">
              
              <p className="text-gray-600">${product.price}</p>

            <button
              onClick={() => setSelectedProduct(product)}
              className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
            >
              Details
            </button>
            </div>
            

          </div>
        ))}
      </div>
      <div className="pagination flex  justify-end">

          {hasMore && (
      <div className="text-center mt-6">
        <button
          // disabled={isLoading}
          onClick={() => setPage(prev => prev + 1)}
          className="px-6 py-2 border rounded disabled:opacity-50 text-gray-100 bg-[#792573]"  
        >
          {/* {isLoading ? 'Loading...' : 'Load more'} */} Load More
        </button>
      </div>
    )}
      </div>



      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
    </div>
    
  );
};

export default Dashboard;
