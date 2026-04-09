"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BellRing,
  Mail,
  MessageSquare,
  Megaphone,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Search,
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
} from "lucide-react";
import {
  studentProfileApi,
  type StudentNotification,
  type StudentNotificationSettings,
} from "@/lib/services/student-profile-api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [settings, setSettings] = useState<StudentNotificationSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await studentProfileApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await studentProfileApi.getNotificationSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const next = await studentProfileApi.updateNotification({
        id: notificationId,
        isRead: true,
      });

      if (Array.isArray(next)) {
        setNotifications(next);
      } else {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
      }
      showMessage("Notification marquée comme lue");
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      const next = await studentProfileApi.updateNotification({
        id: notificationId,
        isRead: false,
      });

      if (Array.isArray(next)) {
        setNotifications(next);
      } else {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: false } : n
          )
        );
      }
      showMessage("Notification marquée comme non lue");
    } catch (error) {
      console.error("Error marking as unread:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const next = await studentProfileApi.deleteNotification(notificationId);
      setNotifications(next);
      showMessage("Notification supprimée");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const next = await studentProfileApi.updateNotification({
        action: "mark_all_read",
      });
      if (Array.isArray(next)) {
        setNotifications(next);
      } else {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
      showMessage("Toutes les notifications marquées comme lues");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const next = await studentProfileApi.deleteNotification();
      setNotifications(next);
      showMessage("Toutes les notifications supprimées");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const updateSettings = async (
    newSettings: StudentNotificationSettings
  ) => {
    try {
      await studentProfileApi.updateNotificationSettings(newSettings);
      setSettings(newSettings);
      showMessage("Paramètres mis à jour");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const getNotificationIcon = (type: string, category: string) => {
    switch (category) {
      case "course":
        return BookOpen;
      case "achievement":
        return Award;
      case "message":
        return MessageSquare;
      case "system":
        return AlertCircle;
      case "marketing":
        return Megaphone;
      default:
        return BellRing;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-blue-100 text-blue-600 border-blue-200";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "read" && notification.isRead) ||
      (filter === "unread" && !notification.isRead);

    const matchesCategory =
      categoryFilter === "all" || notification.category === categoryFilter;

    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-[#002B24]">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-100 text-green-700 flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          {message}
        </motion.div>
      )}

      {/* Settings Panel */}
      {showSettings && settings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Paramètres de notification
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Alertes de cours</div>
                  <div className="text-sm text-gray-500">
                    Recevoir des rappels pour vos leçons
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.courseAlerts}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    courseAlerts: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Emails marketing</div>
                  <div className="text-sm text-gray-500">
                    Nouveautés et offres spéciales
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    marketingEmails: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Messages directs</div>
                  <div className="text-sm text-gray-500">
                    Notifications de vos instructeurs
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.directMessages}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    directMessages: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Annonces plateforme</div>
                  <div className="text-sm text-gray-500">
                    Mises à jour importantes du système
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.systemAnnouncements}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    systemAnnouncements: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Réalisations</div>
                  <div className="text-sm text-gray-500">
                    Célébrer vos succès
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.achievementAlerts}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    achievementAlerts: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Digest hebdomadaire</div>
                  <div className="text-sm text-gray-500">
                    Résumé de votre activité
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    weeklyDigest: e.target.checked,
                  })
                }
                className="w-5 h-5 text-primary rounded"
              />
            </label>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une notification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "unread" | "read")
              }
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Toutes</option>
              <option value="unread">Non lues</option>
              <option value="read">Lues</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Toutes catégories</option>
              <option value="course">Cours</option>
              <option value="achievement">Réalisations</option>
              <option value="message">Messages</option>
              <option value="system">Système</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <BellRing className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filter !== "all" || categoryFilter !== "all"
                ? "Aucune notification trouvée"
                : "Aucune notification"}
            </h3>
            <p className="text-gray-600">
              {searchQuery || filter !== "all" || categoryFilter !== "all"
                ? "Essayez de modifier vos filtres"
                : "Vous n'avez pas encore de notifications"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(
                notification.type,
                notification.category
              );

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl border ${getNotificationColor(notification.type)}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-gray-900 mb-1 ${
                              !notification.isRead ? "font-bold" : ""
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>

                            {notification.metadata?.courseName && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {notification.metadata.courseName}
                              </span>
                            )}

                            {notification.metadata?.instructor && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {notification.metadata.instructor}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 xl:ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Marquer comme lu"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {notification.isRead && (
                            <button
                              onClick={() => markAsUnread(notification.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Marquer comme non lu"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={clearAllNotifications}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Supprimer toutes les notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
