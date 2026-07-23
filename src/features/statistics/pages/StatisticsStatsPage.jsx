// Hooks
import useMe from "@/features/auth/hooks/useMe";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Components
import Card from "@/shared/components/ui/Card";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import StatsCharts from "@/features/statistics/components/StatsCharts";

// Queries
import { statisticsQueries } from "@/features/statistics/queries/statistics.queries";

const StatisticsStatsPage = () => {
  const { me, myId } = useMe();

  const { data: allStats = [], isLoading } = useQuery(
    statisticsQueries.allWeekly(myId),
  );

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
