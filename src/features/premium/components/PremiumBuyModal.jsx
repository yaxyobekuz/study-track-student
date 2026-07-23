import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { authQueries } from "@/features/auth/queries/auth.queries";
import { useBuyPremium } from "@/features/premium/queries/premium.mutations";
import usePremiumConfig from "@/features/premium/hooks/usePremiumConfig";
import ModalWrapper from "@/shared/components/ui/ModalWrapper";
import { Button } from "@/shared/components/shadcn/button";

const PREMIUM_BENEFITS = [
  "Profil rasmi yuklash",
  "Animatsion emoji badge (ism yonida)",
  "Liderlar jadvalida profil rasm va emoji ko'rsatilishi",
  "Maxsus ko'rsatma ism (taxallus) qo'yish",
  "Ism rangini tanlash",
];

const PremiumBuyModal = () => (
  <ModalWrapper name="premiumBuy" title="MBSI Premium" description="Premium obuna">
    <Content />
  </ModalWrapper>
);

const Content = ({ close }) => {
  const { config } = usePremiumConfig();

  const { coinCost, durationDays, isEnabled } = config;

  const { data: profile } = useQuery(authQueries.me());

  const coinBalance = profile?.coinBalance ?? 0;
  const canAfford = coinBalance >= coinCost;

  const buyMutation = useBuyPremium();

  const handleBuy = () =>
    buyMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("MBSI Premium muvaffaqiyatli faollashtirildi!");
        close();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Xatolik yuz berdi");
      },
    });

  return (
    <div className="space-y-4">
      {/* Benefits list */}
      <ul className="space-y-2">
        {PREMIUM_BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-0.5 text-yellow-500 font-bold">✦</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {/* Price */}
      <div className="flex items-center justify-between rounded-lg bg-yellow-50 px-4 py-3">
        <span className="text-sm font-medium text-gray-700">
          Narxi ({durationDays} kun)
        </span>
        <span className="text-lg font-bold text-yellow-600">{coinCost} tanga</span>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Sizning balansingiz</span>
        <span className={`font-semibold ${canAfford ? "text-green-600" : "text-red-500"}`}>
          {coinBalance} tanga
        </span>
      </div>

      {!isEnabled && (
        <p className="text-sm text-red-500">
          MBSI Premium hozircha mavjud emas.
        </p>
      )}

      {isEnabled && !canAfford && (
        <p className="text-sm text-red-500">
          Tangalar yetarli emas. Premium uchun kamida {coinCost} tanga kerak.
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 xs:flex-row xs:justify-end">
        <Button variant="secondary" type="button" onClick={close}>
          Bekor qilish
        </Button>
        <Button
          onClick={handleBuy}
          disabled={!canAfford || !isEnabled || buyMutation.isPending}
        >
          Sotib olish
        </Button>
      </div>
    </div>
  );
};

export default PremiumBuyModal;
