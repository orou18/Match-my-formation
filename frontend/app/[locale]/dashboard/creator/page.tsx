"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Video,
  Users,
  Activity,
  Target,
  ArrowRight,
  Eye,
  DollarSign,
  Play,
  Award,
  TrendingUp,
  CheckCircle,
  Check,
  Bell,
  Settings,
} from "lucide-react";
import {
  useSimpleNotification,
  NotificationContainer,
} from "@/components/ui/SimpleNotification";
import { dashboardService } from "@/lib/services/dashboard-service";

interface DashboardStats {
  totalVideos: number;
  totalEmployees: number;
  totalViews: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentVideos: Array<{
    id: number;
    title: string;
    views: number;
    revenue: number;
    created_at: string;
  }>;
  topEmployees: Array<{
    id: number;
    name: string;
    email: string;
    completion_rate: number;
    progress: number;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    created_at: string;
  }>;
}

interface CreatorDashboardResponse {
  success: boolean;
  data: DashboardStats;
}

export default function CreatorDashboard() {
  const params = useParams();
  const locale = (params.locale as string) || "fr";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const { notifications, success, error, removeNotification } =
    useSimpleNotification();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data =
        await dashboardService.getCreatorDashboard<CreatorDashboardResponse>();
      if (data.success) {
        setStats(data.data);
      } else {
        error("Erreur", "Impossible de charger les données du dashboard");
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const currentStats = stats || {
    totalVideos: 0,
    totalEmployees: 0,
    totalViews: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    recentVideos: [],
    topEmployees: [],
    recentActivity: [],
  };

  const quickActions = [
    {
      title: "Créer une vidéo",
      description: "Ajouter du contenu",
      icon: Video,
      href: `/${locale}/dashboard/creator/videos/create`,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverBg: "hover:bg-blue-100",
    },
    {
      title: "Gérer les employés",
      description: "Gérer votre équipe",
      icon: Users,
      href: `/${locale}/dashboard/creator/employees`,
      color: "from-green-600 to-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverBg: "hover:bg-green-100",
    },
    {
      title: "Créer un parcours",
      description: "Former vos employés",
      icon: Target,
      href: `/${locale}/dashboard/creator/pathways`,
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverBg: "hover:bg-purple-100",
    },
    {
      title: "Personnaliser",
      description: "Configurer le dashboard",
      icon: Settings,
      href: `/${locale}/dashboard/creator/customize`,
      color: "from-indigo-600 to-indigo-700",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      hoverBg: "hover:bg-indigo-100",
    },
    {
      title: "Voir les statistiques",
      description: "Analyser vos performances",
      icon: BarChart3,
      href: `/${locale}/dashboard/creator/stats`,
      color: "from-amber-600 to-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      hoverBg: "hover:bg-amber-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <span className="truncate">Tableau de Bord</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Vue d'ensemble de votre activité
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats principales */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total vidéos</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {formatNumber(currentStats.totalVideos)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Employés</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {formatNumber(currentStats.totalEmployees)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Vues totales</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {formatNumber(currentStats.totalViews)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Revenus</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {formatCurrency(currentStats.totalRevenue)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions rapides - Design Ultra Moderne */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-4 sm:pb-8">
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-xl sm:rounded-2xl shadow-2xl p-1">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Actions Rapides
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Link
                    href={action.href}
                    className={`block h-full p-4 sm:p-6 rounded-lg sm:rounded-xl ${action.bgColor} ${action.hoverBg} hover:shadow-xl transition-all duration-300 relative overflow-hidden border-2 ${action.borderColor}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-20`}
                      ></div>
                    </div>

                    <div className="relative z-10">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 text-xs sm:text-sm group-hover:text-transparent bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-xs leading-relaxed line-clamp-2">
                        {action.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Démarrer
                        </span>
                        <div className="flex items-center gap-2 text-purple-600 group-hover:text-pink-600 transition-colors">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal en tabs - Design Ultra Moderne */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-4 sm:pb-8">
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl shadow-2xl p-1 overflow-hidden">
          <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Tabs avec design moderne */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
              <div className="flex flex-col sm:flex-row gap-2 p-2 sm:p-3 overflow-x-auto">
                {[
                  {
                    id: "overview",
                    label: "Vue d'ensemble",
                    icon: BarChart3,
                    color: "from-blue-500 to-purple-600",
                  },
                  {
                    id: "videos",
                    label: "Vidéos récentes",
                    icon: Video,
                    color: "from-red-500 to-pink-600",
                  },
                  {
                    id: "employees",
                    label: "Top employés",
                    icon: Users,
                    color: "from-emerald-500 to-teal-600",
                  },
                  {
                    id: "activity",
                    label: "Activité récente",
                    icon: Activity,
                    color: "from-purple-500 to-indigo-600",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? `bg-white text-gray-900 shadow-lg scale-105 border-2 border-purple-300`
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/80 border-2 border-transparent"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-br ${tab.color}`
                          : "bg-gray-300"
                      }`}
                    >
                      <tab.icon
                        className={`w-2 h-2 ${activeTab === tab.id ? "text-white" : "text-gray-600"}`}
                      />
                    </div>
                    <span className="font-medium truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu des tabs */}
            <div className="p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-6">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Video className="w-2 h-2 sm:w-2 sm:h-2 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Vidéos Récentes
                      </span>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {currentStats.recentVideos
                        .slice(0, 3)
                        .map((video, index) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-purple-100 hover:shadow-lg hover:scale-101 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="w-8 h-6 sm:w-10 sm:h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                              <Play className="w-3 h-3 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-xs group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                {video.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                                  <Eye className="w-2 h-2 text-blue-600" />
                                  {formatNumber(video.views)}
                                </span>
                                <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                  <DollarSign className="w-2 h-2 text-green-600" />
                                  {formatCurrency(video.revenue)}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <Users className="w-2 h-2 sm:w-2 sm:h-2 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Top Employés
                      </span>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {currentStats.topEmployees
                        .slice(0, 3)
                        .map((employee, index) => (
                          <motion.div
                            key={employee.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-emerald-100 hover:shadow-lg hover:scale-101 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="relative flex-shrink-0">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                <span className="text-white font-bold text-xs">
                                  {employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-pulse flex items-center justify-center">
                                <Check className="w-1 h-1 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-xs group-hover:text-emerald-600 transition-colors mb-1 truncate">
                                {employee.name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2 truncate">
                                {employee.email}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                <span className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                                  <Award className="w-2 h-2 text-amber-600" />
                                  {employee.completion_rate}%
                                </span>
                                <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                                  <TrendingUp className="w-2 h-2 text-purple-600" />
                                  {employee.progress}%
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "videos" && (
                <div className="text-center py-8 sm:py-12">
                  <Video className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Vidéos récentes
                  </h3>
                  <p className="text-xs text-gray-600 px-4">
                    Toutes vos vidéos récentes apparaîtront ici
                  </p>
                </div>
              )}

              {activeTab === "employees" && (
                <div className="text-center py-8 sm:py-12">
                  <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Top employés
                  </h3>
                  <p className="text-xs text-gray-600 px-4">
                    Vos meilleurs employés apparaîtront ici
                  </p>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="text-center py-8 sm:py-12">
                  <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Activité récente
                  </h3>
                  <p className="text-xs text-gray-600 px-4">
                    L'activité récente apparaîtra ici
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
