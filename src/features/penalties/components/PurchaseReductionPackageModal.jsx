// Toast
import { toast } from "sonner";

// Lottie
import Lottie from "lottie-react";

// Icons
import { Coins } from "lucide-react";

// Hooks
import useModal from "@/shared/hooks/useModal";

// Utils
import { getPackageEmoji } from "../utils/fineReduce.utils";

// Components
import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/ModalWrapper";

// API
import { authAPI } from "@/features/auth/api/auth.api";
import { penaltiesAPI } from "@/features/penalties/api/penalties.api";

// Tanstack Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PurchaseReductionPackageModal = () => {
  const { data = {} } = useModal("purchaseReductionPackage");
  const title = data.title ?? "Noma'lum paket";

  return (
    <ModalWrapper
      title="Jarima paketini sotib olish"
      name="purchaseReductionPackage"
      description={`Jarimani kamaytirish uchun "${title}" jarima paketini sotib olmoqchimisiz?`}
    >
      <Content />
    </ModalWrapper>
  );
};

const Content = ({
  close,
  _id,
  title,
  points,
  coinCost,
  discountPercent,
  order,
}) => {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const isPremium = profile?.premium?.isActive ?? false;
  const coinBalance = profile?.coinBalance ?? 0;
  const penaltyPoints = profile?.penaltyPoints ?? 0;

  const appliedDiscount = isPremium ? (discountPercent ?? 0) : 0;
  const finalCoinCost = Math.ceil(
    (coinCost ?? 0) * (1 - appliedDiscount / 100),
  );
  const pointsReduced = Math.min(points ?? 0, penaltyPoints);

  const canAfford = coinBalance >= finalCoinCost;
  const hasPoints = penaltyPoints > 0;

  const mutation = useMutation({
    mutationFn: () => penaltiesAPI.purchaseReductionPackage(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["penalties", "my"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "balance"] });
      toast.success(`Jarima balingiz ${pointsReduced} ballga kamaytirildi!`);
      close();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Xatolik yuz berdi"),
  });

  const emoji = getPackageEmoji(order);

  return (
    <div className="space-y-4">
      {/* Package info */}
      <div className="flex items-center gap-2 rounded-xl border p-2">
        {/* Package Icon */}
        <div className="flex items-center justify-center size-16 bg-gray-100 rounded-md">
          <Lottie animationData={emoji} className="size-8" />
        </div>

        {/* Package Title, Price & Points */}
        <div className="flex-1 space-y-1">
          {/* Package Title */}
          <h3 className="font-semibold text-gray-800 line-clamp-1">
            "{title}" jarima paketi
          </h3>

          <div className="flex items-center justify-between">
            {/* Package Points */}
            <p className="text-sm text-green-700 font-medium">
              -{pointsReduced} ball
            </p>

            {/* Cost */}
            <div className="flex items-center gap-2">
              {appliedDiscount > 0 && (
                <del className="text-sm text-gray-400">{coinCost}</del>
              )}

              <span className="flex items-center gap-1 font-semibold text-yellow-600">
                <Coins className="size-4" />
                {finalCoinCost} tanga
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium discount badge */}
      {appliedDiscount > 0 && (
        <div className="rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 font-medium">
          ✦ Premium chegirma: -{appliedDiscount}%
        </div>
      )}

      {/* Balance */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Sizning balansingiz</span>
        <span
          className={`font-semibold ${canAfford ? "text-green-600" : "text-red-500"}`}
        >
          {coinBalance} tanga
        </span>
      </div>

      {!hasPoints && (
        <p className="text-sm text-red-500">
          Jarima balingiz nolga teng, kamaytirish kerak emas.
        </p>
      )}

      {hasPoints && !canAfford && (
        <p className="text-sm text-red-500">
          Tangalar yetarli emas. Kerak: {finalCoinCost} tanga.
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 xs:flex-row xs:justify-end pt-1">
        <Button variant="secondary" type="button" onClick={close}>
          Bekor qilish
        </Button>
        <Button
          onClick={() => mutation.mutate()}
          disabled={!canAfford || !hasPoints || mutation.isPending}
        >
          {mutation.isPending ? "Yuklanmoqda..." : "Sotib olish"}
        </Button>
      </div>
    </div>
  );
};

export default PurchaseReductionPackageModal;
