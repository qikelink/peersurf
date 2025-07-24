import React, { createContext, useContext, useState, useCallback } from "react";

const dummyNotifications = [
  {
    id: 1,
    title: "Stake Successful",
    message: "Your stake of N100,000 to Titan Node was successful.",
    timestamp: "2024-06-01 10:30 AM",
  },
  {
    id: 2,
    title: "Reward Earned",
    message: "You earned N25,000 in rewards from StakeSquid.",
    timestamp: "2024-05-30 08:15 AM",
  },
];

const NotificationsContext = createContext<any>(null);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const fetchNotifications = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(dummyNotifications); // Replace with real fetch later
      setLoading(false);
      setLoaded(true);
    }, 800);
  }, []);

  const refreshNotifications = () => {
    setLoaded(false);
    fetchNotifications();
  };

  // Only fetch once per session
  React.useEffect(() => {
    if (!loaded) fetchNotifications();
    // eslint-disable-next-line
  }, [loaded, fetchNotifications]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, loading, fetchNotifications, refreshNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}; 