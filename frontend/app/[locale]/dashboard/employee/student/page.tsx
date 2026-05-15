"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "videos" | "pathways" | "progress">("dashboard");
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
    <BrandingProvider creatorId={dashboard?.creator_info?.id || 0}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header moderne */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white"
                >
                  <BookOpen className="w-5 h-5" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Espace de formation
                  </h1>
                  <p className="text-sm text-gray-600">
                    {dashboard?.creator_info?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/${locale}/login-employee`)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  Déconnexion
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex rounded-2xl bg-gray-100 p-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'videos', label: 'Vidéos', icon: Video },
                { id: 'pathways', label: 'Parcours', icon: BookOpen },
                { id: 'progress', label: 'Progression', icon: TrendingUp },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white shadow-md text-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && dashboard && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ModernDashboard
                  stats={dashboard.stats}
                  recentActivity={dashboard.recent_activity}
                  creatorInfo={{
                    ...dashboard.creator_info,
                    avatar: dashboard.creator_info.avatar || ""
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ProgressCharts
                  employeeId={1} // Sera remplacé par l'ID réel de l'employé
                  creatorId={dashboard?.creator_info?.id || 0}
                />
              </motion.div>
            )}

            {activeTab === 'pathways' && (
              <motion.div
                key="pathways"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ModernPathways
                  pathways={pathways.map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    thumbnail: "/placeholder-pathway.jpg",
                    duration: 3600, // 1 heure par défaut
                    videos_count: p.videos_count,
                    completed_videos: Math.floor(p.videos_count * (p.progress_percentage / 100)),
                    is_locked: p.status === "inactive",
                    progress_percentage: p.progress_percentage,
                    created_at: p.assigned_at,
                    difficulty: "intermediate" as const,
                    category: "business" as const,
                    rating: 4.5
                  }))}
                  onPathwaySelect={(pathwayId) => {
                    router.push(`/${locale}/dashboard/employee/student/pathway/${pathwayId}`);
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'videos' && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Vidéos en cours de développement
                  </h3>
                  <p className="text-gray-600">
                    Cette section sera bientôt disponible
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </BrandingProvider>
  );
}
