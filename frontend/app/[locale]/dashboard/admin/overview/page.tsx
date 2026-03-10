"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  BookOpen,
  Activity,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Calendar,
  ArrowRight,
  Settings,
  BarChart3,
  Download,
  Filter,
  Video,
  UserCheck,
  Clock,
} from "lucide-react";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import ChartCard from "@/components/admin/ChartCard";
import SimpleBarChart from "@/components/admin/SimpleBarChart";

export default function AdminOverview() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("users");

  const [stats] = useState({
    users: {
      total: 15420,
      active: 8750,
      new: 245,
      growth: 5.2,
    },
    revenue: {
      total: 45680,
      monthly: 12400,
      growth: 12.4,
    },
    courses: {
      total: 342,
      published: 298,
      draft: 44,
      completion: 78,
    },
    engagement: {
      totalViews: 125000,
      avgWatchTime: 24,
      completionRate: 78,
      satisfaction: 4.7,
    },
  });

  const [chartData] = useState([
    { label: "Lun", value: 2400 },
    { label: "Mar", value: 3200 },
    { label: "Mer", value: 2800 },
    { label: "Jeu", value: 3600 },
    { label: "Ven", value: 4200 },
    { label: "Sam", value: 3800 },
    { label: "Dim", value: 2900 },
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: "user_registration",
      user: "Marie Dubois",
      action: "Nouvel utilisateur inscrit",
      time: "Il y a 5 minutes",
      avatar: "/avatars/user1.jpg",
    },
    {
      id: 2,
      type: "course_published",
      user: "Jean Martin",
      action: "Nouveau cours publié",
      time: "Il y a 15 minutes",
      avatar: "/avatars/user2.jpg",
    },
    {
      id: 3,
      type: "purchase",
      user: "Alice Bernard",
      action: "Achat du cours 'Tourisme Durable'",
      time: "Il y a 1 heure",
      avatar: "/avatars/user3.jpg",
    },
    {
      id: 4,
      type: "video_upload",
      user: "Thomas Petit",
      action: "Vidéo 'Introduction au Luxe' uploadée",
      time: "Il y a 2 heures",
      avatar: "/avatars/user4.jpg",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de Bord Administrateur
              </h1>
              <p className="text-gray-600">
                Vue d'ensemble de la plateforme et métriques clés
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="24h">Dernières 24h</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard
            title="Utilisateurs totaux"
            value={stats.users.total}
            change={stats.users.growth}
            changeType="increase"
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-50"
            subtitle="Inscrits depuis le lancement"
          />
          <AnalyticsCard
            title="Utilisateurs actifs"
            value={stats.users.active}
            change={stats.users.growth}
            changeType="increase"
            icon={Activity}
            color="text-green-600"
            bgColor="bg-green-50"
            subtitle="Actifs cette semaine"
          />
          <AnalyticsCard
            title="Revenus totaux"
            value={`${stats.revenue.total}€`}
            change={stats.revenue.growth}
            changeType="increase"
            icon={DollarSign}
            color="text-purple-600"
            bgColor="bg-purple-50"
            subtitle="Cumul depuis le début"
          />
          <AnalyticsCard
            title="Taux de complétion"
            value={`${stats.engagement.completionRate}%`}
            change={2.3}
            changeType="increase"
            icon={BarChart3}
            color="text-orange-600"
            bgColor="bg-orange-50"
            subtitle="Moyenne des 30 derniers jours"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <ChartCard
            title="Croissance des Utilisateurs"
            subtitle="Nouveaux inscrits par jour"
            icon={<TrendingUp className="w-6 h-6" />}
          >
            <SimpleBarChart data={chartData} />
          </ChartCard>

          {/* Engagement Metrics */}
          <ChartCard
            title="Métriques d'Engagement"
            subtitle="Vues et interactions"
            icon={<Eye className="w-6 h-6" />}
            gradient
          >
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {stats.engagement.totalViews.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Vues totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {stats.engagement.completionRate}%
                    </div>
                    <div className="text-sm text-gray-600">Taux de complétion</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{stats.engagement.avgWatchTime}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{stats.engagement.satisfaction}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Activité Récente</h2>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
              <span>Voir tout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Gérer les utilisateurs</span>
            </button>
            
            <button className="flex flex-col items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <Video className="w-6 h-6 text-green-600" />
              <span className="font-medium">Modérer les vidéos</span>
            </button>
            
            <button className="flex flex-col items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Voir les rapports</span>
            </button>
            
            <button className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
              <Settings className="w-5 h-5 text-orange-600" />
              <span className="font-medium">Paramètres système</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
