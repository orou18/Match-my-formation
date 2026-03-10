"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Users,
  DollarSign,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

interface StatsData {
  overview: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalRevenue: number;
    totalSubscribers: number;
    avgWatchTime: number;
  };
  performance: {
    views: number[];
    likes: number[];
    revenue: number[];
    dates: string[];
  };
  topVideos: Array<{
    id: number;
    title: string;
    views: number;
    likes: number;
    revenue: number;
  }>;
  demographics: {
    countries: Array<{ name: string; value: number }>;
    ageGroups: Array<{ range: string; value: number }>;
    devices: Array<{ type: string; value: number }>;
  };
}

export default function StatisticsDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/creator/stats?range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: "Vues totales",
      value: stats?.overview.totalViews?.toLocaleString() || "0",
      change: "+23%",
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Likes",
      value: stats?.overview.totalLikes?.toLocaleString() || "0",
      change: "+18%",
      icon: ThumbsUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Revenus",
      value: `${stats?.overview.totalRevenue?.toLocaleString() || "0"}€`,
      change: "+32%",
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Abonnés",
      value: stats?.overview.totalSubscribers?.toLocaleString() || "0",
      change: "+12%",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Statistiques
          </h1>
          <p className="text-gray-600">
            Analysez vos performances et suivez votre croissance
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {range === "7d" && "7 jours"}
              {range === "30d" && "30 jours"}
              {range === "90d" && "90 jours"}
              {range === "1y" && "1 an"}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${card.bg} rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  card.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {card.change.startsWith("+") ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {card.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution des vues
          </h2>
          <div className="space-y-4">
            {stats?.performance?.dates?.slice(-7).map((date, index) => {
              const value = stats.performance.views[index] || 0;
              const maxValue = Math.max(...(stats?.performance?.views || [1]));
              const height = (value / maxValue) * 100;

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">
                    {new Date(date).toLocaleDateString("fr", {
                      weekday: "short",
                    })}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${height}%` }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {value.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Taux d'engagement
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Likes par vue</span>
                <span className="text-sm font-medium text-gray-900">4.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "4.2%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Commentaires par vue
                </span>
                <span className="text-sm font-medium text-gray-900">1.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: "1.8%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Partages par vue</span>
                <span className="text-sm font-medium text-gray-900">0.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: "0.9%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Temps de visionnage moyen
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.floor((stats?.overview.avgWatchTime || 0) / 60)}:
                  {((stats?.overview.avgWatchTime || 0) % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Vidéos les plus performantes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Titre
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Vues
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Likes
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Revenus
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.topVideos?.map((video, index) => (
                <tr
                  key={video.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {video.title}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-medium text-gray-900">
                      {video.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-medium text-gray-900">
                      {video.likes.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-medium text-green-600">
                      {video.revenue.toLocaleString()}€
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pays principaux
          </h2>
          <div className="space-y-3">
            {stats?.demographics?.countries
              ?.slice(0, 5)
              .map((country, index) => {
                const maxValue = Math.max(
                  ...stats.demographics.countries.map((c) => c.value)
                );
                const width = (country.value / maxValue) * 100;

                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">
                      {country.name}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {country.value}%
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tranches d'âge
          </h2>
          <div className="space-y-3">
            {stats?.demographics?.ageGroups?.map((group, index) => {
              const maxValue = Math.max(
                ...stats.demographics.ageGroups.map((g) => g.value)
              );
              const width = (group.value / maxValue) * 100;

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">
                    {group.range}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {group.value}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Appareils
          </h2>
          <div className="space-y-3">
            {stats?.demographics?.devices?.map((device, index) => {
              const maxValue = Math.max(
                ...stats.demographics.devices.map((d) => d.value)
              );
              const width = (device.value / maxValue) * 100;

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">
                    {device.type}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {device.value}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
