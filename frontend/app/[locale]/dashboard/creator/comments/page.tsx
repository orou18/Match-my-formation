"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Ban,
  Shield,
  Eye,
  EyeOff,
  Pin,
  Bookmark,
} from "lucide-react";
import { useParams } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
    isSubscribed: boolean;
  };
  video: {
    id: string;
    title: string;
    thumbnail: string;
  };
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: number;
  status: 'published' | 'pending' | 'hidden' | 'reported';
  isPinned: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  moderationFlags?: number;
}

export default function CommentsPage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending' | 'hidden' | 'reported'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simuler le chargement des commentaires
    const mockComments: Comment[] = [
      {
        id: '1',
        content: 'Excellent contenu ! Vraiment utile pour mon projet de tourisme durable. Les explications sont claires et bien structurées.',
        author: {
          name: 'Alice Martin',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
          isVerified: true,
          isSubscribed: true,
        },
        video: {
          id: '1',
          title: 'Tourisme Durable et Écotourisme',
          thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=80&h=60&fit=crop',
        },
        timestamp: '2024-03-14T10:30:00Z',
        likes: 45,
        dislikes: 2,
        replies: 3,
        status: 'published',
        isPinned: true,
        sentiment: 'positive',
      },
      {
        id: '2',
        content: 'Super vidéo ! J\'ai appris beaucoup de choses sur le marketing digital dans le tourisme. Merci pour le partage !',
        author: {
          name: 'Bob Dubois',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          isVerified: false,
          isSubscribed: false,
        },
        video: {
          id: '2',
          title: 'Marketing Digital Touristique',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=60&fit=crop',
        },
        timestamp: '2024-03-14T09:15:00Z',
        likes: 23,
        dislikes: 1,
        replies: 1,
        status: 'published',
        isPinned: false,
        sentiment: 'positive',
      },
      {
        id: '3',
        content: 'Le contenu est intéressant mais je pense qu\'il manque quelques exemples pratiques concrets.',
        author: {
          name: 'Claire Rousseau',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          isVerified: true,
          isSubscribed: true,
        },
        video: {
          id: '3',
          title: 'Gestion Hôtelière Avancée',
          thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=60&fit=crop',
        },
        timestamp: '2024-03-14T08:45:00Z',
        likes: 12,
        dislikes: 5,
        replies: 2,
        status: 'published',
        isPinned: false,
        sentiment: 'neutral',
      },
      {
        id: '4',
        content: 'Ce contenu est inutile et ne m\'a rien appris. Je demande un remboursement.',
        author: {
          name: 'David Bernard',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
          isVerified: false,
          isSubscribed: false,
        },
        video: {
          id: '4',
          title: 'Service Client Excellence',
          thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=80&h=60&fit=crop',
        },
        timestamp: '2024-03-13T18:20:00Z',
        likes: 2,
        dislikes: 15,
        replies: 0,
        status: 'reported',
        isPinned: false,
        sentiment: 'negative',
        moderationFlags: 3,
      },
      {
        id: '5',
        content: 'Merci pour cette vidéo ! Les techniques de service client présentées sont vraiment applicables.',
        author: {
          name: 'Emma Petit',
          avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face',
          isVerified: false,
          isSubscribed: true,
        },
        video: {
          id: '5',
          title: 'Leadership Transformationnel',
          thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=60&fit=crop',
        },
        timestamp: '2024-03-13T14:10:00Z',
        likes: 18,
        dislikes: 0,
        replies: 1,
        status: 'pending',
        isPinned: false,
        sentiment: 'positive',
      },
    ];

    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.video.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    const matchesSentiment = sentimentFilter === 'all' || comment.sentiment === sentimentFilter;
    
    return matchesSearch && matchesStatus && matchesSentiment;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(hours / 24);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'hidden':
        return 'bg-gray-100 text-gray-800';
      case 'reported':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'hidden':
        return <EyeOff className="w-4 h-4" />;
      case 'reported':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSelectComment = (commentId: string) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map(c => c.id));
    }
  };

  const handleBulkAction = (action: 'approve' | 'hide' | 'delete' | 'pin') => {
    if (action === 'delete' && selectedComments.length > 0) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedComments.length} commentaire(s) ?`)) {
        setComments(prev => prev.filter(c => !selectedComments.includes(c.id)));
        setSelectedComments([]);
      }
    } else {
      // Autres actions de modération
      setSelectedComments([]);
    }
  };

  const handleCommentAction = (commentId: string, action: 'like' | 'dislike' | 'reply' | 'report' | 'hide' | 'pin') => {
    // Logique pour les actions individuelles sur les commentaires
    console.log(`Action ${action} on comment ${commentId}`);
  };

  const stats = {
    total: comments.length,
    published: comments.filter(c => c.status === 'published').length,
    pending: comments.filter(c => c.status === 'pending').length,
    reported: comments.filter(c => c.status === 'reported').length,
    positive: comments.filter(c => c.sentiment === 'positive').length,
    negative: comments.filter(c => c.sentiment === 'negative').length,
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
            <MessageSquare className="w-8 h-8 text-blue-600" />
            Commentaires
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez et modérez les commentaires de vos vidéos
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statuts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Publiés</span>
              <span className="text-sm font-bold text-green-600">{stats.published}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En attente</span>
              <span className="text-sm font-bold text-yellow-600">{stats.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Signalés</span>
              <span className="text-sm font-bold text-red-600">{stats.reported}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Positif</span>
              <span className="text-sm font-bold text-green-600">{stats.positive}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Neutre</span>
              <span className="text-sm font-bold text-gray-600">{stats.total - stats.positive - stats.negative}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Négatif</span>
              <span className="text-sm font-bold text-red-600">{stats.negative}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
              Approuver tout ({stats.pending})
            </button>
            <button className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
              Modérer signalés ({stats.reported})
            </button>
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
              placeholder="Rechercher un commentaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="pending">En attente</option>
              <option value="hidden">Masqués</option>
              <option value="reported">Signalés</option>
            </select>
            
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les sentiments</option>
              <option value="positive">Positif</option>
              <option value="neutral">Neutre</option>
              <option value="negative">Négatif</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedComments.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              {selectedComments.length} commentaire(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Approuver
              </button>
              <button
                onClick={() => handleBulkAction('hide')}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
              >
                Masquer
              </button>
              <button
                onClick={() => handleBulkAction('pin')}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
              >
                Épingler
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          {/* Select All */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <input
              type="checkbox"
              checked={selectedComments.length === filteredComments.length}
              onChange={handleSelectAll}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Sélectionner tout ({filteredComments.length})
            </span>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-xl p-4 ${
                  comment.status === 'reported' ? 'border-red-200 bg-red-50' :
                  comment.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleSelectComment(comment.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 mt-1"
                  />

                  {/* Author Avatar */}
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full"
                  />

                  {/* Comment Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.author.name}</span>
                      {comment.author.isVerified && (
                        <Shield className="w-4 h-4 text-blue-600" title="Vérifié" />
                      )}
                      {comment.author.isSubscribed && (
                        <Bookmark className="w-4 h-4 text-purple-600" title="Abonné" />
                      )}
                      {comment.isPinned && (
                        <Pin className="w-4 h-4 text-yellow-600" title="Épinglé" />
                      )}
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.timestamp)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(comment.status)}`}>
                        {getStatusIcon(comment.status)}
                        <span className="ml-1">
                          {comment.status === 'published' ? 'Publié' :
                           comment.status === 'pending' ? 'En attente' :
                           comment.status === 'hidden' ? 'Masqué' : 'Signalé'}
                        </span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${getSentimentColor(comment.sentiment)}`}>
                        {comment.sentiment === 'positive' ? '😊' :
                         comment.sentiment === 'negative' ? '😞' : '😐'}
                      </span>
                    </div>

                    {/* Comment Text */}
                    <p className="text-gray-900 mb-3">{comment.content}</p>

                    {/* Video Reference */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mb-3">
                      <img
                        src={comment.video.thumbnail}
                        alt={comment.video.title}
                        className="w-12 h-8 rounded object-cover"
                      />
                      <span className="text-sm text-gray-600">Sur: {comment.video.title}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleCommentAction(comment.id, 'like')}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {comment.likes}
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'dislike')}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        {comment.dislikes}
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'reply')}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Reply className="w-4 h-4" />
                        Répondre ({comment.replies})
                      </button>
                      
                      <div className="flex-1"></div>
                      
                      {/* Moderation Actions */}
                      <button
                        onClick={() => handleCommentAction(comment.id, 'report')}
                        className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Moderation Flags */}
                    {comment.moderationFlags && comment.moderationFlags > 0 && (
                      <div className="mt-2 p-2 bg-red-100 rounded-lg">
                        <p className="text-sm text-red-800">
                          ⚠️ Signalé {comment.moderationFlags} fois
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon manquant
const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
