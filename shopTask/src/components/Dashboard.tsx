import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import ProductModal from "../components/ProductModal";
import { useInfiniteProducts } from "../hooks/useProducts";
import type { IProduct } from "../types/api.types";

// const PAGE_SIZE = 2;

const Dashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPageFromUrl = Number(searchParams.get("page")) || 1;

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteProducts();

  const [visiblePages, setVisiblePages] = useState(initialPageFromUrl);
  const totalPages = data?.pages[0]?.last_page ?? 0;

  const canLoadMore = visiblePages < totalPages;
  const canLoadPrevious = visiblePages > 1;

  const allProducts = useMemo<IProduct[]>(() => {
    if (!data) return [];

    return data.pages.slice(0, visiblePages).flatMap((page) => page.data);
  }, [data, visiblePages]);

  const handleLoadMore = async () => {
    if (visiblePages >= (data?.pages.length ?? 0) && hasNextPage) {
      await fetchNextPage();
    }

    setVisiblePages((prev) => prev + 1);
    setSearchParams({ page: String(visiblePages + 1) });
  };

  const handleLoadPrevious = () => {
    if (visiblePages <= 1) return;

    setVisiblePages((prev) => prev - 1);
    setSearchParams({ page: String(visiblePages - 1) });
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Menu</h1>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allProducts.map((product) => (
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
                      className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isFetchingNextPage && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
                <p className="text-gray-600 mt-2">Loading more products...</p>
              </div>
            )}

            <div className="pagination flex gap-5 justify-end mt-6">
              {canLoadPrevious && (
                <button
                  onClick={handleLoadPrevious}
                  className="px-6 py-2 border rounded text-gray-100 bg-[#792573] hover:bg-[#7925749f]"
                >
                  Load Previous
                </button>
              )}

              {canLoadMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 border rounded disabled:opacity-50 text-gray-100 bg-[#792573] hover:bg-[#7925749f]"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
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