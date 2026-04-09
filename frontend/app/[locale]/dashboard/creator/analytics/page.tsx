"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Clock,
  Award,
  Target,
  Activity,
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  Star,
  Video,
  BookOpen,
  Trophy,
  Zap
} from "lucide-react";

interface EmployeeAnalytics {
  id: number;
  name: string;
  email: string;
  department: string;
  progress: number;
  completion_rate: number;
  videos_watched: number;
  time_spent: number;
  last_active: string;
  courses_enrolled: number;
  courses_completed: number;
  average_score: number;
  engagement_score: number;
  learning_path: string;
  milestones_achieved: number;
  total_milestones: number;
  streak_days: number;
  certificates_earned: number;
}

interface AnalyticsData {
  employees: EmployeeAnalytics[];
  summary: {
    total_employees: number;
    active_employees: number;
    average_progress: number;
    total_time_spent: number;
    total_videos_watched: number;
    completion_rate: number;
    engagement_rate: number;
    top_performer: EmployeeAnalytics | null;
    improvement_needed: EmployeeAnalytics[];
  };
  performance_trends: {
    daily: Array<{ date: string; active_users: number; completion_rate: number }>;
    weekly: Array<{ week: string; progress: number; engagement: number }>;
    monthly: Array<{ month: string; videos_watched: number; time_spent: number }>;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [sortBy, setSortBy] = useState("progress");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const departments = [
    { value: "all", label: "Tous les départements" },
    { value: "Marketing", label: "Marketing" },
    { value: "Ventes", label: "Ventes" },
    { value: "RH", label: "Ressources Humaines" },
    { value: "IT", label: "Informatique" },
    { value: "Finance", label: "Finance" }
  ];

  const sortOptions = [
    { value: "progress", label: "Progression" },
    { value: "engagement", label: "Engagement" },
    { value: "time_spent", label: "Temps passé" },
    { value: "completion_rate", label: "Taux de complétion" },
    { value: "last_active", label: "Dernière activité" }
  ];

  const dateRanges = [
    { value: "7d", label: "7 derniers jours" },
    { value: "30d", label: "30 derniers jours" },
    { value: "90d", label: "90 derniers jours" },
    { value: "1y", label: "1 an" }
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedDepartment, dateRange, sortBy, currentPage]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        department: selectedDepartment,
        dateRange: dateRange,
        sortBy: sortBy,
        page: currentPage.toString(),
        limit: "10"
      });

      const response = await fetch(`/api/creator/analytics/employees?${params}`);
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Erreur lors du chargement des données");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR');
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600 bg-green-50";
    if (progress >= 60) return "text-blue-600 bg-blue-50";
    if (progress >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getEngagementIcon = (score: number) => {
    if (score >= 85) return <Zap className="w-4 h-4 text-green-500" />;
    if (score >= 70) return <TrendingUp className="w-4 h-4 text-blue-500" />;
    if (score >= 50) return <Activity className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Erreur de chargement</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 md:px-8 py-8 space-y-8"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Employés</h1>
              <p className="text-gray-600">Suivez les performances et la progression de vos employés</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
              <Download size={16} />
              Exporter les données
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">
                {analyticsData.summary.active_employees} actifs
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analyticsData.summary.total_employees}</h3>
            <p className="text-gray-600 text-sm">Total employés</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analyticsData.summary.average_progress}%</h3>
            <p className="text-gray-600 text-sm">Progression moyenne</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatTime(analyticsData.summary.total_time_spent)}</h3>
            <p className="text-gray-600 text-sm">Temps total passé</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analyticsData.summary.engagement_rate}%</h3>
            <p className="text-gray-600 text-sm">Taux d'engagement</p>
          </motion.div>
        </div>

        {/* Top performer et alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analyticsData.summary.top_performer && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">Top Performer</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{analyticsData.summary.top_performer.name}</h4>
                  <p className="text-sm text-gray-600">{analyticsData.summary.top_performer.department}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-medium text-green-600">
                      {analyticsData.summary.top_performer.progress}% de progression
                    </span>
                    <span className="text-sm text-gray-600">
                      {analyticsData.summary.top_performer.certificates_earned} certificats
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {analyticsData.summary.improvement_needed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">Nécessitent une attention</h3>
              </div>
              <div className="space-y-3">
                {analyticsData.summary.improvement_needed.slice(0, 3).map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.department}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getProgressColor(employee.progress)}`}>
                      {employee.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Tableau des employés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Détails des employés</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progression
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temps passé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analyticsData.employees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${employee.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {employee.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getEngagementIcon(employee.engagement_score)}
                        <span className="text-sm font-medium text-gray-900">
                          {employee.engagement_score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatTime(employee.time_spent)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {employee.videos_watched} vidéos
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(employee.last_active)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <BarChart3 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {(pagination.page - 1) * pagination.limit + 1} à{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
                  {pagination.total} employés
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-1">
                    Page {pagination.page} sur {pagination.pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
