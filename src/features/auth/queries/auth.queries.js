// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { authAPI } from "../api/auth.api";

export const authKeys = createQueryKeys("auth");

export const authQueries = {
  /**
   * The current authenticated user → user object. Key: ["auth","me"].
   * Base options only (queryKey + queryFn) — consumers that need `enabled`,
   * `staleTime`, `retry`, etc. spread this and add their own:
   * `useQuery({ ...authQueries.me(), enabled: Boolean(token) })`.
   */
  me: () =>
    queryOptions({
      queryKey: [...authKeys.all, "me"],
      queryFn: () => authAPI.getMe().then((res) => res.data.data),
    }),
};
