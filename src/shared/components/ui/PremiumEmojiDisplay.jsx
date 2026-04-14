import Lottie from "lottie-react";
import { getEmojiAnimation } from "@/shared/data/premiumEmojis.data";

/**
 * Renders a looping Lottie emoji badge for the given emojiId.
 * Renders nothing if emojiId is null/undefined/unrecognized.
 *
 * @param {object} props
 * @param {number|null} props.emojiId
 * @param {string} [props.className] - Size/position classes (default: "size-6")
 */
const PremiumEmojiDisplay = ({ emojiId, className = "size-6" }) => {
  const animationData = getEmojiAnimation(emojiId);
  if (!animationData) return null;

  return (
    <Lottie
      loop
      autoplay
      className={className}
      animationData={animationData}
    />
  );
};

export default PremiumEmojiDisplay;
