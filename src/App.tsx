import { useRoutes } from "react-router-dom";
import { useEffect } from "react";
import routes from "./routes/routes";
import { UserProvider } from "./contexts/UserContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Chatbot from "./components/chatbot";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const routing = useRoutes(routes);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
      delay: 100,
    });
  }, []);

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
