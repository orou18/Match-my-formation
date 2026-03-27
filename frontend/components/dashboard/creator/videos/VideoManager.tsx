"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Plus,
  Eye,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Globe,
  FolderPlus,
} from "lucide-react";
import VideoUploadForm from "./VideoUploadForm";

interface CreatorVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  visibility: "public" | "private" | "unlisted";
  pathway?: string;
  status: "published" | "draft" | "processing";
}

export default function VideoManager() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [videos, setVideos] = useState<CreatorVideo[]>([
    {
      id: "1",
      title: "Introduction au Tourisme Durable",
      description:
        "Découvrez les fondamentaux du tourisme écologique et les pratiques durables.",
      thumbnail: "/videos/video1-thumb.jpg",
      duration: "12:34",
      views: 15420,
      likes: 892,
      comments: 45,
      publishedAt: "Il y a 2 jours",
      visibility: "public",
      status: "published",
    },
    {
      id: "2",
      title: "Gestion Hôtelière Avancée - Module 1",
      description:
        "Première partie de notre formation complète en gestion hôtelière.",
      thumbnail: "/videos/video2-thumb.jpg",
      duration: "18:22",
      views: 8750,
      likes: 567,
      comments: 23,
      publishedAt: "Il y a 5 jours",
      visibility: "private",
      pathway: "Certificat Hôtellerie",
      status: "published",
    },
    {
      id: "3",
      title: "Marketing Digital pour le Tourisme",
      description:
        "Stratégies digitales et marketing pour les professionnels du secteur touristique.",
      thumbnail: "/videos/video3-thumb.jpg",
      duration: "15:45",
      views: 6230,
      likes: 445,
      comments: 18,
      publishedAt: "Il y a 1 semaine",
      visibility: "public",
      status: "published",
    },
    {
      id: "4",
      title: "Service Client d'Excellence",
      description:
        "Les meilleures pratiques du service client dans l'hôtellerie.",
      thumbnail: "/videos/video4-thumb.jpg",
      duration: "22:10",
      views: 9870,
      likes: 723,
      comments: 31,
      publishedAt: "Il y a 3 jours",
      visibility: "private",
      status: "draft",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || video.status === filterStatus;
    const matchesVisibility =
      filterVisibility === "all" || video.visibility === filterVisibility;

    return matchesSearch && matchesStatus && matchesVisibility;
  });

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "public":
        return {
          icon: Globe,
          label: "Public",
          color: "bg-green-100 text-green-700",
        };
      case "private":
        return { icon: Lock, label: "Privé", color: "bg-red-100 text-red-700" };
      case "unlisted":
        return {
          icon: Lock,
          label: "Non listé",
          color: "bg-yellow-100 text-yellow-700",
        };
      default:
        return {
          icon: Lock,
          label: "Brouillon",
          color: "bg-gray-100 text-gray-700",
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return { label: "Publié", color: "bg-green-100 text-green-700" };
      case "draft":
        return { label: "Brouillon", color: "bg-gray-100 text-gray-700" };
      case "processing":
        return { label: "En traitement", color: "bg-blue-100 text-blue-700" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  const handleVideoUpload = (videoData: any) => {
    const newVideo: CreatorVideo = {
      id: Date.now().toString(),
      ...videoData,
      views: 0,
      likes: 0,
      comments: 0,
      publishedAt: "À l'instant",
      status: "processing",
    };
    setVideos([newVideo, ...videos]);
    setShowUploadForm(false);
  };

  if (showUploadForm) {
    return (
      <VideoUploadForm
        onClose={() => setShowUploadForm(false)}
        onSubmit={handleVideoUpload}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes Vidéos
            </h1>
            <p className="text-gray-600">
              Gérez votre contenu vidéo et vos formations
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Vidéo
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Vidéos</p>
              <p className="text-2xl font-bold text-gray-900">
                {videos.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vues Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Likes Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {videos.reduce((sum, v) => sum + v.likes, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Commentaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {videos
                  .reduce((sum, v) => sum + v.comments, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une vidéo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="processing">En traitement</option>
          </select>

          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">Toutes les visibilités</option>
            <option value="public">Public</option>
            <option value="private">Privé</option>
            <option value="unlisted">Non listé</option>
          </select>
        </div>
      </motion.div>

      {/* Videos Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              y: -5,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 5px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(video.status).color}`}
                >
                  {getStatusBadge(video.status).label}
                </span>
              </div>

              {/* Visibility Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getVisibilityBadge(video.visibility).color}`}
                >
                  {React.createElement(
                    getVisibilityBadge(video.visibility).icon,
                    { className: "w-3 h-3" }
                  )}
                  {getVisibilityBadge(video.visibility).label}
                </span>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {video.duration}
              </div>

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Video className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {video.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-4">
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
                  <Calendar className="w-4 h-4" />
                  <span>{video.publishedAt}</span>
                </div>
              </div>

              {/* Pathway */}
              {video.pathway && (
                <div className="flex items-center gap-2 text-xs text-primary mb-4">
                  <FolderPlus className="w-3 h-3" />
                  <span>{video.pathway}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredVideos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune vidéo trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all" || filterVisibility !== "all"
              ? "Essayez de modifier vos filtres de recherche"
              : "Commencez par créer votre première vidéo"}
          </p>
          {!searchTerm &&
            filterStatus === "all" &&
            filterVisibility === "all" && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Créer une vidéo
              </button>
            )}
        </motion.div>
      )}
    </div>
  );
}
