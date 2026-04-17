"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Video,
  Play,
  Eye,
  Clock,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Circle,
  MoreVertical,
  Target,
  BarChart3,
} from "lucide-react";
import { BrandingProvider } from "./components/WhiteBrandingProvider";
import ModernDashboard from "./components/ModernDashboard";
import ProgressCharts from "./components/ProgressCharts";
import ModernPathways from "./components/ModernPathways";

interface EmployeeDashboard {
  creator_info: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  stats: {
    total_videos: number;
    total_pathways: number;
    completed_videos: number;
    completed_pathways: number;
    video_completion_rate: number;
    pathway_completion_rate: number;
  };
  recent_activity: Array<{
    video: {
      id: number;
      title: string;
      thumbnail: string;
    };
    watched_duration: number;
    is_completed: boolean;
    last_watched_at: string;
  }>;
}

interface EmployeeVideo {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  learning_objectives: string[];
  duration: string;
  creator: {
    id: number;
    name: string;
    avatar?: string;
  };
  video_url: string;
  thumbnail: string;
  views: number;
  likes: number;
  created_at: string;
  progress: {
    watched_duration: number;
    is_completed: boolean;
    completed_at?: string;
    last_watched_at?: string;
  };
}

interface EmployeePathway {
  id: number;
  title: string;
  description: string;
  creator: {
    id: number;
    name: string;
    avatar?: string;
  };
  videos_count: number;
  total_duration: string;
  assigned_at: string;
  completed_at?: string;
  progress_percentage: number;
  is_active: boolean;
  status: "active" | "completed" | "inactive";
}

export default function EmployeeStudentPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [dashboard, setDashboard] = useState<EmployeeDashboard | null>(null);
  const [videos, setVideos] = useState<EmployeeVideo[]>([]);
  const [pathways, setPathways] = useState<EmployeePathway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "videos" | "pathways">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === "videos") {
      loadVideos();
    } else if (activeTab === "pathways") {
      loadPathways();
    }
  }, [activeTab, searchTerm, filterCategory, filterStatus]);

  const loadDashboard = async () => {
    try {
      // Vérifier si l'employé est authentifié
      const token = localStorage.getItem('employee_token');
      if (!token) {
        console.error("Aucun token employé trouvé");
        router.push(`/${locale}/login-employee`);
        return;
      }

      const response = await fetch("/api/employee/student/dashboard", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const result = await response.json();
        setDashboard(result.data);
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("Erreur chargement dashboard:", error);
        if (response.status === 401) {
          // Token invalide, rediriger vers login
          localStorage.removeItem('employee_token');
          localStorage.removeItem('employee_info');
          router.push(`/${locale}/login-employee`);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVideos = async () => {
    try {
      const token = localStorage.getItem('employee_token');
      if (!token) {
        console.error("Aucun token employé trouvé");
        return;
      }

      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory !== "all" && { category: filterCategory }),
      });

      const response = await fetch(`/api/employee/student/videos?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const result = await response.json();
        setVideos(result.data || []);
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("Erreur chargement vidéos:", error);
        if (response.status === 401) {
          localStorage.removeItem('employee_token');
          localStorage.removeItem('employee_info');
          router.push(`/${locale}/login-employee`);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const loadPathways = async () => {
    try {
      const token = localStorage.getItem('employee_token');
      if (!token) {
        console.error("Aucun token employé trouvé");
        return;
      }

      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== "all" && { status: filterStatus }),
      });

      const response = await fetch(`/api/employee/student/pathways?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const result = await response.json();
        setPathways(result.data || []);
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("Erreur chargement parcours:", error);
        if (response.status === 401) {
          localStorage.removeItem('employee_token');
          localStorage.removeItem('employee_info');
          router.push(`/${locale}/login-employee`);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleVideoComplete = async (videoId: number, watchedDuration: number, isCompleted: boolean) => {
    try {
      const token = localStorage.getItem('employee_token');
      if (!token) {
        console.error("Aucun token employé trouvé");
        return;
      }

      const response = await fetch(`/api/employee/student/videos/${videoId}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          watched_duration: watchedDuration,
          completed: isCompleted,
        }),
      });

      if (response.ok) {
        // Recharger les données
        loadVideos();
        loadDashboard();
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("Erreur mise à jour vidéo:", error);
        if (response.status === 401) {
          localStorage.removeItem('employee_token');
          localStorage.removeItem('employee_info');
          router.push(`/${locale}/login-employee`);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      marketing: "Marketing",
      development: "Développement",
      design: "Design",
      business: "Business",
      photography: "Photographie",
      music: "Musique",
    };
    return categories[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Impossible de charger vos données</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mon Espace Formation
          </h1>
          <p className="text-gray-600 mt-1">
            Formé par {dashboard.creator_info.name}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
            { id: "videos", label: "Vidéos", icon: Video },
            { id: "pathways", label: "Parcours", icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {dashboard.stats.completed_videos}
              </h3>
              <p className="text-sm text-gray-600">Vidéos complétées</p>
              <div className="mt-2 text-xs text-gray-500">
                {dashboard.stats.video_completion_rate}% de taux de complétion
              </div>
            </motion.div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une vidéo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="marketing">Marketing</option>
                  <option value="development">Développement</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => router.push(`/${locale}/dashboard/employee/student/video/${video.id}`)}
                      className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 transition-colors"
                    >
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  {video.progress.is_completed && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Terminé
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {getCategoryLabel(video.category)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {video.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(video.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progression</span>
                      <span className="text-gray-600">
                        {Math.round((video.progress.watched_duration / (parseInt(video.duration.split(':')[0]) * 60 + parseInt(video.duration.split(':')[1]))) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round((video.progress.watched_duration / (parseInt(video.duration.split(':')[0]) * 60 + parseInt(video.duration.split(':')[1]))) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/${locale}/dashboard/employee/student/video/${video.id}`)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Play className="w-4 h-4" />
                      Continuer
                    </button>
                    {!video.progress.is_completed && (
                      <button
                        onClick={() => handleVideoComplete(video.id, parseInt(video.duration.split(':')[0]) * 60 + parseInt(video.duration.split(':')[1]), true)}
                        className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pathways Tab */}
      {activeTab === "pathways" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un parcours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="completed">Terminés</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pathways Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathways.map((pathway) => (
              <motion.div
                key={pathway.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(pathway.status)}`}>
                      {pathway.status === "active" ? "Actif" : pathway.status === "completed" ? "Terminé" : "Inactif"}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {pathway.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {pathway.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      {pathway.videos_count} vidéos
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {pathway.total_duration}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progression</span>
                      <span className="text-gray-600">{Math.round(pathway.progress_percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pathway.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Assigné le {new Date(pathway.assigned_at).toLocaleDateString("fr-FR")}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/${locale}/dashboard/employee/student/pathway/${pathway.id}`)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      Voir le parcours
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
