"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Upload,
  X,
  Eye,
  EyeOff,
  Save,
  Send,
  Film,
  Image,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface VideoFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  visibility: "public" | "private" | "unlisted";
  allowComments: boolean;
  allowDownloads: boolean;
  videoFile: File | null;
  thumbnailFile: File | null;
}

export default function CreateVideoPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    category: "",
    tags: [],
    visibility: "public",
    allowComments: true,
    allowDownloads: false,
    videoFile: null,
    thumbnailFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Partial<VideoFormData>>({});

  const categories = [
    "Tourisme durable",
    "Gestion hôtelière",
    "Marketing touristique",
    "Guide touristique",
    "Réservation et logistique",
    "Culture et patrimoine",
    "Écotourisme",
    "Transport touristique",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof VideoFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "video" && !file.type.startsWith("video/")) {
        setErrors(prev => ({ ...prev, videoFile: "Veuillez sélectionner un fichier vidéo valide" }));
        return;
      }
      if (type === "thumbnail" && !file.type.startsWith("image/")) {
        setErrors(prev => ({ ...prev, thumbnailFile: "Veuillez sélectionner une image valide" }));
        return;
      }
      setFormData(prev => ({ ...prev, [`${type}File`]: file }));
      if (errors[`${type}File` as keyof VideoFormData]) {
        setErrors(prev => ({ ...prev, [`${type}File`]: undefined }));
      }
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const validateForm = () => {
    const newErrors: Partial<VideoFormData> = {};
    
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.category) newErrors.category = "La catégorie est requise";
    if (!formData.videoFile) newErrors.videoFile = "La vidéo est requise";
    if (!formData.thumbnailFile) newErrors.thumbnailFile = "La miniature est requise";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simuler l'upload avec une progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simuler l'envoi des données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Simuler la création réussie
      setTimeout(() => {
        router.push(`/${locale}/dashboard/creator/videos`);
      }, 500);

    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créer une nouvelle vidéo
          </h1>
          <p className="text-gray-600">
            Partagez votre expertise avec la communauté
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Annuler
          </button>
        </div>
      </motion.div>

      {/* Formulaire */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={(e) => handleSubmit(e, false)}
        className="space-y-8"
      >
        {/* Informations principales */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informations principales
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la vidéo *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Un titre clair et attrayant..."
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
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
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Décrivez en détail le contenu de votre vidéo..."
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="hover:text-primary/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ajoutez des tags (ex: tourisme, hôtel, guide)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTagAdd(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Fichiers */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Film className="w-5 h-5" />
            Fichiers multimédia
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload vidéo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vidéo *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, "video")}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    errors.videoFile
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  {formData.videoFile ? (
                    <div className="text-green-600">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{formData.videoFile.name}</p>
                      <p className="text-xs">{(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Cliquez pour uploader</p>
                      <p className="text-xs">MP4, MOV, AVI jusqu'à 500MB</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.videoFile && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.videoFile}
                </p>
              )}
            </div>

            {/* Upload miniature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miniature *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "thumbnail")}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    errors.thumbnailFile
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  {formData.thumbnailFile ? (
                    <div className="text-green-600">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{formData.thumbnailFile.name}</p>
                      <p className="text-xs">{(formData.thumbnailFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Image className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Cliquez pour uploader</p>
                      <p className="text-xs">JPG, PNG jusqu'à 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.thumbnailFile && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.thumbnailFile}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Paramètres */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres de publication
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibilité
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "public", label: "Public", icon: Eye },
                  { value: "private", label: "Privé", icon: EyeOff },
                  { value: "unlisted", label: "Non listé", icon: Eye },
                ].map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-colors ${
                      formData.visibility === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={value}
                      checked={formData.visibility === value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                  className="mr-3 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Autoriser les commentaires</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowDownloads}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowDownloads: e.target.checked }))}
                  className="mr-3 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Autoriser les téléchargements</span>
              </label>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Upload en cours...</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Enregistrer brouillon
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Publication..." : "Publier"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
