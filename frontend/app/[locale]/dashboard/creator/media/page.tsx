"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Image,
  Video,
  Music,
  FileText,
  Upload,
  Download,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Settings,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
  Edit,
  Copy,
  Share2,
  Star,
  Clock,
  Calendar,
  Tag,
  FolderOpen,
  Film,
  Mic,
  File,
  Palette,
  Type,
  Layers,
} from "lucide-react";
import { useParams } from "next/navigation";

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
  size: number;
  dimensions?: { width: number; height: number };
  duration?: number;
  format: string;
  createdAt: string;
  tags: string[];
  isFavorite: boolean;
  category: string;
  metadata?: {
    bitrate?: number;
    fps?: number;
    codec?: string;
    colorSpace?: string;
    fileSize?: string;
  };
}

export default function MediaPage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'thumbnails' | 'banners' | 'backgrounds' | 'icons' | 'audio' | 'documents'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Simuler le chargement des médias
    const mockMedia: MediaItem[] = [
      // Images
      {
        id: 'img1',
        name: 'Thumbnail Tourisme Durable',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
        size: 256000,
        dimensions: { width: 1920, height: 1080 },
        format: 'JPEG',
        createdAt: '2024-03-01T10:30:00Z',
        tags: ['tourisme', 'durable', 'nature', 'montagne'],
        isFavorite: true,
        category: 'thumbnails',
        metadata: {
          colorSpace: 'RGB',
          fileSize: '256 KB',
        },
      },
      {
        id: 'img2',
        name: 'Bannière Marketing Digital',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=100&fit=crop',
        size: 512000,
        dimensions: { width: 1920, height: 600 },
        format: 'PNG',
        createdAt: '2024-02-15T14:20:00Z',
        tags: ['marketing', 'digital', 'business', 'technology'],
        isFavorite: false,
        category: 'banners',
        metadata: {
          colorSpace: 'RGB',
          fileSize: '512 KB',
        },
      },
      {
        id: 'img3',
        name: 'Background Hôtellerie',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
        size: 384000,
        dimensions: { width: 1920, height: 1080 },
        format: 'JPEG',
        createdAt: '2024-02-20T11:10:00Z',
        tags: ['hôtellerie', 'luxury', 'hotel', 'interior'],
        isFavorite: true,
        category: 'backgrounds',
        metadata: {
          colorSpace: 'RGB',
          fileSize: '384 KB',
        },
      },
      {
        id: 'img4',
        name: 'Icon Service Client',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=512&h=512&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop',
        size: 64000,
        dimensions: { width: 512, height: 512 },
        format: 'PNG',
        createdAt: '2024-01-25T09:45:00Z',
        tags: ['service', 'client', 'support', 'icon'],
        isFavorite: false,
        category: 'icons',
        metadata: {
          colorSpace: 'RGBA',
          fileSize: '64 KB',
        },
      },
      // Vidéos
      {
        id: 'vid1',
        name: 'Intro Tourisme Durable',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
        size: 1024000,
        dimensions: { width: 1280, height: 720 },
        duration: 30,
        format: 'MP4',
        createdAt: '2024-03-01T10:30:00Z',
        tags: ['intro', 'tourisme', 'durable', 'animation'],
        isFavorite: true,
        category: 'backgrounds',
        metadata: {
          bitrate: 2000,
          fps: 30,
          codec: 'H.264',
          fileSize: '1 MB',
        },
      },
      {
        id: 'vid2',
        name: 'Transition Marketing',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
        size: 2048000,
        dimensions: { width: 1280, height: 720 },
        duration: 15,
        format: 'MP4',
        createdAt: '2024-02-15T14:20:00Z',
        tags: ['transition', 'marketing', 'motion'],
        isFavorite: false,
        category: 'backgrounds',
        metadata: {
          bitrate: 3000,
          fps: 30,
          codec: 'H.264',
          fileSize: '2 MB',
        },
      },
      // Audio
      {
        id: 'aud1',
        name: 'Musique d\'intro Formation',
        type: 'audio',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        size: 2560000,
        duration: 180,
        format: 'MP3',
        createdAt: '2024-02-10T13:45:00Z',
        tags: ['musique', 'intro', 'formation', 'upbeat'],
        isFavorite: false,
        category: 'audio',
        metadata: {
          bitrate: 320,
          fileSize: '2.5 MB',
        },
      },
      {
        id: 'aud2',
        name: 'Effet sonore Transition',
        type: 'audio',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        size: 128000,
        duration: 5,
        format: 'MP3',
        createdAt: '2024-01-20T16:30:00Z',
        tags: ['effet', 'sonore', 'transition', 'swoosh'],
        isFavorite: false,
        category: 'audio',
        metadata: {
          bitrate: 192,
          fileSize: '128 KB',
        },
      },
      // Documents
      {
        id: 'doc1',
        name: 'Template Contrat Formation',
        type: 'document',
        url: '#',
        size: 512000,
        format: 'PDF',
        createdAt: '2024-01-20T11:10:00Z',
        tags: ['template', 'contrat', 'formation', 'légal'],
        isFavorite: false,
        category: 'documents',
        metadata: {
          fileSize: '512 KB',
        },
      },
      {
        id: 'doc2',
        name: 'Guide Style Brand',
        type: 'document',
        url: '#',
        size: 2048000,
        format: 'PDF',
        createdAt: '2024-02-01T14:20:00Z',
        tags: ['guide', 'style', 'brand', 'design'],
        isFavorite: true,
        category: 'documents',
        metadata: {
          fileSize: '2 MB',
        },
      },
    ];

    setTimeout(() => {
      setMediaItems(mockMedia);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedMedia = [...filteredMedia].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5 text-green-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'thumbnails':
        return <Image className="w-4 h-4" />;
      case 'banners':
        return <Layers className="w-4 h-4" />;
      case 'backgrounds':
        return <Palette className="w-4 h-4" />;
      case 'icons':
        return <Type className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      case 'documents':
        return <FileText className="w-4 h-4" />;
      default:
        return <FolderOpen className="w-4 h-4" />;
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMedia.map(item => item.id));
    }
  };

  const handleBulkAction = (action: 'delete' | 'favorite' | 'download' | 'share') => {
    if (action === 'delete' && selectedItems.length > 0) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedItems.length} média(s) ?`)) {
        setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      }
    } else {
      // Autres actions
      setSelectedItems([]);
    }
  };

  const handlePreview = (item: MediaItem) => {
    setPreviewItem(item);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const stats = {
    total: mediaItems.length,
    images: mediaItems.filter(item => item.type === 'image').length,
    videos: mediaItems.filter(item => item.type === 'video').length,
    audio: mediaItems.filter(item => item.type === 'audio').length,
    documents: mediaItems.filter(item => item.type === 'document').length,
    totalSize: mediaItems.reduce((sum, item) => sum + item.size, 0),
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Film className="w-8 h-8 text-purple-600" />
            Médias
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez votre bibliothèque de médias
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Importer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Film className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-sm text-gray-600">Total médias</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {formatFileSize(stats.totalSize)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Image className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.images}</h3>
              <p className="text-sm text-gray-600">Images</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.videos}</h3>
              <p className="text-sm text-gray-600">Vidéos</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Music className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.audio}</h3>
              <p className="text-sm text-gray-600">Audio</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.documents}</h3>
              <p className="text-sm text-gray-600">Documents</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des médias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Toutes les catégories</option>
              <option value="thumbnails">Miniatures</option>
              <option value="banners">Bannières</option>
              <option value="backgrounds">Arrière-plans</option>
              <option value="icons">Icônes</option>
              <option value="audio">Audio</option>
              <option value="documents">Documents</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="date">Date de création</option>
              <option value="name">Nom</option>
              <option value="size">Taille</option>
              <option value="type">Type</option>
            </select>
            
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
            <span className="text-sm font-medium text-purple-800">
              {selectedItems.length} média(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('favorite')}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
              >
                <Star className="w-4 h-4 inline mr-1" />
                Favoris
              </button>
              <button
                onClick={() => handleBulkAction('download')}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                <Download className="w-4 h-4 inline mr-1" />
                Télécharger
              </button>
              <button
                onClick={() => handleBulkAction('share')}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                <Share2 className="w-4 h-4 inline mr-1" />
                Partager
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          {/* Select All */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <input
              type="checkbox"
              checked={selectedItems.length === filteredMedia.length}
              onChange={handleSelectAll}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">
              Sélectionner tout ({filteredMedia.length})
            </span>
          </div>

          {/* Items Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedMedia.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="relative">
                    {/* Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handlePreview(item)}
                          className="p-1 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white"
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </button>
                        <button className="p-1 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white">
                          <MoreVertical className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Favorite */}
                    {item.isFavorite && (
                      <div className="absolute top-2 right-2 z-10">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                    
                    {/* Media Preview */}
                    <div className="aspect-video bg-gray-100">
                      {item.type === 'image' ? (
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : item.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : item.type === 'audio' ? (
                        <div className="w-full h-full flex items-center justify-center bg-purple-50">
                          <Music className="w-12 h-12 text-purple-600" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-red-50">
                          <FileText className="w-12 h-12 text-red-600" />
                        </div>
                      )}
                    </div>
                    
                    {/* Type Badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'image' ? 'bg-green-100 text-green-800' :
                        item.type === 'video' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'audio' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.type === 'image' ? 'Image' :
                         item.type === 'video' ? 'Vidéo' :
                         item.type === 'audio' ? 'Audio' : 'Document'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Item Info */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {item.dimensions && (
                        <span>{item.dimensions.width}×{item.dimensions.height}</span>
                      )}
                      {item.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(item.duration)}
                        </span>
                      )}
                      <span>{formatFileSize(item.size)}</span>
                    </div>
                    
                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedMedia.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  
                  {getMediaIcon(item.type)}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        {item.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                      {item.dimensions && (
                        <span>{item.dimensions.width}×{item.dimensions.height}</span>
                      )}
                      {item.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(item.duration)}
                        </span>
                      )}
                      <span>{formatFileSize(item.size)}</span>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePreview(item)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{previewItem.name}</h2>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center mb-4">
                {previewItem.type === 'image' ? (
                  <img
                    src={previewItem.url}
                    alt={previewItem.name}
                    className="max-w-full max-h-96 object-contain rounded-lg"
                  />
                ) : previewItem.type === 'video' ? (
                  <video
                    className="max-w-full max-h-96 rounded-lg"
                    controls
                    src={previewItem.url}
                  />
                ) : previewItem.type === 'audio' ? (
                  <audio
                    className="w-full"
                    controls
                    src={previewItem.url}
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Aperçu non disponible pour ce type de fichier</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">{previewItem.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Format:</span>
                  <span className="ml-2 font-medium">{previewItem.format}</span>
                </div>
                <div>
                  <span className="text-gray-600">Taille:</span>
                  <span className="ml-2 font-medium">{formatFileSize(previewItem.size)}</span>
                </div>
                {previewItem.dimensions && (
                  <div>
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="ml-2 font-medium">
                      {previewItem.dimensions.width}×{previewItem.dimensions.height}
                    </span>
                  </div>
                )}
                {previewItem.duration && (
                  <div>
                    <span className="text-gray-600">Durée:</span>
                    <span className="ml-2 font-medium">{formatDuration(previewItem.duration)}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Créé le:</span>
                  <span className="ml-2 font-medium">{formatDate(previewItem.createdAt)}</span>
                </div>
              </div>
              
              {previewItem.tags.length > 0 && (
                <div className="mt-4">
                  <span className="text-gray-600 text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
