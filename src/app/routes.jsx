// Router
import {
  Route,
  Outlet,
  Navigate,
  Routes as RoutesWrapper,
} from "react-router-dom";

// Layouts
import RootLayout from "@/shared/layouts/RootLayout.jsx";

// Guards
import AuthGuard from "@/shared/components/guards/AuthGuard";
import GuestGuard from "@/shared/components/guards/GuestGuard";

// Home page
import HomePage from "@/features/home/pages/HomePage";

// Auth pages
import LoginPage from "@/features/auth/pages/LoginPage";

// Dashboard page
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

// Profile pages
import ProfilePage from "@/features/profile/pages/ProfilePage";
import ProfileEditPage from "@/features/profile/pages/ProfileEditPage";

// Get started pages
import GetStartedPage from "@/features/get-started/pages/GetStartedPage";

// Transactions page
import TransactionsPage from "@/features/transactions/pages/TransactionsPage";

// Market pages
import MarketProductsPage from "@/features/market/pages/MarketProductsPage";
import MarketMyOrdersPage from "@/features/market/pages/MarketMyOrdersPage";
import MarketProductDetailPage from "@/features/market/pages/MarketProductDetailPage";

// Penalties
import MyPenaltiesPage from "@/features/penalties/pages/MyPenaltiesPage";

// Tasks
import MyTasksPage from "@/features/tasks/pages/MyTasksPage";
import TaskDetailPage from "@/features/tasks/pages/TaskDetailPage";

// Game pages
import GamePage from "@/features/games/pages/GamePage";
import GamesPage from "@/features/games/pages/GamesPage";

// Statistics pages
import StatisticsStatsPage from "@/features/statistics/pages/StatisticsStatsPage";
import StatisticsScoreboardPage from "@/features/statistics/pages/StatisticsScoreboardPage";
import StatisticsCoinsPage from "@/features/statistics/pages/StatisticsCoinsPage";
import MarketLayout from "@/features/market/layouts/MarketLayout";
import StatisticsLayout from "@/features/statistics/layouts/StatisticsLayout";

const Routes = () => {
  return (
    <RoutesWrapper>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/get-started/:stepNumber?" element={<GetStartedPage />} />

      {/* Guest only routes */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route element={<RootLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />

          {/* Statistics */}
          <Route path="/statistics" element={<StatisticsLayout />}>
            <Route
              index
              element={<Navigate to="/statistics/stats" replace />}
            />
            <Route path="stats" element={<StatisticsStatsPage />} />
            <Route path="scoreboard" element={<StatisticsScoreboardPage />} />
            <Route path="coins" element={<StatisticsCoinsPage />} />
          </Route>

          {/* Penalties */}
          <Route path="/penalties" element={<MyPenaltiesPage />} />

          {/* Tasks */}
          <Route path="/tasks" element={<MyTasksPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />

          {/* Market */}
          <Route path="/market" element={<MarketLayout />}>
            <Route index element={<MarketProductsPage />} />
            <Route path="orders" element={<MarketMyOrdersPage />} />
            <Route path="products" element={<MarketProductsPage />} />
          </Route>
          <Route
            path="/market/products/:productId"
            element={<MarketProductDetailPage />}
          />

          {/* Games */}
          <Route path="/games" element={<Outlet />}>
            <Route index element={<GamesPage />} />
            <Route path=":gameId" element={<GamePage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RoutesWrapper>
  );
};

export default Routes;
