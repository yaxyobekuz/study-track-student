// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { achievementsAPI } from "../api/achievements.api";

export const achievementsKeys = createQueryKeys("achievements");

export const achievementsQueries = {
  /** O'quvchining o'z yutuqlari (eng yangisi birinchi). */
  mine: (limit = 5) =>
    queryOptions({
      queryKey: [...achievementsKeys.all, "mine", limit],
      queryFn: () => achievementsAPI.mine(limit).then((r) => r.data),
      staleTime: 5 * 60 * 1000,
    }),
};
