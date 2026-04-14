// Icons
import { LogOut } from "lucide-react";

// Router
import { Link } from "react-router-dom";

// Hooks
import useModal from "@/shared/hooks/useModal";
import useMe from "@/features/auth/hooks/useMe";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatUzDate } from "@/shared/utils/formatDate";

// Data
import useTelegram from "@/shared/hooks/useTelegram";
import usePremium from "@/features/premium/hooks/usePremium";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";
import StudentAvatar from "@/shared/components/ui/StudentAvatar";
import PremiumBuyModal from "@/features/premium/components/PremiumBuyModal";

const ProfilePage = () => {
  const { setHeaderColor } = useTelegram();
  const { openModal } = useModal("premiumBuy");
  const { me, mySmProfilePictureUrl, myIsPremium } = useMe();
  const { PremiumEmojiIcon, premiumNameColorClass } = usePremium(me);

  setHeaderColor("#3b82f6");

  const handleLogout = () => {
    const shouldLogout = confirm("Haqiqatan ham chiqmoqchimisiz?");
    if (!shouldLogout) return;

    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen pt-5 pb-40 animate__animated animate__fadeIn">
      <div className="container space-y-4">
        {/* Title */}
        <h1 className="text-primary font-bold text-xl">Profil</h1>

        {/* Primary Details */}
        <Card title="Umumiy ma'lumotlar" className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-3.5">
            <StudentAvatar
              size="lg"
              isPremium={myIsPremium}
              profilePictureUrl={mySmProfilePictureUrl}
              fallbackName={me?.fullName || me?.firstName || ""}
            />

            <div className="space-y-1 text-sm font-medium xs:text-base">
              <div className="flex items-center gap-1.5">
                {/* Emoji badge */}
                <PremiumEmojiIcon className="size-5" />

                {/* Name */}
                <h3 className={cn("line-clamp-1", premiumNameColorClass)}>
                  {me?.fullName}
                </h3>
              </div>

              <span className="font-medium text-gray-500 text-xs xs:text-sm">
                @{me?.username}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Jarima bali</span>
            <span
              className={`font-medium ${me?.penaltyPoints > 0 ? "text-red-600" : "text-green-600"}`}
            >
              {me?.penaltyPoints || 0}
            </span>
          </div>
        </Card>

        {/* Premium status */}
        {myIsPremium ? (
          <Card title="MBSI Premium" className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                ✦ Obuna faollashtirilgan
              </span>
            </div>

            {me?.premium.expiresAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Muddati</span>
                <span className="font-medium text-gray-900">
                  {formatUzDate(me?.premium.expiresAt)}
                </span>
              </div>
            )}

            {me?.displayName && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Taxallus</span>
                <span className="font-medium text-gray-900">
                  {me?.displayName}
                </span>
              </div>
            )}
          </Card>
        ) : (
          <Card className="bg-gradient-to-t from-yellow-100 to-orange-50 space-y-3">
            <p className="text-sm font-semibold text-yellow-800">
              MBSI Premium
            </p>

            <p className="text-xs text-yellow-700">
              Profil rasm, animatsion emoji, taxallus va ism rangi kabi
              imkoniyatlarni oching.
            </p>

            <Button
              onClick={() => openModal("premiumBuy")}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Sotib olish
            </Button>
          </Card>
        )}

        <Card title="Sinflar" className="space-y-3">
          {me?.classes?.length ? (
            <div className="flex flex-wrap gap-2">
              {me?.classes.map((classItem) => (
                <span
                  key={classItem._id}
                  className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  {classItem.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sinf biriktirilmagan</p>
          )}
        </Card>

        <div className="flex gap-3.5">
          <Button className="w-full" asChild>
            <Link to="/profile/edit">Tahrirlash</Link>
          </Button>

          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-11 p-0 shrink-0"
          >
            <LogOut strokeWidth={1.5} className="size-6" />
          </Button>
        </div>
      </div>

      <PremiumBuyModal />
      <BottomNavbar />
    </div>
  );
};

export default ProfilePage;
