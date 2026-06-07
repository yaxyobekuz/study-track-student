// Utils
import { cn } from "@/shared/utils/cn";

// Router
import { Outlet } from "react-router-dom";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";

// Components
import TestsTabs from "../components/TestsTabs";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

/**
 * "Testlar" bo'limi layouti - pastki navbar destination.
 * Title + tablar (Testlar / Natijalar / Reyting), har tab kontenti <Outlet /> da.
 */
const TestsLayout = () => {
  const { setHeaderColor } = useTelegram();

  setHeaderColor("#3b82f6");

  return (
    <div className="min-h-screen pb-40 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-4">
        {/* Title */}
        <h1 className={cn("text-primary font-bold text-xl")}>Testlar</h1>

        {/* Tabs */}
        <TestsTabs />

        {/* Content */}
        <Outlet />
      </div>

      {/* Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default TestsLayout;
