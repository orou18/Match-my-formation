"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

export default function AdminAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const overview = analyticsData?.overview || {};
  const growth = overview.monthlyGrowth || {};

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await dashboardService.getAdminAnalytics(
          dateRange,
          selectedMetric
        );
        setAnalyticsData(data);
        setTopPerformers(
          Array.isArray(data.topPerformers) ? data.topPerformers : []
        );
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };

    loadAnalytics();
  }, [dateRange, selectedMetric, refreshing]);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  const kpiCards = [
    {
      title: "Revenus Totaux",
      value: formatCurrency(overview.totalRevenue || 0),
      change: growth.revenue || 0,
      icon: DollarSign,
      color: "green",
      trend: (growth.revenue || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Utilisateurs Actifs",
      value: new Intl.NumberFormat("fr-FR").format(overview.totalUsers || 0),
      change: growth.users || 0,
      icon: Users,
      color: "blue",
      trend: (growth.users || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Créateurs",
      value: new Intl.NumberFormat("fr-FR").format(overview.totalCreators || 0),
      change: growth.creators || 0,
      icon: UserCheck,
      color: "purple",
      trend: (growth.creators || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Cours Actifs",
      value: new Intl.NumberFormat("fr-FR").format(overview.totalCourses || 0),
      change: growth.courses || 0,
      icon: Video,
      color: "orange",
      trend: (growth.courses || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Taux d'Engagement",
      value: `${overview.engagementRate || 0}%`,
      change: growth.engagement || 0,
      icon: Target,
      color: "indigo",
      trend: (growth.engagement || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Taux de Completion",
      value: `${overview.completionRate || 0}%`,
      change: growth.completion || 0,
      icon: Award,
      color: "pink",
      trend: (growth.completion || 0) >= 0 ? "up" : "down",
    },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
  };

  const getMetricData = () => {
    if (!analyticsData || !analyticsData.timeSeries) return [];

    switch (selectedMetric) {
      case "revenue":
        return analyticsData.timeSeries.map((d: any) => ({
          period: d.period,
          value: d.revenue,
        }));
      case "users":
        return analyticsData.timeSeries.map((d: any) => ({
          period: d.period,
          value: d.users,
        }));
      case "creators":
        return analyticsData.timeSeries.map((d: any) => ({
          period: d.period,
          value: d.creators,
        }));
      case "courses":
        return analyticsData.timeSeries.map((d: any) => ({
          period: d.period,
          value: d.courses,
        }));
      case "engagement":
        return analyticsData.timeSeries.map((d: any) => ({
          period: d.period,
          value: d.engagement,
        }));
      case "completion":
        return analyticsData.timeSeries.map((d: any) => ({
          period: d.period,
          value: d.completion,
        }));
      default:
        return analyticsData.timeSeries.map((d: any) => ({
          period: d.period,
          value: d.revenue,
        }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Avancés
          </h1>
          <p className="text-gray-600 mt-1">
            Statistiques détaillées de la plateforme
          </p>
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
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors flex items-center gap-2">
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
            <h2 className="text-lg font-bold text-gray-900">
              Évolution Temporelle
            </h2>
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
            <h2 className="text-lg font-bold text-gray-900">
              Répartition par Catégorie
            </h2>
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
            {topPerformers.map((performer, index) => (
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
          <h2 className="text-lg font-bold text-gray-900">
            Activité par Heure
          </h2>
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
