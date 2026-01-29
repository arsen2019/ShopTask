export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (page: number) => [...queryKeys.products.lists(), page] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
    infinite: () => ["products", "infinite"] as const,
  },

  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },
} as const;
