// React
import { useState } from "react";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// API
import { penaltiesAPI } from "@/features/penalties/api/penalties.api";
import { authAPI } from "@/features/auth/api/auth.api";

// Components
import Card from "@/shared/components/ui/Card";
import BackHeader from "@/shared/components/layout/BackHeader";

// Data
import {
  penaltyStatusLabels,
  penaltyStatusColors,
} from "../data/penalties.data";

// Utils
import { formatUzDate } from "@/shared/utils/formatDate";

const MyPenaltiesPage = () => {
  const [page, setPage] = useState(1);

  const { data: me } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["penalties", "my", page],
    queryFn: () =>
      penaltiesAPI
        .getMyPenalties({ page, limit: 20 })
        .then((res) => res.data),
  });

  const penalties = data?.data || [];
  const pagination = data?.pagination;
  const penaltyPoints = me?.penaltyPoints || 0;

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/dashboard" title="Jarimalar" />

      <div className="container pt-4 space-y-4">
        {/* Joriy jarima bali */}
        <Card className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Jarima balingiz</span>
          <span className="text-2xl font-bold text-red-600">
            {penaltyPoints}
          </span>
        </Card>

        {/* 12 ball ogohlantirishi */}
        {penaltyPoints >= 12 && (
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <div className="text-red-600 text-xl">⚠️</div>
              <div>
                <p className="font-semibold text-red-700">
                  Diqqat! Jarima balingiz 12 va undan yuqori
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Iltimos, rahbariyat bilan bog'laning.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 3 ball market ogohlantirishi */}
        {penaltyPoints > 3 && penaltyPoints < 12 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 text-xl">⚠️</div>
              <div>
                <p className="font-semibold text-yellow-700">
                  Do'kondan buyurtma berish cheklangan
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  Jarima balingiz 3 dan yuqori bo'lgani uchun do'kondan
                  buyurtma bera olmaysiz.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Jarimalar ro'yxati */}
        {isLoading ? (
          <Card className="text-center py-10">Yuklanmoqda...</Card>
        ) : penalties.length === 0 ? (
          <Card className="text-center py-10 text-gray-500">
            Hozircha jarimalar yo'q
          </Card>
        ) : (
          <div className="space-y-3">
            {penalties.map((penalty) => (
              <Card key={penalty._id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {penalty.title}
                    </p>
                    {penalty.description && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {penalty.description}
                      </p>
                    )}
                  </div>
                  <span className={`text-lg font-bold ${penalty.type === "reduction" ? "text-green-600" : "text-red-600"}`}>
                    {penalty.type === "reduction" ? "-" : "+"}{penalty.points}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full font-medium ${penaltyStatusColors[penalty.status]}`}
                  >
                    {penaltyStatusLabels[penalty.status]}
                  </span>
                  <span className="text-gray-400">
                    {formatUzDate(penalty.createdAt)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-sm">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 rounded-md bg-white disabled:opacity-50"
            >
              Oldingi
            </button>
            <span className="text-gray-500">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 rounded-md bg-white disabled:opacity-50"
            >
              Keyingi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPenaltiesPage;
