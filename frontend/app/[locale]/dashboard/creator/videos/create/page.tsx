"use client";

import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
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
  Play,
  Pause,
  Plus,
  FolderOpen,
  Loader2,
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
  videoFile: File | string | null;
  thumbnailFile: File | string | null;
  isInPlaylist: boolean;
  playlistId?: string;
  playlistPosition?: number;
}

export default function CreateVideoPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    isInPlaylist: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Partial<VideoFormData>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  // Playlists simulées
  const playlists = [
    { id: "1", name: "Formation Tourisme Durable", videos: 5 },
    { id: "2", name: "Marketing Digital Avancé", videos: 8 },
    { id: "3", name: "Gestion Hôtelière", videos: 6 },
    { id: "4", name: "Service Client Excellence", videos: 4 },
  ];

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

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setErrors({ videoFile: "Format de vidéo non supporté. Utilisez MP4, WebM, OGG ou MOV." });
      return;
    }

    // Validation de la taille (max 2GB)
    const maxSize = 2 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ videoFile: "La vidéo est trop volumineuse. Taille maximale: 2GB." });
      return;
    }

    // Créer l'aperçu
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFormData(prev => ({ ...prev, videoFile: file }));

    // Charger les métadonnées de la vidéo
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration);
      URL.revokeObjectURL(url);
    };
    video.src = url;

    setErrors({});
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const generateThumbnail = useCallback(() => {
    if (!videoRef.current || !previewUrl) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = 1280;
    canvas.height = 720;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
          setFormData(prev => ({ ...prev, thumbnailFile: thumbnailFile }));
        }
      }, 'image/jpeg', 0.8);
    }
  }, [previewUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "video" && !file.type.startsWith("video/")) {
        setErrors(prev => ({ ...prev, videoFile: "Veuillez sélectionner un fichier vidéo valide" } as unknown as Partial<VideoFormData>));
        return;
      }
      if (type === "thumbnail" && !file.type.startsWith("image/")) {
        setErrors(prev => ({ ...prev, thumbnailFile: "Veuillez sélectionner une image valide" } as unknown as Partial<VideoFormData>));
        return;
      }
      setFormData(prev => ({ ...prev, [`${type}File`]: file }));
      if (errors[`${type}File` as keyof VideoFormData]) {
        setErrors(prev => ({ ...prev, [`${type}File`]: undefined } as unknown as Partial<VideoFormData>));
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload et prévisualisation vidéo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vidéo *
              </label>
              
              {!previewUrl ? (
                /* Zone d'upload */
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer"
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Uploadez votre vidéo
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Glissez-déposez ou cliquez pour parcourir
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Formats: MP4, WebM, OGG, MOV</p>
                        <p>Taille maximale: 2GB</p>
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                /* Prévisualisation vidéo */
                <div className="space-y-4">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      className="w-full h-auto max-h-64 object-contain"
                      onLoadedMetadata={() => generateThumbnail()}
                    />
                    
                    {/* Contrôles de lecture */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlayPause}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white" />
                          )}
                        </button>
                        <div className="text-white text-sm">
                          {formatDuration(videoDuration)}
                        </div>
                      </div>
                    </div>

                    {/* Bouton de suppression */}
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, videoFile: undefined }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Bouton générer miniature */}
                  <button
                    onClick={generateThumbnail}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Générer une miniature automatiquement
                  </button>
                </div>
              )}
              
              {errors.videoFile && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {typeof errors.videoFile === 'string' ? errors.videoFile : 'Erreur de fichier'}
                </p>
              )}
            </div>

            {/* Upload miniature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miniature {formData.thumbnailFile ? '✓' : '(optionnel - générer auto)'}
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
                  {formData.thumbnailFile && typeof formData.thumbnailFile !== 'string' ? (
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
                  {typeof errors.thumbnailFile === 'string' ? errors.thumbnailFile : 'Erreur de fichier'}
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

        {/* Playlist */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Playlist
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isInPlaylist}
                onChange={(e) => setFormData(prev => ({ ...prev, isInPlaylist: e.target.checked }))}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 font-medium">Ajouter cette vidéo à une playlist</span>
            </label>

            {formData.isInPlaylist && (
              <div className="space-y-4 pl-6 border-l-4 border-primary/20">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner une playlist
                  </label>
                  <select
                    value={formData.playlistId || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, playlistId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Choisissez une playlist...</option>
                    {playlists.map(playlist => (
                      <option key={playlist.id} value={playlist.id}>
                        {playlist.name} ({playlist.videos} vidéos)
                      </option>
                    ))}
                  </select>
                </div>

                {formData.playlistId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position dans la playlist
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Position (ex: 1 pour début)"
                      value={formData.playlistPosition || ""}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        playlistPosition: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Laissez vide pour ajouter à la fin
                    </p>
                  </div>
                )}

                {/* Option pour créer une nouvelle playlist */}
                <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Créer une nouvelle playlist
                </button>
              </div>
            )}

            {/* Option vidéo indépendante */}
            {!formData.isInPlaylist && (
              <div className="pl-6 border-l-4 border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Film className="w-4 h-4" />
                  <span className="text-sm">Cette vidéo sera publiée indépendamment</span>
                </div>
              </div>
            )}
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
