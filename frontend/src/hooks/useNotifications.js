import { useEffect, useState } from "react";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "../services/notificationSocket";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const socket = connectNotificationSocket(token, (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => disconnectNotificationSocket();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    setNotifications,
  };
};