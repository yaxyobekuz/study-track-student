// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { premiumAPI } from "@/features/premium/api/premium.api";

export const premiumKeys = createQueryKeys("premium");

export const premiumQueries = {
  /**
   * Public MBSI Premium config (price, duration, allowed name colors, enabled
   * flag) configured by the admin. Key: ["premium","config"].
   */
  config: () =>
    queryOptions({
      queryKey: [...premiumKeys.all, "config"],
      staleTime: 5 * 60 * 1000,
      queryFn: () => premiumAPI.getConfig().then((res) => res.data.data),
    }),

  /**
   * Available premium emojis (admin-uploaded lottie configs). Key:
   * ["premium","emojis"]. Loaded once and cached.
   */
  emojis: () =>
    queryOptions({
      queryKey: [...premiumKeys.all, "emojis"],
      staleTime: 5 * 60 * 1000,
      queryFn: () =>
        premiumAPI.getAvailableEmojis().then((res) => res.data.data),
    }),

  /**
   * A lottie animation JSON fetched from a public (S3) URL. Ad-hoc key
   * ["lottie", url] (NOT premium-prefixed) — preserved verbatim. Cached forever
   * and disabled until a url is present.
   */
  lottie: (url) =>
    queryOptions({
      enabled: !!url,
      queryKey: ["lottie", url],
      staleTime: Infinity,
      queryFn: () => fetch(url).then((res) => res.json()),
    }),
};
