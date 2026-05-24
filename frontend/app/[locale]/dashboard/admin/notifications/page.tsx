"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Bell,
  BellRing,
  Send,
  Trash2,
  Eye,
  Calendar,
  User,
  Filter,
  BarChart3,
  TrendingUp,
  Clock,
  MoreVertical,
  Mail,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  Users,
  Target,
  Star,
  Shield,
  Edit,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  target: "all" | "users" | "creators" | "admins";
  status: "draft" | "scheduled" | "sent";
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  openedCount: number;
  clickedCount: number;
  createdBy: string;
  createdAt: string;
}

interface NotificationItem {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
}

/**
 * Helper pour gérer les réponses 401 (session expirée)
 */
const handleAuthError = (response: Response, router: ReturnType<typeof useRouter>, locale: string) => {
  if (response.status === 401) {
    console.error("[Auth] Session expirée - redirection vers login");
    router.push(`/${locale}/login`);
    return true;
  }
  return false;
};

/**
 * Configuration commune pour les requêtes fetch
 */
const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  };
};

export default function AdminNotifications() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Récupérer le locale depuis les params
  const [locale, setLocale] = useState("fr");
  useEffect(() => {
    // Le locale est géré par le layout
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as Notification["type"],
    target: "all" as Notification["target"],
    status: "draft" as Notification["status"],
    scheduledAt: "",
  });
  const [toastNotifications, setToastNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  // Ajouter une notification toast
  const addToast = (type: NotificationItem["type"], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToastNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToastNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // DEBUG: Session NextAuth
  useEffect(() => {
    console.log("[NOTIFICATIONS DEBUG] === Début debug session ===");
    console.log("[NOTIFICATIONS DEBUG] status:", status);
    console.log("[NOTIFICATIONS DEBUG] hasSession:", !!session);
    console.log("[NOTIFICATIONS DEBUG] userId:", session?.user?.id);
    console.log("[NOTIFICATIONS DEBUG] role:", session?.user?.role);
    console.log("[NOTIFICATIONS DEBUG] === Fin debug session ===");
  }, [session, status]);

  // Charger les notifications depuis l'API
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return;

    const loadNotifications = async () => {
      console.log("[NOTIFICATIONS DEBUG] === Début appel API notifications ===");
      console.log("[NOTIFICATIONS DEBUG] endpoint:", "/api/admin/notifications");

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/notifications", getFetchOptions());
        
        // Gestion erreur 401
        if (handleAuthError(response, router, locale)) {
          return;
        }

        console.log("[NOTIFICATIONS DEBUG] Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          // Safe extraction - garantit un tableau
          const notificationsData = Array.isArray(data.notifications) ? data.notifications : [];
          setNotifications(notificationsData);
          console.log("[NOTIFICATIONS DEBUG] Notifications chargées:", notificationsData.length);
        } else {
          const error = await response.json().catch(() => ({}));
          console.error("[NOTIFICATIONS DEBUG] Erreur:", error);
          addToast("warning", "Impossible de charger les notifications");
          setNotifications([]);
        }
      } catch (err) {
        console.error("[NOTIFICATIONS DEBUG] Erreur réseau:", err);
        addToast("error", "Erreur de connexion");
        setError("Impossible de charger les notifications");
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [status, router, locale]);

  // Safe rendering - protection contre undefined
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const filteredNotifications = safeNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || notification.type === filterType;
    const matchesStatus =
      filterStatus === "all" || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateNotification = async () => {
    if (
      !newNotification.title ||
      !newNotification.message ||
      !newNotification.type ||
      !newNotification.target
    ) {
      addToast("warning", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await fetch("/api/admin/notifications", getFetchOptions({
        method: "POST",
        body: JSON.stringify(newNotification),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        const createdNotification = await response.json();
        setNotifications([...safeNotifications, createdNotification]);
        setShowCreateModal(false);
        setNewNotification({
          title: "",
          message: "",
          type: "info",
          target: "all",
          status: "draft",
          scheduledAt: "",
        });
        addToast("success", "Notification créée avec succès");
      } else {
        const error = await response.json().catch(() => ({}));
        addToast("error", error.error || "Erreur lors de la création");
      }
    } catch (err) {
      console.error("[NOTIFICATIONS DEBUG] Erreur création:", err);
      addToast("error", "Erreur lors de la création");
    }
  };

  const handleUpdateNotification = async (
    notificationId: string,
    updates: any
  ) => {
    try {
      const response = await fetch("/api/admin/notifications", getFetchOptions({
        method: "PUT",
        body: JSON.stringify({ id: notificationId, ...updates }),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        const updatedNotification = await response.json();
        setNotifications(
          safeNotifications.map((notification) =>
            notification.id === notificationId
              ? updatedNotification
              : notification
          )
        );
        addToast("success", "Notification mise à jour avec succès");
      } else {
        const error = await response.json().catch(() => ({}));
        addToast("error", error.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("[NOTIFICATIONS DEBUG] Erreur mise à jour:", err);
      addToast("error", "Erreur lors de la mise à jour");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    // Confirmation dialog stylée via modal (pas de confirm())
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette notification?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/notifications?id=${notificationId}`,
        getFetchOptions({
          method: "DELETE",
        })
      );

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        setNotifications(
          safeNotifications.filter(
            (notification) => notification.id !== notificationId
          )
        );
        addToast("success", "Notification supprimée avec succès");
      } else {
        const error = await response.json().catch(() => ({}));
        addToast("error", error.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("[NOTIFICATIONS DEBUG] Erreur suppression:", err);
      addToast("error", "Erreur lors de la suppression");
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-700";
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return AlertCircle;
      case "success":
        return Check;
      case "warning":
        return AlertCircle;
      case "error":
        return X;
      default:
        return Bell;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTargetBadge = (target: string) => {
    switch (target) {
      case "all":
        return "bg-purple-100 text-purple-700";
      case "users":
        return "bg-blue-100 text-blue-700";
      case "creators":
        return "bg-orange-100 text-orange-700";
      case "admins":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case "all":
        return Users;
      case "users":
        return User;
      case "creators":
        return Star;
      case "admins":
        return Shield;
      default:
        return Users;
    }
  };

  const getOpenRate = (notification: Notification) => {
    if (notification.recipients === 0) return 0;
    return Math.round(
      (notification.openedCount / notification.recipients) * 100
    );
  };

  const getClickRate = (notification: Notification) => {
    if (notification.openedCount === 0) return 0;
    return Math.round(
      (notification.clickedCount / notification.openedCount) * 100
    );
  };

  // Loading state - Skeleton cards
  if (status === "loading" || isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state - UI stylée
  if (error) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Impossible de charger les notifications
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                fetch("/api/admin/notifications", getFetchOptions())
                  .then(res => res.json())
                  .then(data => {
                    setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
                    setIsLoading(false);
                  })
                  .catch(() => setIsLoading(false));
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Réessayer
            </button>
            <button
              onClick={() => router.push(`/${locale}/dashboard/admin`)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retour dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Notifications Toast */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toastNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                notification.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : notification.type === "error"
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : notification.type === "warning"
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                  : "bg-blue-50 border border-blue-200 text-blue-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle size={18} />
              ) : notification.type === "error" ? (
                <AlertCircle size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion Notifications
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredNotifications.length} notifications
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <BarChart3 size={18} />
            Analytics
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Nouvelle Notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          {
            label: "Total Envoyées",
            value: safeNotifications.filter((n) => n.status === "sent").length,
            icon: Send,
            color: "green",
            change: "+12%",
          },
          {
            label: "Taux Ouverture",
            value: "44.2%",
            icon: Eye,
            color: "blue",
            change: "+5%",
          },
          {
            label: "Taux Clic",
            value: "18.7%",
            icon: Target,
            color: "purple",
            change: "+3%",
          },
          {
            label: "Programmées",
            value: safeNotifications.filter((n) => n.status === "scheduled").length,
            icon: Clock,
            color: "orange",
            change: "+2",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
              <span className="text-green-600 text-sm font-bold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher une notification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous types</option>
              <option value="info">Information</option>
              <option value="success">Succès</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="sent">Envoyée</option>
              <option value="scheduled">Programmée</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune notification trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par créer votre première notification"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Créer une notification
            </button>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification, index) => {
          const TypeIcon = getTypeIcon(notification.type);
          const TargetIcon = getTargetIcon(notification.target);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${getTypeBadge(notification.type)}`}
                    >
                      <TypeIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {notification.message}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeBadge(notification.type)}`}
                        >
                          {notification.type}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getTargetBadge(notification.target)}`}
                        >
                          <TargetIcon size={12} />
                          {notification.target === "all"
                            ? "Tous"
                            : notification.target === "users"
                              ? "Utilisateurs"
                              : notification.target === "creators"
                                ? "Créateurs"
                                : "Admins"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(notification.status)}`}
                        >
                          {notification.status === "sent"
                            ? "Envoyée"
                            : notification.status === "scheduled"
                              ? "Programmée"
                              : "Brouillon"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {notification.status === "sent" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Users size={14} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-lg font-bold text-gray-900">
                        {notification.recipients.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Destinataires</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Eye size={14} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-lg font-bold text-gray-900">
                        {getOpenRate(notification)}%
                      </p>
                      <p className="text-xs text-gray-500">Taux ouverture</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Target
                        size={14}
                        className="mx-auto text-gray-600 mb-1"
                      />
                      <p className="text-lg font-bold text-gray-900">
                        {getClickRate(notification)}%
                      </p>
                      <p className="text-xs text-gray-500">Taux clic</p>
                    </div>
                  </div>
                )}

                {/* Date Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        Créée le{" "}
                        {new Date(notification.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>Par {notification.createdBy}</span>
                    </div>
                  </div>
                  {notification.scheduledAt && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        Programmée pour{" "}
                        {new Date(notification.scheduledAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Nouvelle Notification
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  placeholder="Titre de la notification"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Contenu de la notification"
                  rows={4}
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as Notification["type"] })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Information</option>
                    <option value="success">Succès</option>
                    <option value="warning">Avertissement</option>
                    <option value="error">Erreur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cible
                  </label>
                  <select
                    value={newNotification.target}
                    onChange={(e) => setNewNotification({ ...newNotification, target: e.target.value as Notification["target"] })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les utilisateurs</option>
                    <option value="users">Utilisateurs uniquement</option>
                    <option value="creators">Créateurs uniquement</option>
                    <option value="admins">Administrateurs uniquement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={newNotification.status}
                    onChange={(e) => setNewNotification({ ...newNotification, status: e.target.value as Notification["status"] })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="scheduled">Programmer</option>
                    <option value="sent">Envoyer immédiatement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'envoi (si programmé)
                  </label>
                  <input
                    type="datetime-local"
                    value={newNotification.scheduledAt}
                    onChange={(e) => setNewNotification({ ...newNotification, scheduledAt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateNotification}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer la Notification
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}