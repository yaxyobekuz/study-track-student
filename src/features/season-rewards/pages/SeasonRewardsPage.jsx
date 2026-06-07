// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Router
import { useParams } from "react-router-dom";

// API
import { testSeasonsAPI } from "@/features/test-seasons/api/testSeasons.api";

// Components
import Card from "@/shared/components/ui/Card";
import BackHeader from "@/shared/components/layout/BackHeader";
import StudentStatsView from "../components/StudentStatsView";

// Utils
import { formatDateUZ } from "@/shared/utils/date.utils";

/**
 * Mavsum mukofotlari sahifasi (o'quvchi).
 * O'quvchining o'z reytingi va mukofotlarini ko'rsatadi.
 */
const SeasonRewardsPage = () => {
  const { id: seasonId } = useParams();

  const { data: season, isLoading } = useQuery({
    queryKey: ["test-season", seasonId],
    queryFn: () =>
      testSeasonsAPI.getOne(seasonId).then((res) => res?.data?.data),
  });

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
        <p className="text-sm text-gray-600">
          {formatDateUZ(season.startDate)} → {formatDateUZ(season.endDate)}
          {season.distributedAt && (
            <span className="ml-2 text-green-700">· Mukofotlar tarqatildi</span>
          )}
        </p>

        <StudentStatsView season={season} />
      </div>
    </div>
  );
};

export default SeasonRewardsPage;
