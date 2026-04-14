// Utils
import { cn } from "@/shared/utils/cn";

// Components
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/shadcn/avatar";
import PremiumEmojiDisplay from "./PremiumEmojiDisplay";

const SIZE_AVATAR = { sm: "size-8", md: "size-10", lg: "size-14" };
const SIZE_BADGE = { sm: "size-5", md: "size-6", lg: "size-8" };

const StudentAvatar = ({
  isPremium,
  size = "md",
  emojiBadgeId,
  className = "",
  profilePictureUrl,
  fallbackName = "",
}) => {
  const avatarSize = SIZE_AVATAR[size] ?? SIZE_AVATAR.md;
  const badgeSize = SIZE_BADGE[size] ?? SIZE_BADGE.md;

  const initials = fallbackName?.[0]?.toUpperCase() || "?";

  return (
    <Avatar
      className={cn("relative inline-flex shrink-0", avatarSize, className)}
    >
      {isPremium && profilePictureUrl && (
        <AvatarImage src={profilePictureUrl} alt={fallbackName} />
      )}
      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold object-cover">
        {initials}
      </AvatarFallback>

      {isPremium && emojiBadgeId && (
        <div className="absolute -bottom-1 -right-1">
          <PremiumEmojiDisplay emojiId={emojiBadgeId} className={badgeSize} />
        </div>
      )}
    </Avatar>
  );
};

export default StudentAvatar;
