import { api } from '../client';
import type { PaginatedProductsResponse } from '../../types/api.types';

export const productsApi = {

  getPaginatedProducts: async (page: number): Promise<PaginatedProductsResponse> => {
    const response = await api.get<PaginatedProductsResponse>(
      `/api/products/paginate?page=${page}`
    );
    return response.data;
  },

};