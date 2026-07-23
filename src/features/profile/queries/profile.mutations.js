// TanStack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { premiumAPI } from "@/features/premium/api/premium.api";

/**
 * Upload a new profile picture (premium-only). Touches the authenticated
 * profile, so it refreshes ["auth","me"].
 *
 * Cross-feature (literal): ["auth","me"].
 */
export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => premiumAPI.uploadProfilePicture(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

/**
 * Delete the current profile picture (premium-only). Touches the authenticated
 * profile, so it refreshes ["auth","me"].
 *
 * Cross-feature (literal): ["auth","me"].
 */
export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => premiumAPI.deleteProfilePicture(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

/**
 * Set (or change) the user's display name / nickname (premium-only). Touches
 * the authenticated profile, so it refreshes ["auth","me"].
 *
 * Cross-feature (literal): ["auth","me"].
 */
export const useSetDisplayName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name) => premiumAPI.setDisplayName(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

/**
 * Set (or clear) the user's name color (premium-only). Touches the
 * authenticated profile, so it refreshes ["auth","me"].
 *
 * Cross-feature (literal): ["auth","me"].
 */
export const useSetNameColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (color) => premiumAPI.setNameColor(color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
