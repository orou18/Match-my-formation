"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Play,
  DollarSign,
  Eye,
  Clock,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
} from "lucide-react";

interface Stats {
  totalViews: number;
  totalStudents: number;
  totalRevenue: number;
  totalVideos: number;
  monthlyViews: number[];
  monthlyRevenue: number[];
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    revenue: number;
    students: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: "view" | "enrollment" | "revenue";
    title: string;
    timestamp: string;
    amount?: number;
  }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );

  useEffect(() => {
    const fetchStats = async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;

      try {
        const response = await fetch("/api/creator/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const payload = await response.json();
        if (response.ok && payload?.data) {
          setStats(payload.data);
        }
      } catch (error) {
        console.error("Erreur de chargement des statistiques créateur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <Users className="w-5 h-5 text-green-500" />;
      case "revenue":
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      default:
        return <Eye className="w-5 h-5 text-purple-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "enrollment":
        return "bg-green-50 border-green-200 text-green-800";
      case "revenue":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-purple-50 border-purple-200 text-purple-800";
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      return `Il y a ${diffDays}j`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Statistiques
          </h1>
          <p className="text-gray-600">
            Suivez les performances de vos formations
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { value: "7d", label: "7 jours" },
            { value: "30d", label: "30 jours" },
            { value: "90d", label: "90 jours" },
            { value: "1y", label: "1 an" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() =>
                setTimeRange(range.value as "7d" | "30d" | "90d" | "1y")
              }
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatNumber(stats.totalViews)}
          </h3>
          <p className="text-gray-600 text-sm">Vues totales</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +8%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatNumber(stats.totalStudents)}
          </h3>
          <p className="text-gray-600 text-sm">Étudiants inscrits</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +23%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(stats.totalRevenue)}
          </h3>
          <p className="text-gray-600 text-sm">Revenus générés</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Play className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +5%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatNumber(stats.totalVideos)}
          </h3>
          <p className="text-gray-600 text-sm">Vidéos créées</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Évolution des vues
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {stats.monthlyViews.map((views, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all hover:from-primary hover:to-primary"
                  style={{
                    height: `${(views / Math.max(...stats.monthlyViews)) * 100}%`,
                    minHeight: "20px",
                  }}
                  title={`${views} vues`}
                />
                <span className="text-xs text-gray-500">{index + 1}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Évolution des revenus
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {stats.monthlyRevenue.map((revenue, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-500 hover:to-green-500"
                  style={{
                    height: `${(revenue / Math.max(...stats.monthlyRevenue)) * 100}%`,
                    minHeight: "20px",
                  }}
                  title={formatCurrency(revenue)}
                />
                <span className="text-xs text-gray-500">{index + 1}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Vidéos les plus populaires
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Titre
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                  Vues
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                  Étudiants
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                  Revenus
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.topVideos.map((video, index) => (
                <tr
                  key={video.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {video.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {formatNumber(video.views)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {formatNumber(video.students)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-medium text-green-600">
                      {formatCurrency(video.revenue)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Activité récente
        </h3>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div
                className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-500">
                    {formatDate(activity.timestamp)}
                  </span>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">
                      +{formatCurrency(activity.amount)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
