// Toaster
import { toast } from "sonner";

// React
import { useState } from "react";

// Data
import {
  marketOrderStatusLabels,
  marketOrderStatusClasses,
} from "@/features/market/data/market.data";

// Hooks
import useModal from "@/shared/hooks/useModal";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatUzDate } from "@/shared/utils/formatDate";

// API
import { marketAPI } from "@/features/market/api/market.api";

// Components
import List from "@/shared/components/ui/List";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/ModalWrapper";

// Tanstack Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const MarketMyOrdersPage = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["market", "my-orders", page],
    queryFn: () =>
      marketAPI
        .getMyOrders({ page, limit: 20 })
        .then((response) => response.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId) => marketAPI.cancelMyOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market", "my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["market", "products"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "transactions"] });
      toast.success("Buyurtma bekor qilindi");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const orders = data?.data || [];
  const pagination = data?.pagination;
  const orderItems = orders.map((order) => {
    const canCancel = !["approved", "rejected", "cancelled"].includes(
      order.status,
    );

    return {
      key: order._id,
      description: formatUzDate(order.createdAt),
      title: order.productSnapshot?.name || order.product?.name,
      trailing: (
        <span
          className={cn(
            "text-xs rounded-full px-2 py-1",
            marketOrderStatusClasses[order.status],
          )}
        >
          {marketOrderStatusLabels[order.status] || order.status}
        </span>
      ),
      subContent: (
        <div className="space-y-2">
          {/* Rejected reason */}
          {order.status === "rejected" && order.rejectReason && (
            <p className="text-xs text-red-600">{order.rejectReason}</p>
          )}

          {/* Cancel button */}
          {canCancel && (
            <Button
              variant="danger"
              className="w-full"
              disabled={cancelMutation.isPending}
              onClick={() =>
                openModal("cancelMarketOrder", { orderId: order._id })
              }
            >
              Buyurtmani bekor qilish
            </Button>
          )}
        </div>
      ),
    };
  });

  if (isLoading) {
    return <Card className="text-center py-10">Yuklanmoqda...</Card>;
  }

  if (!orders?.length) {
    return (
      <Card className="text-center py-10 text-gray-500">
        Buyurtmalar mavjud emas
      </Card>
    );
  }

  return (
    <>
      <List items={orderItems} />

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

      {/* Cancel Order Modal */}
      <ModalWrapper
        name="cancelMarketOrder"
        title="Buyurtmani bekor qilish"
        description="Haqiqatdan ham buyurtmani bekor qilmoqchimisiz?"
      >
        <CancelOrderContent cancelMutation={cancelMutation} />
      </ModalWrapper>
    </>
  );
};

const CancelOrderContent = ({ cancelMutation, close, orderId }) => {
  const handleCancelOrder = () => {
    cancelMutation.mutate(orderId, { onSuccess: close });
  };

  return (
    <div className="flex flex-col gap-3.5 w-full xs:m-0 xs:flex-row xs:justify-end">
      <Button type="button" variant="secondary" onClick={close}>
        Yopish
      </Button>

      <Button
        type="button"
        variant="danger"
        onClick={handleCancelOrder}
        disabled={cancelMutation.isPending}
      >
        Bekor qilish
      </Button>
    </div>
  );
};

export default MarketMyOrdersPage;
