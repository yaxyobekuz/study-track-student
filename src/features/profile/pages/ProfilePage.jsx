// Icons
import { LogOut } from "lucide-react";

// Router
import { Link } from "react-router-dom";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// API
import { authAPI } from "@/features/auth/api/auth.api";

// Components
import Card from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/shadcn/button";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";
import StudentAvatar from "@/shared/components/ui/StudentAvatar";
import PremiumBuyModal from "@/features/premium/components/PremiumBuyModal";

// Hooks
import useModal from "@/shared/hooks/useModal";

// Utils
import { formatUzDate } from "@/shared/utils/formatDate";

const ProfilePage = () => {
  const {
    isError,
    isLoading,
    data: profile,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const { openModal } = useModal("premiumBuy");

  const handleLogout = () => {
    const shouldLogout = confirm("Haqiqatan ham chiqmoqchimisiz?");
    if (!shouldLogout) return;

    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const isPremium = profile?.premium?.isActive;

  return (
    <div className="min-h-screen pt-5 pb-28 space-y-5 animate__animated animate__fadeIn">
      <div className="container space-y-5">
        {/* Top */}
        <h1 className="text-blue-500 font-bold text-xl">Profil</h1>

        {isLoading && (
          <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            Profil ma'lumotlarini yuklab bo'lmadi
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <Card title="Umumiy ma'lumotlar" className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-3.5">
                <StudentAvatar
                  size="lg"
                  isPremium={isPremium}
                  emojiBadgeId={profile?.emojiBadgeId || null}
                  fallbackName={profile?.fullName || profile?.firstName || ""}
                  profilePictureUrl={
                    profile?.profilePicture?.variants?.sm?.url || null
                  }
                />

                <div className="space-y-1 text-sm font-medium xs:text-base">
                  <h3 className="">{profile?.fullName}</h3>

                  <span className="font-medium text-gray-500 text-xs xs:text-sm">
                    @{profile?.username}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Jarima bali</span>
                <span
                  className={`font-medium ${profile?.penaltyPoints > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {profile?.penaltyPoints || 0}
                </span>
              </div>
            </Card>

            {/* Premium status */}
            {isPremium ? (
              <Card title="MBSI Premium" className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    ✦ Premium
                  </span>
                </div>

                {profile.premium.expiresAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Muddati</span>
                    <span className="font-medium text-gray-900">
                      {formatUzDate(profile.premium.expiresAt)}
                    </span>
                  </div>
                )}
                {profile.displayName && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Ko'rsatma ism</span>
                    <span className="font-medium text-gray-900">
                      {profile.displayName}
                    </span>
                  </div>
                )}
                <Button className="w-full" asChild>
                  <Link to="/profile/edit">Premium sozlamalari</Link>
                </Button>
              </Card>
            ) : (
              <Card className="bg-gradient-to-t from-yellow-100 to-orange-50 space-y-3">
                <p className="text-sm font-semibold text-yellow-800">
                  MBSI Premium
                </p>

                <p className="text-xs text-yellow-700">
                  Profil rasm, animatsion emoji, ko'rsatma ism va ism rangi kabi
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
              {profile?.classes?.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.classes.map((classItem) => (
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
          </>
        )}
      </div>

      <PremiumBuyModal />
      <BottomNavbar />
    </div>
  );
};

export default ProfilePage;
