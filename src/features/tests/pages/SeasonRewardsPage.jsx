// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Router
import { useParams } from "react-router-dom";

// Queries
import { testsQueries } from "@/features/tests/queries/tests.queries";

// Components
import Card from "@/shared/components/ui/Card";
import BackHeader from "@/shared/components/layout/BackHeader";
import StudentStatsView from "../components/StudentStatsView";

/**
 * Mavsum mukofotlari sahifasi (o'quvchi).
 * O'quvchining o'z reytingi va mukofotlarini ko'rsatadi.
 */
const SeasonRewardsPage = () => {
  const { id: seasonId } = useParams();

  const { data: season, isLoading } = useQuery(testsQueries.season(seasonId));

  if (isLoading) {
    return (
      <div className="min-h-screen pb-28 bg-gray-100">
        <BackHeader href="/seasons" title="Mavsum" />
        <div className="container pt-4">
          <Card>
            <p className="text-center text-gray-500 py-10">Yuklanmoqda...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="min-h-screen pb-28 bg-gray-100">
        <BackHeader href="/seasons" title="Mavsum" />
        <div className="container pt-4">
          <Card>
            <p className="text-center text-gray-500 py-10">Mavsum topilmadi</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/seasons" title={season.name} />

      <div className="container pt-4 space-y-4">
        {season.distributedAt && (
          <p className="text-sm text-green-700">Mukofotlar tarqatildi</p>
        )}

        <StudentStatsView season={season} />
      </div>
    </div>
  );
};

export default SeasonRewardsPage;
