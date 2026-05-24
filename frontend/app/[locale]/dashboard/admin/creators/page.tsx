"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Video,
  Star,
  Award,
  Calendar,
  Download,
  MoreVertical,
  BarChart3,
  Play,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface Creator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "pending" | "suspended";
  joinDate: string;
  courses: number;
  students: number;
  revenue: number;
  rating: number;
  totalViews: number;
  category: string;
}

/**
 * Helper pour gérer les réponses 401 (session expirée)
 * Redirige vers la page de login si non authentifié
 */
const handleAuthError = (response: Response, router: ReturnType<typeof useRouter>, locale: string) => {
  if (response.status === 401) {
    console.error("[Auth] Session expirée - redirection vers login");
    router.push(`/${locale}/login`);
    return true;
  }
  return false;
};

/**
 * Configuration commune pour les requêtes fetch
 * Inclut les cookies NextAuth pour l'authentification
 */
const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    credentials: "include", // Inclut les cookies NextAuth
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  };
};

export default function AdminCreators() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Récupérer le locale depuis les params
  const [locale, setLocale] = useState("fr");
  useEffect(() => {
    // Le locale est géré par le layout, on utilise "fr" par défaut
    // Dans un vrai scénario, on pourrait le récupérer via useParams()
  }, []);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCreator, setNewCreator] = useState({
    name: "",
    email: "",
    category: "Marketing",
    bio: "",
    expertise: "",
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  // Charger les créateurs
  useEffect(() => {
    // Attendre que la session soit chargée
    if (status === "loading") return;
    
    const loadCreators = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          ...(searchTerm && { search: searchTerm }),
          ...(filterCategory !== "all" && { category: filterCategory }),
          ...(filterStatus !== "all" && { status: filterStatus }),
        });

        const response = await fetch(`/api/admin/creators-backend?${params}`, getFetchOptions());
        
        // Gestion erreur 401 (session expirée)
        if (handleAuthError(response, router, locale)) {
          return;
        }
        
        const data = await response.json();

        if (response.ok && data.success) {
          // Safe extraction des données - garantit un tableau même si data est mal formé
          const records = Array.isArray(data.creators)
            ? data.creators
            : Array.isArray(data.data)
              ? data.data
              : [];
          setCreators(records);
        } else {
          const errorMessage = data?.error || data?.message || "Erreur lors du chargement des créateurs";
          console.error("[Creators] Erreur API:", errorMessage);
          setError(errorMessage);
          setCreators([]);
        }
      } catch (err) {
        console.error("[Creators] Erreur réseau:", err);
        setError("Impossible de se connecter au serveur");
        setCreators([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadCreators();
    }
  }, [status, searchTerm, filterCategory, filterStatus, router, locale]);

  // Filtrage des créateurs - safe rendering
  const filteredCreators = (creators ?? []).filter((creator) => {
    if (!creator) return false;
    const matchesSearch =
      creator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || creator.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || creator.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount ?? 0);
  };

  const formatNumber = (num: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleCreateCreator = async () => {
    if (!newCreator.name || !newCreator.email || !newCreator.category) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await fetch("/api/admin/creators-backend", getFetchOptions({
        method: "POST",
        body: JSON.stringify({
          ...newCreator,
          password: "tempPassword123", // Mot de passe temporaire
          status: "active",
        }),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      const data = await response.json();

      if (data.success) {
        setCreators([...creators, data.creator]);
        setShowCreateModal(false);
        setNewCreator({
          name: "",
          email: "",
          category: "Marketing",
          bio: "",
          expertise: "",
        });
        alert("Créateur créé avec succès");
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (err) {
      console.error("[Creators] Erreur création:", err);
      alert("Erreur lors de la création du créateur");
    }
  };

  const handleUpdateCreator = async (creatorId: string, updates: any) => {
    try {
      const response = await fetch("/api/admin/creators", getFetchOptions({
        method: "PUT",
        body: JSON.stringify({ id: creatorId, ...updates }),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        const updatedCreator = await response.json();
        setCreators(
          (creators ?? []).map((creator) =>
            creator.id === creatorId ? updatedCreator : creator
          )
        );
        alert("Créateur mis à jour avec succès!");
      } else {
        const error = await response.json().catch(() => ({}));
        alert(error.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("[Creators] Erreur mise à jour:", err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteCreator = async (creatorId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce créateur?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/creators?id=${creatorId}`, getFetchOptions({
        method: "DELETE",
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        setCreators((creators ?? []).filter((creator) => creator.id !== creatorId));
        alert("Créateur supprimé avec succès!");
      } else {
        const error = await response.json().catch(() => ({}));
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("[Creators] Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  // Loading state - jamais d'écran blanc
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state - fallback UI propre
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-900 font-bold text-lg mb-2">
          Impossible de charger les créateurs
        </p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion Créateurs
          </h1>
          <p className="text-gray-600 mt-1">
            {(creators ?? []).length > 0
              ? `${filteredCreators.length} créateurs trouvés`
              : "Aucun créateur"}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Exporter
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Nouveau Créateur
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          {
            label: "Total Créateurs",
            value: (creators ?? []).length,
            icon: Users,
            color: "blue",
            change: "+12%",
          },
          {
            label: "Revenus Totaux",
            value: formatCurrency(
              (creators ?? []).reduce((sum, c) => sum + (c.revenue ?? 0), 0)
            ),
            icon: DollarSign,
            color: "green",
            change: "+23%",
          },
          {
            label: "Étudiants Totaux",
            value: formatNumber(
              (creators ?? []).reduce((sum, c) => sum + (c.students ?? 0), 0)
            ),
            icon: Users,
            color: "purple",
            change: "+18%",
          },
          {
            label: "Vues Totales",
            value: formatNumber(
              (creators ?? []).reduce((sum, c) => sum + (c.totalViews ?? 0), 0)
            ),
            icon: Play,
            color: "orange",
            change: "+31%",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
              <span className="text-green-600 text-sm font-bold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher un créateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="Marketing">Marketing</option>
              <option value="Développement">Développement</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Photographie">Photographie</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {(creators ?? []).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun créateur trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            Commencez par créer un nouveau créateur ou attendez les inscriptions
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Nouveau Créateur
          </button>
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun résultat
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </div>
      ) : (
        /* Creators Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{creator.name}</h3>
                      <p className="text-sm text-gray-500">{creator.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(creator.status)}`}
                  >
                    {creator.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Video size={16} className="mx-auto text-gray-600 mb-1" />
                    <p className="text-lg font-bold text-gray-900">
                      {creator.courses ?? 0}
                    </p>
                    <p className="text-xs text-gray-500">Cours</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users size={16} className="mx-auto text-gray-600 mb-1" />
                    <p className="text-lg font-bold text-gray-900">
                      {formatNumber(creator.students ?? 0)}
                    </p>
                    <p className="text-xs text-gray-500">Étudiants</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-900">
                      {creator.rating ?? 0}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(creator.revenue ?? 0)}
                    </p>
                    <p className="text-xs text-gray-500">Revenus</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{formatNumber(creator.totalViews ?? 0)} vues</span>
                  <span>{creator.category}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleUpdateCreator(creator.id, {
                        status:
                          creator.status === "pending" ? "active" : "suspended",
                      })
                    }
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <Eye size={14} />
                    {creator.status === "pending" ? "Approuver" : "Suspendre"}
                  </button>
                  <button
                    onClick={() => handleDeleteCreator(creator.id)}
                    className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <BarChart3 size={14} />
                    {creator.status === "pending" ? "Rejeter" : "Supprimer"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Creator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Créer un créateur
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom complet"
                value={newCreator.name}
                onChange={(e) =>
                  setNewCreator({ ...newCreator, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCreator.email}
                onChange={(e) =>
                  setNewCreator({ ...newCreator, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newCreator.category}
                onChange={(e) =>
                  setNewCreator({ ...newCreator, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Marketing">Marketing</option>
                <option value="Développement">Développement</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Photographie">Photographie</option>
              </select>
              <textarea
                placeholder="Biographie (optionnel)"
                value={newCreator.bio}
                onChange={(e) =>
                  setNewCreator({ ...newCreator, bio: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Expertise (optionnel)"
                value={newCreator.expertise}
                onChange={(e) =>
                  setNewCreator({ ...newCreator, expertise: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateCreator}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}