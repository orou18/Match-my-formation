"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  buildClientAuthHeaders,
  ensureServerAuthSession,
} from "@/lib/api/client-auth";
import {
  Save,
  X,
  Upload,
  Video,
  FileText,
  Image,
  Music,
  Link,
  Target,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Users,
  Calendar,
  Clock,
  Tag,
  User,
  CheckCircle,
  AlertCircle,
  Play,
  Camera,
  Film,
} from "lucide-react";

interface Resource {
  id: string;
  type: "link" | "pdf" | "document" | "image" | "video" | "audio";
  title: string;
  description: string;
  url?: string;
  file?: File;
}

interface VideoFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  learning_objectives: string[];
  visibility: "public" | "private" | "unlisted";
  resources: Resource[];
  thumbnail: File | null;
  video: File | null;
  duration: string;
  allow_comments: boolean;
  publish_immediately: boolean;
}

const categories = [
  { value: "marketing", label: "📈 Marketing Digital", color: "from-blue-500 to-blue-600" },
  { value: "development", label: "💻 Développement Web", color: "from-purple-500 to-purple-600" },
  { value: "design", label: "🎨 Design Graphique", color: "from-pink-500 to-pink-600" },
  { value: "business", label: "💼 Business", color: "from-green-500 to-green-600" },
  { value: "languages", label: "🗣️ Langues", color: "from-yellow-500 to-yellow-600" },
  { value: "music", label: "🎵 Musique", color: "from-red-500 to-red-600" },
  { value: "photography", label: "📷 Photographie", color: "from-indigo-500 to-indigo-600" },
  { value: "fitness", label: "💪 Fitness", color: "from-teal-500 to-teal-600" },
];

const resourceTypes = [
  { value: "link", label: "🔗 Lien externe", icon: Link },
  { value: "pdf", label: "📄 Document PDF", icon: FileText },
  { value: "document", label: "📝 Document texte", icon: FileText },
  { value: "image", label: "🖼️ Image", icon: Image },
  { value: "video", label: "🎥 Vidéo", icon: Video },
  { value: "audio", label: "🎵 Audio", icon: Music },
];

export default function AdminVideoCreate() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    category: "",
    tags: [],
    learning_objectives: [],
    visibility: "public", // Toujours public pour l'admin
    resources: [],
    thumbnail: null,
    video: null,
    duration: "",
    allow_comments: true,
    publish_immediately: true, // Toujours publié immédiatement pour l'admin
  });

  const [tagInput, setTagInput] = useState("");
  const [objectiveInput, setObjectiveInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<string>("00:00");
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

  const handleInputChange = (
    field: keyof VideoFormData,
    value: VideoFormData[keyof VideoFormData]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addObjective = () => {
    if (objectiveInput.trim() && !formData.learning_objectives.includes(objectiveInput.trim())) {
      setFormData(prev => ({
        ...prev,
        learning_objectives: [...prev.learning_objectives, objectiveInput.trim()]
      }));
      setObjectiveInput("");
    }
  };

  const removeObjective = (objectiveToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter(obj => obj !== objectiveToRemove)
    }));
  };

  // Gestion de la prévisualisation vidéo
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, video: file }));
      
      // Créer l'URL de prévisualisation
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      // Extraire la durée de la vidéo
      const video = document.createElement('video');
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        setVideoDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        handleInputChange('duration', `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      });
      
      // Générer des miniatures automatiquement
      generateThumbnails(url);
    }
  };

  // Génération de miniatures depuis la vidéo
  const generateThumbnails = (videoUrl: string) => {
    setIsGeneratingThumbnails(true);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.addEventListener('loadedmetadata', () => {
      const thumbnailCount = 6;
      const thumbnails: string[] = [];
      const duration = video.duration;
      
      for (let i = 0; i < thumbnailCount; i++) {
        const time = (duration / thumbnailCount) * i;
        video.currentTime = time;
        
        video.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 320;
          canvas.height = 180;
          
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
            thumbnails.push(thumbnailUrl);
            
            if (thumbnails.length === thumbnailCount) {
              setGeneratedThumbnails(thumbnails);
              setSelectedThumbnail(thumbnails[0]);
              setIsGeneratingThumbnails(false);
            }
          }
        }, { once: true });
      }
    });
  };

  // Sélection d'une miniature générée
  const selectThumbnail = (thumbnail: string) => {
    setSelectedThumbnail(thumbnail);
  };

  const addResource = () => {
    const newResource: Resource = {
      id: Date.now().toString(),
      type: "link",
      title: "",
      description: "",
      url: "",
    };
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }));
  };

  const updateResource = (
    id: string,
    field: keyof Resource,
    value: Resource[keyof Resource]
  ) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map(resource =>
        resource.id === id ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const removeResource = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource.id !== id)
    }));
  };

  const handleFileUpload = (field: "video" | "thumbnail", file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est obligatoire";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est obligatoire";
    }

    if (!formData.category) {
      newErrors.category = "La catégorie est obligatoire";
    }

    if (!formData.video) {
      newErrors.video = "La vidéo est obligatoire";
    }

    if (!formData.thumbnail && !selectedThumbnail) {
      newErrors.thumbnail = "La miniature est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionState = await ensureServerAuthSession();
      if (!sessionState.ok) {
        setErrors({ submit: sessionState.message });
        return;
      }

      const submitData = new FormData();
      
      // Informations de base
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("tags", JSON.stringify(formData.tags));
      submitData.append("learning_objectives", JSON.stringify(formData.learning_objectives));
      submitData.append("visibility", formData.visibility);
      submitData.append("duration", formData.duration);
      submitData.append("allow_comments", formData.allow_comments.toString());
      submitData.append("publish_immediately", formData.publish_immediately.toString());
      
      // Fichiers
      if (formData.video) {
        submitData.append("video", formData.video);
      }
      
      if (formData.thumbnail) {
        submitData.append("thumbnail", formData.thumbnail);
      }

      if (selectedThumbnail) {
        submitData.append("selected_thumbnail", selectedThumbnail);
      }

      // Ressources
      submitData.append("resources", JSON.stringify(formData.resources));

      // Marquer comme vidéo admin (publique par défaut)
      submitData.append("is_admin_video", "true");
      submitData.append("is_published", "true");

      const response = await fetch("/api/admin/videos", {
        method: "POST",
        body: submitData,
        credentials: "include",
        headers: buildClientAuthHeaders(),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Vidéo admin créée avec succès:", result);
        
        // Rediriger vers le dashboard admin
        router.push(`/${locale}/dashboard/admin`);
      } else {
        const error = await response.json();
        console.error("Erreur lors de la création:", error);
        setErrors({
          submit:
            error?.message ||
            error?.error ||
            "Erreur lors de la création de la vidéo",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setErrors({ submit: "Erreur de connexion" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Video className="w-6 h-6 text-primary" />
                Créer une Vidéo Admin
              </h1>
              <p className="text-gray-600 mt-1">
                Créez une vidéo qui sera visible par tous les utilisateurs
              </p>
            </div>
            <button
              onClick={() => router.push(`/${locale}/dashboard/admin`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Informations de base
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la vidéo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Entrez un titre accrocheur..."
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Décrivez le contenu de votre vidéo..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ajoutez un tag et appuyez sur Entrée..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-primary/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Objectifs d'apprentissage */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Objectifs d&apos;apprentissage
            </h2>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ajoutez un objectif d'apprentissage..."
              />
              <button
                type="button"
                onClick={addObjective}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.learning_objectives.map((objective, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="flex-1 text-gray-700">{objective}</span>
                  <button
                    type="button"
                    onClick={() => removeObjective(objective)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Fichiers média */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Fichiers média
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vidéo <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {formData.video ? formData.video.name : "Cliquez pour uploader une vidéo"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      MP4, WebM, MOV (max 500MB)
                    </p>
                  </label>
                </div>
                {errors.video && (
                  <p className="text-red-500 text-sm mt-1">{errors.video}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miniature <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload("thumbnail", e.target.files[0])}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {formData.thumbnail ? formData.thumbnail.name : "Cliquez pour uploader une miniature"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG, GIF (max 10MB)
                    </p>
                  </label>
                </div>
                {errors.thumbnail && (
                  <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
                )}
              </div>
            </div>

            {/* Prévisualisation vidéo et miniatures générées */}
            {(videoPreview || generatedThumbnails.length > 0) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  Prévisualisation et miniatures
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Prévisualisation vidéo */}
                  {videoPreview && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aperçu de la vidéo
                      </label>
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {videoDuration}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Miniatures générées */}
                  {generatedThumbnails.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Miniatures générées
                        {isGeneratingThumbnails && (
                          <span className="ml-2 text-blue-500 text-xs">
                            Génération en cours...
                          </span>
                        )}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {generatedThumbnails.map((thumbnail, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectThumbnail(thumbnail)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                              selectedThumbnail === thumbnail
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <img
                              src={thumbnail}
                              alt={`Miniature ${index + 1}`}
                              className="w-full h-16 object-cover"
                            />
                            {selectedThumbnail === thumbnail && (
                              <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      {selectedThumbnail && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Miniature sélectionnée
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée estimée
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="ex: 15:30"
              />
            </div>
          </div>

          {/* Paramètres de publication */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Paramètres de publication
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Globe className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Visibilité : Publique</p>
                  <p className="text-sm text-gray-600">
                    Cette vidéo sera visible par tous les utilisateurs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allow-comments"
                  checked={formData.allow_comments}
                  onChange={(e) => handleInputChange("allow_comments", e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="allow-comments" className="text-sm font-medium text-gray-700">
                  Autoriser les commentaires
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="publish-immediately"
                  checked={formData.publish_immediately}
                  onChange={(e) => handleInputChange("publish_immediately", e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="publish-immediately" className="text-sm font-medium text-gray-700">
                  Publier immédiatement
                </label>
              </div>
            </div>
          </div>

          {/* Ressources */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Ressources additionnelles
              </h2>
              <button
                type="button"
                onClick={addResource}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une ressource
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.resources.map((resource) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={resource.type}
                        onChange={(e) => updateResource(resource.id, "type", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {resourceTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre
                      </label>
                      <input
                        type="text"
                        value={resource.title}
                        onChange={(e) => updateResource(resource.id, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Titre de la ressource"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL/Contenu
                      </label>
                      <input
                        type="text"
                        value={resource.url || ""}
                        onChange={(e) => updateResource(resource.id, "url", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="URL ou description"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeResource(resource.id)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="w-4 h-4" />
                <span>Les champs marqués d&apos;un * sont obligatoires</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/dashboard/admin`)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Créer la vidéo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
