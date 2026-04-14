import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { premiumAPI } from "@/features/premium/api/premium.api";
import { authAPI } from "@/features/auth/api/auth.api";
import ModalWrapper from "@/shared/components/ui/ModalWrapper";
import PremiumEmojiDisplay from "@/shared/components/ui/PremiumEmojiDisplay";
import { cn } from "@/shared/utils/cn";

const EmojiSelectorModal = () => (
  <ModalWrapper
    name="emojiSelector"
    title="Emoji tanlash"
    description="Ism yonida chiqadigan animatsion emojini tanlang"
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

  const { data: emojisRes, isLoading } = useQuery({
    queryKey: ["premium", "emojis"],
    queryFn: () => premiumAPI.getAvailableEmojis().then((res) => res.data.data),
  });

  console.log(emojisRes);
  

  const emojis = emojisRes || [];
  const currentEmojiId = profile?.emojiBadgeId;

  const setEmojiBadgeMutation = useMutation({
    mutationFn: (emojiId) => premiumAPI.setEmojiBadge(emojiId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Emoji o'rnatildi");
      close();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  if (isLoading) {
    return <div className="py-8 text-center text-sm text-gray-500">Yuklanmoqda...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3 pb-1">
      {emojis.map((emoji) => {
        const isSelected = currentEmojiId === emoji.emojiId;
        return (
          <button
            key={emoji.emojiId}
            type="button"
            disabled={setEmojiBadgeMutation.isPending}
            onClick={() => setEmojiBadgeMutation.mutate(emoji.emojiId)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-medium transition-colors",
              isSelected
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-transparent bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100"
            )}
          >
            <PremiumEmojiDisplay emojiId={emoji.emojiId} className="size-10" />
            <span>{emoji.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default EmojiSelectorModal;
