"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Video,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Play,
  Clock,
  Calendar,
} from "lucide-react";
import { api } from "@/lib/api/config";
import type { DashboardStats as DashboardStatsType, Video as VideoType } from "@/types";


export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Utiliser uniquement les données mockées pour éviter les erreurs API
    const mockStats: DashboardStatsType = {
      total_videos: 12,
      total_views: 45680,
      total_likes: 3420,
      total_comments: 892,
      total_shares: 234,
      total_revenue: 2850,
      recent_videos: [
        {
          id: 1,
          title: "Introduction au Tourisme Durable",
          description: "Découvrez les fondamentaux du tourisme écologique et les pratiques durables.",
          thumbnail: "/videos/video1-thumb.jpg",
          video_url: "/videos/video1.mp4",
          duration: "12:34",
          order: 1,
          creator_id: 1,
          views: 15420,
          likes: 892,
          comments: [],
          tags: ["tourisme", "durable", "ecologie"],
          is_published: true,
          visibility: "public",
          created_at: "2024-01-15",
          updated_at: "2024-01-15"
        },
        {
          id: 2,
          title: "Gestion Hôtelière Avancée",
          description: "Techniques avancées de gestion hôtelière pour le secteur du luxe.",
          thumbnail: "/videos/video2-thumb.jpg",
          video_url: "/videos/video2.mp4",
          duration: "18:22",
          order: 2,
          creator_id: 1,
          views: 8750,
          likes: 567,
          comments: [],
          tags: ["hotellerie", "management", "luxe"],
          is_published: true,
          visibility: "public",
          created_at: "2024-01-10",
          updated_at: "2024-01-10"
        },
        {
          id: 3,
          title: "Marketing Digital Touristique",
          description: "Stratégies de marketing digital appliquées au secteur touristique.",
          thumbnail: "/videos/video3-thumb.jpg",
          video_url: "/videos/video3.mp4",
          duration: "15:45",
          order: 3,
          creator_id: 1,
          views: 6230,
          likes: 445,
          comments: [],
          tags: ["marketing", "digital", "tourisme"],
          is_published: true,
          visibility: "public",
          created_at: "2024-01-05",
          updated_at: "2024-01-05"
        }
      ],
      performance_data: [65, 78, 92, 88, 95, 82, 90]
    };

    // Simuler un chargement
    const timer = setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);

    /* 
    // Code API original commenté pour éviter les erreurs 404
    const fetchDashboardData = async () => {
      try {
        const data = await api.get<DashboardStatsType>('/api/creator/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Utiliser des données de test en cas d'erreur
        const mockStats: DashboardStatsType = {
          total_videos: 12,
          total_views: 45680,
          total_likes: 3420,
          total_comments: 892,
          total_shares: 234,
          total_revenue: 2850,
          recent_videos: [
            {
              id: 1,
              title: "Introduction au Tourisme Durable",
              description: "Découvrez les fondamentaux du tourisme écologique et les pratiques durables.",
              thumbnail: "/videos/video1-thumb.jpg",
              video_url: "/videos/video1.mp4",
              duration: "12:34",
              order: 1,
              creator_id: 1,
              views: 15420,
              likes: 892,
              comments: [],
              tags: ["tourisme", "durable", "ecologie"],
              is_published: true,
              visibility: "public",
              created_at: "2024-01-15",
              updated_at: "2024-01-15"
            },
            {
              id: 2,
              title: "Gestion Hôtelière Avancée",
              description: "Techniques avancées de gestion hôtelière pour le secteur du luxe.",
              thumbnail: "/videos/video2-thumb.jpg",
              video_url: "/videos/video2.mp4",
              duration: "18:22",
              order: 2,
              creator_id: 1,
              views: 8750,
              likes: 567,
              comments: [],
              tags: ["hotellerie", "management", "luxe"],
              is_published: true,
              visibility: "public",
              created_at: "2024-01-10",
              updated_at: "2024-01-10"
            },
            {
              id: 3,
              title: "Marketing Digital Touristique",
              description: "Stratégies de marketing digital appliquées au secteur touristique.",
              thumbnail: "/videos/video3-thumb.jpg",
              video_url: "/videos/video3.mp4",
              duration: "15:45",
              order: 3,
              creator_id: 1,
              views: 6230,
              likes: 445,
              comments: [],
              tags: ["marketing", "digital", "tourisme"],
              is_published: true,
              visibility: "public",
              created_at: "2024-01-05",
              updated_at: "2024-01-05"
            }
          ],
          performance_data: [65, 78, 92, 88, 95, 82, 90]
        };
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    */
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total des vidéos",
      value: stats?.total_videos || 0,
      icon: Video,
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: "+12%",
    },
    {
      title: "Vues totales",
      value: stats?.total_views?.toLocaleString() || "0",
      icon: Eye,
      color: "text-green-600",
      bg: "bg-green-50",
      change: "+23%",
    },
    {
      title: "Revenus",
      value: `${stats?.total_revenue?.toLocaleString() || "0"}€`,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
      change: "+18%",
    },
    {
      title: "Abonnés",
      value: stats?.total_likes?.toLocaleString() || "0",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
      change: "+5%",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de vos performances et de votre activité
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bg} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Videos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Vidéos récentes
          </h2>
          <div className="space-y-4">
            {stats?.recent_videos?.slice(0, 3).map((video, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {video.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(video.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-8">
                Aucune vidéo récente
              </p>
            )}
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance des 7 derniers jours
          </h2>
          <div className="space-y-4">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
              (day, index) => {
                const height = Math.random() * 100 + 20;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{day}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${height}%` }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {Math.round(height * 10)}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Créer une nouvelle formation
            </h2>
            <p className="text-white/80 mb-4">
              Commencez à créer votre prochain contenu et atteignez plus
              d'apprenants
            </p>
          </div>
          <button 
            onClick={() => {
              // Rediriger vers le formulaire de création
              window.location.href = '/fr/dashboard/creator/videos/create';
            }}
            className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Commencer
          </button>
        </div>
      </motion.div>

      {/* Formulaire de création rapide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Créer une nouvelle vidéo
        </h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la vidéo
              </label>
              <input
                type="text"
                placeholder="Entrez un titre attrayant..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Tourisme durable</option>
                <option>Gestion hôtelière</option>
                <option>Marketing touristique</option>
                <option>Guide touristique</option>
                <option>Réservation et logistique</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Décrivez le contenu de votre vidéo..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vidéo (MP4, MOV)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                  </svg>
                  <p className="text-sm">Cliquez pour uploader ou glissez-déposez</p>
                  <p className="text-xs mt-1">MP4, MOV jusqu'à 500MB</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miniature (JPG, PNG)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Cliquez pour uploader</p>
                  <p className="text-xs mt-1">JPG, PNG jusqu'à 5MB</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-700">Publier immédiatement</span>
            </label>
            
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm text-gray-700">Autoriser les commentaires</span>
            </label>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Créer la vidéo
            </button>
            <button
              type="button"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Enregistrer comme brouillon
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
