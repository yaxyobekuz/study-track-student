// Router
import { Link } from "react-router-dom";

// Data
import { topNavItems } from "../data/nav.data";

// Icons
import { ChevronRight, Mails, Sparkle } from "lucide-react";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";

// Components
import List, { ListItem } from "@/shared/components/ui/List";
import WeeklyStats from "../components/WeeklyStats";
import StoriesPanel from "../components/StoriesPanel";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

const DashboardPage = () => {
  const { setHeaderColor } = useTelegram();
  setHeaderColor("#3b82f6 ");

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-5">
        {/* Top */}
        <div className="flex items-center justify-between">
          <h1 className="text-primary font-bold text-xl">MBSI School</h1>

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
        <ListItem
          to="/profile"
          icon={Sparkle}
          title="MBSI Premium"
          className="rounded-2xl"
          gradientTo="to-yellow-700"
          gradientFrom="from-yellow-700"
          trailing={<ChevronRight className="size-5" strokeWidth={1.5} />}
        />

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
