"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  PlayCircle,
  BookOpen,
  Clock,
  Award,
  Target,
  BarChart3,
  Activity,
  Calendar,
  Star,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useBranding } from "./WhiteBrandingProvider";

interface DashboardStats {
  total_videos: number;
  total_pathways: number;
  completed_videos: number;
  completed_pathways: number;
  video_completion_rate: number;
  pathway_completion_rate: number;
}

interface RecentActivity {
  video: {
    id: number;
    title: string;
    thumbnail: string;
  };
  watched_duration: number;
  is_completed: boolean;
  last_watched_at: string;
}

interface ModernDashboardProps {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  creatorInfo: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
}

export default function ModernDashboard({ stats, recentActivity, creatorInfo }: ModernDashboardProps) {
  const { branding } = useBranding();
  const [animatedStats, setAnimatedStats] = useState({
    videos: 0,
    pathways: 0,
    completion: 0,
  });

  // Animation des compteurs
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = {
      videos: stats.total_videos / steps,
      pathways: stats.total_pathways / steps,
      completion: stats.video_completion_rate / steps,
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedStats({
        videos: Math.min(Math.round(increment.videos * currentStep), stats.total_videos),
        pathways: Math.min(Math.round(increment.pathways * currentStep), stats.total_pathways),
        completion: Math.min(Math.round(increment.completion * currentStep * 10) / 10, stats.video_completion_rate),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [stats]);

  const primaryColor = branding?.primaryColor || "#007A7A";
  const secondaryColor = branding?.secondaryColor || "#002D36";
  const accentColor = branding?.accentColor || "#FFB800";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header avec branding */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r opacity-10"
          style={{
            backgroundImage: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
          }}
        />
        <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {creatorInfo.avatar ? (
                    <img
                      src={creatorInfo.avatar}
                      alt={creatorInfo.name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    creatorInfo.name.split(" ").map((n) => n[0]).join("")
                  )}
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Bonjour, {creatorInfo.name.split(" ")[0]} ! 
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="inline-block ml-2"
                  >
                    <Sparkles className="w-6 h-6" style={{ color: accentColor }} />
                  </motion.span>
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Espace de formation personnalisé
                </p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-right"
            >
              <div className="text-sm text-gray-500 mb-1">Votre progression</div>
              <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                {animatedStats.completion}%
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          icon={PlayCircle}
          title="Vidéos"
          value={animatedStats.videos}
          subtitle="Disponibles"
          color={primaryColor}
          delay={0.1}
        />
        <StatCard
          icon={BookOpen}
          title="Parcours"
          value={animatedStats.pathways}
          subtitle="Actifs"
          color={secondaryColor}
          delay={0.2}
        />
        <StatCard
          icon={CheckCircle}
          title="Terminées"
          value={stats.completed_videos}
          subtitle="Vidéos"
          color="#10B981"
          delay={0.3}
        />
        <StatCard
          icon={Award}
          title="Succès"
          value={stats.completed_pathways}
          subtitle="Parcours"
          color={accentColor}
          delay={0.4}
        />
      </motion.div>

      {/* Progress Chart Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" style={{ color: primaryColor }} />
              Progression globale
            </h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
            >
              {stats.video_completion_rate}% complété
            </motion.div>
          </div>
          
          <div className="space-y-6">
            {/* Video Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Vidéos
                </span>
                <span className="text-sm text-gray-500">
                  {stats.completed_videos} / {stats.total_videos}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.video_completion_rate}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-20"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Pathway Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Parcours
                </span>
                <span className="text-sm text-gray-500">
                  {stats.completed_pathways} / {stats.total_pathways}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ backgroundColor: secondaryColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.pathway_completion_rate}%` }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-20"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: accentColor }} />
              Activité récente
            </h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {recentActivity.length} éléments
            </motion.div>
          </div>

          <AnimatePresence>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.video.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={activity.video.thumbnail || "/placeholder-video.jpg"}
                        alt={activity.video.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      {activity.is_completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {activity.video.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {Math.floor(activity.watched_duration / 60)}min
                        {activity.is_completed && (
                          <span className="text-green-600 font-medium">Terminé</span>
                        )}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className="text-gray-400"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <PlayCircle className="w-8 h-8" style={{ color: primaryColor }} />
                </div>
                <p className="text-gray-600 font-medium">Commencez votre formation</p>
                <p className="text-gray-500 text-sm mt-2">
                  Votre progression apparaîtra ici
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          icon={PlayCircle}
          title="Continuer l'apprentissage"
          description="Reprenez où vous vous êtes arrêté"
          color={primaryColor}
          href="#videos"
        />
        <QuickActionCard
          icon={Target}
          title="Nouveaux parcours"
          description="Découvrez de nouvelles formations"
          color={secondaryColor}
          href="#pathways"
        />
        <QuickActionCard
          icon={Award}
          title="Vos succès"
          description="Consultez vos accomplissements"
          color={accentColor}
          href="#achievements"
        />
      </motion.div>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  subtitle: string;
  color: string;
  delay: number;
}

function StatCard({ icon: Icon, title, value, subtitle, color, delay }: StatCardProps) {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" as const, stiffness: 100, damping: 10 }}
        className="relative group"
      >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"
        style={{ backgroundImage: `linear-gradient(135deg, ${color}, ${color}80)` }}
      />
      <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: color }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: delay * 0.5 }}
          >
            <Zap className="w-4 h-4" style={{ color: color }} />
          </motion.div>
        </div>
        <div className="space-y-1">
          <motion.div
            className="text-3xl font-bold"
            style={{ color: color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
          >
            {value}
          </motion.div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
    </motion.div>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  href: string;
}

function QuickActionCard({ icon: Icon, title, description, color, href }: QuickActionCardProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg border border-gray-100 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
          style={{ backgroundImage: `linear-gradient(135deg, ${color}, ${color}80)` }}
        />
        <div className="relative">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg"
            style={{ backgroundColor: color }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <div className="flex items-center text-sm font-medium" style={{ color: color }}>
            <span>Commencer</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-2"
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
