// API
import { authAPI } from "../api/auth.api";

// Tanstak Query
import { useQuery } from "@tanstack/react-query";

const useMe = () => {
  const {
    isError,
    data: me,
    isLoading,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const isPremium = me?.premium?.isActive;

  return { isError, me, isLoading, isPremium };
};

export default useMe;
