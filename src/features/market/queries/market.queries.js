// TanStack Query
import { queryOptions, keepPreviousData } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { marketAPI } from "../api/market.api";

export const marketKeys = createQueryKeys("market");

export const marketQueries = {
  /**
   * Paginated product catalogue. Key: ["market","products",page].
   * Returns `{ data, pagination }`; keeps the previous page while the next loads.
   */
  products: (page) =>
    queryOptions({
      queryKey: [...marketKeys.all, "products", page],
      queryFn: () =>
        marketAPI
          .getProducts({ page, limit: 12 })
          .then((response) => response.data),
      placeholderData: keepPreviousData,
    }),

  /**
   * A single product by id. Key: ["market","product",id].
   * Returns the unwrapped product; disabled until an id is present.
   */
  product: (id) =>
    queryOptions({
      queryKey: [...marketKeys.all, "product", id],
      queryFn: () =>
        marketAPI.getProductById(id).then((response) => response.data.data),
      enabled: Boolean(id),
    }),

  /**
   * The current student's own orders. Key: ["market","my-orders",page].
   * Returns `{ data, pagination }`.
   */
  myOrders: (page) =>
    queryOptions({
      queryKey: [...marketKeys.all, "my-orders", page],
      queryFn: () =>
        marketAPI
          .getMyOrders({ page, limit: 20 })
          .then((response) => response.data),
    }),
};
