// Lottie
import Lottie from "lottie-react";

// Utils
import { cn } from "@/shared/utils/cn";

// Data
import { getEmojiAnimation } from "@/shared/data/premiumEmojis.data";

const PremiumEmojiDisplay = ({ emojiId, className = "size-6" }) => {
  const animationData = getEmojiAnimation(emojiId);
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
