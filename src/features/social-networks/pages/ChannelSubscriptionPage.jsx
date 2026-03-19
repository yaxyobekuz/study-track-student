// React
import { useState } from "react";

// Icons
import { ChevronRight } from "lucide-react";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";

const ChannelSubscriptionPage = ({ channels = [], onRecheck }) => {
  const { openTelegramLink } = useTelegram();
  const [isChecking, setIsChecking] = useState(false);

  const unsubscribedChannels = channels.filter((ch) => !ch.isSubscribed);

  const handleOpenChannel = (username) => {
    if (username) {
      openTelegramLink(`https://t.me/${username}`);
    }
  };

  const handleRecheck = async () => {
    setIsChecking(true);
    try {
      await onRecheck();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mx-auto mb-5">
          <span className="text-3xl">📢</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Kanallarga obuna bo'ling
        </h1>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6">
          Platformadan foydalanish uchun quyidagi kanallarga obuna bo'lishingiz
          kerak.
        </p>

        {/* Channels list */}
        <div className="space-y-3 mb-4">
          {unsubscribedChannels.map((channel, index) => (
            <button
              key={index}
              disabled={!channel.username}
              onClick={() => handleOpenChannel(channel.username)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="size-8 fill-primary">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {channel.name}
                </p>

                {channel.username && (
                  <p className="text-xs text-blue-600">@{channel.username}</p>
                )}
              </div>

              <ChevronRight
                strokeWidth={1.5}
                className="size-6 stroke-gray-400"
              />
            </button>
          ))}
        </div>

        {/* Recheck button */}
        <Button
          className="w-full"
          disabled={isChecking}
          onClick={handleRecheck}
        >
          Tekshirish{isChecking && "..."}
        </Button>
      </Card>
    </div>
  );
};

export default ChannelSubscriptionPage;
