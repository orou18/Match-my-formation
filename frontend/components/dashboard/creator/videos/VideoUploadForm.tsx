"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import React from "react";
import {
  Upload,
  X,
  Video,
  Image as ImageIcon,
  Save,
  Eye,
  Trash2,
  Play,
  FileText,
  AlertCircle,
  Globe,
  Lock,
  FolderPlus,
  Check,
} from "lucide-react";

interface VideoUploadErrors {
  title?: string;
  description?: string;
  category?: string;
  video?: string;
  thumbnail?: string;
  pathway?: string;
  tags?: string;
  visibility?: string;
}

interface VideoUploadData {
  title: string;
  description: string;
  category: string;
  tags: string;
  visibility: "public" | "private" | "unlisted";
  pathway?: string;
  video: File | null;
  thumbnail: File | null;
}

interface VideoUploadFormProps {
  onClose: () => void;
  onSubmit: (data: VideoUploadData) => void;
}

export default function VideoUploadForm({
  onClose,
  onSubmit,
}: VideoUploadFormProps) {
  const [formData, setFormData] = useState<VideoUploadData>({
    title: "",
    description: "",
    category: "",
    tags: "",
    visibility: "public",
    pathway: "",
    video: null,
    thumbnail: null,
  });

  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    thumbnail: 0,
  });

  const [errors, setErrors] = useState<VideoUploadErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();

  const categories = [
    "Tourisme",
    "Hôtellerie",
    "Restauration",
    "Marketing Digital",
    "Gestion",
    "Service Client",
    "Développement Durable",
    "Autre",
  ];

  const pathways = [
    "Certificat Hôtellerie",
    "Formation Tourisme",
    "Marketing Digital",
    "Gestion Restaurant",
    "Service Client Excellence",
    "Développement Durable",
  ];

  const validateForm = () => {
    const newErrors: VideoUploadErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (!formData.category) {
      newErrors.category = "La catégorie est requise";
    }

    if (!formData.video) {
      newErrors.video = "La vidéo est requise";
    }

    if (!formData.thumbnail) {
      newErrors.thumbnail = "La miniature est requise";
    }

    if (formData.video && formData.video.size > 500 * 1024 * 1024) {
      newErrors.video = "La vidéo ne doit pas dépasser 500MB";
    }

    if (formData.thumbnail && formData.thumbnail.size > 5 * 1024 * 1024) {
      newErrors.thumbnail = "La miniature ne doit pas dépasser 5MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange =
    (field: "video" | "thumbnail") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [field]: file }));

        // Créer un preview
        if (field === "video") {
          const videoUrl = URL.createObjectURL(file);
          setVideoPreview(videoUrl);
        } else {
          const imageUrl = URL.createObjectURL(file);
          setThumbnailPreview(imageUrl);
        }

        // Clear error for this field
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      }
    };

  const removeFile = (field: "video" | "thumbnail") => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    if (field === "video") {
      setVideoPreview(null);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'upload
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("category", formData.category);
      uploadData.append("tags", formData.tags);
      uploadData.append("visibility", formData.visibility);
      if (formData.pathway) uploadData.append("pathway", formData.pathway);
      if (formData.video) uploadData.append("video", formData.video);
      if (formData.thumbnail)
        uploadData.append("thumbnail", formData.thumbnail);

      // Simuler progression
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress((prev) => ({ ...prev, video: i, thumbnail: i }));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Simuler succès
      console.log("Video uploaded:", formData);

      // Appeler le callback avec les données
      onSubmit(formData);
    } catch (error) {
      console.error("Upload error:", error);
      setErrors({ video: "Erreur lors de l'upload de la vidéo" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto pb-8"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Créer une nouvelle vidéo
              </h1>
              <p className="text-gray-600">
                Partagez votre expertise avec la communauté
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Informations de la vidéo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la vidéo *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Donnez un titre accrocheur..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="Décrivez le contenu de votre vidéo..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="tourisme, hôtellerie, formation..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibilité
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === "public"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: e.target.value as any,
                        }))
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Public</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-7">
                      Visible par tout le monde
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === "private"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: e.target.value as any,
                        }))
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Privé</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-7">
                      Uniquement pour les abonnés
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="unlisted"
                      checked={formData.visibility === "unlisted"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: e.target.value as any,
                        }))
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Non listé</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-7">
                      Accessible par lien uniquement
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parcours (optionnel)
                </label>
                <select
                  value={formData.pathway}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pathway: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Aucun parcours</option>
                  {pathways.map((pathway) => (
                    <option key={pathway} value={pathway}>
                      {pathway}
                    </option>
                  ))}
                </select>
                {formData.pathway && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                    <FolderPlus className="w-3 h-3" />
                    <span>
                      Cette vidéo sera intégrée dans le parcours sélectionné
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Fichiers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vidéo *
                </label>
                {videoPreview ? (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      className="w-full h-48 object-cover rounded-xl"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("video")}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Cliquez pour ajouter une vidéo
                      </div>
                      <div className="text-xs text-gray-500">
                        MP4, WebM, MOV (max 500MB)
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange("video")}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.video && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.video}
                  </p>
                )}
                {uploadProgress.video > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress.video}%` }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miniature *
                </label>
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("thumbnail")}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Cliquez pour ajouter une miniature
                      </div>
                      <div className="text-xs text-gray-500">
                        Recommandé: 1280x720px, JPG, PNG (max 5MB)
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange("thumbnail")}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.thumbnail}
                  </p>
                )}
                {uploadProgress.thumbnail > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress.thumbnail}%` }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Aperçu
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publication en cours...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Publier la vidéo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
