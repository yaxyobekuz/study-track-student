// React
import { useState } from "react";

// Icons
import { Trophy } from "lucide-react";

// Utils
import { cn } from "@/shared/utils/cn";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Static data
import { NAME_COLOR_CLASS_MAP } from "@/shared/data/nameColors.data";

// API
import { authAPI } from "@/features/auth/api/auth.api";
import { statisticsAPI } from "@/features/statistics/api/statistics.api";

// Components
import Counter from "@/shared/components/ui/Counter";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import List, { ListItem } from "@/shared/components/ui/List";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";
import StudentAvatar from "@/shared/components/ui/StudentAvatar";
import StatisticsTabs from "@/features/statistics/components/StatisticsTabs";
import PremiumEmojiDisplay from "@/shared/components/ui/PremiumEmojiDisplay";

const StatisticsScoreboardPage = () => {
  const [page, setPage] = useState(1);

  const { data: me } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const studentId = me?._id;

  const { data: myStats } = useQuery({
    queryKey: ["statistics", "student-weekly", studentId],
    queryFn: () =>
      statisticsAPI
        .getStudentWeekly(studentId)
        .then((res) => res.data?.data || null),
  });

  const { data: rankingsData, isLoading } = useQuery({
    queryKey: ["statistics", "school-rankings", page],
    queryFn: () =>
      statisticsAPI
        .getSchoolRankings({ page, limit: 50 })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const rankings = rankingsData?.data?.rankings || [];
  const pagination = rankingsData?.pagination;

  const myIsPremium = me?.premium?.isActive;
  const myProfilePictureUrl = me?.profilePicture?.variants?.sm?.url || null;

  return (
    <div className="min-h-screen pb-36 bg-gray-100 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-4">
        <h1 className="text-blue-500 font-bold text-xl">Haftalik reyting</h1>

        <StatisticsTabs />

        {/* O'z natijasi */}
        {myStats && (
          <ListItem
            icon={
              myIsPremium
                ? () => (
                    <StudentAvatar
                      isPremium
                      fallbackName={me?.fullName || ""}
                      className="rounded-none size-full"
                      profilePictureUrl={myProfilePictureUrl}
                      emojiBadgeId={me?.emojiBadgeId || null}
                    />
                  )
                : Trophy
            }
            className="rounded-2xl"
            gradientTo="to-green-700"
            gradientFrom="from-green-400"
            title={
              myIsPremium && me?.displayName
                ? me.displayName
                : me?.fullName || "..."
            }
            titleClassName={
              myIsPremium && me?.nameColor
                ? NAME_COLOR_CLASS_MAP[me.nameColor]
                : ""
            }
            trailing={
              <div className="text-right">
                <p className="text-xs text-gray-500">Ball</p>
                <p className="font-bold text-lg text-primary leading-tight">
                  <Counter value={myStats.simpleStats?.totalSum ?? 0} />
                </p>
              </div>
            }
          />
        )}

        {/* Reyting ro'yxati */}
        {isLoading ? (
          <LoaderCard className="h-64" />
        ) : rankings.length === 0 ? (
          <ListItem
            icon={Trophy}
            className="rounded-2xl"
            gradientTo="to-gray-400"
            title="Natija topilmadi"
            gradientFrom="from-gray-300"
            description="Joriy haftada hech qanday natija mavjud emas"
          />
        ) : (
          <List
            items={rankings.map((item) => {
              const isMe = item.student._id === me?._id;
              const isPremium = item.student.premium?.isActive;
              const description = item?.classes?.map((c) => c.name).join(", ");

              const displayTitle =
                isPremium && item.student.displayName
                  ? item.student.displayName
                  : item.student.fullName;

              const titleColor =
                isPremium && item.student.nameColor
                  ? NAME_COLOR_CLASS_MAP[item.student.nameColor] || ""
                  : "";

              const Icon = isPremium
                ? () => (
                    <StudentAvatar
                      isPremium
                      className="rounded-none size-full"
                      fallbackName={item.student.fullName || ""}
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
                    <span className="font-bold text-base text-primary">
                      {item.totalSum}
                    </span>
                  </div>
                ),
              };
            })}
          />
        )}

        {/* Pagination */}
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
      </div>

      <BottomNavbar />
    </div>
  );
};

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

export default StatisticsScoreboardPage;
