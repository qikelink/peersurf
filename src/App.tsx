import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import { UserProvider } from "./contexts/UserContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const routing = useRoutes(routes);
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationsProvider>
          <main>{routing}</main>
        </NotificationsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
