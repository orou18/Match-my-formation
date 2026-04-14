"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Video as VideoIcon,
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
  Upload,
  X,
  Plus,
  FileText,
  Link,
  Target,
  BookOpen,
  Edit,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Image,
  Film,
  Settings,
  ChevronDown,
  ChevronUp,
  Star,
  Download,
  ExternalLink,
  FolderOpen,
  Search,
  Tag,
  Music,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import type {
  Video,
  VideoFormData,
  Resource,
  DashboardStats,
} from "@/types/creator";
import {
  useSimpleNotification,
  NotificationContainer,
} from "@/components/ui/SimpleNotification";

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
  tags?: string[];
  learning_objectives?: string[];
  resources?: Resource[];
  is_free?: boolean;
  difficulty_level?: string;
}

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const videoId = params.id as string;

  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState("00:00");
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    null
  );
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    objectives: false,
    resources: false,
    media: false,
    settings: false,
  });

  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    category: "",
    tags: [],
    learning_objectives: [],
    resources: [],
    video_file: undefined,
    thumbnail: undefined,
    visibility: "private",
    allow_comments: true,
    publish_immediately: false,
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalViews: 0,
    engagement: 0,
    revenue: 0,
  });

  const { notifications, success, error, removeNotification } =
    useSimpleNotification();

  useEffect(() => {
    loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    try {
      const response = await fetch(`/api/creator/videos-simple`, {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const videosList = Array.isArray(data.videos) ? data.videos : [];
        const currentVideo = videosList.find((v: any) => v.id === videoId);

        if (currentVideo) {
          setVideo(currentVideo);
          setFormData({
            title: currentVideo.title || "",
            description: currentVideo.description || "",
            category: currentVideo.category || "",
            tags: currentVideo.tags || [],
            learning_objectives: currentVideo.learning_objectives || [],
            resources: currentVideo.resources || [],
            video_file: undefined,
            thumbnail: undefined,
            visibility: currentVideo.visibility || "private",
            allow_comments: true,
            publish_immediately: currentVideo.status === "published",
          });
          setVideoDuration(currentVideo.duration || "00:00");
        } else {
          error("Vidéo non trouvée", "La vidéo demandée n'existe pas");
          router.push(`/${locale}/dashboard/creator/videos`);
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement de la vidéo:", err);
      if (typeof err === "object" && err !== null && "message" in err) {
        error(
          "Erreur de chargement",
          (err as any).message ||
            "Impossible de charger les détails de la vidéo"
        );
      } else {
        error(
          "Erreur de chargement",
          "Impossible de charger les détails de la vidéo"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddLearningObjective = (objective: string) => {
    if (objective && !formData.learning_objectives.includes(objective)) {
      setFormData((prev) => ({
        ...prev,
        learning_objectives: [...prev.learning_objectives, objective],
      }));
    }
  };

  const handleRemoveLearningObjective = (objectiveToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter(
        (obj) => obj !== objectiveToRemove
      ),
    }));
  };

  const handleAddResource = (resource: Resource) => {
    setFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, resource],
    }));
  };

  const handleUpdateResource = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.map((resource, i) =>
        i === index ? { ...resource, [field]: value } : resource
      ),
    }));
  };

  const handleRemoveResource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, video_file: file }));
      // Extraire la durée de la vidéo
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        setVideoDuration(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setSelectedThumbnail(URL.createObjectURL(file));
    }
  };

  const generateThumbnails = () => {
    if (!formData.video_file) return;

    // Simuler la génération de miniatures
    const thumbnails = [];
    for (let i = 0; i < 6; i++) {
      thumbnails.push(`/api/placeholder/320/180?text=Thumbnail ${i + 1}`);
    }
    setGeneratedThumbnails(thumbnails);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      tags: [],
      learning_objectives: [],
      resources: [],
      video_file: undefined,
      thumbnail: undefined,
      visibility: "private",
      allow_comments: true,
      publish_immediately: false,
    });
    setSelectedThumbnail(null);
    setGeneratedThumbnails([]);
    setVideoDuration("00:00");
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      formDataToSend.append(
        "learning_objectives",
        JSON.stringify(formData.learning_objectives)
      );
      formDataToSend.append("resources", JSON.stringify(formData.resources));
      formDataToSend.append("visibility", formData.visibility);
      formDataToSend.append(
        "allow_comments",
        formData.allow_comments.toString()
      );
      formDataToSend.append(
        "publish_immediately",
        formData.publish_immediately.toString()
      );
      formDataToSend.append("duration", videoDuration);

      if (formData.video_file) {
        formDataToSend.append("video", formData.video_file);
      }
      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }
      if (selectedThumbnail) {
        formDataToSend.append("selected_thumbnail", selectedThumbnail);
      }

      // Simuler la progression de l'upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Utiliser fetch direct pour éviter le problème d'import
      const response = await fetch(`/api/creator/videos-simple?id=${videoId}`, {
        method: "PUT",
        body: formDataToSend,
        cache: "no-store",
      });

      if (response.ok) {
        const result = await response.json();
        setUploadProgress(100);

        success(
          "Vidéo mise à jour avec succès",
          `"${formData.title}" a été mise à jour`
        );

        // Recharger la liste des vidéos dans le dashboard creator
        if (
          typeof window !== "undefined" &&
          (window as any).refreshCreatorVideos
        ) {
          (window as any).refreshCreatorVideos();
        }

        setTimeout(() => {
          router.push(`/${locale}/dashboard/creator/videos`);
        }, 1500);
      } else {
        throw new Error("Erreur lors de la mise à jour de la vidéo");
      }
    } catch (err) {
      console.error("Erreur:", err);
      error(
        "Erreur lors de la mise à jour",
        "Une erreur technique est survenue"
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <VideoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vidéo non trouvée
          </h2>
          <p className="text-gray-600 mb-4">
            La vidéo que vous recherchez n'existe pas.
          </p>
          <button
            onClick={() => router.push(`/${locale}/dashboard/creator/videos`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retour aux vidéos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() =>
                  router.push(`/${locale}/dashboard/creator/videos`)
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Modifier la vidéo
                </h1>
                <p className="text-sm text-gray-600">
                  Mettez à jour les informations de votre vidéo
                </p>
              </div>
            </div>
            <button
              onClick={handleUpdateVideo}
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isSubmitting && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progression de la mise à jour
                  </span>
                  <span className="text-sm text-gray-500">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleUpdateVideo} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection("basic")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-t-2xl"
            >
              <div className="flex items-center gap-3">
                <VideoIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Informations de base
                </h2>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  Obligatoire
                </span>
              </div>
              {expandedSections.basic ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.basic && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la vidéo
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Entrez un titre accrocheur..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Décrivez votre vidéo en détail..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="marketing">📈 Marketing</option>
                    <option value="development">💻 Développement</option>
                    <option value="design">🎨 Design</option>
                    <option value="business">💼 Business</option>
                    <option value="photography">📸 Photographie</option>
                    <option value="music">🎵 Musique</option>
                    <option value="fitness">💪 Fitness</option>
                    <option value="cooking">🍳 Cuisine</option>
                    <option value="education">🎓 Éducation</option>
                    <option value="technology">🔧 Technologie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags ({formData.tags.length})
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ajouter un tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector(
                          'input[placeholder="Ajouter un tag..."]'
                        ) as HTMLInputElement;
                        if (input?.value) {
                          handleAddTag(input.value);
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Publication Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection("settings")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-t-2xl"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Paramètres de publication
                </h2>
              </div>
              {expandedSections.settings ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.settings && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibilité
                  </label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="private">🔒 Privé</option>
                    <option value="public">🌍 Public</option>
                    <option value="unlisted">👥 Non listé</option>
                  </select>
                  {formData.visibility === "public" && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <p className="text-sm text-blue-700">
                          Cette vidéo sera visible par tous les utilisateurs
                          dans la section "Pépites de nos experts"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="allow_comments"
                      checked={formData.allow_comments}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          allow_comments: e.target.checked,
                        }))
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      Autoriser les commentaires
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="publish_immediately"
                      checked={formData.publish_immediately}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          publish_immediately: e.target.checked,
                        }))
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      Publier immédiatement
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection("media")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-t-2xl"
            >
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Fichiers média
                </h2>
              </div>
              {expandedSections.media ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.media && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vidéo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Cliquez pour uploader une nouvelle vidéo
                      </span>
                      <span className="text-xs text-gray-500">
                        (Laissez vide pour conserver la vidéo actuelle)
                      </span>
                    </label>
                    {formData.video_file && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ {formData.video_file.name} sélectionné
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Miniature
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Image className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Cliquez pour uploader une miniature
                      </span>
                      <span className="text-xs text-gray-500">
                        (Laissez vide pour conserver l'actuelle)
                      </span>
                    </label>
                    {selectedThumbnail && (
                      <div className="mt-4">
                        <img
                          src={selectedThumbnail}
                          alt="Preview"
                          className="w-32 h-20 object-cover rounded-lg mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
