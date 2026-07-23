// TanStack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { marketAPI } from "../api/market.api";

// Keys
import { marketKeys } from "./market.queries";

/**
 * Place an order for a product. Buying costs coins, so besides the market's own
 * caches this also invalidates the cross-feature coins keys.
 *
 * Own keys (via `marketKeys.all`): ["market","products"], ["market","product",productId],
 * ["market","my-orders"]. Cross-feature (literal): ["coins","balance"], ["coins","transactions"].
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      marketAPI.createOrder({ productId, quantity }),
    onSuccess: (_data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: [...marketKeys.all, "products"] });
      queryClient.invalidateQueries({
        queryKey: [...marketKeys.all, "product", productId],
      });
      queryClient.invalidateQueries({
        queryKey: [...marketKeys.all, "my-orders"],
      });
      queryClient.invalidateQueries({ queryKey: ["coins", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "transactions"] });
    },
  });
};

/**
 * Cancel one of the student's own orders. Refunds coins, so this invalidates the
 * market's own caches plus the cross-feature coins keys.
 *
 * Own keys (via `marketKeys.all`): ["market","my-orders"], ["market","products"].
 * Cross-feature (literal): ["coins","balance"], ["coins","transactions"].
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => marketAPI.cancelMyOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...marketKeys.all, "my-orders"],
      });
      queryClient.invalidateQueries({ queryKey: [...marketKeys.all, "products"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "transactions"] });
    },
  });
};
