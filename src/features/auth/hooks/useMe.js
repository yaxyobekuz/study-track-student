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
  const mySmProfilePictureUrl = me?.profilePicture?.variants?.sm?.url || null;
  const myMdProfilePictureUrl = me?.profilePicture?.variants?.md?.url || null;
  const myLgProfilePictureUrl = me?.profilePicture?.variants?.lg?.url || null;

  return {
    me,
    isError,
    isLoading,
    isPremium,
    myId: me?._id,
    mySmProfilePictureUrl,
    myMdProfilePictureUrl,
    myLgProfilePictureUrl,
    isMePremium: isPremium,
    myIsPremium: isPremium,
  };
};

export default useMe;
