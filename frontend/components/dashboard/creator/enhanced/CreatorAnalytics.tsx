"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Video,
  Clock,
  Target,
  Eye,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface CreatorAnalytics {
  totalEmployees: number;
  totalPathways: number;
  totalCourses: number;
  totalVideos: number;
  totalWatchTime: number;
  averageCompletion: number;
  engagementRate: number;
  revenueGrowth: number;
  employeeProgress: {
    employeeName: string;
    progress: number;
    completedCourses: number;
    totalCourses: number;
    lastActivity: string;
  }[];
  pathwayPerformance: {
    pathwayName: string;
    enrolledEmployees: number;
    averageProgress: number;
    completionRate: number;
  }[];
  revenueData: {
    month: string;
    revenue: number;
    enrollments: number;
  }[];
}

export default function CreatorAnalytics() {
  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  useEffect(() => {
    // Données mockées enrichies pour le créateur
    const mockAnalytics: CreatorAnalytics = {
      totalEmployees: 25,
      totalPathways: 3,
      totalCourses: 8,
      totalVideos: 45,
      totalWatchTime: 1250, // en heures
      averageCompletion: 78.5,
      engagementRate: 85.2,
      revenueGrowth: 23.7,
      employeeProgress: [
        {
          employeeName: "Alexandre Martin",
          progress: 92,
          completedCourses: 5,
          totalCourses: 6,
          lastActivity: "2024-03-16 14:30",
        },
        {
          employeeName: "Marie Dubois",
          progress: 78,
          completedCourses: 3,
          totalCourses: 4,
          lastActivity: "2024-03-16 09:15",
        },
        {
          employeeName: "Thomas Bernard",
          progress: 65,
          completedCourses: 2,
          totalCourses: 3,
          lastActivity: "2024-03-15 16:45",
        },
        {
          employeeName: "Sophie Laurent",
          progress: 88,
          completedCourses: 4,
          totalCourses: 5,
          lastActivity: "2024-03-16 11:20",
        },
        {
          employeeName: "Pierre Petit",
          progress: 45,
          completedCourses: 1,
          totalCourses: 3,
          lastActivity: "2024-03-14 08:30",
        },
      ],
      pathwayPerformance: [
        {
          pathwayName: "Formation Management Hôtelier",
          enrolledEmployees: 15,
          averageProgress: 78.5,
          completionRate: 82.3,
        },
        {
          pathwayName: "Parcours Chef de Cuisine",
          enrolledEmployees: 8,
          averageProgress: 65.2,
          completionRate: 71.8,
        },
        {
          pathwayName: "Marketing Digital Touristique",
          enrolledEmployees: 12,
          averageProgress: 89.1,
          completionRate: 92.5,
        },
      ],
      revenueData: [
        { month: "Jan", revenue: 4500, enrollments: 12 },
        { month: "Fév", revenue: 5200, enrollments: 15 },
        { month: "Mar", revenue: 6800, enrollments: 18 },
        { month: "Avr", revenue: 5900, enrollments: 16 },
        { month: "Mai", revenue: 7200, enrollments: 22 },
        { month: "Juin", revenue: 8100, enrollments: 25 },
      ],
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateGrowth = (current: number, previous: number) => {
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Créateur
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Analytics Créateur
          </h1>
          <p className="text-gray-600">
            Suivez les performances de vos employés et parcours
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">Dernière année</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4 text-gray-600" />
            Exporter
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +8.5%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analytics?.totalEmployees || 0}
          </h3>
          <p className="text-sm text-gray-600">Employés totaux</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +15.2%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analytics?.totalPathways || 0}
          </h3>
          <p className="text-sm text-gray-600">Parcours actifs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +12.7%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analytics?.totalVideos || 0}
          </h3>
          <p className="text-sm text-gray-600">Vidéos créées</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +23.7%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {analytics?.totalWatchTime}h
          </h3>
          <p className="text-sm text-gray-600">Temps de visionnage</p>
        </motion.div>
      </div>

      {/* Employee Progress Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Progression des Employés
          </h2>
          <p className="text-sm text-gray-600">
            Suivez la progression de chaque employé
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cours complétés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total cours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière activité
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics?.employeeProgress.map((employee, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.employeeName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${employee.progress}%` }}
                          transition={{
                            delay: index * 0.05 + 0.5,
                            duration: 0.8,
                          }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {employee.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {employee.completedCourses}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {employee.totalCourses}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {new Date(employee.lastActivity).toLocaleDateString()}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pathway Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Performance des Parcours
            </h2>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Voir tous
            </button>
          </div>
          <div className="space-y-4">
            {analytics?.pathwayPerformance.map((pathway, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    {pathway.pathwayName}
                  </h3>
                  <div className="text-sm font-medium text-primary">
                    {pathway.completionRate}%
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-gray-600">Employés</div>
                    <div className="font-medium text-gray-900">
                      {pathway.enrolledEmployees}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Progression</div>
                    <div className="font-medium text-gray-900">
                      {pathway.averageProgress}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Complétion</div>
                    <div className="font-medium text-gray-900">
                      {pathway.completionRate}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Revenus Mensuels
            </h2>
            <span className="text-sm text-green-600 font-medium">
              +{analytics?.revenueGrowth}%
            </span>
          </div>
          <div className="space-y-4">
            {analytics?.revenueData.map((data, index) => {
              const maxRevenue = Math.max(
                ...analytics.revenueData.map((d) => d.revenue)
              );
              const height = (data.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">
                    {data.month}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${height}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full relative"
                    >
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {data.revenue.toLocaleString()}€
                    </div>
                    <div className="text-xs text-gray-600">
                      {data.enrollments} inscriptions
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
