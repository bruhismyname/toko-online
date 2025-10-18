import React, { createContext, useContext, useState, ReactNode } from "react";
import Notification from "@/components/common/notification";

interface NotificationState {
  message: string;
  type: "success" | "error" | "info" | "confirm";
  isVisible: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface NotificationContextType {
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
  hideNotification: () => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setNotification({ message, type, isVisible: true });
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setNotification({
      message,
      type: "confirm",
      isVisible: true,
      onConfirm,
      onCancel,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification, showConfirm }}
    >
      {children}

      {notification.isVisible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          onConfirm={notification.onConfirm}
          onCancel={notification.onCancel}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
