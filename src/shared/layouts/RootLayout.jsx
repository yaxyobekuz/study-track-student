// Router
import { Outlet } from "react-router-dom";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Hooks
import useTelegram from "@/shared/hooks/useTelegram";

// Components
import BugReport from "../components/layout/BugReport";

// API + queries
import { authQueries } from "@/features/auth/queries/auth.queries";
import { socialNetworksAPI } from "@/features/social-networks/api/social-networks.api";

// Blocked pages
import BlockedPage from "@/features/penalties/pages/BlockedPage";
import ChannelSubscriptionPage from "@/features/social-networks/pages/ChannelSubscriptionPage";

const RootLayout = () => {
  const { isTelegram, user: tgUser } = useTelegram();

  const { data: user } = useQuery(authQueries.me());

  const { data: subscription, refetch: recheckSubscription } = useQuery({
    queryKey: ["social-networks", "check-subscription", tgUser?.id],
    queryFn: () =>
      socialNetworksAPI
        .checkSubscription(tgUser.id)
        .then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
    enabled: isTelegram && !!tgUser?.id && !!user,
  });

  if (user?.penaltyPoints >= 12) return <BlockedPage />;

  if (subscription && !subscription?.subscribed) {
    return (
      <ChannelSubscriptionPage
        onRecheck={recheckSubscription}
        channels={subscription?.channels}
      />
    );
  }

  return (
    <div className="bg-gray-100">
      <Outlet />
      <BugReport />
    </div>
  );
};

export default RootLayout;
