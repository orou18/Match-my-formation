"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Video,
  Music,
  FileText,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Clock,
  Calendar,
  Tag,
  MoreHorizontal,
  Copy,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Heart,
  Share2,
  Camera,
  Film,
  Mic,
  File,
  FolderOpen,
  X,
  Check
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  thumbnail?: string;
  size: string;
  duration?: string;
  dimensions?: string;
  format: string;
  createdAt: string;
  tags: string[];
  description?: string;
  isFavorite: boolean;
  metadata: {
    resolution?: string;
    bitrate?: string;
    fps?: string;
    codec?: string;
  };
}

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const mediaItems: MediaItem[] = [
    {
      id: "1",
      name: "Thumbnail Hôtellerie",
      type: "image",
      url: "/images/hotellerie-thumb.jpg",
      size: "2.4 MB",
      dimensions: "1920x1080",
      format: "JPEG",
      createdAt: "2024-06-08",
      tags: ["thumbnail", "hôtellerie", "premium"],
      description: "Miniature pour la vidéo sur l'hôtellerie",
      isFavorite: true,
      metadata: {
        resolution: "1920x1080",
        bitrate: "8.2 Mbps"
      }
    },
    {
      id: "2",
      name: "Introduction Tourisme Durable",
      type: "video",
      url: "/videos/intro-tourisme.mp4",
      thumbnail: "/videos/video1-thumb.jpg",
      size: "245 MB",
      duration: "12:34",
      dimensions: "1920x1080",
      format: "MP4",
      createdAt: "2024-06-10",
      tags: ["tourisme", "durable", "intro"],
      description: "Vidéo d'introduction au tourisme durable",
      isFavorite: true,
      metadata: {
        resolution: "1920x1080",
        bitrate: "4.5 Mbps",
        fps: "30",
        codec: "H.264"
      }
    },
    {
      id: "3",
      name: "Musique d'Ambiance",
      type: "audio",
      url: "/audio/ambiance.mp3",
      size: "4.8 MB",
      duration: "3:45",
      format: "MP3",
      createdAt: "2024-05-15",
      tags: ["musique", "ambiance", "background"],
      description: "Musique d'ambiance pour les vidéos",
      isFavorite: false,
      metadata: {
        bitrate: "320 kbps",
        codec: "MP3"
      }
    },
    {
      id: "4",
      name: "Guide Marketing PDF",
      type: "document",
      url: "/documents/guide-marketing.pdf",
      size: "1.2 MB",
      format: "PDF",
      createdAt: "2024-06-01",
      tags: ["guide", "marketing", "pdf"],
      description: "Guide complet sur le marketing digital",
      isFavorite: false,
      metadata: {}
    },
    {
      id: "5",
      name: "Bannière Promotion",
      type: "image",
      url: "/images/banner-promo.jpg",
      size: "856 KB",
      dimensions: "1200x400",
      format: "PNG",
      createdAt: "2024-06-12",
      tags: ["bannière", "promotion", "marketing"],
      description: "Bannière pour la promotion des formations",
      isFavorite: false,
      metadata: {
        resolution: "1200x400",
        bitrate: "2.1 Mbps"
      }
    },
    {
      id: "6",
      name: "Témoignage Client",
      type: "video",
      url: "/videos/temoignage.mp4",
      thumbnail: "/videos/temoignage-thumb.jpg",
      size: "156 MB",
      duration: "8:22",
      dimensions: "1920x1080",
      format: "MP4",
      createdAt: "2024-06-05",
      tags: ["témoignage", "client", "avis"],
      description: "Témoignage d'un client satisfait",
      isFavorite: true,
      metadata: {
        resolution: "1920x1080",
        bitrate: "3.8 Mbps",
        fps: "30",
        codec: "H.264"
      }
    },
    {
      id: "7",
      name: "Logo Formation",
      type: "image",
      url: "/images/logo-formation.png",
      size: "245 KB",
      dimensions: "512x512",
      format: "PNG",
      createdAt: "2024-05-20",
      tags: ["logo", "formation", "branding"],
      description: "Logo pour les formations",
      isFavorite: false,
      metadata: {
        resolution: "512x512",
        bitrate: "1.2 Mbps"
      }
    },
    {
      id: "8",
      name: "Podcast Tourisme",
      type: "audio",
      url: "/audio/podcast-tourisme.mp3",
      size: "12.3 MB",
      duration: "25:30",
      format: "MP3",
      createdAt: "2024-06-14",
      tags: ["podcast", "tourisme", "audio"],
      description: "Podcast sur les tendances du tourisme",
      isFavorite: false,
      metadata: {
        bitrate: "320 kbps",
        codec: "MP3"
      }
    }
  ];

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === "all" || item.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "size":
        return parseFloat(b.size) - parseFloat(a.size);
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "document":
        return FileText;
      default:
        return File;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case "image":
        return "from-green-500 to-teal-500";
      case "video":
        return "from-red-500 to-pink-500";
      case "audio":
        return "from-purple-500 to-indigo-500";
      case "document":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleFavorite = (itemId: string) => {
    console.log(`Toggle favorite for item ${itemId}`);
  };

  const openPreview = (item: MediaItem) => {
    setPreviewItem(item);
    setIsPlaying(false);
  };

  const closePreview = () => {
    setPreviewItem(null);
    setIsPlaying(false);
  };

  const stats = {
    total: mediaItems.length,
    images: mediaItems.filter(item => item.type === "image").length,
    videos: mediaItems.filter(item => item.type === "video").length,
    audio: mediaItems.filter(item => item.type === "audio").length,
    documents: mediaItems.filter(item => item.type === "document").length,
    favorites: mediaItems.filter(item => item.isFavorite).length,
    totalSize: "380 MB"
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Médias</h1>
            <p className="text-gray-600">Gérez votre bibliothèque multimédia</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher des médias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <File className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.total}</span>
          <p className="text-xs text-gray-600">Total</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Image className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.images}</span>
          <p className="text-xs text-gray-600">Images</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.videos}</span>
          <p className="text-xs text-gray-600">Vidéos</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.audio}</span>
          <p className="text-xs text-gray-600">Audio</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.documents}</span>
          <p className="text-xs text-gray-600">Docs</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">{stats.favorites}</span>
          <p className="text-xs text-gray-600">Favoris</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="date">Date</option>
              <option value="name">Nom</option>
              <option value="size">Taille</option>
              <option value="type">Type</option>
            </select>

            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Organiser
            </button>
          </div>
        </div>
      </motion.div>

      {/* Media Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedItems.map((item, index) => {
              const ItemIcon = getItemIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => openPreview(item)}
                >
                  <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleItemSelection(item.id);
                      }}
                      className="absolute top-2 left-2 z-10 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="absolute top-2 right-2 z-10 p-1 bg-white/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className={`w-4 h-4 ${item.isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                    </button>

                    {item.type === "image" ? (
                      <img 
                        src={item.url} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : item.type === "video" && item.thumbnail ? (
                      <div className="relative">
                        <img 
                          src={item.thumbnail} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {item.duration}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className={`w-16 h-16 bg-gradient-to-br ${getItemColor(item.type)} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <ItemIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <h3 className="font-medium text-gray-900 text-sm truncate" title={item.name}>
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{item.size}</span>
                      <span className="text-xs text-gray-500">{item.format}</span>
                    </div>
                    {item.dimensions && (
                      <span className="text-xs text-gray-500">{item.dimensions}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedItems.map((item, index) => {
              const ItemIcon = getItemIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />

                  <div 
                    className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                    onClick={() => openPreview(item)}
                  >
                    {item.type === "image" ? (
                      <img 
                        src={item.url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : item.type === "video" && item.thumbnail ? (
                      <div className="relative">
                        <img 
                          src={item.thumbnail} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getItemColor(item.type)} rounded-xl flex items-center justify-center`}>
                          <ItemIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      {item.isFavorite && (
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <ItemIcon className="w-3 h-3" />
                        {item.type}
                      </span>
                      <span>{item.size}</span>
                      <span>{item.format}</span>
                      {item.dimensions && <span>{item.dimensions}</span>}
                      {item.duration && <span>{item.duration}</span>}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1 truncate">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun média trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterType !== "all"
                ? "Essayez de modifier vos filtres de recherche"
                : "Commencez par uploader vos premiers médias"}
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto">
              <Upload className="w-5 h-5" />
              Upload des médias
            </button>
          </div>
        )}
      </motion.div>

      {/* Preview Modal */}
      {previewItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{previewItem.name}</h3>
              <button
                onClick={closePreview}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Preview Area */}
                <div className="flex-1">
                  {previewItem.type === "image" ? (
                    <img 
                      src={previewItem.url} 
                      alt={previewItem.name}
                      className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                    />
                  ) : previewItem.type === "video" ? (
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        className="w-full h-auto max-h-[60vh]"
                        controls
                        src={previewItem.url}
                      />
                    </div>
                  ) : previewItem.type === "audio" ? (
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-8 text-white text-center">
                      <Music className="w-16 h-16 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2">{previewItem.name}</h4>
                      <audio controls className="w-full mt-4" src={previewItem.url} />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-8 text-white text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2">{previewItem.name}</h4>
                      <p className="mb-4">{previewItem.description}</p>
                      <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Download className="w-4 h-4 inline mr-2" />
                        Télécharger
                      </button>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="lg:w-80">
                  <h4 className="font-semibold text-gray-900 mb-4">Informations</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Type</label>
                      <p className="font-medium text-gray-900 capitalize">{previewItem.type}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Format</label>
                      <p className="font-medium text-gray-900">{previewItem.format}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Taille</label>
                      <p className="font-medium text-gray-900">{previewItem.size}</p>
                    </div>
                    {previewItem.dimensions && (
                      <div>
                        <label className="text-sm text-gray-600">Dimensions</label>
                        <p className="font-medium text-gray-900">{previewItem.dimensions}</p>
                      </div>
                    )}
                    {previewItem.duration && (
                      <div>
                        <label className="text-sm text-gray-600">Durée</label>
                        <p className="font-medium text-gray-900">{previewItem.duration}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-600">Date de création</label>
                      <p className="font-medium text-gray-900">{previewItem.createdAt}</p>
                    </div>
                    {previewItem.tags.length > 0 && (
                      <div>
                        <label className="text-sm text-gray-600">Tags</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewItem.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      <Download className="w-4 h-4 inline mr-2" />
                      Télécharger
                    </button>
                    <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <Share2 className="w-4 h-4 inline mr-2" />
                      Partager
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
