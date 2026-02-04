import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/services/products.service";
import type { IProduct } from "../types/api.types";

type ProductsState = {
  items: IProduct[];
  currentPage: number;
  lastPage: number;
};

const INITIAL_STATE: ProductsState = {
  items: [],
  currentPage: 0,
  lastPage: 1,
};

const PRODUCTS_KEY = ["products"] as const;

export const useProductsPage = () => {
  const queryClient = useQueryClient();

  const { data: state = INITIAL_STATE, isLoading } = useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async () => {
      const response = await productsApi.getPaginatedProducts(1);
      return {
        items: response.data,
        currentPage: response.current_page,
        lastPage: response.last_page,
      };
    },
  });

  const loadMoreMutation = useMutation({
    mutationFn: async () => {
      const currentState =
        queryClient.getQueryData<ProductsState>(PRODUCTS_KEY);
      if (!currentState) throw new Error("No current state");

      const nextPage = currentState.currentPage + 1;
      return productsApi.getPaginatedProducts(nextPage);
    },
    onSuccess: (response) => {
      queryClient.setQueryData<ProductsState>(PRODUCTS_KEY, (old) => {
        if (!old) return INITIAL_STATE; 
        return {
          items: [...old.items, ...response.data],
          currentPage: response.current_page,
          lastPage: response.last_page,
        };
      });
    },
  });

  const canLoadMore = state.currentPage < state.lastPage;

  return {
    products: state.items,
    loadMore: loadMoreMutation.mutate,
    isLoading,
    isFetching: loadMoreMutation.isPending,
    canLoadMore,
  };
};
