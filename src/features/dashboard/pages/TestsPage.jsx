// Router
import { Outlet } from "react-router-dom";

// Data
import { testTabs } from "../data/nav.data";

// Components
import Tabs from "@/shared/components/ui/Tabs";
import BackHeader from "@/shared/components/layout/BackHeader";

/**
 * "Testlar" markazi - URL bo'yicha tablar (Testlar / Natijalar / Reyting).
 * Har tab kontenti ichki route orqali <Outlet /> da render bo'ladi.
 */
const TestsPage = () => {
  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/dashboard" title="Testlar" />

      <div className="container pt-4 space-y-4">
        <Tabs
          activePathIndex={1}
          listClassName="w-full"
          items={testTabs}
          getItemHref={(item) => item.path}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default TestsPage;
