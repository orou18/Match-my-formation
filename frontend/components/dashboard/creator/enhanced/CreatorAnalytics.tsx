"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Video,
  TrendingUp,
  DollarSign,
  BarChart3,
  PlayCircle,
  Clock,
  Award,
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalEmployees: number;
  totalCourses: number;
  revenueGrowth: number;
  employeeProgress: Array<{
    employeeName: string;
    progress: number;
    completedCourses: number;
    totalCourses: number;
    lastActivity: string;
  }>;
  pathwayPerformance: Array<{
    pathwayName: string;
    enrolledEmployees: number;
    averageProgress: number;
    completionRate: number;
  }>;
  revenueData: Array<{
    month: string;
    revenue: number;
  }>;
}

export default function CreatorAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalEmployees: 0,
    totalCourses: 0,
    revenueGrowth: 0,
    employeeProgress: [],
    pathwayPerformance: [],
    revenueData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);

        // Simuler des données pour le moment
        const mockData: AnalyticsData = {
          totalRevenue: 12500,
          totalEmployees: 156,
          totalCourses: 24,
          revenueGrowth: 23.5,
          employeeProgress: [
            {
              employeeName: "Alice Martin",
              progress: 85,
              completedCourses: 3,
              totalCourses: 4,
              lastActivity: "2 heures ago",
            },
            {
              employeeName: "Bob Dubois",
              progress: 60,
              completedCourses: 2,
              totalCourses: 4,
              lastActivity: "1 jour ago",
            },
          ],
          pathwayPerformance: [
            {
              pathwayName: "Formation Vente",
              enrolledEmployees: 45,
              averageProgress: 72,
              completionRate: 85,
            },
            {
              pathwayName: "Formation Marketing",
              enrolledEmployees: 38,
              averageProgress: 68,
              completionRate: 79,
            },
          ],
          revenueData: [
            { month: "Jan", revenue: 2100 },
            { month: "Fév", revenue: 2400 },
            { month: "Mar", revenue: 2800 },
            { month: "Avr", revenue: 3200 },
            { month: "Mai", revenue: 2000 },
          ],
        };

        setAnalytics(mockData);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Revenu Total",
      value: `${analytics.totalRevenue.toLocaleString()}€`,
      change: `+${analytics.revenueGrowth}%`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Employés Actifs",
      value: analytics.totalEmployees.toLocaleString(),
      change: "+12 cette semaine",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Cours Créés",
      value: analytics.totalCourses.toString(),
      change: "+3 ce mois",
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Taux de Croissance",
      value: `${analytics.revenueGrowth}%`,
      change: "+2.1% vs mois dernier",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenus Mensuels
          </h3>
          <div className="space-y-4">
            {analytics.revenueData.map((item, index) => (
              <div
                key={item.month}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.revenue / 3200) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {item.revenue}€
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pathway Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance des Parcours
          </h3>
          <div className="space-y-4">
            {analytics.pathwayPerformance.map((pathway, index) => (
              <div
                key={pathway.pathwayName}
                className="border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {pathway.pathwayName}
                  </h4>
                  <span className="text-sm text-gray-600">
                    {pathway.enrolledEmployees} employés
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progression moyenne</span>
                    <span className="font-medium">
                      {pathway.averageProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${pathway.averageProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taux de complétion</span>
                    <span className="font-medium">
                      {pathway.completionRate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Employee Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progression des Employés
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Employé
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Progression
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Cours
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Dernière activité
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.employeeProgress.map((employee, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {employee.employeeName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${employee.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {employee.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {employee.completedCourses}/{employee.totalCourses}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {employee.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
