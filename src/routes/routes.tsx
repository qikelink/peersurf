import HomePage from "@/components/pages/home-page";
import OpportuniesPage from "@/components/pages/opportunities-page";
import TalentPage from "@/components/pages/talent-page";
import CommunityPage from "@/components/pages/community-page";
import AuthPage from "@/components/pages/auth-page";
import ProfilePage from "@/components/pages/profile-page";
import SponsorDashboard from "@/components/pages/sponsor-dashboard";
import NotificationsPage from "../components/pages/notifications-page";
import OpportunityDetailPage from "../components/pages/opportunity-detail";
import { useUser } from "../contexts/UserContext";

// Auth guard component - only used for pages that require authentication
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <>{children}</>;
}

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/opportunities",
    element: <OpportuniesPage />, // Temporarily bypass AuthGuard
  },
  {
    path: "/talent",
    element: <TalentPage />,
  },
  {
    path: "/about",
    element: <CommunityPage />,
  },
  {
    path: "/opportunity/:id",
    element: <OpportunityDetailPage />,
  },

 
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/profile",
    element: (
      <AuthGuard>
        <ProfilePage />
      </AuthGuard>
    ),
  },
  {
    path: "/sponsor",
    element: <SponsorDashboard />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "*",
    element: (
      <div className="text-center text-red-500 bg-background min-h-screen flex items-center justify-center">
        404 - Page Not Found
      </div>
    ),
  },
];

export default routes;
