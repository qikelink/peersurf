import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const NotificationsContext = createContext<any>(null);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Try to fetch notifications from the backend
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch notifications for the current user
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching notifications:', error);
          // If there's an error or no notifications table, set empty array
          setNotifications([]);
        } else {
          setNotifications(data || []);
        }
      } else {
        // No user logged in, set empty array
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // If there's any error, set empty array
      setNotifications([]);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
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