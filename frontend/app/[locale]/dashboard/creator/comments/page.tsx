"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Reply,
  Heart,
  Flag,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Video,
  ThumbsUp,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Ban,
  Star,
  TrendingUp,
  Eye,
} from "lucide-react";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    subscribers?: number;
  };
  content: string;
  video: {
    title: string;
    thumbnail: string;
    id: string;
  };
  timestamp: string;
  likes: number;
  replies: number;
  status: "published" | "pending" | "spam" | "deleted";
  sentiment: "positive" | "neutral" | "negative";
  isPinned?: boolean;
}

export default function CommentsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);

  const comments: Comment[] = [
    {
      id: "1",
      user: {
        name: "Marie Dubois",
        avatar: "/avatars/user1.jpg",
        subscribers: 1250,
      },
      content:
        "Excellent contenu ! J'ai beaucoup appris sur les pratiques durables en tourisme. Pourriez-vous faire un suivi sur les certifications écologiques ?",
      video: {
        title: "Introduction au Tourisme Durable",
        thumbnail: "/videos/video1-thumb.jpg",
        id: "1",
      },
      timestamp: "Il y a 2 heures",
      likes: 24,
      replies: 3,
      status: "published",
      sentiment: "positive",
      isPinned: true,
    },
    {
      id: "2",
      user: {
        name: "Jean Martin",
        avatar: "/avatars/user2.jpg",
        subscribers: 850,
      },
      content:
        "Les explications sont claires mais j'aimerais voir plus d'exemples concrets de mise en œuvre dans des hôtels réels.",
      video: {
        title: "Gestion Hôtelière Avancée",
        thumbnail: "/videos/video2-thumb.jpg",
        id: "2",
      },
      timestamp: "Il y a 4 heures",
      likes: 12,
      replies: 1,
      status: "published",
      sentiment: "neutral",
    },
    {
      id: "3",
      user: {
        name: "Sophie Laurent",
        avatar: "/avatars/user3.jpg",
        subscribers: 2100,
      },
      content:
        "Merci beaucoup ! Ces conseils m'ont permis d'améliorer mon service client de 40%. Mon taux de satisfaction est passé de 3.2 à 4.8 étoiles !",
      video: {
        title: "Service Client d'Excellence",
        thumbnail: "/videos/video3-thumb.jpg",
        id: "3",
      },
      timestamp: "Il y a 6 heures",
      likes: 48,
      replies: 5,
      status: "published",
      sentiment: "positive",
    },
    {
      id: "4",
      user: {
        name: "Pierre Bernard",
        avatar: "/avatars/user4.jpg",
        subscribers: 320,
      },
      content:
        "Le son est un peu faible dans cette vidéo, serait-il possible d'améliorer l'audio pour les prochaines vidéos ?",
      video: {
        title: "Marketing Digital pour le Tourisme",
        thumbnail: "/videos/video4-thumb.jpg",
        id: "4",
      },
      timestamp: "Il y a 8 heures",
      likes: 8,
      replies: 2,
      status: "published",
      sentiment: "neutral",
    },
    {
      id: "5",
      user: {
        name: "Utilisateur spam",
        avatar: "/avatars/spam.jpg",
        subscribers: 0,
      },
      content: "Achetez mes produits ! Liens dans la description !!!",
      video: {
        title: "Introduction au Tourisme Durable",
        thumbnail: "/videos/video1-thumb.jpg",
        id: "1",
      },
      timestamp: "Il y a 12 heures",
      likes: 0,
      replies: 0,
      status: "spam",
      sentiment: "negative",
    },
  ];

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.video.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || comment.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return {
          icon: CheckCircle,
          label: "Publié",
          color: "bg-green-100 text-green-700",
        };
      case "pending":
        return {
          icon: Clock,
          label: "En attente",
          color: "bg-yellow-100 text-yellow-700",
        };
      case "spam":
        return { icon: Ban, label: "Spam", color: "bg-red-100 text-red-700" };
      case "deleted":
        return {
          icon: Trash2,
          label: "Supprimé",
          color: "bg-gray-100 text-gray-700",
        };
      default:
        return {
          icon: AlertCircle,
          label: status,
          color: "bg-gray-100 text-gray-700",
        };
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return { label: "😊 Positif", color: "bg-green-100 text-green-700" };
      case "neutral":
        return { label: "😐 Neutre", color: "bg-gray-100 text-gray-700" };
      case "negative":
        return { label: "😊 Négatif", color: "bg-red-100 text-red-700" };
      default:
        return { label: sentiment, color: "bg-gray-100 text-gray-700" };
    }
  };

  const handleCommentAction = (action: string, commentId: string) => {
    console.log(`Action ${action} on comment ${commentId}`);
  };

  const toggleCommentSelection = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const stats = {
    total: comments.length,
    published: comments.filter((c) => c.status === "published").length,
    pending: comments.filter((c) => c.status === "pending").length,
    spam: comments.filter((c) => c.status === "spam").length,
    positive: comments.filter((c) => c.sentiment === "positive").length,
    negative: comments.filter((c) => c.sentiment === "negative").length,
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Commentaires
            </h1>
            <p className="text-gray-600">
              Gérez et modérez les commentaires de votre communauté
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un commentaire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.total}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.published}
            </span>
          </div>
          <p className="text-sm text-gray-600">Publiés</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.pending}
            </span>
          </div>
          <p className="text-sm text-gray-600">En attente</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Ban className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.spam}
            </span>
          </div>
          <p className="text-sm text-gray-600">Spam</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.positive}
            </span>
          </div>
          <p className="text-sm text-gray-600">Positifs</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.negative}
            </span>
          </div>
          <p className="text-sm text-gray-600">Négatifs</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Tous", count: stats.total },
            { value: "published", label: "Publiés", count: stats.published },
            { value: "pending", label: "En attente", count: stats.pending },
            { value: "spam", label: "Spam", count: stats.spam },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedFilter === filter.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Comments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        {selectedComments.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {selectedComments.length} commentaire(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                  Approuver
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                  Supprimer
                </button>
                <button className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600">
                  Marquer comme spam
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {filteredComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-4">
                <input
                  type="checkbox"
                  checked={selectedComments.includes(comment.id)}
                  onChange={() => toggleCommentSelection(comment.id)}
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />

                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {comment.user.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {comment.user.name}
                        </h3>
                        {comment.user.subscribers && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {comment.user.subscribers.toLocaleString()} abonnés
                          </span>
                        )}
                        {comment.isPinned && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>

                      <p className="text-gray-700 text-sm mb-3">
                        {comment.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>{comment.video.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{comment.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comment.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Reply className="w-3 h-3" />
                          <span>{comment.replies}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(comment.status).color}`}
                      >
                        {getStatusBadge(comment.status).label}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentBadge(comment.sentiment).color}`}
                      >
                        {getSentimentBadge(comment.sentiment).label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1">
                      <Reply className="w-3 h-3" />
                      Répondre
                    </button>
                    <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Aimer
                    </button>
                    <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1">
                      <Flag className="w-3 h-3" />
                      Signaler
                    </button>
                    <button
                      onClick={() => handleCommentAction("delete", comment.id)}
                      className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="ml-4">
                  <img
                    src={comment.video.thumbnail}
                    alt={comment.video.title}
                    className="w-20 h-14 object-cover rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun commentaire trouvé
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedFilter !== "all"
                ? "Essayez de modifier vos filtres de recherche"
                : "Soyez le premier à commenter !"}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
