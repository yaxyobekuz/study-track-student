// React
import { useState } from "react";

// Data
import {
  penaltyStatusLabels,
  penaltyStatusColors,
} from "../data/penalties.data";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Hooks
import useModal from "@/shared/hooks/useModal";
import useMe from "@/features/auth/hooks/useMe";

// Utils
import { formatUzDate } from "@/shared/utils/formatDate";

// API
import { penaltiesAPI } from "@/features/penalties/api/penalties.api";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import BackHeader from "@/shared/components/layout/BackHeader";
import FineReductionPackagesModal from "../components/FineReductionPackagesModal";
import PurchaseReductionPackageModal from "../components/PurchaseReductionPackageModal";

const MyPenaltiesPage = () => {
  const { me } = useMe();
  const { openModal } = useModal();
  const [page, setPage] = useState(1);

  const { data: settings } = useQuery({
    queryKey: ["penalties", "settings"],
    queryFn: () => penaltiesAPI.getSettings().then((res) => res.data.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["penalties", "my", page],
    queryFn: () =>
      penaltiesAPI.getMyPenalties({ page, limit: 20 }).then((res) => res.data),
  });

  const penalties = data?.data || [];
  const pagination = data?.pagination;
  const penaltyPoints = me?.penaltyPoints || 0;
  const discountPercent = settings?.premiumReductionDiscountPercent ?? 0;

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/dashboard" title="Jarimalar" />

      <div className="container pt-4 space-y-4">
        <Card className="space-y-4">
          {/* Current Penalty Points */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Jarima balingiz</span>
            <span className="text-2xl font-bold text-red-600">
              {penaltyPoints}
            </span>
          </div>

          {/* Fine Reduction Button */}
          {penaltyPoints > 0 && (
            <Button
              className="w-full"
              onClick={() =>
                openModal("fineReductionPackages", { discountPercent })
              }
            >
              Jarimani kamaytirish
            </Button>
          )}
        </Card>

        {/* Penalties List */}
        {isLoading ? (
          <Card className="text-center py-10">Yuklanmoqda...</Card>
        ) : penalties.length === 0 ? (
          <Card className="text-center py-10 text-gray-500">
            Hozircha jarimalar yo'q
          </Card>
        ) : (
          penalties.map((penalty) => (
            <Card key={penalty._id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{penalty.title}</p>
                  {penalty.description && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {penalty.description}
                    </p>
                  )}
                </div>
                <span
                  className={`text-lg font-bold ${penalty.type === "reduction" ? "text-green-600" : "text-red-600"}`}
                >
                  {penalty.type === "reduction" ? "-" : "+"}
                  {penalty.points}
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
          ))
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

      {/* Modals */}
      <FineReductionPackagesModal />
      <PurchaseReductionPackageModal />
    </div>
  );
};

export default MyPenaltiesPage;
