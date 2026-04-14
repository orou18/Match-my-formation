"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

export default function AdminAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "super_admin">(
    "admin"
  );
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const response = await fetch("/api/admin/admins");
        if (response.ok) {
          const data = await response.json();
          setAdmins(data.admins);
        } else {
          console.error("Erreur lors du chargement des administrateurs");
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const mockAdmins: Admin[] = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@platform.com",
      role: "super_admin",
      permissions: allPermissions.map((p) => p.id),
      status: "active",
      lastLogin: "2024-03-18T14:30:00Z",
      avatar: "/temoignage.png",
    },
    {
      id: "2",
      name: "Marie Laurent",
      email: "marie.laurent@platform.com",
      role: "admin",
      permissions: [
        "users_view",
        "users_edit",
        "creators_view",
        "content_view",
        "analytics_view",
      ],
      status: "active",
      lastLogin: "2024-03-18T10:15:00Z",
      avatar: "/temoignage.png",
    },
    {
      id: "3",
      name: "Pierre Martin",
      email: "pierre.martin@platform.com",
      role: "admin",
      permissions: [
        "users_view",
        "creators_view",
        "creators_manage",
        "content_manage",
      ],
      status: "active",
      lastLogin: "2024-03-17T16:45:00Z",
      avatar: "/temoignage.png",
    },
    {
      id: "4",
      name: "Sophie Bernard",
      email: "sophie.bernard@platform.com",
      role: "admin",
      permissions: [
        "content_view",
        "content_manage",
        "ads_manage",
        "webinars_manage",
      ],
      status: "inactive",
      lastLogin: "2024-03-15T09:20:00Z",
      avatar: "/temoignage.png",
    },
  ];

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdminRole) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdminRole,
          permissions: selectedPermissions,
        }),
      });

      if (response.ok) {
        const createdAdmin = await response.json();
        setAdmins([...admins, createdAdmin]);
        setShowCreateModal(false);
        setNewAdmin({ name: "", email: "" });
        setSelectedPermissions([]);
        setNewAdminRole("admin");
        alert("Administrateur créé avec succès!");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création");
    }
  };

  const handleUpdateAdmin = async (adminId: string, updates: any) => {
    try {
      const response = await fetch("/api/admin/admins", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: adminId, ...updates }),
      });

      if (response.ok) {
        const updatedAdmin = await response.json();
        setAdmins(
          admins.map((admin) => (admin.id === adminId ? updatedAdmin : admin))
        );
        alert("Administrateur mis à jour avec succès!");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet administrateur?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/admins?id=${adminId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAdmins(admins.filter((admin) => admin.id !== adminId));
        alert("Administrateur supprimé avec succès!");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion Administrateurs
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredAdmins.length} administrateurs
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-50">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {admins.length}
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
                {admins.filter((a) => a.status === "active").length}
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
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
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

      {/* Admins List */}
      <div className="space-y-4">
        {filteredAdmins.map((admin, index) => (
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
                  Permissions ({admin.permissions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {admin.permissions.slice(0, 6).map((permissionId) => {
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
                  {admin.permissions.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{admin.permissions.length - 6} autres
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
        ))}
      </div>

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
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
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
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Créer l'Admin
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
