"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FolderOpen,
  FileText,
  Video,
  Image,
  Music,
  Download,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Folder,
  MoreVertical,
  Eye,
  Calendar,
  File,
  Trash2,
  Edit,
  Copy,
  Move,
  Share2,
  Star,
  Clock,
  HardDrive,
  Archive,
  Tag,
} from "lucide-react";
import { useParams } from "next/navigation";

interface LibraryItem {
  id: string;
  name: string;
  type: 'folder' | 'video' | 'image' | 'audio' | 'document';
  size?: number;
  thumbnail?: string;
  duration?: number;
  createdAt: string;
  modifiedAt: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  parentFolder?: string;
  path: string;
  metadata?: {
    resolution?: string;
    format?: string;
    codec?: string;
    bitrate?: number;
    pages?: number;
    size?: string;
    duration?: number;
  };
}

export default function LibraryPage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'image' | 'audio' | 'document' | 'folder'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    // Simuler le chargement des éléments de la bibliothèque
    const mockItems: LibraryItem[] = [
      // Dossiers
      {
        id: 'folder1',
        name: 'Vidéos de formation',
        type: 'folder',
        createdAt: '2024-01-15T10:30:00Z',
        modifiedAt: '2024-03-14T15:20:00Z',
        tags: ['formation', 'vidéos'],
        isFavorite: true,
        isArchived: false,
        path: '/Vidéos de formation',
      },
      {
        id: 'folder2',
        name: 'Miniatures',
        type: 'folder',
        createdAt: '2024-02-01T14:20:00Z',
        modifiedAt: '2024-03-13T09:45:00Z',
        tags: ['images', 'miniatures'],
        isFavorite: false,
        isArchived: false,
        path: '/Miniatures',
      },
      {
        id: 'folder3',
        name: 'Documents',
        type: 'folder',
        createdAt: '2024-01-20T11:10:00Z',
        modifiedAt: '2024-03-12T16:30:00Z',
        tags: ['pdf', 'documents'],
        isFavorite: false,
        isArchived: false,
        path: '/Documents',
      },
      {
        id: 'folder4',
        name: 'Audio',
        type: 'folder',
        createdAt: '2024-02-10T13:45:00Z',
        modifiedAt: '2024-03-11T14:15:00Z',
        tags: ['musique', 'podcast'],
        isFavorite: false,
        isArchived: false,
        path: '/Audio',
      },
      // Vidéos
      {
        id: 'video1',
        name: 'Tourisme Durable - Épisode 1',
        type: 'video',
        size: 1024000000, // 1GB
        thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
        duration: 1800, // 30 minutes
        createdAt: '2024-03-01T10:30:00Z',
        modifiedAt: '2024-03-14T15:20:00Z',
        tags: ['tourisme', 'durable', 'formation'],
        isFavorite: true,
        isArchived: false,
        parentFolder: 'folder1',
        path: '/Vidéos de formation/Tourisme Durable - Épisode 1',
        metadata: {
          resolution: '1920x1080',
          format: 'MP4',
          codec: 'H.264',
          bitrate: 5000,
        },
      },
      {
        id: 'video2',
        name: 'Marketing Digital - Introduction',
        type: 'video',
        size: 856000000, // 856MB
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
        duration: 1200, // 20 minutes
        createdAt: '2024-02-15T14:20:00Z',
        modifiedAt: '2024-03-13T09:45:00Z',
        tags: ['marketing', 'digital', 'intro'],
        isFavorite: false,
        isArchived: false,
        parentFolder: 'folder1',
        path: '/Vidéos de formation/Marketing Digital - Introduction',
        metadata: {
          resolution: '1920x1080',
          format: 'MP4',
          codec: 'H.264',
          bitrate: 4500,
        },
      },
      {
        id: 'video3',
        name: 'Gestion Hôtelière - Module 3',
        type: 'video',
        size: 1234000000, // 1.2GB
        thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
        duration: 2400, // 40 minutes
        createdAt: '2024-02-20T11:10:00Z',
        modifiedAt: '2024-03-12T16:30:00Z',
        tags: ['hôtellerie', 'gestion', 'module3'],
        isFavorite: true,
        isArchived: false,
        parentFolder: 'folder1',
        path: '/Vidéos de formation/Gestion Hôtelière - Module 3',
        metadata: {
          resolution: '1920x1080',
          format: 'MP4',
          codec: 'H.264',
          bitrate: 6000,
        },
      },
      // Images
      {
        id: 'img1',
        name: 'Thumbnail Tourisme',
        type: 'image',
        size: 256000, // 256KB
        thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
        createdAt: '2024-03-01T10:30:00Z',
        modifiedAt: '2024-03-14T15:20:00Z',
        tags: ['miniature', 'tourisme'],
        isFavorite: false,
        isArchived: false,
        parentFolder: 'folder2',
        path: '/Miniatures/Thumbnail Tourisme',
        metadata: {
          resolution: '1920x1080',
          format: 'JPEG',
        },
      },
      {
        id: 'img2',
        name: 'Bannière Marketing',
        type: 'image',
        size: 512000, // 512KB
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
        createdAt: '2024-02-15T14:20:00Z',
        modifiedAt: '2024-03-13T09:45:00Z',
        tags: ['bannière', 'marketing'],
        isFavorite: false,
        isArchived: false,
        parentFolder: 'folder2',
        path: '/Miniatures/Bannière Marketing',
        metadata: {
          resolution: '1920x1080',
          format: 'PNG',
        },
      },
      // Documents
      {
        id: 'doc1',
        name: 'Guide Touristique 2024',
        type: 'document',
        size: 2048000, // 2MB
        createdAt: '2024-01-20T11:10:00Z',
        modifiedAt: '2024-03-12T16:30:00Z',
        tags: ['guide', 'tourisme', '2024'],
        isFavorite: false,
        isArchived: false,
        parentFolder: 'folder3',
        path: '/Documents/Guide Touristique 2024',
        metadata: {
          format: 'PDF',
          pages: 45,
        },
      },
      {
        id: 'doc2',
        name: 'Contrat de service',
        type: 'document',
        size: 512000, // 512KB
        createdAt: '2024-02-10T13:45:00Z',
        modifiedAt: '2024-03-11T14:15:00Z',
        tags: ['contrat', 'service', 'légal'],
        isFavorite: false,
        isArchived: false,
        parentFolder: 'folder3',
        path: '/Documents/Contrat de service',
        metadata: {
          format: 'PDF',
          pages: 12,
        },
      },
      // Audio
      {
        id: 'audio1',
        name: 'Podcast Tourisme - Épisode 1',
        type: 'audio',
        size: 25600000, // 25MB
        createdAt: '2024-02-10T13:45:00Z',
        modifiedAt: '2024-03-11T14:15:00Z',
        tags: ['podcast', 'tourisme', 'audio'],
        isFavorite: false,
        isArchived: false,
        parentFolder: 'folder4',
        path: '/Audio/Podcast Tourisme - Épisode 1',
        metadata: {
          format: 'MP3',
          bitrate: 320,
          duration: 1800,
        },
      },
    ];

    setTimeout(() => {
      setItems(mockItems);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
      case 'size':
        return (b.size || 0) - (a.size || 0);
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
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

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-5 h-5 text-yellow-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
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
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleBulkAction = (action: 'delete' | 'archive' | 'favorite' | 'move') => {
    if (action === 'delete' && selectedItems.length > 0) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedItems.length} élément(s) ?`)) {
        setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      }
    } else {
      // Autres actions
      setSelectedItems([]);
    }
  };

  const stats = {
    total: items.length,
    folders: items.filter(item => item.type === 'folder').length,
    videos: items.filter(item => item.type === 'video').length,
    images: items.filter(item => item.type === 'image').length,
    documents: items.filter(item => item.type === 'document').length,
    audio: items.filter(item => item.type === 'audio').length,
    totalSize: items.reduce((sum, item) => sum + (item.size || 0), 0),
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
            <FolderOpen className="w-8 h-8 text-yellow-600" />
            Bibliothèque
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez tous vos fichiers multimédias
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau dossier
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <HardDrive className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-sm text-gray-600">Éléments totaux</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Stockage utilisé:</span>
            <span className="text-sm font-medium text-gray-900">{formatFileSize(stats.totalSize)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Folder className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.folders}</h3>
              <p className="text-sm text-gray-600">Dossiers</p>
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
            <div className="p-3 bg-green-50 rounded-xl">
              <Image className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.images}</h3>
              <p className="text-sm text-gray-600">Images</p>
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
              placeholder="Rechercher des fichiers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="folder">Dossiers</option>
              <option value="video">Vidéos</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="audio">Audio</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Date de modification</option>
              <option value="name">Nom</option>
              <option value="size">Taille</option>
              <option value="type">Type</option>
            </select>
            
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              {selectedItems.length} élément(s) sélectionné(s)
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
                onClick={() => handleBulkAction('archive')}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
              >
                <Archive className="w-4 h-4 inline mr-1" />
                Archiver
              </button>
              <button
                onClick={() => handleBulkAction('move')}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                <Move className="w-4 h-4 inline mr-1" />
                Déplacer
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

      {/* Items Grid/List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          {/* Select All */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <input
              type="checkbox"
              checked={selectedItems.length === filteredItems.length}
              onChange={handleSelectAll}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Sélectionner tout ({filteredItems.length})
            </span>
          </div>

          {/* Items Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded text-blue-600 focus:ring-blue-500 mt-1"
                    />
                    
                    <div className="flex-1">
                      {/* Thumbnail/Icon */}
                      <div className="mb-3">
                        {item.type === 'folder' ? (
                          <div className="w-full h-32 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Folder className="w-12 h-12 text-yellow-600" />
                          </div>
                        ) : item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getItemIcon(item.type)}
                          </div>
                        )}
                      </div>
                      
                      {/* Item Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                          {item.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {item.type === 'video' && item.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(item.duration)}
                            </span>
                          )}
                          {item.size && (
                            <span>{formatFileSize(item.size)}</span>
                          )}
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
                        
                        {/* Metadata */}
                        {item.metadata && (
                          <div className="text-xs text-gray-500">
                            {item.metadata.resolution && <span>{item.metadata.resolution}</span>}
                            {item.metadata.format && <span> • {item.metadata.format}</span>}
                            {item.metadata.codec && <span> • {item.metadata.codec}</span>}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Modifié: {formatDate(item.modifiedAt)}</span>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedItems.map((item) => (
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
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  
                  {getItemIcon(item.type)}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        {item.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        <span className="text-xs text-gray-500">{formatDate(item.modifiedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                      {item.type === 'video' && item.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(item.duration)}
                        </span>
                      )}
                      {item.size && <span>{formatFileSize(item.size)}</span>}
                      {item.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {item.tags.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
