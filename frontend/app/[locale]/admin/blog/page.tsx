"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Clock,
  Tag,
  MoreVertical,
  Save,
  X,
  Upload,
  Image,
  Send,
  MessageSquare,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: "published" | "draft" | "scheduled";
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  featuredImage?: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Simuler le chargement des articles de blog
    const mockPosts: BlogPost[] = [
      {
        id: "1",
        title: "Les Tendances du Tourisme Durable en 2024",
        slug: "tendances-tourisme-durable-2024",
        excerpt: "Découvrez les dernières innovations et tendances qui transforment l'industrie du tourisme vers un avenir plus durable.",
        content: "Le tourisme durable connaît une transformation sans précédent en 2024...",
        author: "Marie Expert",
        status: "published",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        views: 3420,
        likes: 156,
        comments: 23,
        tags: ["tourisme", "durable", "tendances", "2024"],
        category: "Tourisme",
        seoTitle: "Tendances Tourisme Durable 2024 | Match My Formation",
        seoDescription: "Guide complet des tendances du tourisme durable pour 2024"
      },
      {
        id: "2",
        title: "Comment Optimiser la Gestion Hôtelière",
        slug: "optimiser-gestion-hoteliere",
        excerpt: "Stratégies avancées pour améliorer l'efficacité opérationnelle et la satisfaction client dans l'hôtellerie moderne.",
        content: "La gestion hôtelière exige une approche multidimensionnelle...",
        author: "Jean Formateur",
        status: "published",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        views: 2890,
        likes: 134,
        comments: 18,
        tags: ["hôtellerie", "gestion", "optimisation", "client"],
        category: "Hôtellerie",
        seoTitle: "Optimisation Gestion Hôtelière | Match My Formation",
        seoDescription: "Guide pratique pour optimiser la gestion hôtelière"
      },
      {
        id: "3",
        title: "Marketing Digital pour le Secteur Touristique",
        slug: "marketing-digital-touristique",
        excerpt: "Techniques et stratégies de marketing digital spécifiquement adaptées aux entreprises du secteur touristique.",
        content: "Le marketing digital révolutionne la manière dont les entreprises touristiques...",
        author: "Pierre Pro",
        status: "draft",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        views: 0,
        likes: 0,
        comments: 0,
        tags: ["marketing", "digital", "tourisme", "stratégie"],
        category: "Marketing",
        seoTitle: "Marketing Digital Touristique | Match My Formation",
        seoDescription: "Stratégies de marketing digital pour le tourisme"
      },
      {
        id: "4",
        title: "L'Importance du Service Client dans l'Hôtellerie",
        slug: "service-client-hotellerie",
        excerpt: "Pourquoi un service client exceptionnel est crucial pour le succès dans l'industrie hôtelière moderne.",
        content: "Le service client est devenu un différenciateur majeur...",
        author: "Sophie Specialiste",
        status: "scheduled",
        publishedAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        views: 0,
        likes: 0,
        comments: 0,
        tags: ["service", "client", "hôtellerie", "expérience"],
        category: "Service Client",
        seoTitle: "Service Client Hôtellerie | Match My Formation",
        seoDescription: "L'importance du service client dans l'hôtellerie"
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1200);
  }, []);

  const getStatusColor = (status: BlogPost["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-50 border-green-200 text-green-800";
      case "draft":
        return "bg-gray-50 border-gray-200 text-gray-800";
      case "scheduled":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusLabel = (status: BlogPost["status"]) => {
    switch (status) {
      case "published":
        return "Publié";
      case "draft":
        return "Brouillon";
      case "scheduled":
        return "Programmé";
      default:
        return status;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = 
      filter === "all" || post.status === filter;
    
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === "published").length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id));
    }
  };

  const handleBulkAction = (action: "publish" | "draft" | "delete") => {
    if (action === "delete") {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedPosts.length} article(s) ?`)) {
        setPosts(prev => prev.filter(p => !selectedPosts.includes(p.id)));
        setSelectedPosts([]);
      }
    } else {
      setPosts(prev => prev.map(p => 
        selectedPosts.includes(p.id) 
          ? { ...p, status: action as BlogPost["status"] }
          : p
      ));
      setSelectedPosts([]);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(false);
  };

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "Admin",
      status: "draft",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0,
      tags: [],
      category: "General",
      seoTitle: "",
      seoDescription: ""
    };
    setEditingPost(newPost);
    setIsCreating(true);
  };

  const handleSavePost = () => {
    if (!editingPost) return;

    if (isCreating) {
      setPosts(prev => [editingPost, ...prev]);
    } else {
      setPosts(prev => prev.map(p => 
        p.id === editingPost.id ? editingPost : p
      ));
    }

    setEditingPost(null);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl p-6 animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (editingPost) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            {isCreating ? "Nouvel Article" : "Modifier l'Article"}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button
              onClick={handleSavePost}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isCreating ? "Créer" : "Sauvegarder"}
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'article
              </label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Titre attractif et informatif"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL (Slug)
              </label>
              <input
                type="text"
                value={editingPost.slug}
                onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="url-de-l-article"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extrait (résumé)
              </label>
              <textarea
                rows={3}
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Résumé attractif pour les moteurs de recherche et les aperçus"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                rows={12}
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                placeholder="Contenu complet de l'article en format Markdown ou HTML"
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Tourisme">Tourisme</option>
                  <option value="Hôtellerie">Hôtellerie</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Service Client">Service Client</option>
                  <option value="Management">Management</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={editingPost.tags.join(", ")}
                  onChange={(e) => setEditingPost({ 
                    ...editingPost, 
                    tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">SEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    value={editingPost.seoTitle}
                    onChange={(e) => setEditingPost({ ...editingPost, seoTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Titre optimisé pour les moteurs de recherche"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description SEO
                  </label>
                  <input
                    type="text"
                    value={editingPost.seoDescription}
                    onChange={(e) => setEditingPost({ ...editingPost, seoDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Description optimisée pour les moteurs de recherche"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={editingPost.status}
                onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as BlogPost["status"] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="scheduled">Programmé</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Gestion du Blog
          </h1>
          <p className="text-gray-600">
            Créez et gérez les articles de blog
          </p>
        </div>
        
        <button
          onClick={handleCreatePost}
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Nouvel Article
        </button>
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
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {totalPosts}
              </h3>
              <p className="text-sm text-gray-600">Total articles</p>
            </div>
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
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(totalViews)}
              </h3>
              <p className="text-sm text-gray-600">Vues totales</p>
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
            <div className="p-3 bg-purple-50 rounded-xl">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(totalComments)}
              </h3>
              <p className="text-sm text-gray-600">Commentaires</p>
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
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Send className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {publishedPosts}
              </h3>
              <p className="text-sm text-gray-600">Publiés</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2">
            {[
              { value: "all", label: "Tous" },
              { value: "published", label: "Publiés" },
              { value: "draft", label: "Brouillons" },
              { value: "scheduled", label: "Programmés" }
            ].map((filterType) => (
              <button
                key={filterType.value}
                onClick={() => setFilter(filterType.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filterType.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <span className="text-sm font-medium text-blue-800">
              {selectedPosts.length} article(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("publish")}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Publier
              </button>
              <button
                onClick={() => handleBulkAction("draft")}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
              >
                Brouillon
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Aucun article trouvé" : "Aucun article"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Essayez de modifier votre recherche ou vos filtres"
                : "Commencez par créer votre premier article"
              }
            </p>
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Créer un article
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* Select All */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <input
                type="checkbox"
                checked={selectedPosts.length === filteredPosts.length}
                onChange={handleSelectAll}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">
                Sélectionner tout ({filteredPosts.length})
              </span>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="rounded text-primary focus:ring-primary"
                  />

                  {/* Featured Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(post.status)}`}>
                        {getStatusLabel(post.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(post.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.comments}
                      </span>
                      <div className="flex items-center gap-1">
                        {post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-200 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-gray-400">+{post.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer"
                      onClick={() => {
                        if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
                          setPosts(prev => prev.filter(p => p.id !== post.id));
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
