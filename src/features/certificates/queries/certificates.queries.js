// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { certificatesAPI } from "../api/certificates.api";

export const certificatesKeys = createQueryKeys("certificates");

export const certificatesQueries = {
  /**
   * O'z rejalari → `{ student, plans }`.
   * Kalit: ["certificates", "my"]
   */
  my: () =>
    queryOptions({
      queryKey: [...certificatesKeys.all, "my"],
      queryFn: () => certificatesAPI.getMy().then((res) => res.data.data),
    }),
};
