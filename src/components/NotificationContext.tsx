"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Alert, getMockAlerts } from "@/lib/mockData";

interface NotificationContextType {
  alerts: Alert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addAlert: (alert: Alert) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  alerts: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  addAlert: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("monitored_identities");
    let email = "user@example.com";
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.emails?.[0]) email = parsed.emails[0];
      } catch {}
    }
    setAlerts(getMockAlerts(email));
  }, []);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAsRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider value={{ alerts, unreadCount, markAsRead, markAllAsRead, addAlert }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
