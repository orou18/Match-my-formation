"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Loader,
} from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info" | "loading";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  }
  return context;
}

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove notification after duration (except for persistent and loading)
    if (!notification.persistent && notification.type !== "loading") {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationsContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "loading":
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "loading":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
        return "text-blue-800";
      case "loading":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 max-w-sm`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${getTextColor()}`}>
            {notification.title}
          </h4>
          {notification.message && (
            <p className={`text-sm mt-1 ${getTextColor()} opacity-80`}>
              {notification.message}
            </p>
          )}

          {/* Action button */}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className={`mt-2 text-sm font-medium ${getTextColor()} underline hover:no-underline`}
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 rounded-md ${getTextColor()} opacity-60 hover:opacity-100 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      {notification.type !== "loading" && !notification.persistent && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <motion.div
            className="bg-blue-500 h-1 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{
              duration: (notification.duration || 5000) / 1000,
              ease: "linear",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

// Helper functions for common notifications
export const createNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  return {
    success: (
      title: string,
      message?: string,
      options?: Partial<Omit<Notification, "id" | "type" | "title" | "message">>
    ) => {
      addNotification({ type: "success", title, message, ...options });
    },
    error: (
      title: string,
      message?: string,
      options?: Partial<Omit<Notification, "id" | "type" | "title" | "message">>
    ) => {
      addNotification({
        type: "error",
        title,
        message,
        persistent: true,
        ...options,
      });
    },
    warning: (
      title: string,
      message?: string,
      options?: Partial<Omit<Notification, "id" | "type" | "title" | "message">>
    ) => {
      addNotification({ type: "warning", title, message, ...options });
    },
    info: (
      title: string,
      message?: string,
      options?: Partial<Omit<Notification, "id" | "type" | "title" | "message">>
    ) => {
      addNotification({ type: "info", title, message, ...options });
    },
    loading: (
      title: string,
      message?: string,
      options?: Partial<Omit<Notification, "id" | "type" | "title" | "message">>
    ) => {
      addNotification({
        type: "loading",
        title,
        message,
        persistent: true,
        ...options,
      });
    },
  };
};
