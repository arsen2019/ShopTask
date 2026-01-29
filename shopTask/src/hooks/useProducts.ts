import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type { PaginatedProductsResponse } from '../types/api.types';
import { productsApi } from '../api/services/products.service';
import { queryKeys } from '../api/queryKeys';

export const useInfiniteProducts = () => {
  return useInfiniteQuery<
    PaginatedProductsResponse, 
    Error,                    
    InfiniteData<PaginatedProductsResponse>,
    ReturnType<typeof queryKeys.products.infinite>,
    number
  >({
    queryKey: queryKeys.products.infinite(),
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      productsApi.getPaginatedProducts(pageParam),

    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined,

    getPreviousPageParam: (firstPage) =>
      firstPage.current_page > 1
        ? firstPage.current_page - 1
        : undefined,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};
