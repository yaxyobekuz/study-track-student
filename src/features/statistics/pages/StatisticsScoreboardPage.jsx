// React
import { useState } from "react";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Icons
import { Trophy } from "lucide-react";

// Components
import List, { ListItem } from "@/shared/components/ui/List";
import Counter from "@/shared/components/ui/Counter";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";
import StatisticsTabs from "@/features/statistics/components/StatisticsTabs";

// API
import { authAPI } from "@/features/auth/api/auth.api";
import { statisticsAPI } from "@/features/statistics/api/statistics.api";

const StatisticsScoreboardPage = () => {
  const [page, setPage] = useState(1);

  const { data: me } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const studentId = me?._id;

  // O'z haftalik natijasi (dashboard da allaqachon cached)
  const { data: myStats } = useQuery({
    queryKey: ["statistics", "student-weekly", studentId],
    queryFn: () =>
      statisticsAPI
        .getStudentWeekly(studentId)
        .then((res) => res.data?.data || null),
    enabled: !!studentId,
  });

  // Maktab bo'yicha reyting ro'yxati
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

  return (
    <div className="min-h-screen pb-36 bg-gray-100 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-4">
        <h1 className="text-blue-500 font-bold text-xl">Haftalik reyting</h1>

        <StatisticsTabs />

        {/* O'z natijasi */}
        {myStats && (
          <ListItem
            icon={Trophy}
            className="rounded-2xl"
            gradientTo="to-green-700"
            gradientFrom="from-green-400"
            title={me?.fullName || "..."}
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
            gradientFrom="from-gray-300"
            gradientTo="to-gray-400"
            title="Natija topilmadi"
            description="Joriy haftada hech qanday natija mavjud emas"
            className="rounded-2xl"
          />
        ) : (
          <List
            items={rankings.map((item) => {
              const isMe = item.student._id === me?._id;
              const description = item?.classes?.map((c) => c.name).join(", ");

              const Icon = () => (
                <span className="font-bold text-white text-xs xs:text-sm">
                  {item.rank}
                </span>
              );

              return {
                description,
                icon: Icon,
                key: item.student._id,
                title: item.student.fullName,
                className: isMe ? "border-2 border-primary" : "",
                ...getRankProps(item.rank),
                trailing: (
                  <span className="font-bold text-base text-primary">
                    {item.totalSum}
                  </span>
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
        "bg-gradient-to-bl from-yellow-50 via-white to-yellow-100 border border-yellow-200",
    };
  }

  if (rank === 2) {
    return {
      gradientFrom: "from-gray-400",
      gradientTo: "to-gray-700",
      className:
        "bg-gradient-to-bl from-gray-50 via-white to-gray-100 border border-gray-200",
    };
  }

  if (rank === 3) {
    return {
      gradientFrom: "from-orange-400",
      gradientTo: "to-orange-700",
      className:
        "bg-gradient-to-bl from-orange-50 via-white to-orange-100 border border-orange-200",
    };
  }

  return {
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-700",
  };
};

export default StatisticsScoreboardPage;
