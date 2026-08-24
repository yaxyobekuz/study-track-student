// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { financeAPI } from "../api/finance.api";

/**
 * Kalit prefiksi "finance" — ilgari eski MBSI Molia bazasi uchun "molia" edi.
 * O'sha integratsiya olib tashlangani uchun to'qnashuv yo'q.
 */
export const financeKeys = createQueryKeys("finance");

export const financeQueries = {
  /**
   * O'quvchining o'z moliyaviy manzarasi: tarif, o'quv yili, moliyaviy holat,
   * oylik majburiyatlar va qarz. `enabled` shart emas — server o'quvchini
   * tokendan aniqlaydi.
   */
  myFinance: () =>
    queryOptions({
      queryKey: [...financeKeys.all, "my"],
      queryFn: () =>
        financeAPI
          .getMyFinance()
          .then((res) => res.data.data),
    }),
};
