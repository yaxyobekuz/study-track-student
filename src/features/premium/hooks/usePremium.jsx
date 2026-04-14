// Data
import {
  NAME_COLOR_MAP,
  NAME_COLOR_CLASS_MAP,
} from "@/shared/data/nameColors.data";

// Hooks
import useMe from "@/features/auth/hooks/useMe";

// Components
import PremiumEmojiDisplay from "@/shared/components/ui/PremiumEmojiDisplay";

const usePremium = (user) => {
  let me = null;
  let userData = user;

  if (typeof user !== "object" && Array.isArray(user) === false) {
    const { me: meData } = useMe();

    me = meData;
    userData = meData;
  }

  const isPremium = userData?.premium?.isActive || false;

  const fallbackValue = (value, defaultValue = "") => {
    if (isPremium) return value;
    return defaultValue;
  };

  const premiumNameColorClass = fallbackValue(
    NAME_COLOR_CLASS_MAP[userData?.nameColor],
  );

  const premiumNameColor = fallbackValue(NAME_COLOR_MAP[userData?.nameColor]);

  const PremiumEmojiIcon = fallbackValue(
    ({ ...props }) => (
      <PremiumEmojiDisplay emojiId={userData?.emojiBadgeId} {...props} />
    ),
    HiddenElement,
  );

  return {
    me,
    isPremium,
    user: userData,
    premiumNameColor,
    PremiumEmojiIcon,
    premiumNameColorClass,
  };
};

const HiddenElement = () => <span className="hidden" />;

export default usePremium;
