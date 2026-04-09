"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Video,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  DollarSign,
  Play,
  Pause,
  MoreVertical,
  Upload,
  FileText,
  X,
  Calendar,
} from "lucide-react";
import { isYouTubeUrl, toYouTubeEmbedUrl } from "@/lib/video-utils";
import { creatorDashboardApi } from "@/lib/services/creator-dashboard-api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  video_url?: string | null;
  duration: string;
  views: number;
  students: number;
  revenue: number;
  status: "published" | "draft" | "unlisted";
  visibility?: "public" | "private" | "unlisted";
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  category: string;
  price: number;
  language: string;
}

export default function VideosPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params as any)?.locale || "fr";
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "all" | "published" | "draft" | "unlisted"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "views" | "revenue" | "title">(
    "date"
  );
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    // Charger les vidéos depuis l'API
    const fetchVideos = async () => {
      try {
        // Utiliser fetch direct pour éviter le problème d'import
        const response = await fetch("/api/creator/videos-simple", {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });
        
        if (response.ok) {
          const data = await response.json();
          const videosList = Array.isArray(data.videos) ? data.videos : [];
          setVideos(videosList);
        }
      } catch (error) {
        console.error("Erreur fetch vidéos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Fonction pour recharger les vidéos (utilisée depuis d'autres pages)
  const refreshVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/creator/videos-simple", {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });
      
      if (response.ok) {
        const data = await response.json();
        const videosList = Array.isArray(data.videos) ? data.videos : [];
        setVideos(videosList);
      }
    } catch (error) {
      console.error("Erreur lors du rechargement des vidéos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Exposer la fonction de rechargement globalement pour les autres pages
  useEffect(() => {
    // Stocker la fonction de rechargement pour y accéder depuis d'autres composants
    (window as any).refreshCreatorVideos = refreshVideos;
    
    return () => {
      delete (window as any).refreshCreatorVideos;
    };
  }, [refreshVideos]);

  const getStatusColor = (status: VideoData["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-50 border-green-200 text-green-800";
      case "draft":
        return "bg-gray-50 border-gray-200 text-gray-800";
      case "unlisted":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = (status: VideoData["status"]) => {
    switch (status) {
      case "published":
        return <Play className="w-4 h-4" />;
      case "draft":
        return <FileText className="w-4 h-4" />;
      case "unlisted":
        return <Pause className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: VideoData["status"]) => {
    switch (status) {
      case "published":
        return "Publié";
      case "draft":
        return "Brouillon";
      case "unlisted":
        return "Non listée";
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const filteredVideos = videos
    .filter((video) => {
      // Gestion du filtre par statut
      const matchesFilter = filter === "all" || video.status === filter;
      
      // Gestion du filtre par recherche avec valeurs par défaut
      const title = video.title || "";
      const description = video.description || "";
      const category = video.category || "";
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch =
        title.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower);

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          // Gestion des différentes propriétés de date possibles
          const dateA = new Date(a.updatedAt || a.updated_at || a.createdAt || a.created_at || 0);
          const dateB = new Date(b.updatedAt || b.updated_at || b.createdAt || b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        case "views":
          return (b.views || 0) - (a.views || 0);
        case "revenue":
          return (b.revenue || 0) - (a.revenue || 0);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

  const totalVideos = videos.length;
  const publishedVideos = videos.filter((v) => v.status === "published").length;
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalRevenue = videos.reduce((sum, v) => sum + v.revenue, 0);

  const handleSelectVideo = (videoId: string) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map((v) => v.id));
    }
  };

  const handleVideoPreview = (video: VideoData) => {
    setSelectedVideo(video);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedVideo(null);
  };

  const handleBulkAction = async (
    action: "publish" | "draft" | "unlisted" | "delete"
  ) => {
    if (action === "delete") {
      if (
        confirm(
          `Êtes-vous sûr de vouloir supprimer ${selectedVideos.length} vidéo(s) ?`
        )
      ) {
        // Appeler l'API DELETE pour chaque vidéo sélectionnée
        try {
          await Promise.all(
            selectedVideos.map((videoId) =>
              creatorDashboardApi.deleteVideo(videoId)
            )
          );

          // Mettre à jour le state local
          setVideos((prev) =>
            prev.filter((v) => !selectedVideos.includes(v.id))
          );
          setSelectedVideos([]);
        } catch (error) {
          console.error("Erreur suppression vidéos:", error);
          alert("Erreur lors de la suppression des vidéos");
        }
      }
    } else {
      // Appeler l'API PUT pour chaque vidéo sélectionnée
      try {
        await Promise.all(
          selectedVideos.map((videoId) =>
            creatorDashboardApi.updateVideo({
                id: videoId,
                visibility:
                  action === "publish"
                    ? "public"
                    : action === "unlisted"
                      ? "unlisted"
                      : "private",
            })
          )
        );

        // Mettre à jour le state local
        setVideos((prev) =>
          prev.map((v) =>
            selectedVideos.includes(v.id)
              ? {
                  ...v,
                  visibility:
                    action === "publish"
                      ? "public"
                      : action === "unlisted"
                        ? "unlisted"
                        : "private",
                  status:
                    action === "publish"
                      ? "published"
                      : action === "unlisted"
                        ? "unlisted"
                        : "draft",
                }
              : v
          )
        );
        setSelectedVideos([]);
      } catch (error) {
        console.error("Erreur mise à jour vidéos:", error);
        alert("Erreur lors de la mise à jour des vidéos");
      }
    }
  };

  const handleEditVideo = (video: VideoData) => {
    router.push(`/${locale}/dashboard/creator/videos/${video.id}/edit`);
  };

  const handleDeleteSelected = async () => {
    if (selectedVideos.length === 0) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedVideos.length} vidéo(s) ?`)) {
      return;
    }

    try {
      // Utiliser fetch direct pour éviter le problème d'import
      for (const videoId of selectedVideos) {
        const response = await fetch(`/api/creator/videos-simple?id=${videoId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la suppression de la vidéo ${videoId}`);
        }
      }

      // Mettre à jour le state local
      setVideos((prev) =>
        prev.filter((v) => !selectedVideos.includes(v.id))
      );
      setSelectedVideos([]);
    } catch (error) {
      console.error("Erreur suppression vidéo:", error);
      alert("Erreur lors de la suppression de la vidéo");
    }
  };

  const handleDeleteVideo = async (video: VideoData) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${video.title}" ?`)) {
      return;
    }

    try {
      // Utiliser fetch direct pour éviter le problème d'import
      const response = await fetch(`/api/creator/videos-simple?id=${video.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });
      
      if (response.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== video.id));
      } else {
        throw new Error("Erreur lors de la suppression de la vidéo");
      }
    } catch (error) {
      console.error("Erreur suppression vidéo:", error);
      alert("Erreur lors de la suppression de la vidéo");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded-xl"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Video className="w-8 h-8 text-primary" />
            Mes Vidéos
          </h1>
          <p className="text-gray-600">
            Gérez votre catalogue de formations vidéo
          </p>
        </div>

        <Link
          href={`/${locale}/dashboard/creator/videos/create`}
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Créer une vidéo
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {totalVideos}
              </h3>
              <p className="text-sm text-gray-600">Total vidéos</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {publishedVideos}
              </h3>
              <p className="text-sm text-gray-600">Publiées</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(totalViews)}
              </h3>
              <p className="text-sm text-gray-600">Vues totales</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRevenue)}
              </h3>
              <p className="text-sm text-gray-600">Revenus générés</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une vidéo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex gap-2">
            {[
              { value: "all", label: "Toutes" },
              { value: "published", label: "Publiées" },
              { value: "draft", label: "Brouillons" },
              { value: "unlisted", label: "Non listées" },
            ].map((filterType) => (
              <button
                key={filterType.value}
                onClick={() =>
                  setFilter(
                    filterType.value as
                      | "all"
                      | "published"
                      | "draft"
                      | "unlisted"
                  )
                }
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filterType.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as "date" | "views" | "revenue" | "title"
              )
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="date">Date de modification</option>
            <option value="views">Nombre de vues</option>
            <option value="revenue">Revenus</option>
            <option value="title">Titre</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedVideos.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <span className="text-sm font-medium text-blue-800">
              {selectedVideos.length} vidéo(s) sélectionnée(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("publish")}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Publier
              </button>
              <button
                onClick={() => handleBulkAction("draft")}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
              >
                Brouillon
              </button>
              <button
                onClick={() => handleBulkAction("unlisted")}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
              >
                Non listée
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Videos Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {filteredVideos.length === 0 ? (
          <div className="p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Aucune vidéo trouvée" : "Aucune vidéo"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Essayez de modifier votre recherche ou vos filtres"
                : "Commencez par créer votre première vidéo"}
            </p>
            <Link
              href={`/${locale}/dashboard/creator/videos/create`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Créer une vidéo
            </Link>
          </div>
        ) : (
          <div className="p-6">
            {/* Select All */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <input
                type="checkbox"
                checked={selectedVideos.length === filteredVideos.length}
                onChange={handleSelectAll}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">
                Sélectionner tout ({filteredVideos.length})
              </span>
            </div>

            {/* Videos List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedVideos.includes(video.id)}
                      onChange={() => handleSelectVideo(video.id)}
                      className="rounded text-primary focus:ring-primary"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div
                    className="relative aspect-video bg-gray-100 cursor-pointer group-hover:opacity-90 transition-opacity"
                    onClick={() => handleVideoPreview(video)}
                  >
                    {video.thumbnail &&
                    video.thumbnail !== "/api/placeholder/320/180" ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback si l'image ne charge pas
                          (e.target as HTMLImageElement).style.display = "none";
                          (
                            e.target as HTMLImageElement
                          ).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}

                    {/* Fallback gradient si pas de miniature */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ${video.thumbnail && video.thumbnail !== "/api/placeholder/320/180" ? "hidden" : ""}`}
                    >
                      <Video className="w-12 h-12 text-white/60" />
                    </div>

                    {/* Play button overlay au hover */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg">
                      {video.duration}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getStatusColor(video.status)}`}
                    >
                      {getStatusIcon(video.status)}
                      {getStatusLabel(video.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{video.category}</span>
                      <span>
                        {formatDate(
                          video.updatedAt ||
                            video.updated_at ||
                            video.createdAt ||
                            video.created_at ||
                            new Date().toISOString()
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span>{formatNumber(video.views)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{video.students}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatCurrency(video.revenue)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditVideo(video)}
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {isPreviewOpen && selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedVideo.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedVideo.description}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              {selectedVideo.video_url ? (
                isYouTubeUrl(selectedVideo.video_url) ? (
                  <iframe
                    src={
                      toYouTubeEmbedUrl(selectedVideo.video_url) || undefined
                    }
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    autoPlay
                    muted
                    preload="metadata"
                    className="w-full h-full"
                    poster={selectedVideo.thumbnail || undefined}
                    onError={(e) => {
                      console.error("Erreur de chargement vidéo:", e);
                      const videoElement = e.target as HTMLVideoElement;
                      const parent = videoElement.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
                            <div style="text-align: center;">
                              <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                              <p style="color: #6b7280; margin-bottom: 0.5rem;">Erreur de chargement vidéo</p>
                              <p style="color: #9ca3af; font-size: 0.875rem; margin-top: 0.5rem;">
                                URL: ${selectedVideo.video_url || 'Non définie'}
                              </p>
                              <button 
                                onclick="window.open('${selectedVideo.video_url || '#'}', '_blank')"
                                style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;"
                              >
                                Ouvrir dans un nouvel onglet
                              </button>
                            </div>
                          </div>
                        `;
                      }
                    }}
                    onLoadStart={() => {
                      console.log("Début du chargement vidéo:", selectedVideo.video_url);
                    }}
                    onCanPlay={() => {
                      console.log("Vidéo prête à jouer:", selectedVideo.video_url);
                    }}
                  >
                    <source src={selectedVideo.video_url || ""} type="video/mp4" />
                    <source src={selectedVideo.video_url || ""} type="video/webm" />
                    <source src={selectedVideo.video_url || ""} type="video/ogg" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Vidéo non disponible</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Aucune URL de vidéo définie
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Informations
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span className="font-medium">
                        {selectedVideo.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-medium">
                        {selectedVideo.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(selectedVideo.status)}`}
                      >
                        {getStatusIcon(selectedVideo.status)}
                        {getStatusLabel(selectedVideo.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Statistiques
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vues:</span>
                      <span className="font-medium">
                        {formatNumber(selectedVideo.views)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Étudiants:</span>
                      <span className="font-medium">
                        {selectedVideo.students}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenus:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedVideo.revenue)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Actions</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                      Modifier
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      Dupliquer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
