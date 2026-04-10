"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  Video,
  Play,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Film,
} from "lucide-react";

interface AdminVideo {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  learning_objectives: string[];
  visibility: string;
  duration: string;
  allow_comments: boolean;
  publish_immediately: boolean;
  is_admin_video: boolean;
  is_published: boolean;
  creator: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  video_url: string;
  thumbnail: string;
  students_count: number;
  views: number;
  likes: number;
  comments: any[];
  created_at: string;
  updated_at: string;
}

export default function AdminVideosPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<AdminVideo | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les vidéos admin
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/videos", {
        cache: "no-store",
      });

      if (response.ok) {
        const result = await response.json();
        setVideos(result.data || []);
      } else {
        console.error("Erreur lors du chargement des vidéos");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les vidéos
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Supprimer une vidéo
  const handleDeleteVideo = async (videoId: number) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVideos(prev => prev.filter(video => video.id !== videoId));
        setShowDeleteModal(false);
        setVideoToDelete(null);
      } else {
        console.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Voir une vidéo
  const handleViewVideo = (video: AdminVideo) => {
    setSelectedVideo(video);
  };

  // Éditer une vidéo
  const handleEditVideo = (video: AdminVideo) => {
    router.push(`/${locale}/dashboard/admin/videos/${video.id}/edit`);
  };

  const categories = [
    { value: "marketing", label: "📈 Marketing" },
    { value: "development", label: "💻 Développement" },
    { value: "design", label: "🎨 Design" },
    { value: "business", label: "💼 Business" },
    { value: "photography", label: "📸 Photographie" },
    { value: "music", label: "🎵 Musique" },
  ];

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Film className="w-8 h-8 text-blue-500" />
                Vidéos Admin
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez toutes les vidéos créées depuis l'administration
              </p>
            </div>
            <button
              onClick={() => router.push(`/${locale}/dashboard/admin/videos/create`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Créer une vidéo
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>
        </div>

        {/* Videos Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Aucune vidéo trouvée" : "Aucune vidéo créée"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Essayez de modifier votre recherche"
                : "Commencez par créer votre première vidéo admin"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push(`/${locale}/dashboard/admin/videos/create`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Créer une vidéo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
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
                      onClick={() => handleViewVideo(video)}
                      className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 transition-colors"
                    >
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Admin
                    </span>
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
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {getCategoryLabel(video.category)}
                    </span>
                    {video.is_published && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Publié
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {video.students_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(video.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewVideo(video)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </button>
                    <button
                      onClick={() => handleEditVideo(video)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Éditer
                    </button>
                    <button
                      onClick={() => {
                        setVideoToDelete(video.id);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Video Preview Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedVideo.title}
                  </h2>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6" style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}>
                <div className="aspect-video bg-black rounded-lg mb-6">
                  <video
                    src={selectedVideo.video_url}
                    controls
                    className="w-full h-full rounded-lg"
                    poster={selectedVideo.thumbnail}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Informations</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Catégorie:</span>
                        <span>{getCategoryLabel(selectedVideo.category)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durée:</span>
                        <span>{selectedVideo.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Créé le:</span>
                        <span>{new Date(selectedVideo.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <span className={selectedVideo.is_published ? "text-green-600" : "text-yellow-600"}>
                          {selectedVideo.is_published ? "Publié" : "Brouillon"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vues:</span>
                        <span>{selectedVideo.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Étudiants:</span>
                        <span>{selectedVideo.students_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Likes:</span>
                        <span>{selectedVideo.likes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commentaires:</span>
                        <span>{selectedVideo.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedVideo.description && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm">{selectedVideo.description}</p>
                  </div>
                )}
                
                {selectedVideo.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                Supprimer la vidéo
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Êtes-vous sûr de vouloir supprimer cette vidéo ? Cette action est irréversible.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setVideoToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => videoToDelete && handleDeleteVideo(videoToDelete)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
