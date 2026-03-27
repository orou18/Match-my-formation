"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface SimpleNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

export function useSimpleNotification() {
  const [notifications, setNotifications] = useState<SimpleNotification[]>([]);

  const addNotification = (notification: Omit<SimpleNotification, "id">) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const success = (title: string, message?: string) => {
    addNotification({ type: "success", title, message });
  };

  const error = (title: string, message?: string) => {
    addNotification({ type: "error", title, message });
  };

  const warning = (title: string, message?: string) => {
    addNotification({ type: "warning", title, message });
  };

  const info = (title: string, message?: string) => {
    addNotification({ type: "info", title, message });
  };

  return {
    notifications,
    success,
    error,
    warning,
    info,
    removeNotification,
  };
}

export function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: SimpleNotification[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${getBackgroundColor(notification.type)} border rounded-lg shadow-lg p-4 max-w-sm`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-semibold ${getTextColor(notification.type)}`}
                >
                  {notification.title}
                </h4>
                {notification.message && (
                  <p
                    className={`text-sm mt-1 ${getTextColor(notification.type)} opacity-80`}
                  >
                    {notification.message}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => onRemove(notification.id)}
                className={`flex-shrink-0 p-1 rounded-md ${getTextColor(notification.type)} opacity-60 hover:opacity-100 transition-opacity`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getIcon(type: NotificationType) {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "error":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "warning":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "info":
      return <Info className="w-5 h-5 text-blue-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
}

function getBackgroundColor(type: NotificationType) {
  switch (type) {
    case "success":
      return "bg-green-50 border-green-200";
    case "error":
      return "bg-red-50 border-red-200";
    case "warning":
      return "bg-yellow-50 border-yellow-200";
    case "info":
      return "bg-blue-50 border-blue-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
}

function getTextColor(type: NotificationType) {
  switch (type) {
    case "success":
      return "text-green-800";
    case "error":
      return "text-red-800";
    case "warning":
      return "text-yellow-800";
    case "info":
      return "text-blue-800";
    default:
      return "text-gray-800";
  }
}
