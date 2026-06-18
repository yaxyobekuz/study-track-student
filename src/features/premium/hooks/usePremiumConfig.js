// TanStack Query
import { useQuery } from "@tanstack/react-query";

// API
import { premiumAPI } from "@/features/premium/api/premium.api";

// Default config (admin sozlamalari yuklanmaguncha)
const DEFAULT_CONFIG = {
  isEnabled: true,
  coinCost: 100,
  durationDays: 30,
  allowedNameColors: [],
};

/**
 * Fetches the public MBSI Premium config (price, duration, allowed name
 * colors, enabled flag) configured by the admin.
 * @returns {{ config: object, isLoading: boolean }}
 */
const usePremiumConfig = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["premium", "config"],
    staleTime: 5 * 60 * 1000,
    queryFn: () => premiumAPI.getConfig().then((res) => res.data.data),
  });

  return { config: data || DEFAULT_CONFIG, isLoading };
};

export default usePremiumConfig;
