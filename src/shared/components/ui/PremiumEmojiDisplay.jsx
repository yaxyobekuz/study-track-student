// Lottie
import Lottie from "lottie-react";

// Utils
import { cn } from "@/shared/utils/cn";

// Hooks
import { usePremiumEmojiAnimation } from "@/features/premium/hooks/usePremiumEmojis";

/**
 * Renders a premium emoji badge (lottie animation) by its EmojiConfig _id.
 * Animatsiya S3 dagi .json fayldan onlayn yuklab ko'rsatiladi.
 * @param {object} props
 * @param {string} props.emojiId - EmojiConfig _id.
 * @param {string} [props.className]
 */
const PremiumEmojiDisplay = ({ emojiId, className = "size-6" }) => {
  const animationData = usePremiumEmojiAnimation(emojiId);
  if (!animationData) return null;

  return (
    <Lottie
      loop
      autoplay
      animationData={animationData}
      className={cn("shrink-0", className)}
    />
  );
};

export default PremiumEmojiDisplay;
