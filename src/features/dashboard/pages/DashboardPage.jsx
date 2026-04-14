// Utils
import { cn } from "@/shared/utils/cn";

// Router
import { Link } from "react-router-dom";

// Data
import { topNavItems } from "../data/nav.data";

// Icons
import { ChevronRight, Mails, Sparkle } from "lucide-react";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";
import usePremium from "@/features/premium/hooks/usePremium";

// Components
import WeeklyStats from "../components/WeeklyStats";
import StoriesPanel from "../components/StoriesPanel";
import List, { ListItem } from "@/shared/components/ui/List";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

const DashboardPage = () => {
  const { setHeaderColor } = useTelegram();
  const {
    isPremium,
    PremiumEmojiIcon,
    premiumNameColor,
    premiumNameColorClass,
  } = usePremium();

  setHeaderColor(premiumNameColor || "#3b82f6");

  return (
    <div className="min-h-screen pb-40 bg-gray-100 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-5">
        {/* Top */}
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center gap-3.5">
            <h1
              className={cn(
                "text-primary font-bold text-xl",
                premiumNameColorClass,
              )}
            >
              MBSI School
            </h1>

            {/* Emoji badge */}
            <PremiumEmojiIcon />
          </div>

          {/* Tasks link */}
          <Link
            to="/tasks"
            className="flex items-center justify-center size-11 bg-white rounded-full border"
          >
            <Mails strokeWidth={1.5} size={20} />
          </Link>
        </div>

        {/* Stories Panel */}
        <StoriesPanel />

        {/* Premium */}
        {!isPremium && (
          <ListItem
            to="/profile"
            icon={Sparkle}
            title="MBSI Premium"
            className="rounded-2xl"
            gradientTo="to-yellow-700"
            gradientFrom="from-yellow-700"
            trailing={<ChevronRight className="size-5" strokeWidth={1.5} />}
          />
        )}

        <List
          items={topNavItems.map((item) => ({
            to: item.to,
            icon: item.icon,
            title: item.label,
            gradientTo: item.gradientTo,
            description: item.description,
            gradientFrom: item.gradientFrom,
            trailing: <ChevronRight className="size-5" strokeWidth={1.5} />,
          }))}
        />

        {/* Student Weekly Stats */}
        <WeeklyStats />
      </div>

      {/* Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default DashboardPage;
