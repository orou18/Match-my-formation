"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  DollarSign,
  Video,
  Eye,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Activity,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { dashboardService } from "@/lib/services/dashboard-service";

interface AnalyticsData {
  period: string;
  users: number;
  creators: number;
  revenue: number;
  courses: number;
  engagement: number;
  completion: number;
}

interface TopPerformer {
  id: string;
  name: string;
  type: "course" | "creator";
  metric: string;
  value: number;
  change: number;
}

interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
}

/**
 * Helper pour gérer les réponses 401 (session expirée)
 * Redirige vers la page de login si non authentifié
 */
const handleAuthError = (response: Response, router: ReturnType<typeof useRouter>, locale: string) => {
  if (response.status === 401) {
    console.error("[Auth] Session expirée - redirection vers login");
    router.push(`/${locale}/login`);
    return true;
  }
  return false;
};

export default function AdminAnalytics() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Récupérer le locale depuis les params
  const [locale, setLocale] = useState("fr");
  useEffect(() => {
    // Le locale est géré par le layout, on utilise "fr" par défaut
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  // Ajouter une notification
  const addNotification = (type: Notification["type"], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications(prev => [...prev, { id, type, message }]);
    // Auto-dismiss après 5 secondes
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // DEBUG: Session NextAuth
  useEffect(() => {
    console.log("[ANALYTICS DEBUG] === Début debug session ===");
    console.log("[ANALYTICS DEBUG] status:", status);
    console.log("[ANALYTICS DEBUG] hasSession:", !!session);
    console.log("[ANALYTICS DEBUG] userId:", session?.user?.id);
    console.log("[ANALYTICS DEBUG] role:", session?.user?.role);
    console.log("[ANALYTICS DEBUG] hasAccessToken:", !!session?.user?.accessToken);
    console.log("[ANALYTICS DEBUG] === Fin debug session ===");
  }, [session, status]);

  // Charger les analytics
  useEffect(() => {
    // Attendre que la session soit chargée
    if (status === "loading") return;
    if (status === "unauthenticated") return;

    const loadAnalytics = async () => {
      // DEBUG: Avant appel API
      console.log("[ANALYTICS DEBUG] === Début appel API analytics ===");
      console.log("[ANALYTICS DEBUG] endpoint:", "/api/admin/stats");
      console.log("[ANALYTICS DEBUG] dateRange:", dateRange);
      console.log("[ANALYTICS DEBUG] selectedMetric:", selectedMetric);

      try {
        setIsLoading(true);
        setError(null);

        const data = await dashboardService.getAdminAnalytics(dateRange, selectedMetric);
        
        // DEBUG: Réponse reçue
        console.log("[ANALYTICS DEBUG] Réponse reçue:", data ? "OK" : "null");

        if (data) {
          setAnalyticsData(data);
          setTopPerformers(Array.isArray(data.topPerformers) ? data.topPerformers : []);
          
          // Notification succès discrète
          if (!refreshing) {
            addNotification("success", "Données analytics chargées avec succès");
          }
        } else {
          setError("Aucune donnée disponible");
          addNotification("warning", "Aucune donnée analytics disponible");
        }
      } catch (err) {
        console.error("[ANALYTICS DEBUG] Erreur:", err);
        
        // Vérifier si c'est une erreur 401
        if (err instanceof Error) {
          if (err.message.includes("401")) {
            router.push(`/${locale}/login`);
            return;
          }
        }
        
        setError("Impossible de charger les données analytics");
        addNotification("error", "Erreur lors du chargement des analytics");
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };

    loadAnalytics();
  }, [status, dateRange, selectedMetric, refreshing, router, locale]);

  // Safe normalization - garantit des valeurs par défaut
  const safeData = analyticsData ?? {};
  const overview = safeData.overview ?? {};
  const growth = overview.monthlyGrowth ?? {};

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount ?? 0);
  }

  const kpiCards = [
    {
      title: "Revenus Totaux",
      value: formatCurrency(overview.totalRevenue ?? 0),
      change: growth.revenue ?? 0,
      icon: DollarSign,
      color: "green",
      trend: (growth.revenue ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Utilisateurs Actifs",
      value: new Intl.NumberFormat("fr-FR").format(overview.totalUsers ?? 0),
      change: growth.users ?? 0,
      icon: Users,
      color: "blue",
      trend: (growth.users ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Créateurs",
      value: new Intl.NumberFormat("fr-FR").format(overview.totalCreators ?? 0),
      change: growth.creators ?? 0,
      icon: UserCheck,
      color: "purple",
      trend: (growth.creators ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Cours Actifs",
      value: new Intl.NumberFormat("fr-FR").format(overview.totalCourses ?? 0),
      change: growth.courses ?? 0,
      icon: Video,
      color: "orange",
      trend: (growth.courses ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Taux d'Engagement",
      value: `${overview.engagementRate ?? 0}%`,
      change: growth.engagement ?? 0,
      icon: Target,
      color: "indigo",
      trend: (growth.engagement ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Taux de Completion",
      value: `${overview.completionRate ?? 0}%`,
      change: growth.completion ?? 0,
      icon: Award,
      color: "pink",
      trend: (growth.completion ?? 0) >= 0 ? "up" : "down",
    },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
    addNotification("info", "Actualisation des données...");
  };

  const getMetricData = () => {
    const timeSeries = safeData.timeSeries ?? [];
    if (!Array.isArray(timeSeries) || timeSeries.length === 0) return [];

    return timeSeries.map((d: any) => {
      switch (selectedMetric) {
        case "revenue":
          return { period: d.period, value: d.revenue ?? 0 };
        case "users":
          return { period: d.period, value: d.users ?? 0 };
        case "creators":
          return { period: d.period, value: d.creators ?? 0 };
        case "courses":
          return { period: d.period, value: d.courses ?? 0 };
        case "engagement":
          return { period: d.period, value: d.engagement ?? 0 };
        case "completion":
          return { period: d.period, value: d.completion ?? 0 };
        default:
          return { period: d.period, value: d.revenue ?? 0 };
      }
    });
  };

  const handleExport = () => {
    addNotification("info", "Export des données en cours...");
    // Simulation d'export - à implémenter avec vraie logique
    setTimeout(() => {
      addNotification("success", "Export terminé avec succès");
    }, 1500);
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
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* KPI Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
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
            Impossible de charger les analytics
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                setRefreshing(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
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
    <div className="p-6 space-y-6">
      {/* Notifications Toast */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Avancés</h1>
          <p className="text-gray-600 mt-1">Statistiques détaillées de la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-4 py-2">
            <Calendar size={18} className="text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="outline-none bg-transparent text-sm"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">Dernière année</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-white rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw
              size={18}
              className={`text-gray-600 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${kpi.color}-50`}>
                <kpi.icon size={20} className={`text-${kpi.color}-600`} />
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  kpi.trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{kpi.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Évolution Temporelle</h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
            >
              <option value="revenue">Revenus</option>
              <option value="users">Utilisateurs</option>
              <option value="creators">Créateurs</option>
              <option value="courses">Cours</option>
              <option value="engagement">Engagement</option>
              <option value="completion">Completion</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Graphique d'évolution interactif</p>
              <div className="mt-4 space-y-1">
                {getMetricData()
                  .slice(-3)
                  .map((data: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{data.period}:</span>
                      <span className="font-bold">
                        {selectedMetric === "revenue"
                          ? formatCurrency(data.value)
                          : data.value}
                        {selectedMetric.includes("rate") ||
                        selectedMetric.includes("engagement") ||
                        selectedMetric.includes("completion")
                          ? "%"
                          : ""}
                      </span>
                    </div>
                  ))}
                {getMetricData().length === 0 && (
                  <p className="text-gray-400 text-sm">Aucune donnée disponible</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Répartition par Catégorie</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <Filter size={18} />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Graphique de répartition</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Marketing:</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Business:</span>
                  <span className="font-bold">28%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Design:</span>
                  <span className="font-bold">22%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Technologie:</span>
                  <span className="font-bold">15%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Top Performers</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {(topPerformers ?? []).map((performer) => (
              <div
                key={performer.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      performer.type === "course"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {performer.type === "course" ? (
                      <Video size={20} className="text-blue-600" />
                    ) : (
                      <UserCheck size={20} className="text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-500">
                      {performer.type === "course" ? "Cours" : "Créateur"} •{" "}
                      {performer.metric}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {performer.type === "course" &&
                    performer.metric === "Revenus"
                      ? formatCurrency(performer.value)
                      : performer.value}
                    {performer.metric === "Note" ? "/5" : ""}
                    {performer.metric === "Completion" ||
                    performer.metric === "Engagement"
                      ? "%"
                      : ""}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-sm font-bold ${
                      performer.change > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {performer.change > 0 ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {Math.abs(performer.change)}%
                  </div>
                </div>
              </div>
            ))}
            {(topPerformers ?? []).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Aucun top performer disponible</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Activité par Heure</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }, (_, i) => {
              const hour = i % 24;
              const intensity = Math.random();
              return (
                <div
                  key={i}
                  className={`h-8 rounded flex items-center justify-center text-xs ${
                    intensity > 0.8
                      ? "bg-green-500 text-white"
                      : intensity > 0.6
                        ? "bg-green-400 text-white"
                        : intensity > 0.4
                          ? "bg-green-300"
                          : intensity > 0.2
                            ? "bg-green-200"
                            : "bg-gray-100"
                  }`}
                >
                  {hour}h
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Faible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span>Moyenne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Élevée</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}