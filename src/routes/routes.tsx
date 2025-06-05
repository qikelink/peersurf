import CommunityPage from "@/components/pages/community-page";
import HomePage from "@/components/pages/home-page";

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/community",
    element: <CommunityPage />,
  },
  {
    path: "*",
    element: (
      <div className="text-center text-red-500">404 - Page Not Found</div>
    ),
  },
];

export default routes;
