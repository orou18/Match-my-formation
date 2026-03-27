"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  Trash2,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;

      try {
        const response = await fetch("/api/creator/notifications", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();

        if (response.ok) {
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error(
          "Erreur de chargement des notifications créateur:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const markAsRead = async (id: string) => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;
    await fetch("/api/creator/notifications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ id, read: true }),
    });
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = async () => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;
    await fetch("/api/creator/notifications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ action: "mark_all_read" }),
    });
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = async (id: string) => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;
    await fetch(`/api/creator/notifications?id=${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = async () => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;
    await fetch("/api/creator/notifications", {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notif.read) ||
      (filter === "read" && notif.read);

    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-8 animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            Restez informé des activités importantes de votre dashboard
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Tout marquer comme lu
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Tout supprimer
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex gap-2">
            {(["all", "unread", "read"] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filterType === "all" && "Toutes"}
                {filterType === "unread" && "Non lues"}
                {filterType === "read" && "Lues"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm
                ? "Aucune notification trouvée"
                : "Aucune notification"}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Essayez de modifier votre recherche"
                : "Vous n'avez pas encore de notifications"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                !notification.read
                  ? "border-primary/20 bg-primary/5"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}
                >
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                          title="Marquer comme lu"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(notification.timestamp)}
                    </div>

                    {notification.action && (
                      <Link
                        href={notification.action.url}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {notification.action.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
