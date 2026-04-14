// Router
import { Outlet } from "react-router-dom";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";
import usePremium from "@/features/premium/hooks/usePremium";

// Utils
import { cn } from "@/shared/utils/cn";

// Components
import StatisticsTabs from "../components/StatisticsTabs";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

const StatisticsLayout = () => {
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
          Statistika
        </h1>

        {/* Tabs */}
        <StatisticsTabs />

        {/* Content */}
        <Outlet />
      </div>

      {/* Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default StatisticsLayout;
