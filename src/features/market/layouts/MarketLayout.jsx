// Utils
import { cn } from "@/shared/utils/cn";

// Router
import { Outlet } from "react-router-dom";

// Components
import MarketTabs from "../components/MarketTabs";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";
import usePremium from "@/features/premium/hooks/usePremium";

const MarketLayout = () => {
  const { setHeaderColor } = useTelegram();
  const { premiumNameColor, premiumNameColorClass } = usePremium();

  setHeaderColor(premiumNameColor || "#3b82f6");

  return (
    <div className="min-h-screen pb-28 animate__animated animate__fadeIn">
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
    </div>
  );
};

export default MarketLayout;
