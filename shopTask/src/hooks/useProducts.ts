import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/services/products.service";
import type {
  PaginatedProductsResponse,
  IProduct,
} from "../types/api.types";

type ProductsCache = {
  items: IProduct[];
  loadedPages: number[];
  lastPage: number;
};

export const useProductsPage = (page: number) => {
  const queryClient = useQueryClient();

  const query = useQuery<ProductsCache>({
    queryKey: ["products", page],

    placeholderData: () =>
      queryClient.getQueryData<ProductsCache>(["products"]),

    queryFn: async () => {
      const cached = queryClient.getQueryData<ProductsCache>(["products"]);

      const loadedPages = cached?.loadedPages ?? [];
      const items = cached?.items ?? [];

      const pagesToFetch: number[] = [];

      for (let p = 1; p <= page; p++) {
        if (!loadedPages.includes(p)) {
          pagesToFetch.push(p);
        }
      }

      if (pagesToFetch.length === 0 && cached) {
        return cached;
      }

      let newItems: IProduct[] = [];
      let lastPageFromApi = cached?.lastPage ?? page;

      for (const p of pagesToFetch) {
        const response: PaginatedProductsResponse =
          await productsApi.getPaginatedProducts(p);

        newItems = [...newItems, ...response.data];
        lastPageFromApi = response.last_page;
      }

      const merged: ProductsCache = {
        items: [...items, ...newItems],
        loadedPages: [...loadedPages, ...pagesToFetch],
        lastPage: lastPageFromApi,
      };

      queryClient.setQueryData(["products"], merged);

      return merged; 
    },

    staleTime: Infinity,
  });

  return {
    products: query.data?.items ?? [],
    lastPage: query.data?.lastPage ?? 1,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  };
};