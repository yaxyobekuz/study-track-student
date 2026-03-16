// Icons
import { ChevronRight } from "lucide-react";

// Data
import { topNavItems } from "../data/nav.data";

// Components
import List from "@/shared/components/ui/List";
import WeeklyStats from "../components/WeeklyStats";
import StoriesPanel from "../components/StoriesPanel";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-5">
        {/* Top */}
        <h1 className="text-primary font-bold text-xl">MBSI School</h1>

        {/* Stories Panel */}
        <StoriesPanel />

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
