"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Users,
  TrendingUp,
  DollarSign,
  PlayCircle,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Plus,
  BarChart3,
} from "lucide-react";

interface DashboardStats {
  total_videos: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_revenue: number;
  recent_videos: Array<{
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    video_url: string;
    duration: string;
    views: number;
    likes: number;
    comments: number;
    tags: string[];
    created_at: string;
  }>;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    total_videos: 0,
    total_views: 0,
    total_likes: 0,
    total_comments: 0,
    total_shares: 0,
    total_revenue: 0,
    recent_videos: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // Simuler des données pour le moment
        const mockStats: DashboardStats = {
          total_videos: 24,
          total_views: 15420,
          total_likes: 892,
          total_comments: 234,
          total_shares: 156,
          total_revenue: 3250,
          recent_videos: [
            {
              id: 1,
              title: "Introduction au Marketing Digital",
              description: "Découvrez les bases du marketing digital",
              thumbnail: "/thumbnail1.jpg",
              video_url: "/video1.mp4",
              duration: "15:30",
              views: 1234,
              likes: 89,
              comments: 12,
              tags: ["marketing", "digital", "base"],
              created_at: "2024-01-15",
            },
            {
              id: 2,
              title: "Techniques de Vente Avancées",
              description: "Apprenez les techniques de vente modernes",
              thumbnail: "/thumbnail2.jpg",
              video_url: "/video2.mp4",
              duration: "22:15",
              views: 892,
              likes: 67,
              comments: 8,
              tags: ["vente", "techniques", "avancé"],
              created_at: "2024-01-12",
            },
          ],
        };

        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Vidéos",
      value: stats.total_videos.toString(),
      icon: Video,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+3 cette semaine",
    },
    {
      title: "Vues Totales",
      value: stats.total_views.toLocaleString(),
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+12% vs mois dernier",
    },
    {
      title: "Likes",
      value: stats.total_likes.toLocaleString(),
      icon: ThumbsUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+8% vs mois dernier",
    },
    {
      title: "Revenus",
      value: `${stats.total_revenue.toLocaleString()}€`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+15% vs mois dernier",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Vidéos Récentes
          </h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nouvelle Vidéo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.recent_videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{video.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{video.comments}</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Video className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Créer une vidéo</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <span className="font-medium">Voir les statistiques</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Gérer les employés</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
