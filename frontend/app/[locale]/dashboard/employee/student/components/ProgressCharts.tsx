"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Award,
  Activity,
  Zap,
} from "lucide-react";

interface ProgressData {
  daily: Array<{ date: string; videos: number; pathways: number }>;
  weekly: Array<{ week: string; completion: number }>;
  monthly: Array<{ month: string; hours: number }>;
}

interface ProgressChartsProps {
  employeeId: number;
  creatorId: number;
}

export default function ProgressCharts({ employeeId, creatorId }: ProgressChartsProps) {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const token = localStorage.getItem('employee_token');
        if (!token) return;

        const response = await fetch(`/api/employee/student/progress?period=${selectedPeriod}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProgressData(data.data);
          }
        }
      } catch (error) {
        console.error("Error loading progress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <div className="inline-flex rounded-2xl bg-gray-100 p-1">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod(period)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-white shadow-md text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period === 'daily' ? 'Quotidien' : period === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Activité {selectedPeriod === 'daily' ? 'quotidienne' : selectedPeriod === 'weekly' ? 'hebdomadaire' : 'mensuelle'}
            </h2>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Zap className="w-4 h-4 text-primary" />
            </motion.div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {progressData?.daily.slice(-7).map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: `${(day.videos / Math.max(...progressData.daily.map(d => d.videos))) * 100}%` }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="flex-1 relative group"
              >
                <div className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-white opacity-20"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  {day.videos} vidéos
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <span>7 derniers jours</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Vidéos regardées</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              Répartition de la progression
            </h2>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center"
            >
              <Award className="w-4 h-4 text-secondary" />
            </motion.div>
          </div>

          <div className="relative h-64 flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#E5E7EB"
                strokeWidth="16"
                fill="none"
              />
              
              {/* Progress circle */}
              <motion.circle
                cx="96"
                cy="96"
                r="80"
                stroke="url(#gradient)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "502 502", strokeDashoffset: "502" }}
                animate={{ strokeDashoffset: "125.5" }} // 75% progress
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#007A7A" />
                  <stop offset="100%" stopColor="#FFB800" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-4xl font-bold text-gray-900"
              >
                75%
              </motion.div>
              <div className="text-sm text-gray-600">Progression globale</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span className="text-sm text-gray-700">Vidéos complétées</span>
              </div>
              <span className="text-sm font-medium text-gray-900">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span className="text-sm text-gray-700">Parcours terminés</span>
              </div>
              <span className="text-sm font-medium text-gray-900">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="text-sm text-gray-700">En cours</span>
              </div>
              <span className="text-sm font-medium text-gray-900">15%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <ProgressStatCard
          icon={Clock}
          title="Temps total"
          value="12h 35min"
          subtitle="Cette semaine"
          color="#007A7A"
          trend="+15%"
        />
        <ProgressStatCard
          icon={TrendingUp}
          title="Série actuelle"
          value="7 jours"
          subtitle="Consécutive"
          color="#10B981"
          trend="+2 jours"
        />
        <ProgressStatCard
          icon={Target}
          title="Objectifs"
          value="8/10"
          subtitle="Atteints"
          color="#FFB800"
          trend="80%"
        />
        <ProgressStatCard
          icon={Award}
          title="Niveau"
          value="Intermédiaire"
          subtitle="Progression"
          color="#002D36"
          trend="En cours"
        />
      </motion.div>
    </div>
  );
}

interface ProgressStatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  trend: string;
}

function ProgressStatCard({ icon: Icon, title, value, subtitle, color, trend }: ProgressStatCardProps) {
  const isPositive = trend.includes('+') || !trend.includes('-');
  
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {trend}
        </motion.div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-700">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </motion.div>
  );
}
