// Tanstak Query
import { useQuery } from "@tanstack/react-query";

// Queries
import { authQueries } from "../queries/auth.queries";

const useMe = () => {
  const { isError, data: me, isLoading } = useQuery(authQueries.me());

  const isPremium = me?.premium?.isActive;
  const mySmProfilePictureUrl = me?.profilePicture?.variants?.sm?.url || null;
  const myMdProfilePictureUrl = me?.profilePicture?.variants?.md?.url || null;
  const myLgProfilePictureUrl = me?.profilePicture?.variants?.lg?.url || null;

  return {
    me,
    isError,
    isLoading,
    isPremium,
    myId: me?.id,
    mySmProfilePictureUrl,
    myMdProfilePictureUrl,
    myLgProfilePictureUrl,
    isMePremium: isPremium,
    myIsPremium: isPremium,
  };
};

export default useMe;
