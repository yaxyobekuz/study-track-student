// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { financeAPI } from "../api/finance.api";

/**
 * Finance keys use the legacy "molia" prefix (the CFO/MBSI finance base), NOT
 * "finance" — so `financeKeys.all` === ["molia"] and every finance query nests
 * under it. Kept byte-identical to the pre-refactor inline keys.
 */
export const financeKeys = createQueryKeys("molia");

export const financeQueries = {
  /**
   * The current student's finance snapshot, looked up by full name (the MBSI
   * finance base keys on name). Key: ["molia","finance",fullName]. Returns the
   * unwrapped `{ found, student, payments, requests }`; disabled until a name
   * is present.
   */
  myFinance: (fullName) =>
    queryOptions({
      queryKey: [...financeKeys.all, "finance", fullName],
      queryFn: () => financeAPI.getMyFinance(fullName).then((res) => res.data),
      enabled: !!fullName,
    }),
};
