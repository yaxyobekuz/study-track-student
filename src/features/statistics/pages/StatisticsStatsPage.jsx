// Hooks
import useMe from "@/features/auth/hooks/useMe";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Components
import Card from "@/shared/components/ui/Card";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import StatsCharts from "@/features/statistics/components/StatsCharts";

// API
import { statisticsAPI } from "@/features/statistics/api/statistics.api";

const StatisticsStatsPage = () => {
  const { me, myId } = useMe();

  const { data: allStats = [], isLoading } = useQuery({
    queryKey: ["statistics", "all-weekly", myId],
    queryFn: () =>
      statisticsAPI.getAllWeeklyStats(myId).then((res) => res.data?.data ?? []),
  });

  if (isLoading) {
    return <LoaderCard className="h-64" />;
  }

  if (!allStats?.length) {
    return (
      <Card className="text-center py-10 text-gray-500">
        Statistika ma'lumotlari topilmadi
      </Card>
    );
  }

  return <StatsCharts allStats={allStats} />;
};

export default StatisticsStatsPage;
