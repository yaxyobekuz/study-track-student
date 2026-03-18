// Router
import { Outlet } from "react-router-dom";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// API
import { authAPI } from "@/features/auth/api/auth.api";

// Components
import BugReport from "../components/layout/BugReport";

// Blocked page
import BlockedPage from "@/features/penalties/pages/BlockedPage";

const RootLayout = () => {
  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(localStorage.getItem("authToken")),
  });

  if (user?.penaltyPoints >= 12) return <BlockedPage />;

  return (
    <div className="bg-gray-100">
      <Outlet />
      <BugReport />
    </div>
  );
};

export default RootLayout;
