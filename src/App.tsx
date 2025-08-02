import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import { UserProvider } from "./contexts/UserContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";

function App() {
  const routing = useRoutes(routes);
  return (
    <UserProvider>
      <NotificationsProvider>
        <main>{routing}</main>
      </NotificationsProvider>
    </UserProvider>
  );
}

export default App;
