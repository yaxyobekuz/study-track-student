// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { coinsAPI } from "../api/coins.api";

// Domain is "coins" (the api file is coins.api.js). The "coins" prefix on these
// keys is invalidated by OTHER features (market / premium / penalties / finance)
// via literal arrays, so it MUST stay exactly ["coins", ...].
export const coinsKeys = createQueryKeys("coins");

export const coinsQueries = {
  /** The student's current coin balance. Unwraps to `{ coinBalance }`. */
  balance: () =>
    queryOptions({
      queryKey: [...coinsKeys.all, "balance"], // ["coins", "balance"]
      queryFn: () => coinsAPI.getBalance().then((res) => res.data.data),
    }),

  /** Paginated coin transactions `{ data, pagination }`. */
  transactions: (page) =>
    queryOptions({
      queryKey: [...coinsKeys.all, "transactions", page], // ["coins", "transactions", page]
      queryFn: () =>
        coinsAPI.getTransactions({ page, limit: 20 }).then((res) => res.data),
      keepPreviousData: true,
    }),
};
