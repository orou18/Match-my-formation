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
  Calendar,
} from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  students: number;
  revenue: number;
  status: "published" | "draft" | "processing" | "archived";
  createdAt: string;
  updatedAt: string;
  category: string;
  price: number;
  language: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "processing" | "archived">("all");
  const [sortBy, setSortBy] = useState<"date" | "views" | "revenue" | "title">("date");
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  useEffect(() => {
    // Charger les vidéos depuis l'API
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/creator/videos-simple');
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
        } else {
          console.error('Erreur lors du chargement des vidéos');
        }
      } catch (error) {
        console.error('Erreur fetch vidéos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getStatusColor = (status: VideoData["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-50 border-green-200 text-green-800";
      case "draft":
        return "bg-gray-50 border-gray-200 text-gray-800";
      case "processing":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "archived":
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
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "archived":
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
      case "processing":
        return "En traitement";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const filteredVideos = videos
    .filter(video => {
      const matchesFilter = 
        filter === "all" || video.status === filter;
      
      const matchesSearch = 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "views":
          return b.views - a.views;
        case "revenue":
          return b.revenue - a.revenue;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const totalVideos = videos.length;
  const publishedVideos = videos.filter(v => v.status === "published").length;
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalRevenue = videos.reduce((sum, v) => sum + v.revenue, 0);

  const handleSelectVideo = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map(v => v.id));
    }
  };

  const handleBulkAction = (action: "publish" | "draft" | "archive" | "delete") => {
    if (action === "delete") {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedVideos.length} vidéo(s) ?`)) {
        setVideos(prev => prev.filter(v => !selectedVideos.includes(v.id)));
        setSelectedVideos([]);
      }
    } else {
      setVideos(prev => prev.map(v => 
        selectedVideos.includes(v.id) 
          ? { ...v, status: action as VideoData["status"] }
          : v
      ));
      setSelectedVideos([]);
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
        
        <a
          href="/fr/dashboard/creator/videos/create"
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Créer une vidéo
        </a>
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
              { value: "processing", label: "En cours" },
              { value: "archived", label: "Archivées" }
            ].map((filterType) => (
              <button
                key={filterType.value}
                onClick={() => setFilter(filterType.value as any)}
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
            onChange={(e) => setSortBy(e.target.value as any)}
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
                onClick={() => handleBulkAction("archive")}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
              >
                Archiver
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
                : "Commencez par créer votre première vidéo"
              }
            </p>
            <a
              href="/fr/dashboard/creator/videos/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Créer une vidéo
            </a>
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
                  <div className="relative aspect-video bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Video className="w-12 h-12 text-white/60" />
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg">
                      {video.duration}
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getStatusColor(video.status)}`}>
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
                      <span>{formatDate(video.updatedAt)}</span>
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
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
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
    </div>
  );
}
