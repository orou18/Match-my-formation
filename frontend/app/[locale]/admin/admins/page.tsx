"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
  Key,
  Calendar,
  Mail,
  Settings,
  Save,
  X,
  Eye,
  EyeOff,
  UserPlus,
  UserMinus,
  Activity,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  status: "active" | "inactive" | "suspended";
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  phone?: string;
  department?: string;
  twoFactorEnabled: boolean;
  loginAttempts: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"admins" | "permissions" | "activity">("admins");

  useEffect(() => {
    // Simuler le chargement des administrateurs
    const mockAdmins: AdminUser[] = [
      {
        id: "1",
        name: "Super Administrateur",
        email: "admin@matchmyformation.com",
        role: "super_admin",
        status: "active",
        permissions: ["all"],
        lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        avatar: "/api/placeholder/40/40",
        phone: "+33 1 23 45 67 89",
        department: "Direction",
        twoFactorEnabled: true,
        loginAttempts: 0
      },
      {
        id: "2",
        name: "Jean Admin",
        email: "jean.admin@matchmyformation.com",
        role: "admin",
        status: "active",
        permissions: ["users", "content", "analytics"],
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        department: "Support",
        twoFactorEnabled: true,
        loginAttempts: 0
      },
      {
        id: "3",
        name: "Marie Moderator",
        email: "marie.moderator@matchmyformation.com",
        role: "moderator",
        status: "active",
        permissions: ["content", "comments"],
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        department: "Modération",
        twoFactorEnabled: false,
        loginAttempts: 1
      },
      {
        id: "4",
        name: "Pierre Inactif",
        email: "pierre.inactif@matchmyformation.com",
        role: "admin",
        status: "inactive",
        permissions: ["users", "content"],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        department: "Technique",
        twoFactorEnabled: false,
        loginAttempts: 3
      },
      {
        id: "5",
        name: "Sophie Suspendue",
        email: "sophie.suspendue@matchmyformation.com",
        role: "moderator",
        status: "suspended",
        permissions: ["content"],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        department: "Modération",
        twoFactorEnabled: true,
        loginAttempts: 5
      }
    ];

    setTimeout(() => {
      setAdmins(mockAdmins);
      setLoading(false);
    }, 1200);
  }, []);

  const getRoleColor = (role: AdminUser["role"]) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "admin":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "moderator":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getRoleIcon = (role: AdminUser["role"]) => {
    switch (role) {
      case "super_admin":
        return <ShieldCheck className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "moderator":
        return <ShieldX className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: AdminUser["role"]) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "moderator":
        return "Modérateur";
      default:
        return role;
    }
  };

  const getStatusColor = (status: AdminUser["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-50 border-green-200 text-green-800";
      case "inactive":
        return "bg-gray-50 border-gray-200 text-gray-800";
      case "suspended":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusLabel = (status: AdminUser["status"]) => {
    switch (status) {
      case "active":
        return "Actif";
      case "inactive":
        return "Inactif";
      case "suspended":
        return "Suspendu";
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

  const filteredAdmins = admins.filter(admin => {
    const matchesFilter = 
      filter === "all" || admin.status === filter;
    
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.status === "active").length;
  const superAdmins = admins.filter(a => a.role === "super_admin").length;
  const twoFactorEnabled = admins.filter(a => a.twoFactorEnabled).length;

  const handleSelectAdmin = (adminId: string) => {
    setSelectedAdmins(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAdmins.length === filteredAdmins.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(filteredAdmins.map(a => a.id));
    }
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "suspend" | "delete") => {
    if (action === "delete") {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedAdmins.length} administrateur(s) ?`)) {
        setAdmins(prev => prev.filter(a => !selectedAdmins.includes(a.id)));
        setSelectedAdmins([]);
      }
    } else {
      const newStatus = action === "activate" ? "active" : 
                        action === "deactivate" ? "inactive" : "suspended";
      
      setAdmins(prev => prev.map(a => 
        selectedAdmins.includes(a.id) 
          ? { ...a, status: newStatus as AdminUser["status"] }
          : a
      ));
      setSelectedAdmins([]);
    }
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setIsCreating(false);
  };

  const handleCreateAdmin = () => {
    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      name: "",
      email: "",
      role: "moderator",
      status: "active",
      permissions: ["content"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      twoFactorEnabled: false,
      loginAttempts: 0
    };
    setEditingAdmin(newAdmin);
    setIsCreating(true);
  };

  const handleSaveAdmin = () => {
    if (!editingAdmin) return;

    if (isCreating) {
      setAdmins(prev => [editingAdmin, ...prev]);
    } else {
      setAdmins(prev => prev.map(a => 
        a.id === editingAdmin.id ? editingAdmin : a
      ));
    }

    setEditingAdmin(null);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setEditingAdmin(null);
    setIsCreating(false);
  };

  const availablePermissions: Permission[] = [
    { id: "all", name: "Accès total", description: "Toutes les permissions", category: "Général" },
    { id: "users", name: "Gestion utilisateurs", description: "Créer, modifier, supprimer des utilisateurs", category: "Utilisateurs" },
    { id: "content", name: "Gestion contenu", description: "Gérer les articles, vidéos et cours", category: "Contenu" },
    { id: "analytics", name: "Analytiques", description: "Voir les statistiques et rapports", category: "Analytiques" },
    { id: "payments", name: "Gestion paiements", description: "Gérer les transactions et factures", category: "Finances" },
    { id: "settings", name: "Paramètres", description: "Configurer la plateforme", category: "Système" },
    { id: "support", name: "Support client", description: "Gérer les tickets et support", category: "Support" },
    { id: "moderation", name: "Modération", description: "Modérer le contenu et commentaires", category: "Modération" },
    { id: "newsletter", name: "Newsletter", description: "Gérer les campagnes email", category: "Marketing" },
    { id: "api", name: "Accès API", description: "Gérer les clés API et webhooks", category: "Technique" }
  ];

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
      </div>
    );
  }

  if (editingAdmin) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            {isCreating ? "Nouvel Administrateur" : "Modifier l'Administrateur"}
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
              onClick={handleSaveAdmin}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isCreating ? "Créer" : "Sauvegarder"}
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={editingAdmin.name}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Nom de l'administrateur"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editingAdmin.email}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="email@exemple.com"
              />
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <select
                value={editingAdmin.role}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as AdminUser["role"] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="moderator">Modérateur</option>
                <option value="admin">Administrateur</option>
                <option value="super_admin">Super Administrateur</option>
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={editingAdmin.status}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, status: e.target.value as AdminUser["status"] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={editingAdmin.phone || ""}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            {/* Département */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département
              </label>
              <input
                type="text"
                value={editingAdmin.department || ""}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, department: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Direction, Support, Technique..."
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePermissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAdmin.permissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEditingAdmin({
                          ...editingAdmin,
                          permissions: [...editingAdmin.permissions, permission.id]
                        });
                      } else {
                        setEditingAdmin({
                          ...editingAdmin,
                          permissions: editingAdmin.permissions.filter(p => p !== permission.id)
                        });
                      }
                    }}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{permission.name}</p>
                    <p className="text-xs text-gray-600">{permission.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Options de sécurité */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingAdmin.twoFactorEnabled}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, twoFactorEnabled: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Activer l'authentification à deux facteurs
                </span>
              </label>
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
            <Users className="w-8 h-8 text-primary" />
            Gestion des Administrateurs
          </h1>
          <p className="text-gray-600">
            Créez et gérez les comptes administrateurs
          </p>
        </div>
        
        <button
          onClick={handleCreateAdmin}
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Nouvel Admin
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
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(totalAdmins)}
              </h3>
              <p className="text-sm text-gray-600">Total admins</p>
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
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(activeAdmins)}
              </h3>
              <p className="text-sm text-gray-600">Admins actifs</p>
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
              <Key className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(twoFactorEnabled)}
              </h3>
              <p className="text-sm text-gray-600">2FA activé</p>
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
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(superAdmins)}
              </h3>
              <p className="text-sm text-gray-600">Super admins</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "admins", label: "Administrateurs", icon: Users },
              { id: "permissions", label: "Permissions", icon: Key },
              { id: "activity", label: "Activité", icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Admins Tab */}
          {activeTab === "admins" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un administrateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="flex gap-2">
                  {[
                    { value: "all", label: "Tous" },
                    { value: "active", label: "Actifs" },
                    { value: "inactive", label: "Inactifs" },
                    { value: "suspended", label: "Suspendus" }
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
              {selectedAdmins.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedAdmins.length} admin(s) sélectionné(s)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("activate")}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      <UserPlus className="w-4 h-4 inline mr-1" />
                      Activer
                    </button>
                    <button
                      onClick={() => handleBulkAction("deactivate")}
                      className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                    >
                      <UserMinus className="w-4 h-4 inline mr-1" />
                      Désactiver
                    </button>
                    <button
                      onClick={() => handleBulkAction("suspend")}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
                    >
                      Suspendre
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

              {/* Admins List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.length === filteredAdmins.length}
                          onChange={handleSelectAll}
                          className="rounded text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Admin</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Rôle</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Département</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">2FA</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Dernière connexion</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin, index) => (
                      <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedAdmins.includes(admin.id)}
                            onChange={() => handleSelectAdmin(admin.id)}
                            className="rounded text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {admin.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{admin.name}</p>
                              <p className="text-sm text-gray-500">{admin.phone || "Non renseigné"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{admin.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getRoleColor(admin.role)}`}>
                            {getRoleIcon(admin.role)}
                            {getRoleLabel(admin.role)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(admin.status)}`}>
                            {getStatusLabel(admin.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{admin.department || "Non défini"}</td>
                        <td className="py-3 px-4">
                          {admin.twoFactorEnabled ? (
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                          ) : (
                            <ShieldX className="w-5 h-5 text-gray-400" />
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {admin.lastLogin ? formatDate(admin.lastLogin) : "Jamais"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditAdmin(admin)}
                              className="p-1 text-gray-400 hover:text-primary transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Supprimer"
                              onClick={() => {
                                if (confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
                                  setAdmins(prev => prev.filter(a => a.id !== admin.id));
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === "permissions" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrice des permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-5 h-5 text-primary" />
                      <h4 className="font-medium text-gray-900">{permission.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{permission.description}</p>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                      {permission.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-4">
                {[
                  { user: "Jean Admin", action: "Connexion réussie", date: "Il y a 2 heures", type: "login" },
                  { user: "Marie Moderator", action: "Modification de l'utilisateur Alice Martin", date: "Il y a 4 heures", type: "update" },
                  { user: "Super Administrateur", action: "Création du nouvel admin Pierre Inactif", date: "Il y a 6 heures", type: "create" },
                  { user: "Sophie Suspendue", action: "Tentative de connexion échouée", date: "Il y a 8 heures", type: "failed_login" },
                  { user: "Jean Admin", action: "Suppression de l'ancien contenu", date: "Il y a 12 heures", type: "delete" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
