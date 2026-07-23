// TanStack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { premiumAPI } from "@/features/premium/api/premium.api";

// Keys
import { premiumKeys } from "./premium.queries";

/**
 * Buy MBSI Premium. Spends coins and flips the user's premium status, so it
 * refreshes both the premium status and the authenticated profile.
 *
 * Own key (via `premiumKeys.all`): ["premium","status"].
 * Cross-feature (literal): ["auth","me"].
 */
export const useBuyPremium = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => premiumAPI.buyPremium(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({
        queryKey: [...premiumKeys.all, "status"],
      });
    },
  });
};

/**
 * Set (or change) the user's animated emoji badge. Only touches the profile.
 *
 * Cross-feature (literal): ["auth","me"].
 */
export const useSetEmojiBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emojiId) => premiumAPI.setEmojiBadge(emojiId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
