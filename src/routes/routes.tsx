import HomePage from "@/components/pages/home-page";
import WalletDashboard from "@/components/pages/wallet-page";
import FundingPage from "@/components/pages/funding-page";
import CalculatorPage from "@/components/pages/calculator-page";
import CardsPage from "@/components/pages/cards-page";
import { PortfolioPage } from "@/components/pages/dashboard-page";
import { useNavigate } from "react-router-dom";
import DelegatePage from "@/components/pages/delegate-page";
import AuthPage from "@/components/pages/auth-page";
import ProfilePage from "@/components/pages/profile-page";
import NotificationsPage from "../components/pages/notifications-page";

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
    element: <WalletDashboard />,
  },
  {
    path: "/funding",
    element: <FundingPage />,
  },
  {
    path: "/calculator",
    element: <CalculatorPage />,
  },
  {
    path: "/cards",
    element: <CardsPage />,
  },
  {
    path: "/dashboard",
    element: <PortfolioPageWrapper />,
  },
  {
    path: "/delegate",
    element: <DelegatePage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "*",
    element: (
      <div className="text-center text-red-500">404 - Page Not Found</div>
    ),
  },
];

export default routes;
