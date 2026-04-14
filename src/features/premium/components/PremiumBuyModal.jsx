import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { premiumAPI } from "@/features/premium/api/premium.api";
import { authAPI } from "@/features/auth/api/auth.api";
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
  <ModalWrapper
    name="premiumBuy"
    title="MBSI Premium"
    description="30 kunlik premium obuna"
  >
    <Content />
  </ModalWrapper>
);

const Content = ({ close }) => {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const coinBalance = profile?.coinBalance ?? 0;
  const canAfford = coinBalance >= 100;

  const buyMutation = useMutation({
    mutationFn: () => premiumAPI.buyPremium(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["premium", "status"] });
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
        <span className="text-sm font-medium text-gray-700">Narxi (30 kun)</span>
        <span className="text-lg font-bold text-yellow-600">100 tanga</span>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Sizning balansingiz</span>
        <span className={`font-semibold ${canAfford ? "text-green-600" : "text-red-500"}`}>
          {coinBalance} tanga
        </span>
      </div>

      {!canAfford && (
        <p className="text-sm text-red-500">
          Tangalar yetarli emas. Premium uchun kamida 100 tanga kerak.
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 xs:flex-row xs:justify-end">
        <Button variant="secondary" type="button" onClick={close}>
          Bekor qilish
        </Button>
        <Button
          onClick={() => buyMutation.mutate()}
          disabled={!canAfford || buyMutation.isPending}
        >
          Sotib olish
        </Button>
      </div>
    </div>
  );
};

export default PremiumBuyModal;
