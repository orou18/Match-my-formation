"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
  Users,
  FileText,
  Video,
  DollarSign,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  permissions: string[];
  status: "active" | "inactive";
  lastLogin: string;
  avatar?: string;
}

interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
}

const allPermissions: Permission[] = [
  {
    id: "users_view",
    name: "Voir utilisateurs",
    description: "Accéder à la liste des utilisateurs",
    category: "Utilisateurs",
  },
  {
    id: "users_create",
    name: "Créer utilisateurs",
    description: "Créer de nouveaux comptes",
    category: "Utilisateurs",
  },
  {
    id: "users_edit",
    name: "Modifier utilisateurs",
    description: "Modifier les comptes existants",
    category: "Utilisateurs",
  },
  {
    id: "users_delete",
    name: "Supprimer utilisateurs",
    description: "Supprimer des comptes",
    category: "Utilisateurs",
  },
  {
    id: "creators_view",
    name: "Voir créateurs",
    description: "Accéder à la liste des créateurs",
    category: "Créateurs",
  },
  {
    id: "creators_manage",
    name: "Gérer créateurs",
    description: "Approuver/suspendre les créateurs",
    category: "Créateurs",
  },
  {
    id: "content_view",
    name: "Voir contenus",
    description: "Accéder à tous les contenus",
    category: "Contenus",
  },
  {
    id: "content_manage",
    name: "Gérer contenus",
    description: "Modérer et gérer les contenus",
    category: "Contenus",
  },
  {
    id: "ads_manage",
    name: "Gérer publicités",
    description: "Créer et gérer les campagnes",
    category: "Publicités",
  },
  {
    id: "webinars_manage",
    name: "Gérer webinaires",
    description: "Organiser et modérer les webinaires",
    category: "Webinaires",
  },
  {
    id: "analytics_view",
    name: "Voir analytics",
    description: "Accéder aux statistiques",
    category: "Analytics",
  },
  {
    id: "settings_system",
    name: "Paramètres système",
    description: "Configurer la plateforme",
    category: "Système",
  },
];

/**
 * Helper pour gérer les réponses 401 (session expirée)
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
 */
const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  };
};

export default function AdminAdmins() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Récupérer le locale depuis les params
  const [locale, setLocale] = useState("fr");
  useEffect(() => {
    // Le locale est géré par le layout
  }, []);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "super_admin">("admin");
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  // Ajouter une notification
  const addNotification = (type: Notification["type"], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // DEBUG: Session NextAuth
  useEffect(() => {
    console.log("[ADMINS DEBUG] === Début debug session ===");
    console.log("[ADMINS DEBUG] status:", status);
    console.log("[ADMINS DEBUG] hasSession:", !!session);
    console.log("[ADMINS DEBUG] userId:", session?.user?.id);
    console.log("[ADMINS DEBUG] role:", session?.user?.role);
    console.log("[ADMINS DEBUG] === Fin debug session ===");
  }, [session, status]);

  // Charger les admins depuis l'API
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return;

    const loadAdmins = async () => {
      console.log("[ADMINS DEBUG] === Début appel API admins ===");
      console.log("[ADMINS DEBUG] endpoint:", "/api/admin/admins");

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/admins", getFetchOptions());
        
        // Gestion erreur 401
        if (handleAuthError(response, router, locale)) {
          return;
        }

        console.log("[ADMINS DEBUG] Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          // Safe extraction - garantit un tableau
          const adminsData = Array.isArray(data.admins) ? data.admins : [];
          setAdmins(adminsData);
          console.log("[ADMINS DEBUG] Admins chargés:", adminsData.length);
        } else {
          const error = await response.json().catch(() => ({}));
          console.error("[ADMINS DEBUG] Erreur:", error);
          addNotification("warning", "Impossible de charger les administrateurs");
          setAdmins([]);
        }
      } catch (err) {
        console.error("[ADMINS DEBUG] Erreur réseau:", err);
        addNotification("error", "Erreur de connexion");
        setError("Impossible de charger les administrateurs");
        setAdmins([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdmins();
  }, [status, router, locale]);

  // Safe rendering - protection contre undefined
  const safeAdmins = Array.isArray(admins) ? admins : [];
  
  const filteredAdmins = safeAdmins.filter(
    (admin) =>
      admin && (
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdminRole) {
      addNotification("warning", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await fetch("/api/admin/admins", getFetchOptions({
        method: "POST",
        body: JSON.stringify({
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdminRole,
          permissions: selectedPermissions,
        }),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        const createdAdmin = await response.json();
        setAdmins([...safeAdmins, createdAdmin]);
        setShowCreateModal(false);
        setNewAdmin({ name: "", email: "" });
        setSelectedPermissions([]);
        setNewAdminRole("admin");
        addNotification("success", "Administrateur créé avec succès");
      } else {
        const error = await response.json().catch(() => ({}));
        addNotification("error", error.error || "Erreur lors de la création");
      }
    } catch (err) {
      console.error("[ADMINS DEBUG] Erreur création:", err);
      addNotification("error", "Erreur lors de la création");
    }
  };

  const handleUpdateAdmin = async (adminId: string, updates: any) => {
    try {
      const response = await fetch("/api/admin/admins", getFetchOptions({
        method: "PUT",
        body: JSON.stringify({ id: adminId, ...updates }),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        const updatedAdmin = await response.json();
        setAdmins(
          safeAdmins.map((admin) => (admin.id === adminId ? updatedAdmin : admin))
        );
        addNotification("success", "Administrateur mis à jour avec succès");
      } else {
        const error = await response.json().catch(() => ({}));
        addNotification("error", error.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("[ADMINS DEBUG] Erreur mise à jour:", err);
      addNotification("error", "Erreur lors de la mise à jour");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    // Confirmation dialog stylée via modal (pas de confirm())
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/admins?id=${adminId}`, getFetchOptions({
        method: "DELETE",
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        setAdmins(safeAdmins.filter((admin) => admin.id !== adminId));
        addNotification("success", "Administrateur supprimé avec succès");
      } else {
        const error = await response.json().catch(() => ({}));
        addNotification("error", error.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("[ADMINS DEBUG] Erreur suppression:", err);
      addNotification("error", "Erreur lors de la suppression");
    }
  };

  const getRoleBadge = (role: string) => {
    return role === "super_admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  const getPermissionsByCategory = () => {
    const categories = allPermissions.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>
    );
    return categories;
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleRoleChange = (role: "admin" | "super_admin") => {
    setNewAdminRole(role);
    if (role === "super_admin") {
      setSelectedPermissions(allPermissions.map((p) => p.id));
    } else {
      setSelectedPermissions([]);
    }
  };

  // Loading state - Skeleton cards
  if (status === "loading" || isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* List skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state - UI stylée
  if (error) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Impossible de charger les administrateurs
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                // Recharger les données
                fetch("/api/admin/admins", getFetchOptions())
                  .then(res => res.json())
                  .then(data => {
                    setAdmins(Array.isArray(data.admins) ? data.admins : []);
                    setIsLoading(false);
                  })
                  .catch(() => setIsLoading(false));
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Réessayer
            </button>
            <button
              onClick={() => router.push(`/${locale}/dashboard/admin`)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retour dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notifications Toast */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                notification.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : notification.type === "error"
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : notification.type === "warning"
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                  : "bg-blue-50 border border-blue-200 text-blue-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle size={18} />
              ) : notification.type === "error" ? (
                <AlertCircle size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion Administrateurs
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredAdmins.length} administrateur{filteredAdmins.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Nouvel Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-50">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {safeAdmins.length}
              </p>
              <p className="text-sm text-gray-600">Total Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-50">
              <ShieldCheck size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {safeAdmins.filter((a) => a.status === "active").length}
              </p>
              <p className="text-sm text-gray-600">Actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {allPermissions.length}
              </p>
              <p className="text-sm text-gray-600">Permissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Rechercher un administrateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredAdmins.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Shield size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun administrateur trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par créer votre premier administrateur"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Créer un admin
            </button>
          )}
        </div>
      )}

      {/* Admins List */}
      {filteredAdmins.length > 0 && (
        <div className="space-y-4">
          {filteredAdmins.map((admin, index) => {
            // Safe rendering pour permissions
            const safePermissions = Array.isArray(admin.permissions) ? admin.permissions : [];
            
            return (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Shield size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{admin.name}</h3>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(admin.role)}`}
                      >
                        {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(admin.status)}`}
                      >
                        {admin.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Permissions ({safePermissions.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {safePermissions.slice(0, 6).map((permissionId) => {
                        const permission = allPermissions.find(
                          (p) => p.id === permissionId
                        );
                        return permission ? (
                          <span
                            key={permissionId}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {permission.name}
                          </span>
                        ) : null;
                      })}
                      {safePermissions.length > 6 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{safePermissions.length - 6} autres
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      Dernière connexion:{" "}
                      {admin.lastLogin
                        ? new Date(admin.lastLogin).toLocaleDateString("fr-FR")
                        : "Jamais"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateAdmin(admin.id, {
                            status:
                              admin.status === "active" ? "inactive" : "active",
                          })
                        }
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Créer un Administrateur
            </h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="admin"
                      checked={newAdminRole === "admin"}
                      onChange={() => handleRoleChange("admin")}
                      className="rounded border-gray-300"
                    />
                    <span>Admin</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="super_admin"
                      checked={newAdminRole === "super_admin"}
                      onChange={() => handleRoleChange("super_admin")}
                      className="rounded border-gray-300"
                    />
                    <span>Super Admin</span>
                  </label>
                </div>
              </div>

              {/* Permissions */}
              {newAdminRole === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Permissions ({selectedPermissions.length} sélectionnées)
                  </label>
                  <div className="space-y-4">
                    {Object.entries(getPermissionsByCategory()).map(
                      ([category, permissions]) => (
                        <div key={category}>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {category}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {permissions.map((permission) => (
                              <label
                                key={permission.id}
                                className="flex items-start gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.includes(
                                    permission.id
                                  )}
                                  onChange={() =>
                                    handlePermissionToggle(permission.id)
                                  }
                                  className="mt-1 rounded border-gray-300"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {permission.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {permission.description}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {newAdminRole === "super_admin" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={20} className="text-purple-600" />
                    <span className="font-semibold text-purple-900">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Le Super Admin a accès à toutes les fonctionnalités de la
                    plateforme sans restrictions.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateAdmin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer l'Admin
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}