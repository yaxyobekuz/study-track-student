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

// Game pages
import GamePage from "@/features/games/pages/GamePage";
import GamesPage from "@/features/games/pages/GamesPage";

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

          {/* Penalties */}
          <Route path="/penalties" element={<MyPenaltiesPage />} />

          {/* Market */}
          <Route path="/market" element={<Outlet />}>
            <Route index element={<MarketProductsPage />} />
            <Route path="orders" element={<MarketMyOrdersPage />} />
            <Route path="products" element={<MarketProductsPage />} />
            <Route
              path="products/:productId"
              element={<MarketProductDetailPage />}
            />
          </Route>

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
