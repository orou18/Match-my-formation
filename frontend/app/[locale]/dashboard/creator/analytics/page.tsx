"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
  ChevronLeft,
  ChevronRight,
  LineChart,
  AreaChart,
  BarChart,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  RefreshCw,
  Play,
  Pause
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ScatterChart,
  Scatter
} from "recharts";

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
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Types de graphiques disponibles
  const chartTypes = [
    {
      id: 'progression',
      name: 'Progression Temporelle',
      icon: <LineChart className="w-5 h-5" />,
      description: 'Évolution de la progression des employés'
    },
    {
      id: 'engagement',
      name: 'Engagement',
      icon: <AreaChart className="w-5 h-5" />,
      description: 'Taux d\'engagement sur la période'
    },
    {
      id: 'departments',
      name: 'Répartition par Département',
      icon: <PieChart className="w-5 h-5" />,
      description: 'Distribution des employés par département'
    },
    {
      id: 'performance',
      name: 'Performance Radar',
      icon: <Target className="w-5 h-5" />,
      description: 'Vue radar des performances'
    },
    {
      id: 'comparison',
      name: 'Comparaison',
      icon: <BarChart className="w-5 h-5" />,
      description: 'Comparaison des métriques clés'
    },
    {
      id: 'scatter',
      name: 'Analyse Croisée',
      icon: <Activity className="w-5 h-5" />,
      description: 'Corrélation temps vs progression'
    }
  ];

  // Navigation automatique
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentChartIndex((prev) => (prev + 1) % chartTypes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, chartTypes.length]);

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

      const response = await fetch(`/api/creator/analytics/employees?${params}`, {
        cache: "no-store",
        credentials: "include", // Inclure les cookies NextAuth
      });
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

  // Composants de graphiques
  const renderChart = () => {
    const currentChart = chartTypes[currentChartIndex];
    
    switch (currentChart.id) {
      case 'progression':
        return <ProgressionChart data={analyticsData?.performance_trends?.daily || []} />;
      case 'engagement':
        return <EngagementChart data={analyticsData?.performance_trends?.weekly || []} />;
      case 'departments':
        return <DepartmentChart employees={analyticsData?.employees || []} />;
      case 'performance':
        return <PerformanceRadar data={analyticsData?.employees?.slice(0, 5) || []} />;
      case 'comparison':
        return <ComparisonChart data={analyticsData?.employees || []} />;
      case 'scatter':
        return <ScatterAnalysis data={analyticsData?.employees || []} />;
      default:
        return <ProgressionChart data={analyticsData?.performance_trends?.daily || []} />;
    }
  };

  // Composant Chart pour la progression temporelle
  const ProgressionChart = ({ data }: { data: any[] }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <defs>
            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
          />
          <Area
            type="monotone"
            dataKey="active_users"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#colorProgress)"
            name="Utilisateurs actifs"
          />
          <Line
            type="monotone"
            dataKey="completion_rate"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 4 }}
            name="Taux de complétion"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </motion.div>
  );

  // Composant Chart pour l'engagement
  const EngagementChart = ({ data }: { data: any[] }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          <defs>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="week" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
          />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="#8B5CF6"
            strokeWidth={3}
            fill="url(#colorEngagement)"
            name="Engagement"
          />
          <Area
            type="monotone"
            dataKey="progress"
            stroke="#F59E0B"
            strokeWidth={3}
            fill="url(#colorProgress)"
            name="Progression"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </motion.div>
  );

  // Composant Chart pour la répartition par département
  const DepartmentChart = ({ employees }: { employees: EmployeeAnalytics[] }) => {
    const deptData = employees.reduce((acc, emp) => {
      const existing = acc.find(item => item.name === emp.department);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: emp.department, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={deptData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: any) => `${props.name || ''} ${props.percent ? (props.percent * 100).toFixed(0) : 0}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {deptData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </motion.div>
    );
  };

  // Composant Chart pour le radar de performance
  const PerformanceRadar = ({ data }: { data: EmployeeAnalytics[] }) => {
    const radarData = [
      { subject: 'Progression', A: data[0]?.progress || 0, fullMark: 100 },
      { subject: 'Engagement', A: data[0]?.engagement_score || 0, fullMark: 100 },
      { subject: 'Complétion', A: data[0]?.completion_rate || 0, fullMark: 100 },
      { subject: 'Temps', A: Math.min((data[0]?.time_spent || 0) / 10, 100), fullMark: 100 },
      { subject: 'Vidéos', A: Math.min((data[0]?.videos_watched || 0) * 5, 100), fullMark: 100 },
      { subject: 'Score', A: data[0]?.average_score || 0, fullMark: 100 }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} />
            <Radar
              name={data[0]?.name || 'Employé'}
              dataKey="A"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  };

  // Composant Chart pour la comparaison
  const ComparisonChart = ({ data }: { data: EmployeeAnalytics[] }) => {
    const comparisonData = data.slice(0, 5).map((emp: EmployeeAnalytics) => ({
      name: emp.name.split(' ')[0],
      progression: emp.progress,
      engagement: emp.engagement_score,
      completion: emp.completion_rate
    }));

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
            <Bar dataKey="progression" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="engagement" fill="#10B981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="completion" fill="#F59E0B" radius={[8, 8, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  };

  // Composant Chart pour l'analyse croisée
  const ScatterAnalysis = ({ data }: { data: EmployeeAnalytics[] }) => {
    const scatterData = data.map((emp: EmployeeAnalytics) => ({
      x: emp.time_spent,
      y: emp.progress,
      name: emp.name.split(' ')[0],
      engagement: emp.engagement_score
    }));

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Temps passé (min)"
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Progression (%)"
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Scatter 
              name="Employés" 
              data={scatterData} 
              fill="#3B82F6"
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-white to-[#F3F4F6] pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 md:px-8 py-8 space-y-8"
      >
        {/* Header avec navigation */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Analytics Immersifs
              </h1>
              <p className="text-gray-600">Explorez vos données avec des visualisations interactives</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isAutoPlay 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAutoPlay ? 'Pause' : 'Lecture Auto'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                <Download size={16} />
                Exporter
              </button>
              <button 
                onClick={fetchAnalyticsData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <RefreshCw size={16} />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Navigation des graphiques */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Types de Visualisation</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentChartIndex((prev) => (prev - 1 + chartTypes.length) % chartTypes.length)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 font-medium">
                {currentChartIndex + 1} / {chartTypes.length}
              </span>
              <button
                onClick={() => setCurrentChartIndex((prev) => (prev + 1) % chartTypes.length)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {chartTypes.map((chart, index) => (
              <motion.button
                key={chart.id}
                onClick={() => setCurrentChartIndex(index)}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  index === currentChartIndex
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center gap-2">
                  {chart.icon}
                  <span className="text-xs font-medium text-center">{chart.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{analyticsData.summary.total_employees}</h3>
            <p className="text-gray-600 text-sm">Total employés</p>
            <div className="mt-2 text-xs text-green-600 font-medium">
              {analyticsData.summary.active_employees} actifs
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{analyticsData.summary.average_progress}%</h3>
            <p className="text-gray-600 text-sm">Progression moyenne</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">15%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{formatTime(analyticsData.summary.total_time_spent)}</h3>
            <p className="text-gray-600 text-sm">Temps total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{analyticsData.summary.engagement_rate}%</h3>
            <p className="text-gray-600 text-sm">Engagement</p>
          </motion.div>
        </div>

        {/* Graphique principal avec animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChartIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {chartTypes[currentChartIndex].name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {chartTypes[currentChartIndex].description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Temps réel</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
              {renderChart()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Filtres avancés */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filtres Avancés</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
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
