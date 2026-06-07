// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Router
import { Link } from "react-router-dom";

// Icons
import { Award, ChevronRight, Calendar } from "lucide-react";

// API
import { testSeasonsAPI } from "@/features/tests/api/testSeasons.api";

// Components
import Card from "@/shared/components/ui/Card";

// Utils
import { formatDateUZ } from "@/shared/utils/date.utils";

const SeasonsList = () => {
  const { data: seasons = [], isLoading } = useQuery({
    queryKey: ["test-seasons", "active"],
    queryFn: () => testSeasonsAPI.getActive().then((res) => res.data.data),
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Card>
          <p className="text-center text-gray-500 py-10">Yuklanmoqda...</p>
        </Card>
      ) : seasons.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar size={40} className="text-gray-300" />
            <p className="mt-3 text-gray-500">Faol mavsumlar yo'q.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {seasons.map((season) => (
            <Link
              className="block"
              key={season._id}
              to={`/seasons/${season._id}/rewards`}
            >
              <Card className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center size-10 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <Award size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">{season.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {formatDateUZ(season.startDate)} →{" "}
                    {formatDateUZ(season.endDate)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeasonsList;
