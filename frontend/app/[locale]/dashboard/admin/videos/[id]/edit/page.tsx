"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  buildClientAuthHeaders,
  ensureServerAuthSession,
} from "@/lib/api/client-auth";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Tag,
  Target,
  FileText,
  Video,
  Image,
  Music,
  Link,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
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
  generatedThumbnails?: string[];
  selectedThumbnail?: string;
  students_count: number;
  views: number;
  likes: number;
  comments: any[];
  resources: any[];
  created_at: string;
  updated_at: string;
}

const categories = [
  { value: "marketing", label: "📈 Marketing Digital" },
  { value: "development", label: "💻 Développement Web" },
  { value: "design", label: "🎨 Design UX/UI" },
  { value: "business", label: "💼 Business" },
  { value: "photography", label: "📸 Photographie" },
  { value: "video", label: "🎬 Production Vidéo" },
  { value: "audio", label: "🎵 Production Audio" },
  { value: "writing", label: "✍️ Rédaction" },
  { value: "other", label: "📚 Autre" },
];

const resourceTypes = [
  { value: "link", label: "🔗 Lien externe", icon: Link },
  { value: "document", label: "📄 Document PDF", icon: FileText },
  { value: "image", label: "🖼️ Image", icon: Image },
  { value: "video", label: "🎥 Vidéo", icon: Video },
  { value: "audio", label: "🎵 Audio", icon: Music },
];

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;

  const [video, setVideo] = useState<AdminVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
    learning_objectives: [] as string[],
    visibility: "public",
    duration: "",
    allow_comments: true,
    publish_immediately: true,
    resources: [] as any[],
  });

  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Fonction pour gérer les URLs des fichiers locaux
  const getFileUrl = (url: string) => {
    if (!url) return "";

    // Si c'est une URL externe (commence par http), la retourner telle quelle
    if (url.startsWith("http")) {
      return url;
    }

    // Si c'est un chemin local, s'assurer qu'il commence par /
    if (!url.startsWith("/")) {
      return `/${url}`;
    }

    return url;
  };

  useEffect(() => {
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    console.log("Fetching video with ID:", videoId);
    try {
      const sessionState = await ensureServerAuthSession();
      if (!sessionState.ok) {
        setError(sessionState.message);
        return;
      }

      const response = await fetch(`/api/admin/videos/get?id=${videoId}`, {
        credentials: "include",
        headers: buildClientAuthHeaders(),
      });
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Video data received:", data);

        if (data.success && data.data) {
          console.log("Setting form data with:", data.data);
          setVideo(data.data);
          setFormData({
            title: data.data.title || "",
            description: data.data.description || "",
            category: data.data.category || "",
            tags: data.data.tags || [],
            learning_objectives: data.data.learning_objectives || [],
            visibility: data.data.visibility || "public",
            duration: data.data.duration || "",
            allow_comments: data.data.allow_comments ?? true,
            publish_immediately: data.data.publish_immediately ?? true,
            resources: data.data.resources || [],
          });
          setVideoPreview(getFileUrl(data.data.video_url || ""));
          setThumbnailPreview(getFileUrl(data.data.thumbnail || ""));
        } else {
          console.error("API returned success=false or no data:", data);
          setError("Format de réponse invalide");
        }
      } else {
        try {
          const errorData = await response.json();
          console.error("API error:", errorData);
          setError(errorData.message || "Vidéo non trouvée");
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
          setError("Erreur lors de la récupération de la vidéo");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Erreur lors du chargement de la vidéo");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addTag = () => {
    const input = document.getElementById("new-tag") as HTMLInputElement;
    const tag = input.value.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      input.value = "";
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addObjective = () => {
    const input = document.getElementById("new-objective") as HTMLInputElement;
    const objective = input.value.trim();
    if (objective && !formData.learning_objectives.includes(objective)) {
      setFormData((prev) => ({
        ...prev,
        learning_objectives: [...prev.learning_objectives, objective],
      }));
      input.value = "";
    }
  };

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addResource = () => {
    setFormData((prev) => ({
      ...prev,
      resources: [
        ...prev.resources,
        {
          id: Date.now(),
          type: "link",
          title: "",
          description: "",
          url: "",
        },
      ],
    }));
  };

  const updateResource = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.map((resource, i) =>
        i === index ? { ...resource, [field]: value } : resource
      ),
    }));
  };

  const removeResource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const sessionState = await ensureServerAuthSession();
      if (!sessionState.ok) {
        setError(sessionState.message);
        return;
      }

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("tags", JSON.stringify(formData.tags));
      submitData.append(
        "learning_objectives",
        JSON.stringify(formData.learning_objectives)
      );
      submitData.append("visibility", formData.visibility);
      submitData.append("duration", formData.duration);
      submitData.append("allow_comments", formData.allow_comments.toString());
      submitData.append(
        "publish_immediately",
        formData.publish_immediately.toString()
      );
      submitData.append("resources", JSON.stringify(formData.resources));

      if (videoFile) {
        submitData.append("video", videoFile);
      }
      if (thumbnailFile) {
        submitData.append("thumbnail", thumbnailFile);
      }

      const response = await fetch(`/api/admin/videos/get?id=${videoId}`, {
        method: "PUT",
        body: submitData,
        credentials: "include",
        headers: buildClientAuthHeaders(),
      });

      if (response.ok) {
        setSuccess("Vidéo mise à jour avec succès !");
        setTimeout(() => {
          router.push("/dashboard/admin/videos");
        }, 2000);
      } else {
        const error = await response.json().catch(() => ({}));
        setError(
          error?.message ||
            error?.error ||
            "Erreur lors de la mise à jour de la vidéo"
        );
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour de la vidéo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Modifier la vidéo
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Mettez à jour les informations de votre vidéo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              Informations de base
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la vidéo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Donnez un titre attractif à votre vidéo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée estimée
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ex: 15:30"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Décrivez le contenu de votre vidéo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        id="new-tag"
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ajouter un tag..."
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Objectifs d'apprentissage */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Objectifs d'apprentissage
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  id="new-objective"
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ajouter un objectif d'apprentissage..."
                  onKeyPress={(e) => e.key === "Enter" && addObjective()}
                />
                <button
                  type="button"
                  onClick={addObjective}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {formData.learning_objectives.map((objective, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <span className="text-green-800">{objective}</span>
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fichiers médias */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              Fichiers médias
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vidéo
                </label>
                <div className="space-y-2">
                  {videoPreview && (
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-32 bg-black rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miniature
                </label>
                <div className="space-y-2">
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres de publication */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-600" />
              Paramètres de publication
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allow_comments"
                    checked={formData.allow_comments}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Autoriser les commentaires
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="publish_immediately"
                    checked={formData.publish_immediately}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Publier immédiatement
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    {success}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
