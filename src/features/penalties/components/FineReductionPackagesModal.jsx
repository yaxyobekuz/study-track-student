// Lottie
import Lottie from "lottie-react";

// Icons
import { Coins } from "lucide-react";

// Hooks
import useModal from "@/shared/hooks/useModal";
import useMe from "@/features/auth/hooks/useMe";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Utils
import { cn } from "@/shared/utils/cn";
import { getPackageEmoji } from "../utils/fineReduce.utils";

// Components
import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/ModalWrapper";

// API
import { penaltiesAPI } from "@/features/penalties/api/penalties.api";

const FineReductionPackagesModal = () => (
  <ModalWrapper
    name="fineReductionPackages"
    title="Jarimani kamaytirish uchun paketlar"
  >
    <Content />
  </ModalWrapper>
);

const Content = ({ close, discountPercent }) => {
  const { openModal } = useModal();
  const { me, isMePremium } = useMe();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["penalties", "reduction-packages"],
    queryFn: () =>
      penaltiesAPI.getReductionPackages().then((res) => res.data.data),
  });

  const coinBalance = me?.coinBalance ?? 0;
  const penaltyPoints = me?.penaltyPoints ?? 0;
  const appliedDiscount = isMePremium ? (discountPercent ?? 0) : 0;

  const getFinalCost = (coinCost) =>
    Math.ceil(coinCost * (1 - appliedDiscount / 100));

  const handleBuy = (pkg) => {
    openModal("purchaseReductionPackage", {
      _id: pkg._id,
      title: pkg.title,
      order: pkg.order,
      points: pkg.points,
      coinCost: pkg.coinCost,
      discountPercent: appliedDiscount,
    });

    close();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-red-400" />
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-6">
        Hozircha paketlar mavjud emas
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Premium discount badge */}
      {isMePremium && appliedDiscount > 0 && (
        <div className="rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 font-medium">
          ✦ Premium chegirma: -{appliedDiscount}%
        </div>
      )}

      {/* Packages */}
      <div className="grid grid-cols-3 gap-1.5">
        {packages.map((pkg) => {
          const finalCost = getFinalCost(pkg.coinCost);
          const canAfford = coinBalance >= finalCost;

          const hasPoints = penaltyPoints > 0;
          const emoji = getPackageEmoji(pkg.order);
          const isDisabled = !canAfford || !hasPoints;

          return (
            <div
              key={pkg._id}
              className={cn(
                "space-y-2",
                isDisabled ? "opacity-60" : "opacity-100",
              )}
            >
              <div className="flex items-center justify-center relative w-full py-5 bg-gray-100 rounded-xl">
                <Lottie animationData={emoji} className="size-10" />

                {/* Point */}
                <p className="absolute bottom-3 right-3 font-bold text-green-600">
                  -{pkg.points}
                </p>

                {/* Title */}
                <p className="absolute top-3 left-3 text-xs font-semibold text-gray-800 line-clamp-2">
                  {pkg.title}
                </p>
              </div>

              {/* Buy button */}
              <Button
                size="sm"
                className="w-full gap-1 xs:gap-2"
                disabled={isDisabled}
                onClick={() => handleBuy(pkg)}
              >
                {appliedDiscount > 0 && (
                  <del className="opacity-70 font-normal">{pkg.coinCost}</del>
                )}
                <Coins size={16} />
                <span className="font-bold">{finalCost}</span>
              </Button>
            </div>
          );
        })}
      </div>

      {/* Close button */}
      <Button variant="secondary" className="w-full" onClick={close}>
        Yopish
      </Button>
    </div>
  );
};

export default FineReductionPackagesModal;
