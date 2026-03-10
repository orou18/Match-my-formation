"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Tag,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function VideoUpload() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    visibility: "public",
    thumbnail: null as File | null,
    video: null as File | null,
  });

  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    thumbnail: 0,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: "tourisme", label: "Tourisme" },
    { value: "hotellerie", label: "Hôtellerie" },
    { value: "marketing", label: "Marketing Digital" },
    { value: "service_client", label: "Service Client" },
    { value: "developpement", label: "Développement Professionnel" },
    { value: "culture", label: "Culture Générale" },
  ];

  const handleFileChange = (fileType: 'video' | 'thumbnail') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fileType]: file }));
      
      // Preview for video
      if (fileType === 'video') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.category) newErrors.category = "La catégorie est requise";
    if (!formData.video) newErrors.video = "La vidéo est requise";
    if (!formData.thumbnail) newErrors.thumbnail = "La miniature est requise";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsUploading(false);
      return;
    }

    try {
      // Simulation d'upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('tags', formData.tags);
      uploadData.append('visibility', formData.visibility);
      if (formData.video) uploadData.append('video', formData.video);
      if (formData.thumbnail) uploadData.append('thumbnail', formData.thumbnail);

      // Simuler progression
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(prev => ({ ...prev, video: i, thumbnail: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Simuler succès
      console.log('Video uploaded:', formData);
      
      // Redirection
      router.push(`/${locale}/dashboard/admin/videos`);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ submit: "Erreur lors de l'upload. Veuillez réessayer." });
    } finally {
      setIsUploading(false);
      setUploadProgress({ video: 0, thumbnail: 0 });
    }
  };

  const removeFile = (fileType: 'video' | 'thumbnail') => {
    setFormData(prev => ({ ...prev, [fileType]: null }));
    if (fileType === 'video' && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Ajouter une Vidéo
                </h1>
                <p className="text-gray-600">
                  Uploadez et configurez votre nouvelle vidéo
                </p>
              </div>
              
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title and Description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la vidéo *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrez un titre accrocheur..."
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
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Décrivez le contenu de votre vidéo..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="tourisme, luxe, service client..."
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Visibilité de la vidéo
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                    className="text-primary"
                  />
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-gray-600">Visible par tout le monde</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                    className="text-primary"
                  />
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Privé</div>
                      <div className="text-sm text-gray-600">Uniquement les abonnés</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vidéo *
                </label>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  errors.video ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary'
                }`}>
                  {formData.video ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <Video className="w-12 h-12 text-primary" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formData.video.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(formData.video.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('video')}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {uploadProgress.video > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress.video}%` }}
                            className="bg-primary h-full rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <div className="text-sm font-medium text-gray-700">
                        Cliquez pour uploader la vidéo
                      </div>
                      <div className="text-xs text-gray-500">
                        Formats supportés: MP4, WebM, MOV (max 500MB)
                      </div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange('video')(e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.video && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.video}
                  </p>
                )}

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Miniature *
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    errors.thumbnail ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary'
                  }`}>
                    {formData.thumbnail ? (
                      <div className="space-y-4">
                        <div className="relative mx-auto w-32 h-20 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(formData.thumbnail)}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formData.thumbnail.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('thumbnail')}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {uploadProgress.thumbnail > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress.thumbnail}%` }}
                              className="bg-primary h-full rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <div className="text-sm font-medium text-gray-700">
                          Cliquez pour ajouter une miniature
                        </div>
                        <div className="text-xs text-gray-500">
                          Recommandé: 1280x720px, JPG, PNG (max 5MB)
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('thumbnail')(e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.thumbnail}
                  </p>
                )}
              </div>
            </div>

            {/* Video Preview */}
            {previewUrl && (
              <div className="border-t border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu de la vidéo</h3>
                <div className="relative bg-black rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <video
                    src={previewUrl}
                    controls
                    className="absolute inset-0 w-full h-full"
                  >
                    <source src={previewUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-3 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Upload en cours...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Publier la vidéo</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
