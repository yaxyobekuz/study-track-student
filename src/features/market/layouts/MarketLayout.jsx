// Utils
import { cn } from "@/shared/utils/cn";

// Router
import { Outlet } from "react-router-dom";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";
import usePremium from "@/features/premium/hooks/usePremium";

// Components
import MarketTabs from "../components/MarketTabs";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

const MarketLayout = () => {
  const { setHeaderColor } = useTelegram();
  const { premiumNameColor, premiumNameColorClass } = usePremium();

  setHeaderColor(premiumNameColor || "#3b82f6");

  return (
    <div className="min-h-screen pb-40 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-4">
        {/* Title */}
        <h1
          className={cn(
            "text-primary font-bold text-xl",
            premiumNameColorClass,
          )}
        >
          Do'kon
        </h1>

        {/* Tabs */}
        <MarketTabs />

        {/* Content */}
        <Outlet />
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default MarketLayout;
