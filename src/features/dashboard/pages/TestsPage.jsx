// Utils
import { cn } from "@/shared/utils/cn";

// Router
import { Outlet } from "react-router-dom";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";

// Data
import { testTabs } from "../data/nav.data";

// Components
import Tabs from "@/shared/components/ui/Tabs";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

/**
 * "Testlar" bo'limi - pastki navbar destination.
 * URL bo'yicha tablar (Testlar / Natijalar / Reyting), har tab kontenti <Outlet /> da.
 */
const TestsPage = () => {
  const { setHeaderColor } = useTelegram();

  setHeaderColor("#3b82f6");

  return (
    <div className="min-h-screen pb-40 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-4">
        {/* Title */}
        <h1 className={cn("text-primary font-bold text-xl")}>Testlar</h1>

        {/* Tabs */}
        <Tabs
          activePathIndex={1}
          listClassName="w-full"
          items={testTabs}
          getItemHref={(item) => item.path}
        />

        {/* Content */}
        <Outlet />
      </div>

      {/* Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default TestsPage;
