"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import React from "react";
import {
  Video,
  Play,
  Eye,
  ThumbsUp,
  MessageSquare,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Pause,
  BarChart3,
} from "lucide-react";
import AnalyticsCard from "@/components/admin/AnalyticsCard";

export default function AdminVideos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

  const [videos] = useState([
    {
      id: 1,
      title: "Introduction au Tourisme Durable",
      description: "Découvrez les fondamentaux du tourisme écologique",
      creator: "Marie Dubois",
      creatorId: 2,
      thumbnail: "/videos/video1-thumb.jpg",
      duration: "12:34",
      views: 15420,
      likes: 892,
      comments: 45,
      status: "published",
      category: "Tourisme",
      publishedAt: "2024-03-01",
      revenue: 2450,
    },
    {
      id: 2,
      title: "Gestion Hôtelière Avancée",
      description: "Techniques de management pour l'hôtellerie de luxe",
      creator: "Jean Martin",
      creatorId: 2,
      thumbnail: "/videos/video2-thumb.jpg",
      duration: "18:22",
      views: 8750,
      likes: 567,
      comments: 23,
      status: "published",
      category: "Hôtellerie",
      publishedAt: "2024-02-28",
      revenue: 3200,
    },
    {
      id: 3,
      title: "Marketing Digital pour le Tourisme",
      description: "Stratégies digitales pour les professionnels du tourisme",
      creator: "Alice Bernard",
      creatorId: 3,
      thumbnail: "/videos/video3-thumb.jpg",
      duration: "15:45",
      views: 6230,
      likes: 445,
      comments: 67,
      status: "processing",
      category: "Marketing",
      publishedAt: null,
      revenue: 0,
    },
    {
      id: 4,
      title: "Service Client en Hôtellerie",
      description: "Excellence du service client dans l'industrie hôtelière",
      creator: "Thomas Petit",
      creatorId: 4,
      thumbnail: "/videos/video4-thumb.jpg",
      duration: "22:10",
      views: 9870,
      likes: 723,
      comments: 89,
      status: "published",
      category: "Service Client",
      publishedAt: "2024-03-05",
      revenue: 4100,
    },
  ]);

  const [stats] = useState({
    total: 342,
    published: 298,
    processing: 44,
    totalViews: 40270,
    totalRevenue: 9750,
  });

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || video.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectVideo = (videoId: number) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Publié" },
      processing: { color: "bg-yellow-100 text-yellow-700", icon: Pause, label: "En traitement" },
      draft: { color: "bg-gray-100 text-gray-700", icon: Edit, label: "Brouillon" },
      flagged: { color: "bg-red-100 text-red-700", icon: AlertTriangle, label: "Signalé" },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestion des Vidéos
              </h1>
              <p className="text-gray-600">
                Modérez et supervisez toutes les vidéos de la plateforme
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                <Video className="w-4 h-4" />
                Ajouter une vidéo
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnalyticsCard
            title="Total vidéos"
            value={stats.total}
            change={12.5}
            changeType="increase"
            icon={Video}
            color="text-blue-600"
            bgColor="bg-blue-50"
            subtitle="Toutes catégories confondues"
          />
          <AnalyticsCard
            title="Vidéos publiées"
            value={stats.published}
            change={8.2}
            changeType="increase"
            icon={CheckCircle}
            color="text-green-600"
            bgColor="bg-green-50"
            subtitle="Actuellement en ligne"
          />
          <AnalyticsCard
            title="En traitement"
            value={stats.processing}
            change={-5.1}
            changeType="decrease"
            icon={Pause}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
            subtitle="En attente de validation"
          />
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une vidéo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">Toutes les catégories</option>
              <option value="Tourisme">Tourisme</option>
              <option value="Hôtellerie">Hôtellerie</option>
              <option value="Marketing">Marketing</option>
              <option value="Service Client">Service Client</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publié</option>
              <option value="processing">En traitement</option>
              <option value="draft">Brouillon</option>
              <option value="flagged">Signalé</option>
            </select>
          </div>
        </motion.div>

        {/* Videos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
            >
              {/* Video Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusBadge(video.status).color}`}>
                    {React.createElement(getStatusBadge(video.status).icon, { className: "w-3 h-3" })}
                    {getStatusBadge(video.status).label}
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>

                {/* Video Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{video.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{video.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{video.publishedAt || "Non publié"}</span>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div>
                      <div className="font-medium text-gray-900">{video.creator}</div>
                      <div className="text-xs text-gray-500">Créateur</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {video.revenue > 0 ? `${video.revenue}€` : "Non publié"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
