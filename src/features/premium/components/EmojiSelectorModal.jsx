// Toaster
import { toast } from "sonner";

// Utils
import { cn } from "@/shared/utils/cn";

// Hooks
import { usePremiumEmojis } from "@/features/premium/hooks/usePremiumEmojis";

// Queries
import { authQueries } from "@/features/auth/queries/auth.queries";
import { useSetEmojiBadge } from "@/features/premium/queries/premium.mutations";

// Components
import ModalWrapper from "@/shared/components/ui/ModalWrapper";
import PremiumEmojiDisplay from "@/shared/components/ui/PremiumEmojiDisplay";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

const EmojiSelectorModal = () => (
  <ModalWrapper name="emojiSelector" title="Emoji tanlash">
    <Content />
  </ModalWrapper>
);

const Content = ({ close }) => {
  const { data: profile } = useQuery(authQueries.me());

  const { emojis, isLoading } = usePremiumEmojis();

  const currentEmojiId = profile?.emojiBadgeId;

  const setEmojiBadgeMutation = useSetEmojiBadge();

  const handleSelect = (emojiId) =>
    setEmojiBadgeMutation.mutate(emojiId, {
      onSuccess: () => {
        toast.success("Emoji o'rnatildi");
        close();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Xatolik yuz berdi");
      },
    });

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="grid grid-cols-4 gap-3 pb-4">
      {emojis.map((emoji) => {
        const isSelected = currentEmojiId === emoji.id;
        return (
          <button
            key={emoji.id}
            disabled={setEmojiBadgeMutation.isPending}
            onClick={() => handleSelect(emoji.id)}
            className={cn(
              "flex items-center justify-center rounded-lg border-2 w-full h-16 transition-colors duration-200",
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-transparent bg-gray-50 hover:bg-gray-100",
            )}
          >
            <PremiumEmojiDisplay emojiId={emoji.id} className="size-10" />
          </button>
        );
      })}
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-4 gap-3 pb-4">
    {Array.from({ length: 20 }).map((_, index) => (
      <button
        key={index}
        className="flex items-center justify-center rounded-lg border-2 w-full h-16 transition-colors duration-200 border-transparent bg-gray-50"
      />
    ))}
  </div>
);

export default EmojiSelectorModal;
