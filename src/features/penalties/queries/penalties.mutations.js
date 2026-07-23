// TanStack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { penaltiesAPI } from "../api/penalties.api";

// Keys
import { penaltiesKeys } from "./penalties.queries";

/**
 * Purchase a fine-reduction package. Invalidates the student's own penalties
 * list (["penalties", "my"]) and the cross-feature caches that the purchase
 * touches: the profile (["auth", "me"]) and the coin balance / transactions
 * (["coins", ...]). Cross-feature keys stay as literal arrays.
 */
export const usePurchaseReductionPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => penaltiesAPI.purchaseReductionPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({
        queryKey: [...penaltiesKeys.all, "my"],
      });
      queryClient.invalidateQueries({ queryKey: ["coins", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "balance"] });
    },
  });
};
