// TanStack Query
import { useQuery } from "@tanstack/react-query";

// API
import { authAPI } from "@/features/auth/api/auth.api";
import { statisticsAPI } from "@/features/statistics/api/statistics.api";

// Components
import LoaderCard from "@/shared/components/ui/LoaderCard";
import Card from "@/shared/components/ui/Card";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";
import StatisticsTabs from "@/features/statistics/components/StatisticsTabs";
import StatsCharts from "@/features/statistics/components/StatsCharts";

const StatisticsStatsPage = () => {
  const { data: me } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const studentId = me?._id;

  const { data: allStats = [], isLoading } = useQuery({
    queryKey: ["statistics", "all-weekly", studentId],
    queryFn: () =>
      statisticsAPI
        .getAllWeeklyStats(studentId)
        .then((res) => res.data?.data ?? []),
    enabled: !!studentId,
  });

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-4">
        <h1 className="text-blue-500 font-bold text-xl">Statistika</h1>

        <StatisticsTabs />

        {isLoading ? (
          <LoaderCard className="h-64" />
        ) : allStats.length === 0 ? (
          <Card>
            <p className="text-center py-10 text-gray-500">
              Hozircha statistika ma'lumotlari mavjud emas
            </p>
          </Card>
        ) : (
          <StatsCharts allStats={allStats} />
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default StatisticsStatsPage;
