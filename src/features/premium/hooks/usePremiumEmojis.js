// TanStack Query
import { useQuery } from "@tanstack/react-query";

// API
import { premiumAPI } from "@/features/premium/api/premium.api";

/**
 * Shared hook for premium emojis.
 *
 * Premium emojilar admin tomonidan lottie (.json) fayl sifatida yuklanadi va
 * S3 da saqlanadi. Bu hook ularning ro'yxatini bir marta yuklab keshlaydi va
 * id bo'yicha tez qidirish uchun map qaytaradi.
 *
 * @returns {{ emojis: object[], byId: Record<string, object>, isLoading: boolean }}
 */
export const usePremiumEmojis = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["premium", "emojis"],
    staleTime: 5 * 60 * 1000,
    queryFn: () => premiumAPI.getAvailableEmojis().then((res) => res.data.data),
  });

  const emojis = data || [];
  const byId = emojis.reduce((acc, emoji) => {
    acc[emoji.id] = emoji;
    return acc;
  }, {});

  return { emojis, byId, isLoading };
};

/**
 * Loads (and caches) a lottie animation JSON from a public URL.
 * @param {string} url - Animation .json URL (S3).
 * @returns {object|null} lottie-react `animationData`
 */
export const useEmojiAnimation = (url) => {
  const { data } = useQuery({
    enabled: !!url,
    queryKey: ["lottie", url],
    staleTime: Infinity,
    queryFn: () => fetch(url).then((res) => res.json()),
  });

  return data || null;
};

/**
 * Resolves an emoji (by its id) to its lottie `animationData`.
 * @param {string} emojiId - EmojiConfig id.
 * @returns {object|null}
 */
export const usePremiumEmojiAnimation = (emojiId) => {
  const { byId } = usePremiumEmojis();
  const url = emojiId ? byId[emojiId]?.animationUrl : null;
  return useEmojiAnimation(url);
};

export default usePremiumEmojis;
