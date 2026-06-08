// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Router
import { Link } from "react-router-dom";

// Icons
import { Award, ChevronRight } from "lucide-react";

// API
import { testResultsAPI } from "@/features/grading/api/testResults.api";

// Data
import {
  RESULT_STATUS_LABELS,
  RESULT_STATUS_COLORS,
} from "@/features/grading/data/resultStatuses.data";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { formatScore } from "@/shared/utils/formatScore";

/**
 * O'quvchining barcha test natijalari ro'yxati.
 * "Testlar" markazidagi "Natijalar" tabining kontenti.
 */
const MyResultsList = () => {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["my-results"],
    queryFn: () => testResultsAPI.getMy().then((res) => res.data.data),
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Card>
          <p className="text-center text-gray-500 py-10">Yuklanmoqda...</p>
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Award size={40} className="text-gray-300" />
            <p className="mt-3 text-gray-500">
              Hali natijalar yo'q. Mavjud testlardan birini topshiring.
            </p>
            <Link to="/tests/available" className="mt-3">
              <Button>Mavjud testlar</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((r) => (
            <Link key={r._id} to={`/my-results/${r._id}`}>
              <Card className="space-y-2 active:scale-[0.99]">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {r.test?.title || "Test"}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-xs font-medium",
                          RESULT_STATUS_COLORS[r.status] || "bg-gray-100",
                        )}
                      >
                        {RESULT_STATUS_LABELS[r.status]}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {r.subject?.name} · {r.season?.name}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {formatDateUZ(r.createdAt)}
                      </p>

                      <p className="text-xl font-bold text-blue-700">
                        {formatScore(r.finalScore)}
                        <span className="text-sm font-normal text-gray-500">
                          {" "}
                          / {r.maxScore != null ? formatScore(r.maxScore) : "-"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResultsList;
