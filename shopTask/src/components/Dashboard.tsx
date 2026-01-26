import { useEffect, useState, useRef } from "react";
import authFetch from "../api/fetcher.ts";
import ProductModal from "../components/ProductModal.tsx";
import Navbar from "../layouts/Navbar.tsx";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

  useEffect(() => {
    const loadPages = async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      
      try {
        const pagesToFetch: number[] = [];
        
        if (isInitialLoadRef.current) {
          for (let i = 1; i <= pageFromUrl; i++) {
            if (!loadedPagesRef.current.has(i)) {
              pagesToFetch.push(i);
            }
          }
          isInitialLoadRef.current = false;
        } else {
          if (!loadedPagesRef.current.has(currentPage)) {
            pagesToFetch.push(currentPage);
          }
        }

        if (pagesToFetch.length === 0) {
          setIsLoading(false);
          return;
        }

        const requests = pagesToFetch.map((pageNum) =>
          authFetch(`/api/products/paginate?page=${pageNum}`)
        );

        const responses = await Promise.all(requests);
        
        const newProducts = responses.flatMap((r) => r.data);
        
        setProducts((prev) => {
          const combined = [...prev, ...newProducts];
          const unique = Array.from(
            new Map(combined.map((p) => [p.id, p])).values()
          );
          return unique;
        });

        pagesToFetch.forEach((pageNum) => {
          loadedPagesRef.current.add(pageNum);
        });

        const lastResponse = responses[responses.length - 1];
        setHasMore(lastResponse.current_page < lastResponse.last_page);
        
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPages();
  }, [currentPage, pageFromUrl]);

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleLoadPrevious = () => {
    if (currentPage <= 1) return;
    
    setProducts((prev) => {
      const productsPerPage = 2;
      return prev.slice(0, -productsPerPage);
    });
    
    loadedPagesRef.current.delete(currentPage);
    
    setCurrentPage((prev) => prev - 1);
    
    setHasMore(true);
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Menu</h1>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 shadow">
                  <img
                    src={`http://localhost:4000${product.picture}`}
                    alt={product.name}
                    className="h-40 w-full rounded object-contain"
                  />
                  <h3 className="mt-2 font-semibold text-gray-800">
                    {product.name}
                  </h3>
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

            {isLoading && products.length > 0 && (
              <div className="text-center py-4">
                <p className="text-gray-600">Loading more products...</p>
              </div>
            )}

            <div className="pagination flex gap-5 justify-end mt-6">
              {currentPage > 1 && (
                <button
                  onClick={handleLoadPrevious}
                  disabled={isLoading}
                  className="px-6 py-2 border rounded disabled:opacity-50 text-gray-100 bg-[#792573] hover:bg-[#7925749f] transition-colors"
                >
                  Load Previous
                </button>
              )}
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-2 border rounded disabled:opacity-50 text-gray-100 bg-[#792573] hover:bg-[#7925749f] transition-colors"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          </>
        )}

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