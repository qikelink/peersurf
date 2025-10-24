import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import { UserProvider } from "./contexts/UserContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Chatbot from "./components/chatbot";

function App() {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationsProvider>
          <main>{routing}</main>
          <Chatbot />
        </NotificationsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
