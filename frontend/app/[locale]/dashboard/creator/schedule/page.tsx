"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Play,
  Pause,
  Video,
  Users,
  TrendingUp,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  Share2,
  Download,
  Repeat,
  Settings,
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
  Globe,
  Lock,
  Unlock,
} from "lucide-react";
import { useParams } from "next/navigation";

interface ScheduledContent {
  id: string;
  title: string;
  type: 'video' | 'live' | 'playlist' | 'announcement';
  video?: {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
  };
  scheduledAt: string;
  status: 'scheduled' | 'published' | 'cancelled' | 'processing';
  visibility: 'public' | 'private' | 'unlisted';
  platforms: string[];
  description?: string;
  tags: string[];
  estimatedViews: number;
  actualViews?: number;
  engagement?: number;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  notifications: {
    email: boolean;
    push: boolean;
    social: boolean;
  };
}

export default function SchedulePage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'published' | 'cancelled' | 'processing'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'live' | 'playlist' | 'announcement'>('all');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);

  useEffect(() => {
    // Simuler le chargement du contenu planifié
    const mockContent: ScheduledContent[] = [
      {
        id: '1',
        title: 'Webinaire : Tourisme Durable',
        type: 'live',
        video: {
          id: 'vid1',
          title: 'Tourisme Durable et Écotourisme',
          thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
          duration: 3600,
        },
        scheduledAt: '2024-03-20T14:00:00Z',
        status: 'scheduled',
        visibility: 'public',
        platforms: ['YouTube', 'Facebook', 'LinkedIn'],
        description: 'Webinaire interactif sur les pratiques de tourisme durable',
        tags: ['webinaire', 'tourisme', 'durable', 'live'],
        estimatedViews: 500,
        isRecurring: false,
        notifications: {
          email: true,
          push: true,
          social: true,
        },
      },
      {
        id: '2',
        title: 'Nouvelle vidéo : Marketing Digital Avancé',
        type: 'video',
        video: {
          id: 'vid2',
          title: 'Marketing Digital Touristique',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
          duration: 1800,
        },
        scheduledAt: '2024-03-18T10:00:00Z',
        status: 'scheduled',
        visibility: 'public',
        platforms: ['YouTube', 'Instagram'],
        description: 'Techniques avancées de marketing digital pour le secteur touristique',
        tags: ['marketing', 'digital', 'tourisme', 'avancé'],
        estimatedViews: 1200,
        isRecurring: false,
        notifications: {
          email: true,
          push: false,
          social: true,
        },
      },
      {
        id: '3',
        title: 'Série : Gestion Hôtelière',
        type: 'playlist',
        video: {
          id: 'vid3',
          title: 'Gestion Hôtelière Avancée',
          thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
          duration: 2400,
        },
        scheduledAt: '2024-03-22T15:30:00Z',
        status: 'scheduled',
        visibility: 'public',
        platforms: ['YouTube', 'TikTok'],
        description: 'Série de 5 épisodes sur la gestion hôtelière moderne',
        tags: ['série', 'hôtellerie', 'gestion', 'formation'],
        estimatedViews: 800,
        isRecurring: true,
        recurringPattern: 'weekly',
        notifications: {
          email: false,
          push: true,
          social: true,
        },
      },
      {
        id: '4',
        title: 'Annonce : Nouvelle formation disponible',
        type: 'announcement',
        scheduledAt: '2024-03-19T09:00:00Z',
        status: 'published',
        visibility: 'public',
        platforms: ['Facebook', 'Twitter', 'LinkedIn'],
        description: 'Annonce de la nouvelle formation sur le service client',
        tags: ['annonce', 'formation', 'service', 'client'],
        estimatedViews: 2000,
        actualViews: 2456,
        engagement: 8.5,
        isRecurring: false,
        notifications: {
          email: true,
          push: true,
          social: true,
        },
      },
      {
        id: '5',
        title: 'Live Q&R : Questions-Réponses',
        type: 'live',
        video: {
          id: 'vid4',
          title: 'Service Client Excellence',
          thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop',
          duration: 2700,
        },
        scheduledAt: '2024-03-25T18:00:00Z',
        status: 'cancelled',
        visibility: 'public',
        platforms: ['YouTube', 'Instagram'],
        description: 'Session live de questions-réponses sur le service client',
        tags: ['live', 'q&a', 'service', 'client'],
        estimatedViews: 300,
        isRecurring: false,
        notifications: {
          email: false,
          push: false,
          social: false,
        },
      },
      {
        id: '6',
        title: 'Mise à jour : Leadership',
        type: 'video',
        video: {
          id: 'vid5',
          title: 'Leadership Transformationnel',
          thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
          duration: 1500,
        },
        scheduledAt: '2024-03-17T12:00:00Z',
        status: 'processing',
        visibility: 'private',
        platforms: ['YouTube'],
        description: 'Mise à jour du contenu sur le leadership transformationnel',
        tags: ['leadership', 'transformationnel', 'mise à jour'],
        estimatedViews: 600,
        isRecurring: false,
        notifications: {
          email: true,
          push: false,
          social: false,
        },
      },
    ];

    setTimeout(() => {
      setScheduledContent(mockContent);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredContent = scheduledContent.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'live':
        return <Play className="w-5 h-5 text-red-600" />;
      case 'playlist':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'announcement':
        return <Bell className="w-5 h-5 text-yellow-600" />;
      default:
        return <Video className="w-5 h-5 text-gray-600" />;
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-600" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-600" />;
      case 'unlisted':
        return <Unlock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSelectContent = (contentId: string) => {
    setSelectedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContent.length === filteredContent.length) {
      setSelectedContent([]);
    } else {
      setSelectedContent(filteredContent.map(item => item.id));
    }
  };

  const handleBulkAction = (action: 'publish' | 'cancel' | 'reschedule' | 'delete') => {
    if (action === 'delete' && selectedContent.length > 0) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedContent.length} élément(s) planifié(s) ?`)) {
        setScheduledContent(prev => prev.filter(item => !selectedContent.includes(item.id)));
        setSelectedContent([]);
      }
    } else {
      // Autres actions
      setSelectedContent([]);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getContentForDate = (day: number) => {
    if (!day) return [];
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return filteredContent.filter(item => {
      const itemDate = new Date(item.scheduledAt);
      const itemDateStr = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
      return itemDateStr === dateStr;
    });
  };

  const stats = {
    total: scheduledContent.length,
    scheduled: scheduledContent.filter(item => item.status === 'scheduled').length,
    published: scheduledContent.filter(item => item.status === 'published').length,
    cancelled: scheduledContent.filter(item => item.status === 'cancelled').length,
    processing: scheduledContent.filter(item => item.status === 'processing').length,
    totalEstimatedViews: scheduledContent.reduce((sum, item) => sum + item.estimatedViews, 0),
    totalActualViews: scheduledContent.reduce((sum, item) => sum + (item.actualViews || 0), 0),
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
            <Calendar className="w-8 h-8 text-indigo-600" />
            Planification
          </h1>
          <p className="text-gray-600 mt-1">
            Planifiez et gérez votre contenu à publier
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendrier
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Liste
            </button>
          </div>
          
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Planifier
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
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-sm text-gray-600">Total planifié</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+12%</span>
            <span className="text-gray-500">ce mois</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.scheduled}</h3>
              <p className="text-sm text-gray-600">En attente</p>
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
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.published}</h3>
              <p className="text-sm text-gray-600">Publié</p>
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
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalActualViews.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">Vues totales</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Estimé: {stats.totalEstimatedViews.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher du contenu planifié..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Planifié</option>
              <option value="published">Publié</option>
              <option value="cancelled">Annulé</option>
              <option value="processing">En cours</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les types</option>
              <option value="video">Vidéo</option>
              <option value="live">Live</option>
              <option value="playlist">Playlist</option>
              <option value="announcement">Annonce</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedContent.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-indigo-50 rounded-lg">
            <span className="text-sm font-medium text-indigo-800">
              {selectedContent.length} élément(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Publier
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                <XCircle className="w-4 h-4 inline mr-1" />
                Annuler
              </button>
              <button
                onClick={() => handleBulkAction('reschedule')}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                <Clock className="w-4 h-4 inline mr-1" />
                Reprogrammer
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

      {/* Content Display */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getDaysInMonth(currentDate).map((day, index) => {
                const dayContent = day ? getContentForDate(day) : [];
                const isSelected = selectedDate && selectedDate.getDate() === day && 
                                  selectedDate.getMonth() === currentDate.getMonth() &&
                                  selectedDate.getFullYear() === currentDate.getFullYear();
                const isToday = new Date().getDate() === day && 
                                new Date().getMonth() === currentDate.getMonth() &&
                                new Date().getFullYear() === currentDate.getFullYear();
                
                return (
                  <div
                    key={index}
                    onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`min-h-[80px] border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 ${
                      isSelected ? 'bg-indigo-50 border-indigo-500' : ''
                    } ${isToday ? 'bg-blue-50' : ''} ${!day ? 'bg-gray-50' : ''}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayContent.slice(0, 2).map((content, contentIndex) => (
                            <div
                              key={contentIndex}
                              className={`text-xs p-1 rounded truncate ${
                                content.type === 'video' ? 'bg-blue-100 text-blue-800' :
                                content.type === 'live' ? 'bg-red-100 text-red-800' :
                                content.type === 'playlist' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {content.title}
                            </div>
                          ))}
                          {dayContent.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayContent.length - 2} plus
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6">
            {/* Select All */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <input
                type="checkbox"
                checked={selectedContent.length === filteredContent.length}
                onChange={handleSelectAll}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">
                Sélectionner tout ({filteredContent.length})
              </span>
            </div>

            {/* List View */}
            <div className="space-y-4">
              {filteredContent.map((content) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(content.id)}
                      onChange={() => handleSelectContent(content.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 mt-1"
                    />
                    
                    {getTypeIcon(content.type)}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{content.title}</h3>
                        <div className="flex items-center gap-2">
                          {getVisibilityIcon(content.visibility)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                            {getStatusIcon(content.status)}
                            <span className="ml-1">
                              {content.status === 'scheduled' ? 'Planifié' :
                               content.status === 'published' ? 'Publié' :
                               content.status === 'cancelled' ? 'Annulé' : 'En cours'}
                            </span>
                          </span>
                        </div>
                      </div>
                      
                      {content.description && (
                        <p className="text-gray-600 mb-3">{content.description}</p>
                      )}
                      
                      {content.video && (
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-3">
                          <img
                            src={content.video.thumbnail}
                            alt={content.video.title}
                            className="w-16 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{content.video.title}</p>
                            <p className="text-xs text-gray-600">
                              Durée: {formatDuration(content.video.duration)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDateTime(content.scheduledAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Estimé: {content.estimatedViews.toLocaleString()}
                          </span>
                          {content.actualViews && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              Réel: {content.actualViews.toLocaleString()}
                            </span>
                          )}
                          {content.isRecurring && (
                            <span className="flex items-center gap-1">
                              <Repeat className="w-4 h-4" />
                              {content.recurringPattern === 'daily' ? 'Quotidien' :
                               content.recurringPattern === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {content.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
