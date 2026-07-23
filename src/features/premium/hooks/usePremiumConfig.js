// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Queries
import { premiumQueries } from "@/features/premium/queries/premium.queries";

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
  const { data, isLoading } = useQuery(premiumQueries.config());

  return { config: data || DEFAULT_CONFIG, isLoading };
};

export default usePremiumConfig;
