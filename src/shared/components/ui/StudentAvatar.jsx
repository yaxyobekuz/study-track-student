// React
import { useState } from "react";

// Utils
import { cn } from "@/shared/utils/cn";

const SIZE_AVATAR = { sm: "size-8", md: "size-10", lg: "size-14" };

const StudentAvatar = ({
  isPremium,
  size = "md",
  profilePictureUrl,
  fallbackName = "",
  className = "rounded-full",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const avatarSize = SIZE_AVATAR[size] ?? SIZE_AVATAR.md;
  const initials = fallbackName?.[0]?.toUpperCase() || "?";

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden",
        avatarSize,
        className,
      )}
    >
      {/* Img */}
      {isPremium && profilePictureUrl && (
        <img
          alt={fallbackName}
          src={profilePictureUrl}
          onLoad={() => setIsLoaded(true)}
          className="size-full object-cover"
          onError={(e) => setIsLoaded(false)}
        />
      )}

      {/* Fallback initials */}
      <div
        className={cn(
          "flex items-center justify-center absolute inset-0 size-full bg-blue-100 text-blue-700 font-semibold transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100",
        )}
      >
        {initials}
      </div>
    </div>
  );
};

export default StudentAvatar;
