// TanStack Query
import { queryOptions, keepPreviousData } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { penaltiesAPI } from "../api/penalties.api";

export const penaltiesKeys = createQueryKeys("penalties");

export const penaltiesQueries = {
  /**
   * The current student's own penalties. Paginated `{ data, pagination }`;
   * keeps the previous page while the next loads.
   * Key: ["penalties", "my", page]
   */
  my: (page) =>
    queryOptions({
      queryKey: [...penaltiesKeys.all, "my", page],
      queryFn: () =>
        penaltiesAPI.getMyPenalties({ page, limit: 20 }).then((res) => res.data),
      placeholderData: keepPreviousData,
    }),

  /**
   * Fine-reduction packages available for purchase.
   * Key: ["penalties", "reduction-packages"]
   */
  reductionPackages: () =>
    queryOptions({
      queryKey: [...penaltiesKeys.all, "reduction-packages"],
      queryFn: () =>
        penaltiesAPI.getReductionPackages().then((res) => res.data.data),
    }),

  /**
   * Penalty settings (fine amount, premium reduction discount, etc.).
   * Key: ["penalties", "settings"]
   */
  settings: () =>
    queryOptions({
      queryKey: [...penaltiesKeys.all, "settings"],
      queryFn: () => penaltiesAPI.getSettings().then((res) => res.data.data),
    }),
};
