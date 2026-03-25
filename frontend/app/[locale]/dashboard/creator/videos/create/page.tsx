"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
  Music
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import type { Video, VideoFormData, Resource, DashboardStats } from "@/types/creator";
import { useSimpleNotification, NotificationContainer } from "@/components/ui/SimpleNotification";

export default function CreateVideoPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(true); // Modal ouvert par défaut
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState('00:00');
  const [thumbnailTime, setThumbnailTime] = useState(0);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    category: '',
    learning_objectives: [],
    resources: [],
    visibility: 'private',
    allow_comments: true,
    publish_immediately: false,
    tags: [],
    video_url: '',
    thumbnail_url: ''
  });
  
  const [newObjective, setNewObjective] = useState('');
  const [newTag, setNewTag] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    objectives: false,
    resources: false,
    files: true,
    settings: false
  });

  const { notifications, success, error, removeNotification } = useSimpleNotification();

  useEffect(() => {
    loadVideos();
    loadStats();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/creator/dashboard');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      } else {
        console.error('Erreur lors du chargement des vidéos');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/creator/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {
          totalVideos: 0,
          totalViews: 0,
          engagement: 0,
          revenue: 0
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    success('Création en cours', 'Votre vidéo est en cours de création...');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('learning_objectives', JSON.stringify(formData.learning_objectives));
      formDataToSend.append('resources', JSON.stringify(formData.resources));
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('visibility', formData.visibility);
      formDataToSend.append('allow_comments', formData.allow_comments.toString());
      formDataToSend.append('publish_immediately', formData.publish_immediately.toString());
      formDataToSend.append('duration', videoDuration);

      if (formData.video_file) {
        formDataToSend.append('video_file', formData.video_file);
      }
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }
      if (selectedThumbnail) {
        formDataToSend.append('selected_thumbnail', selectedThumbnail);
      }

      // Simuler la progression de l'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/creator/videos-simple', {
        method: 'POST',
        body: formDataToSend
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        setVideos(prev => [...prev, result.video]);
        setShowCreateModal(false);
        resetForm();
        success('Vidéo créée avec succès', `"${result.video.title}" a été ajoutée à votre contenu`);
        
        // Si la vidéo est publique, recharger les données
        if (result.video.visibility === 'public') {
          loadStats();
        }
        
        // Redirection vers le dashboard
        setTimeout(() => {
          router.push(`/${locale}/dashboard/creator`);
        }, 1500);
      } else {
        const errorData = await response.json();
        error('Erreur lors de la création', errorData.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur:', err);
      error('Erreur lors de la création', 'Une erreur technique est survenue');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handlePublishDirectly = async () => {
  // Vérification des champs obligatoires avec messages spécifiques
  if (!formData.title) {
    error('Titre requis', 'Veuillez ajouter un titre à votre vidéo');
    return;
  }
  if (!formData.description) {
    error('Description requise', 'Veuillez ajouter une description à votre vidéo');
    return;
  }
  if (!formData.video_file) {
    error('Vidéo requise', 'Veuillez sélectionner un fichier vidéo');
    return;
  }

  setIsSubmitting(true);
  setUploadProgress(10);

    try {
      // Simuler l'upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Préparer les données pour la publication directe
      const publishData = new FormData();
      publishData.append('title', formData.title);
      publishData.append('description', formData.description);
      publishData.append('category', formData.category);
      publishData.append('video_file', formData.video_file);
      publishData.append('thumbnail', formData.thumbnail || '');
      publishData.append('tags', JSON.stringify(formData.tags));
      publishData.append('learning_objectives', JSON.stringify(formData.learning_objectives));
      publishData.append('resources', JSON.stringify(formData.resources));
      publishData.append('visibility', 'public'); // Publication directe = publique
      publishData.append('allow_comments', 'true');
      publishData.append('published_immediately', 'true'); // Flag pour publication immédiate

      const response = await fetch('/api/creator/videos', {
        method: 'POST',
        body: publishData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const newVideo = await response.json();
        success('Vidéo publiée avec succès!', `"${formData.title}" est maintenant en ligne et visible par tous`);
        
        // Réinitialiser le formulaire
        setFormData({
          title: '',
          description: '',
          category: '',
          tags: [],
          learning_objectives: [],
          resources: [],
          video_file: undefined,
          thumbnail: undefined,
          visibility: 'private',
          allow_comments: true,
          publish_immediately: false
        });
        
        // Rediriger vers le dashboard après un court délai
        setTimeout(() => {
          router.push(`/${locale}/dashboard/creator`);
        }, 1500);
      } else {
        const errorData = await response.json();
        error('Erreur lors de la publication', errorData.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur:', err);
      error('Erreur lors de la publication', 'Une erreur technique est survenue');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo? Cette action est irréversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/creator/videos?id=${videoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const deletedVideo = videos.find(v => v.id === videoId);
        setVideos(videos.filter(video => video.id !== videoId));
        if (previewVideo?.id === videoId) {
          setPreviewVideo(null);
        }
        success('Vidéo supprimée', `"${deletedVideo?.title}" a été supprimée avec succès`);
        loadStats();
      } else {
        const errorData = await response.json();
        error('Erreur lors de la suppression', errorData.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur:', err);
      error('Erreur lors de la suppression', 'Une erreur technique est survenue');
    }
  };

  const handlePreview = (video: Video) => {
    setPreviewVideo(video);
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        learning_objectives: [...prev.learning_objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, {
        type: 'link',
        title: '',
        description: '',
        url: '',
        file_size: 0,
        created_at: new Date().toISOString()
      }]
    }));
  };

  const updateResource = (index: number, field: string, value: string | File | number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, video_file: file }));
      setVideoPreview(URL.createObjectURL(file));
      
      // Obtenir la durée de la vidéo
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        setVideoDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
      setSelectedThumbnail(null);
      setGeneratedThumbnails([]);
    }
  };

  const generateThumbnailsFromVideo = async () => {
    if (!videoPreview || !videoRef.current) return;

    setIsGeneratingThumbnail(true);
    const video = videoRef.current;
    video.currentTime = 0;

    const thumbnails: string[] = [];
    const duration = video.duration;
    const interval = duration / 6; // Générer 6 miniatures

    for (let i = 0; i < 6; i++) {
      const time = i * interval;
      video.currentTime = time;
      
      await new Promise(resolve => {
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          thumbnails.push(canvas.toDataURL('image/jpeg', 0.8));
          resolve(true);
        };
      });
    }

    setGeneratedThumbnails(thumbnails);
    setIsGeneratingThumbnail(false);
    success('Miniatures générées', '6 miniatures ont été générées à partir de la vidéo');
  };

  const selectThumbnail = (thumbnail: string) => {
    setSelectedThumbnail(thumbnail);
    setThumbnailPreview(thumbnail);
  };

  const handleResourceUpload = async (index: number, file: File | null) => {
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', formData.resources[index].type);

      const response = await fetch('/api/creator/upload-resource', {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        const result = await response.json();
        updateResource(index, 'url', result.url);
        updateResource(index, 'file_size', file.size);
        success('Ressource uploadée', 'Le fichier a été uploadé avec succès');
      } else {
        const errorData = await response.json();
        error('Erreur d\'upload', errorData.error || 'Impossible d\'uploader le fichier');
      }
    } catch (err) {
      console.error('Erreur:', err);
      error('Erreur technique', 'Une erreur est survenue lors de l\'upload');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      learning_objectives: [],
      resources: [],
      visibility: 'private',
      allow_comments: true,
      publish_immediately: false,
      tags: [],
      video_url: '',
      thumbnail_url: ''
    });
    setNewObjective('');
    setNewTag('');
    setVideoPreview(null);
    setThumbnailPreview(null);
    setSelectedThumbnail(null);
    setGeneratedThumbnails([]);
    setVideoDuration('00:00');
    setExpandedSections({
      basic: true,
      objectives: false,
      resources: false,
      files: true,
      settings: false
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'published' && video.is_published) ||
                      (activeTab === 'drafts' && !video.is_published);
    return matchesSearch && matchesTab;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const statCards = [
    {
      title: "Total Vidéos",
      value: stats?.totalVideos || 0,
      icon: VideoIcon,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Vues Totales",
      value: stats?.totalViews || 0,
      icon: Eye,
      color: "bg-green-500",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Engagement",
      value: `${stats?.engagement || 0}%`,
      icon: Users,
      color: "bg-purple-500",
      change: "+5%",
      changeType: "increase"
    },
    {
      title: "Revenus",
      value: `${stats?.revenue || 0}€`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: "+15%",
      changeType: "increase"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Film className="w-8 h-8 text-blue-600" />
                  Créer une nouvelle vidéo
                </h1>
                <p className="text-gray-600 mt-1">Remplissez toutes les informations pour votre contenu</p>
              </div>
              <button
                onClick={() => router.back()}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Retour
              </button>
            </div>
          </div>
        </div>

        {/* Create Modal - Full Page */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] sm:h-[80vh] flex flex-col shadow-2xl border border-gray-200"
              >
                {/* Header */}
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
                  <div className="flex justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                          Créer une nouvelle vidéo
                        </h2>
                        <p className="text-sm text-gray-600 hidden sm:block">
                          Remplissez toutes les informations pour votre contenu
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.back()}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCreateVideo} className="flex flex-col h-full">
                  {/* Progress Bar */}
                  {uploadProgress > 0 && (
                    <div className="bg-blue-50 border-b border-blue-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                          Upload en cours...
                        </span>
                        <span className="text-sm font-bold text-blue-600">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Content */}
                  <div 
                    className="flex-1 overflow-y-auto overflow-x-hidden"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#93c5fd #f3f4f6'
                    }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        width: 8px;
                      }
                      div::-webkit-scrollbar-track {
                        background: #f3f4f6;
                        border-radius: 4px;
                      }
                      div::-webkit-scrollbar-thumb {
                        background: #93c5fd;
                        border-radius: 4px;
                        transition: background 0.2s;
                      }
                      div::-webkit-scrollbar-thumb:hover {
                        background: #60a5fa;
                      }
                    `}</style>
                    <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
                      {/* Basic Information */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleSection('basic')}
                          className="w-full px-3 sm:px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <VideoIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900">Informations de base</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Obligatoire
                            </span>
                          </div>
                          {expandedSections.basic ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSections.basic && (
                          <div className="px-3 sm:px-4 pb-4 space-y-3">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Titre de la vidéo *
                                </label>
                                <input
                                  type="text"
                                  value={formData.title}
                                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Entrez le titre de votre vidéo"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Catégorie
                                </label>
                                <select
                                  value={formData.category}
                                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Sélectionnez une catégorie</option>
                                  <option value="marketing">📈 Marketing</option>
                                  <option value="development">💻 Développement</option>
                                  <option value="design">🎨 Design</option>
                                  <option value="business">💼 Business</option>
                                  <option value="education">📚 Éducation</option>
                                  <option value="technology">🔧 Technologie</option>
                                  <option value="other">📦 Autre</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                              </label>
                              <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Décrivez votre vidéo en détail..."
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                              </label>
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ajouter un tag"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={addTag}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Ajouter
                                  </button>
                                </div>
                                {formData.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full flex items-center gap-2 border border-blue-100">
                                        #{tag}
                                        <button
                                          type="button"
                                          onClick={() => removeTag(index)}
                                          className="text-blue-500 hover:text-blue-700"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Learning Objectives */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleSection('objectives')}
                          className="w-full px-3 sm:px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Target className="w-4 h-4 text-green-600" />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900">Objectifs d'apprentissage</h3>
                            <span className="text-xs text-gray-500">
                              {formData.learning_objectives.length} ajouté{formData.learning_objectives.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          {expandedSections.objectives ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSections.objectives && (
                          <div className="px-3 sm:px-4 pb-4 space-y-3">
                            <div className="space-y-3">
                              {formData.learning_objectives.map((objective, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                  <span className="text-gray-900 flex-1">{objective}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeObjective(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newObjective}
                                  onChange={(e) => setNewObjective(e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Ajouter un objectif d'apprentissage"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addObjective();
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={addObjective}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Resources */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleSection('resources')}
                          className="w-full px-3 sm:px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-purple-600" />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900">Ressources associées</h3>
                            <span className="text-xs text-gray-500">
                              {formData.resources.length} ajoutée{formData.resources.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          {expandedSections.resources ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSections.resources && (
                          <div className="px-3 sm:px-4 pb-4 space-y-3">
                            <div className="space-y-4">
                              {formData.resources.map((resource, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                      </label>
                                      <select
                                        value={resource.type}
                                        onChange={(e) => updateResource(index, 'type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      >
                                        <option value="link">🔗 Lien</option>
                                        <option value="pdf">📄 PDF</option>
                                        <option value="document">📝 Document</option>
                                        <option value="image">🖼️ Image</option>
                                        <option value="video">🎥 Vidéo</option>
                                        <option value="audio">🎵 Audio</option>
                                      </select>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Titre
                                      </label>
                                      <input
                                        type="text"
                                        value={resource.title}
                                        onChange={(e) => updateResource(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Titre de la ressource"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                      </label>
                                      <input
                                        type="text"
                                        value={resource.description || ''}
                                        onChange={(e) => updateResource(index, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Description (optionnel)"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Actions
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() => removeResource(index)}
                                        className="w-full px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {resource.type === 'link' ? (
                                      <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          URL
                                        </label>
                                        <input
                                          type="url"
                                          value={resource.url || ''}
                                          onChange={(e) => updateResource(index, 'url', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          placeholder="https://exemple.com"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Fichier
                                        </label>
                                        <input
                                          type="file"
                                          accept={resource.type === 'pdf' ? 'application/pdf' : 
                                                 resource.type === 'image' ? 'image/*' : 
                                                 resource.type === 'video' ? 'video/*' :
                                                 resource.type === 'audio' ? 'audio/*' :
                                                 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
                                          onChange={(e) => handleResourceUpload(index, e.target.files?.[0] || null)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {(resource as any).file_data && (
                                          <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Fichier sélectionné: {(resource as any).file_data.name}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={addResource}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-600 hover:text-gray-700 flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Ajouter une ressource
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Files */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleSection('files')}
                          className="w-full px-3 sm:px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Upload className="w-4 h-4 text-orange-600" />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900">Fichiers média</h3>
                            <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                              Obligatoire
                            </span>
                          </div>
                          {expandedSections.files ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSections.files && (
                          <div className="px-4 sm:px-6 pb-6 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  <Film className="w-4 h-4 inline mr-2" />
                                  Vidéo
                                </label>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="video/*"
                                  onChange={handleVideoUpload}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {videoPreview && (
                                  <div className="mt-4 space-y-3">
                                    <video
                                      ref={videoRef}
                                      src={videoPreview}
                                      className="w-full h-32 rounded-lg object-cover bg-black shadow-lg"
                                      controls
                                    />
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <p className="text-sm text-blue-700 flex items-center gap-2">
                                        <Film className="w-4 h-4" />
                                        Durée: {videoDuration}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  <Image className="w-4 h-4 inline mr-2" />
                                  Miniature
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleThumbnailUpload}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {thumbnailPreview && (
                                  <div className="mt-4 space-y-3">
                                    <img
                                      src={thumbnailPreview}
                                      className="w-full h-32 rounded-lg object-cover shadow-lg"
                                      alt="Aperçu de la miniature"
                                    />
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                      <p className="text-sm text-green-700 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Miniature sélectionnée
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {videoPreview && (
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <button
                                  type="button"
                                  onClick={generateThumbnailsFromVideo}
                                  disabled={isGeneratingThumbnail}
                                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                                >
                                  {isGeneratingThumbnail ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                                      Génération des miniatures...
                                    </>
                                  ) : (
                                    <>
                                      <Target className="w-4 h-4" />
                                      Générer des miniatures depuis la vidéo
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            {generatedThumbnails.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700">Sélectionnez une miniature:</h4>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                  {generatedThumbnails.map((thumbnail, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => selectThumbnail(thumbnail)}
                                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                                        selectedThumbnail === thumbnail 
                                          ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                    >
                                      <img
                                        src={thumbnail}
                                        className="w-full h-16 object-cover"
                                        alt={`Miniature ${index + 1}`}
                                      />
                                      {selectedThumbnail === thumbnail && (
                                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                                          <CheckCircle className="w-3 h-3" />
                                        </div>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Settings */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleSection('settings')}
                          className="w-full px-3 sm:px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Settings className="w-4 h-4 text-gray-600" />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900">Paramètres de publication</h3>
                          </div>
                          {expandedSections.settings ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSections.settings && (
                          <div className="px-3 sm:px-4 pb-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Visibilité
                                </label>
                                <select
                                  value={formData.visibility}
                                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="private">🔒 Privé</option>
                                  <option value="public">🌍 Public</option>
                                  <option value="unlisted">👥 Non listé</option>
                                </select>
                              </div>

                              <div className="flex items-center justify-center">
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                                  <input
                                    type="checkbox"
                                    checked={formData.allow_comments}
                                    onChange={(e) => setFormData(prev => ({ ...prev, allow_comments: e.target.checked }))}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Autoriser les commentaires
                                  </span>
                                </label>
                              </div>

                              <div className="flex items-center justify-center">
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                                  <input
                                    type="checkbox"
                                    checked={formData.publish_immediately}
                                    onChange={(e) => setFormData(prev => ({ ...prev, publish_immediately: e.target.checked }))}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Publier immédiatement
                                  </span>
                                </label>
                              </div>
                            </div>

                            {formData.visibility === 'public' && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-blue-900 mb-1">
                                      🌍 Vidéo publique
                                    </p>
                                    <p className="text-sm text-blue-700">
                                      Cette vidéo sera visible par tous les utilisateurs sur les dashboards étudiants et dans la section "pépites de nos experts".
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => router.back()}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={handlePublishDirectly}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                        >
                          <Upload className="w-4 h-4" />
                          Publier directement
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.title || !formData.description || !formData.video_file}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg font-medium text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
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
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Notification Container */}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </>
  );
}
