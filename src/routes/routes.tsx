import HomePage from "@/components/pages/home-page";
import WalletDashboard from "@/components/pages/wallet-page";
// import FundingPage from "@/components/pages/funding-page"; // Commented out Paystack funding
import PrivyFundingPage from "@/components/pages/privy-funding-page";
import CalculatorPage from "@/components/pages/calculator-page";
import CardsPage from "@/components/pages/cards-page";
import { PortfolioPage } from "@/components/pages/dashboard-page";
import { useNavigate } from "react-router-dom";
import DelegatePage from "@/components/pages/delegate-page";
// import AuthPage from "@/components/pages/auth-page"; // Commented out old auth
import PrivyAuthPage from "@/components/pages/privy-auth-page";
import ProfilePage from "@/components/pages/profile-page";
import NotificationsPage from "../components/pages/notifications-page";
import PrivyAuthGuard from "../components/PrivyAuthGuard";

function PortfolioPageWrapper() {
  const navigate = useNavigate();
  return <PortfolioPage onBack={() => navigate("/wallet")} />;
}

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/wallet",
    element: (
      <PrivyAuthGuard>
        <WalletDashboard />
      </PrivyAuthGuard>
    ),
  },
  {
    path: "/funding",
    element: (
      <PrivyAuthGuard>
        <PrivyFundingPage />
      </PrivyAuthGuard>
    ),
  },
  {
    path: "/calculator",
    element: (
      <PrivyAuthGuard>
        <CalculatorPage />
      </PrivyAuthGuard>
    ),
  },
  {
    path: "/cards",
    element: (
      <PrivyAuthGuard>
        <CardsPage />
      </PrivyAuthGuard>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivyAuthGuard>
        <PortfolioPageWrapper />
      </PrivyAuthGuard>
    ),
  },
  {
    path: "/delegate",
    element: (
      <PrivyAuthGuard>
        <DelegatePage />
      </PrivyAuthGuard>
    ),
  },
  {
    path: "/auth",
    element: <PrivyAuthPage />,
  },
  {
    path: "/profile",
    element: (
      <PrivyAuthGuard>
        <ProfilePage />
      </PrivyAuthGuard>
    ),
  },
  {
    path: "/notifications",
    element: (
      <PrivyAuthGuard>
        <NotificationsPage />
      </PrivyAuthGuard>
    ),
  },
  {
    path: "*",
    element: (
      <div className="text-center text-red-500">404 - Page Not Found</div>
    ),
  },
];

export default routes;
