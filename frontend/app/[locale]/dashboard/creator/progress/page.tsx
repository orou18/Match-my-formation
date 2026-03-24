"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  TrendingUp,
  Clock,
  Award,
  Target,
  BarChart3,
  Eye,
  Play,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Building,
  Calendar
} from "lucide-react";
import { useSimpleNotification, NotificationContainer } from "@/components/ui/SimpleNotification";

interface EmployeeProgress {
  employee: {
    id: number;
    name: string;
    email: string;
    domain: string;
    is_active: boolean;
    last_login_at: string;
  };
  stats: {
    total_videos: number;
    completed_videos: number;
    in_progress_videos: number;
    average_progress: number;
    total_watch_time_minutes: number;
    completion_rate: number;
  };
}

interface GlobalStats {
  total_employees: number;
  active_employees: number;
  total_watch_time: number;
  average_completion_rate: number;
  top_performers: EmployeeProgress[];
  by_domain: Array<{
    domain: string;
    total_employees: number;
    total_watch_time: number;
    average_completion_rate: number;
  }>;
}

export default function EmployeeProgressPage() {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProgress | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);

  const { notifications, success, error, removeNotification } = useSimpleNotification();

  useEffect(() => {
    loadGlobalProgress();
  }, []);

  const loadGlobalProgress = async () => {
    try {
      const response = await fetch("/api/creator/employees/progress/global", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setGlobalStats(data.data);
      } else {
        error("Erreur", "Impossible de charger la progression globale");
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeProgress = async (employeeId: number) => {
    try {
      const response = await fetch(`/api/creator/employees/${employeeId}/progress`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setEmployeeDetails(data.data);
        setSelectedEmployee(data.data.employee);
      } else {
        error("Erreur", "Impossible de charger les détails de progression");
      }
    } catch (err) {
      error("Erreur", "Une erreur technique est survenue");
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  const filteredTopPerformers = globalStats?.top_performers?.filter(emp => 
    emp.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee.domain.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Suivi de Progression
              </h1>
              <p className="text-gray-600 mt-2">
                Visualisez la progression de vos employés
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats globales */}
      {globalStats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total employés</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.total_employees}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de complétion moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.average_completion_rate}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temps total de formation</p>
                  <p className="text-2xl font-bold text-gray-900">{formatTime(globalStats.total_watch_time)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employés actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.active_employees}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats par domaine */}
      {globalStats?.by_domain && globalStats.by_domain.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Building className="w-5 h-5 text-blue-600" />
              Progression par Domaine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalStats.by_domain.map((domain, index) => (
                <motion.div
                  key={domain.domain}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{domain.domain}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(domain.average_completion_rate)}`}>
                      {domain.average_completion_rate}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Employés:</span>
                      <span className="font-medium">{domain.total_employees}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Temps total:</span>
                      <span className="font-medium">{formatTime(domain.total_watch_time)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(domain.average_completion_rate, 100)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top performers */}
      {globalStats?.top_performers && globalStats.top_performers.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500" />
                Top Performers
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temps de formation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vidéos terminées</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTopPerformers.map((employeeProgress, index) => (
                    <motion.tr
                      key={employeeProgress.employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{employeeProgress.employee.name}</p>
                            <p className="text-sm text-gray-600">{employeeProgress.employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {employeeProgress.employee.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-600 to-green-700 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(employeeProgress.stats.completion_rate, 100)}%` }}
                            />
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(employeeProgress.stats.completion_rate)}`}>
                            {employeeProgress.stats.completion_rate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatTime(employeeProgress.stats.total_watch_time_minutes)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {employeeProgress.stats.completed_videos}/{employeeProgress.stats.total_videos}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(employeeProgress.stats.completion_rate)}`}>
                            {employeeProgress.stats.completed_videos > 0 ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              if (expandedEmployee === employeeProgress.employee.id) {
                                setExpandedEmployee(null);
                                setEmployeeDetails(null);
                              } else {
                                setExpandedEmployee(employeeProgress.employee.id);
                                loadEmployeeProgress(employeeProgress.employee.id);
                              }
                            }}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            {expandedEmployee === employeeProgress.employee.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Détails détaillés */}
            <AnimatePresence>
              {expandedEmployee && employeeDetails && (
                <motion.tr
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-l-4 border-blue-600 bg-blue-50"
                >
                  <td colSpan={6} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          Progression par vidéo
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {employeeDetails.detailed_progress?.map((progress: any) => (
                            <div key={progress.video_id} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 text-sm">{progress.video_title}</h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${progress.completed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {progress.completed ? 'Terminé' : 'En cours'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                                    style={{ width: `${Math.min(progress.progress_percentage, 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                  {progress.progress_percentage}%
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Temps: {Math.floor(progress.watch_time_seconds / 60)}:{(progress.watch_time_seconds % 60).toString().padStart(2, '0')}</span>
                                <span>Durée: {Math.floor(progress.total_duration_seconds / 60)}:{(progress.total_duration_seconds % 60).toString().padStart(2, '0')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          Statistiques détaillées
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total vidéos:</span>
                            <span className="font-medium">{employeeDetails.stats.total_videos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Vidéos terminées:</span>
                            <span className="font-medium text-green-600">{employeeDetails.stats.completed_videos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">En cours:</span>
                            <span className="font-medium text-amber-600">{employeeDetails.stats.in_progress_videos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Progression moyenne:</span>
                            <span className="font-medium">{employeeDetails.stats.average_progress}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Temps total:</span>
                            <span className="font-medium">{formatTime(employeeDetails.stats.total_watch_time_minutes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Taux de complétion:</span>
                            <span className={`font-medium ${getProgressColor(employeeDetails.stats.completion_rate)}`}>
                              {employeeDetails.stats.completion_rate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
}
