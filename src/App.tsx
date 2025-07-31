import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
// import { UserProvider } from "./contexts/UserContext"; // Commented out old auth
import { PrivyWrapper } from "./lib/privy.tsx";
import { PrivyProvider } from "./contexts/PrivyContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { OrchestratorsProvider } from "./contexts/OrchestratorsContext";

function App() {
  const routing = useRoutes(routes);
  return (
    <PrivyWrapper>
      <PrivyProvider>
        <NotificationsProvider>
          <OrchestratorsProvider>
            <main>{routing}</main>
          </OrchestratorsProvider>
        </NotificationsProvider>
      </PrivyProvider>
    </PrivyWrapper>
  );
}

export default App;
