// React
import { useState } from "react";

// Icons
import { Coins } from "lucide-react";

// Utils
import { cn } from "@/shared/utils/cn";

// Hooks
import useMe from "@/features/auth/hooks/useMe";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Static data
import { NAME_COLOR_CLASS_MAP } from "@/shared/data/nameColors.data";

// API
import { statisticsAPI } from "@/features/statistics/api/statistics.api";

// Components
import LoaderCard from "@/shared/components/ui/LoaderCard";
import List, { ListItem } from "@/shared/components/ui/List";
import StudentAvatar from "@/shared/components/ui/StudentAvatar";
import PremiumEmojiDisplay from "@/shared/components/ui/PremiumEmojiDisplay";

const getRankProps = (rank) => {
  if (rank === 1) {
    return {
      gradientFrom: "from-yellow-400",
      gradientTo: "to-yellow-700",
      className:
        "bg-gradient-to-tr from-yellow-50 to-white border-2 border-yellow-300",
    };
  }
  if (rank === 2) {
    return {
      gradientFrom: "from-gray-400",
      gradientTo: "to-gray-700",
      className:
        "bg-gradient-to-tr from-gray-50 to-white border-2 border-gray-300",
    };
  }
  if (rank === 3) {
    return {
      gradientFrom: "from-orange-400",
      gradientTo: "to-orange-700",
      className:
        "bg-gradient-to-tr from-orange-50 to-white border-2 border-orange-300",
    };
  }
  return {
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-700",
  };
};

const StatisticsCoinsPage = () => {
  const [page, setPage] = useState(1);
  const { me, myId, myIsPremium, mySmProfilePictureUrl } = useMe();

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["statistics", "coin-leaderboard", page],
    queryFn: () =>
      statisticsAPI
        .getCoinLeaderboard({ page, limit: 50 })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const rankings = leaderboardData?.data || [];
  const pagination = leaderboardData?.pagination;

  const myEntry = rankings.find((item) => item.student._id === myId);

  if (isLoading) {
    return <LoaderCard className="h-64" />;
  }

  if (!rankings.length) {
    return (
      <ListItem
        icon={Coins}
        className="rounded-2xl"
        gradientTo="to-gray-400"
        gradientFrom="from-gray-300"
        title="Natija topilmadi"
        description="Hech qanday ma'lumot mavjud emas"
      />
    );
  }

  return (
    <>
      {myEntry && (
        <ListItem
          icon={
            myIsPremium
              ? () => (
                  <StudentAvatar
                    isPremium
                    fallbackName={me?.fullName || ""}
                    className="rounded-none size-full"
                    profilePictureUrl={mySmProfilePictureUrl}
                  />
                )
              : Coins
          }
          className="rounded-2xl"
          gradientTo="to-amber-700"
          gradientFrom="from-amber-400"
          title={
            myIsPremium && me?.displayName ? me.displayName : me?.fullName || "..."
          }
          titleClassName={
            myIsPremium && me?.nameColor ? NAME_COLOR_CLASS_MAP[me.nameColor] : ""
          }
          trailing={
            <div className="text-right">
              <p className="text-xs text-gray-500">Tanga</p>
              <p className="font-bold text-lg text-amber-500 leading-tight">
                {myEntry.student.coinBalance ?? 0}
              </p>
            </div>
          }
        />
      )}

      <List
        items={rankings.map((item) => {
          const isMe = item.student._id === myId;
          const isPremium = item.student.premium?.isActive;
          const description = item.student.classes?.map((c) => c.name).join(", ");

          const displayTitle =
            isPremium && item.student.displayName
              ? item.student.displayName
              : `${item.student.firstName} ${item.student.lastName || ""}`.trim();

          const titleColor =
            isPremium && item.student.nameColor
              ? NAME_COLOR_CLASS_MAP[item.student.nameColor] || ""
              : "";

          const Icon = isPremium
            ? () => (
                <StudentAvatar
                  isPremium
                  className="rounded-none size-full"
                  fallbackName={`${item.student.firstName} ${item.student.lastName || ""}`}
                  emojiBadgeId={item.student.emojiBadgeId || null}
                  profilePictureUrl={item.student.profilePictureUrl || null}
                />
              )
            : () => (
                <span className="font-bold text-white text-xs xs:text-sm">
                  {item.rank}
                </span>
              );

          const rankProps = getRankProps(item.rank);

          return {
            description,
            icon: Icon,
            key: item.student._id,
            title: displayTitle,
            titleClassName: titleColor,
            className: cn(
              isMe ? "border-2 border-primary" : "",
              isPremium && !isMe ? "ring-2 ring-yellow-300" : "",
              rankProps.className,
            ),
            gradientFrom: rankProps.gradientFrom,
            gradientTo: rankProps.gradientTo,
            trailing: (
              <div className="flex items-center gap-1">
                {isPremium && item.student.emojiBadgeId && (
                  <PremiumEmojiDisplay
                    emojiId={item.student.emojiBadgeId}
                    className="size-5"
                  />
                )}
                <span className="font-bold text-base text-amber-500">
                  {item.student.coinBalance ?? 0}
                </span>
              </div>
            ),
          };
        })}
      />

      {pagination?.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-md bg-white disabled:opacity-50"
          >
            Oldingi
          </button>
          <span className="text-gray-500">
            {page} / {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded-md bg-white disabled:opacity-50"
          >
            Keyingi
          </button>
        </div>
      )}
    </>
  );
};

export default StatisticsCoinsPage;
