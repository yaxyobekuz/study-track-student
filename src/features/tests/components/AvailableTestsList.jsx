// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Router
import { Link } from "react-router-dom";

// Icons
import { Clock, ListChecks, AlertCircle, Play } from "lucide-react";

// API
import { testBindingsAPI } from "@/features/tests/api/tests.api";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";

// Utils
import { formatDateUZ } from "@/shared/utils/date.utils";

const AvailableTestsList = () => {
  const { data: bindings = [], isLoading } = useQuery({
    queryKey: ["bindings", "available"],
    queryFn: () => testBindingsAPI.getAvailable().then((res) => res.data.data),
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Card>
          <p className="text-center text-gray-500 py-10">Yuklanmoqda...</p>
        </Card>
      ) : bindings.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ListChecks size={40} className="text-gray-300" />
            <p className="mt-3 text-gray-500">
              Hozircha topshirishingiz mumkin bo'lgan testlar yo'q.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {bindings.map((b) => (
            <Card key={b._id} className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {b.test?.title}
                  </h3>
                  <p className="text-sm text-gray-600">{b.subject?.name}</p>
                </div>

                <p className="text-xs text-gray-500">{b.season?.name}</p>
              </div>

              {/* time & question count */}
              <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {b.test?.timeLimitMinutes} daqiqa
                </span>
                <span className="flex items-center gap-1.5">
                  <ListChecks size={14} />
                  {b.test?.questionCount} savol
                </span>
              </div>

              {b.season?.endDate && (
                <p className="text-xs text-gray-500">
                  Mavsum tugashi:{" "}
                  <span className="font-medium">
                    {formatDateUZ(b.season.endDate)}
                  </span>
                </p>
              )}

              {b.hasInProgress && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-800 text-xs">
                  <AlertCircle size={14} />
                  Davom etayotgan sessiyangiz bor - bosish davom ettiradi
                </div>
              )}

              <Button className="w-full gap-2" asChild>
                <Link to={`/take-test/${b._id}`}>
                  <Play size={16} />
                  {b.hasInProgress ? "Davom etish" : "Boshlash"}
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableTestsList;
