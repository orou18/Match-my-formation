"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  History,
  Video,
  FileText,
  Calendar,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Download,
  Trash2,
  Edit,
  MoreVertical,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface HistoryItem {
  id: number;
  type: "video" | "course" | "document";
  title: string;
  description: string;
  thumbnail?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  status: "published" | "draft" | "archived";
  created_at: string;
  updated_at: string;
  performance: {
    views_change: number;
    likes_change: number;
    engagement_rate: number;
  };
}

export default function HistoryManager() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/creator/history", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "course":
        return FileText;
      case "document":
        return FileText;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-blue-600 bg-blue-50";
      case "course":
        return "text-green-600 bg-green-50";
      case "document":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Publié";
      case "draft":
        return "Brouillon";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique</h1>
        <p className="text-gray-600">
          Consultez l'historique complet de vos contenus et leurs performances
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total des vues",
            value: history
              .reduce((sum, item) => sum + item.views, 0)
              .toLocaleString(),
            icon: Eye,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            title: "Total des likes",
            value: history
              .reduce((sum, item) => sum + item.likes, 0)
              .toLocaleString(),
            icon: ThumbsUp,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            title: "Total des commentaires",
            value: history
              .reduce((sum, item) => sum + item.comments, 0)
              .toLocaleString(),
            icon: MessageSquare,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            title: "Total des partages",
            value: history
              .reduce((sum, item) => sum + item.shares, 0)
              .toLocaleString(),
            icon: Share2,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 ${stat.bg} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher dans l'historique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tous les types</option>
            <option value="video">Vidéos</option>
            <option value="course">Cours</option>
            <option value="document">Documents</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map((item, index) => {
          const TypeIcon = getTypeIcon(item.type);
          const typeColorClass = getTypeColor(item.type);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail/Icon */}
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon
                        className={`w-8 h-8 ${typeColorClass.split(" ")[0]}`}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${typeColorClass}`}
                        >
                          {item.type === "video" && "Vidéo"}
                          {item.type === "course" && "Cours"}
                          {item.type === "document" && "Document"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(item.status)}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {item.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {item.comments.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      {item.shares.toLocaleString()}
                    </span>
                  </div>

                  {/* Performance Indicators */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      {item.performance.views_change >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          item.performance.views_change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.performance.views_change >= 0 ? "+" : ""}
                        {item.performance.views_change}% vues
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.performance.likes_change >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          item.performance.likes_change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.performance.likes_change >= 0 ? "+" : ""}
                        {item.performance.likes_change}% likes
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-600">
                        {item.performance.engagement_rate}% engagement
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Créé le {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Modifié le{" "}
                      {new Date(item.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun élément trouvé
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "Essayez de modifier vos filtres de recherche"
              : "Votre historique est vide pour le moment"}
          </p>
        </div>
      )}
    </div>
  );
}
