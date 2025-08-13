import HomePage from "@/components/pages/home-page";
import OpportuniesPage from "@/components/pages/opportunities-page";
import AuthPage from "@/components/pages/auth-page";
import ProfilePage from "@/components/pages/profile-page";
import SponsorDashboard from "@/components/pages/sponsor-dashboard";
import NotificationsPage from "../components/pages/notifications-page";
import { useUser } from "../contexts/UserContext";

// Simple auth guard component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  // Check if Supabase is configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Configuration Error</h2>
          <p className="text-gray-400 mb-4">Supabase environment variables are not configured.</p>
          <p className="text-sm text-gray-500">Please check your .env file</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
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
    path: "/home",
    element: <OpportuniesPage />, // Temporarily bypass AuthGuard
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
    element: (
      <AuthGuard>
        <SponsorDashboard />
      </AuthGuard>
    ),
  },
  {
    path: "/notifications",
    element: (
      <AuthGuard>
        <NotificationsPage />
      </AuthGuard>
    ),
  },
  {
    path: "*",
    element: (
      <div className="text-center text-red-500 bg-black min-h-screen flex items-center justify-center">
        404 - Page Not Found
      </div>
    ),
  },
];

export default routes;
