// Components
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

        {/* Student Weekly Stats */}
        <WeeklyStats />
      </div>

      {/* Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default DashboardPage;
