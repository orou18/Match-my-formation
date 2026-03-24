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
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Search,
  MoreVertical
} from "lucide-react";

interface KPICard {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  trend: 'up' | 'down';
}

interface ChartData {
  name: string;
  users: number;
  creators: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const kpiData: KPICard[] = [
    {
      title: "Utilisateurs Actifs",
      value: "28,743",
      change: 12.5,
      icon: Users,
      color: "blue",
      trend: "up"
    },
    {
      title: "Créateurs",
      value: "1,234",
      change: 8.3,
      icon: UserCheck,
      color: "purple",
      trend: "up"
    },
    {
      title: "Revenus Mensuels",
      value: "€147,832",
      change: 23.7,
      icon: DollarSign,
      color: "green",
      trend: "up"
    },
    {
      title: "Cours Actifs",
      value: "892",
      change: -2.1,
      icon: Video,
      color: "orange",
      trend: "down"
    },
    {
      title: "Taux d'Engagement",
      value: "78.4%",
      change: 5.2,
      icon: Target,
      color: "indigo",
      trend: "up"
    },
    {
      title: "Sessions Video",
      value: "156K",
      change: 18.9,
      icon: Eye,
      color: "pink",
      trend: "up"
    }
  ];

  const chartData: ChartData[] = [
    { name: "Jan", users: 4000, creators: 240, revenue: 2400 },
    { name: "Fév", users: 3000, creators: 139, revenue: 2210 },
    { name: "Mar", users: 2000, creators: 980, revenue: 2290 },
    { name: "Avr", users: 2780, creators: 390, revenue: 2000 },
    { name: "Mai", users: 1890, creators: 480, revenue: 2181 },
    { name: "Jun", users: 2390, creators: 380, revenue: 2500 },
    { name: "Jul", users: 3490, creators: 430, revenue: 2100 },
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
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
            <RefreshCw size={18} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiData.map((kpi, index) => (
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
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{kpi.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Croissance de la Plateforme</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Graphique de croissance interactif</p>
              <p className="text-sm text-gray-400 mt-1">Utilisateurs +28% ce mois</p>
            </div>
          </div>
        </motion.div>

        {/* Creator Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Répartition Créateurs</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Graphique de répartition</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Individuels:</span>
                  <span className="font-bold">856 (69%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Entreprises:</span>
                  <span className="font-bold">378 (31%)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Activité Récente</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { user: "Alice Martin", action: "a créé un nouveau cours", time: "il y a 2 min", type: "course" },
            { user: "Bob Dubois", action: "s'est inscrit à Premium", time: "il y a 15 min", type: "subscription" },
            { user: "Claire Durand", action: "a complété 5 cours", time: "il y a 1h", type: "achievement" },
            { user: "System", action: "Nouveau créateur vérifié", time: "il y a 2h", type: "system" },
          ].map((activity, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'course' ? 'bg-blue-100' :
                  activity.type === 'subscription' ? 'bg-green-100' :
                  activity.type === 'achievement' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  {activity.type === 'course' ? <Video size={16} className="text-blue-600" /> :
                   activity.type === 'subscription' ? <DollarSign size={16} className="text-green-600" /> :
                   activity.type === 'achievement' ? <Award size={16} className="text-purple-600" /> :
                   <Activity size={16} className="text-gray-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
