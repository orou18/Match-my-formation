"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Edit,
  Save,
  X,
  Check,
  Camera,
  Lock,
  Bell,
  Globe,
  Users,
  Settings,
  Calendar,
  MapPin,
  Phone,
  Briefcase,
  Star,
  Activity,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  permissions: string[];
  avatar: string;
  bio: string;
  phone: string;
  location: string;
  department: string;
  joinDate: string;
  lastLogin: string;
  status: "active" | "inactive";
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  language: string;
  timezone: string;
}

interface NotificationItem {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
}

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

export default function AdminProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [locale, setLocale] = useState("fr");
  
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editProfile, setEditProfile] = useState<Partial<AdminProfile>>({});
  const [toastNotifications, setToastNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  // Ajouter une notification toast
  const addToast = (type: NotificationItem["type"], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToastNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToastNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // DEBUG: Session NextAuth
  useEffect(() => {
    console.log("[PROFILE DEBUG] === Début debug session ===");
    console.log("[PROFILE DEBUG] status:", status);
    console.log("[PROFILE DEBUG] hasSession:", !!session);
    console.log("[PROFILE DEBUG] userId:", session?.user?.id);
    console.log("[PROFILE DEBUG] role:", session?.user?.role);
    console.log("[PROFILE DEBUG] === Fin debug session ===");
  }, [session, status]);

  // Charger le profile depuis l'API
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return;

    const loadProfile = async () => {
      console.log("[PROFILE DEBUG] === Début appel API profile ===");
      console.log("[PROFILE DEBUG] endpoint:", "/api/admin/profile");

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/profile", getFetchOptions());
        
        // Gestion erreur 401
        if (handleAuthError(response, router, locale)) {
          return;
        }

        console.log("[PROFILE DEBUG] Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          // Safe extraction
          const profileData = data.profile || data.user || data;
          setProfile(profileData);
          setEditProfile(profileData);
          console.log("[PROFILE DEBUG] Profile chargé:", profileData);
        } else {
          const error = await response.json().catch(() => ({}));
          console.error("[PROFILE DEBUG] Erreur:", error);
          addToast("warning", "Impossible de charger le profil");
          setError("Impossible de charger le profil");
        }
      } catch (err) {
        console.error("[PROFILE DEBUG] Erreur réseau:", err);
        addToast("error", "Erreur de connexion");
        setError("Erreur de connexion");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [status, router, locale]);

  // Safe rendering - protection contre undefined
  const safeProfile = profile ?? {} as AdminProfile;
  const safePermissions = Array.isArray(profile?.permissions) ? profile.permissions : [];

  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/profile", getFetchOptions({
        method: "PUT",
        body: JSON.stringify(editProfile),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setEditProfile(updatedProfile);
        setIsEditing(false);
        addToast("success", "Profil mis à jour avec succès!");
      } else {
        const error = await response.json().catch(() => ({}));
        addToast("error", error.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("[PROFILE DEBUG] Erreur:", err);
      addToast("error", "Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      addToast("warning", "Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      addToast("warning", "Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      const response = await fetch("/api/admin/profile/change-password", getFetchOptions({
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }));

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        addToast("success", "Mot de passe modifié avec succès!");
      } else {
        const error = await response.json().catch(() => ({}));
        addToast("error", error.error || "Erreur lors du changement de mot de passe");
      }
    } catch (err) {
      console.error("[PROFILE DEBUG] Erreur:", err);
      addToast("error", "Erreur lors du changement de mot de passe");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/admin/profile/upload-avatar", {
        method: "POST",
        body: formData,
      });

      // Gestion erreur 401
      if (handleAuthError(response, router, locale)) {
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => (prev ? { ...prev, avatar: data.avatar } : null));
        setEditProfile((prev) => ({ ...prev, avatar: data.avatar }));
        addToast("success", "Avatar mis à jour avec succès!");
      } else {
        const error = await response.json().catch(() => ({}));
        addToast("error", error.error || "Erreur lors du téléchargement");
      }
    } catch (err) {
      console.error("[PROFILE DEBUG] Erreur:", err);
      addToast("error", "Erreur lors du téléchargement");
    }
  };

  const canEdit =
    safeProfile.role === "super_admin" ||
    safePermissions.includes("profile_edit") ||
    false;

  const getPermissionBadge = (permission: string) => {
    const category = permission.split("_")[0];
    switch (category) {
      case "users":
        return "bg-blue-100 text-blue-700";
      case "creators":
        return "bg-green-100 text-green-700";
      case "content":
        return "bg-purple-100 text-purple-700";
      case "ads":
        return "bg-orange-100 text-orange-700";
      case "webinars":
        return "bg-red-100 text-red-700";
      case "analytics":
        return "bg-indigo-100 text-indigo-700";
      case "settings":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Loading state - Skeleton UI
  if (status === "loading" || isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Profile skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mx-auto mb-4"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
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
            Impossible de charger le profil
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                fetch("/api/admin/profile", getFetchOptions())
                  .then(res => res.json())
                  .then(data => {
                    setProfile(data.profile || data.user || data);
                    setEditProfile(data.profile || data.user || data);
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
    <div className="p-6">
      {/* Notifications Toast */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toastNotifications.map((notification) => (
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Profil Administrateur
            </h1>
            <div className="flex items-center gap-3">
              {canEdit && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Edit size={18} />
                  Modifier
                </button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (profile) setEditProfile(profile);
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <X size={18} />
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {safeProfile.avatar ? (
                      <img
                        src={safeProfile.avatar}
                        alt={safeProfile.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-gray-400" />
                    )}
                  </div>
                  {canEdit && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.name || ""}
                      onChange={(e) =>
                        setEditProfile({ ...editProfile, name: e.target.value })
                      }
                      className="text-center border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    safeProfile.name || "Non renseigné"
                  )}
                </h2>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      safeProfile.role === "super_admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {safeProfile.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      safeProfile.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {safeProfile.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editProfile.email || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            email: e.target.value,
                          })
                        }
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      safeProfile.email || "Non renseigné"
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editProfile.phone || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            phone: e.target.value,
                          })
                        }
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      safeProfile.phone || "Non renseigné"
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editProfile.location || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            location: e.target.value,
                          })
                        }
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      safeProfile.location || "Non renseigné"
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={16} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editProfile.department || ""}
                        onChange={(e) =>
                          setEditProfile({
                            ...editProfile,
                            department: e.target.value,
                          })
                        }
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      safeProfile.department || "Non renseigné"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <Lock size={18} className="text-gray-600" />
                  <span className="text-gray-700">Changer le mot de passe</span>
                </button>

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-gray-600" />
                    <span className="text-gray-700">Notifications email</span>
                  </div>
                  {canEdit ? (
                    <button
                      onClick={() =>
                        setEditProfile({
                          ...editProfile,
                          emailNotifications: !editProfile.emailNotifications,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        editProfile.emailNotifications
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          editProfile.emailNotifications
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  ) : (
                    <span
                      className={`w-12 h-6 rounded-full ${
                        safeProfile.emailNotifications
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transform ${
                          safeProfile.emailNotifications
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-gray-600" />
                    <span className="text-gray-700">Langue</span>
                  </div>
                  {canEdit ? (
                    <select
                      value={editProfile.language || "fr"}
                      onChange={(e) =>
                        setEditProfile({
                          ...editProfile,
                          language: e.target.value,
                        })
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  ) : (
                    <span className="text-gray-600">
                      {safeProfile.language === "fr" ? "Français" : "English"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Biographie</h3>
              {isEditing ? (
                <textarea
                  value={editProfile.bio || ""}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Parlez-nous de vous..."
                />
              ) : (
                <p className="text-gray-600">
                  {safeProfile.bio || "Aucune biographie renseignée"}
                </p>
              )}
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {safePermissions.map((permission, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${getPermissionBadge(permission)}`}
                  >
                    {permission
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                ))}
              </div>
              {safePermissions.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Aucune permission spécifique
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'inscription</p>
                    <p className="font-semibold text-gray-900">
                      {safeProfile.joinDate ? new Date(safeProfile.joinDate).toLocaleDateString("fr-FR") : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dernière connexion</p>
                    <p className="font-semibold text-gray-900">
                      {safeProfile.lastLogin ? new Date(safeProfile.lastLogin).toLocaleDateString("fr-FR") : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Authentification 2FA
                    </p>
                    <p className="font-semibold text-gray-900">
                      {safeProfile.twoFactorEnabled ? "Activée" : "Désactivée"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rôle</p>
                    <p className="font-semibold text-gray-900">
                      {safeProfile.role === "super_admin"
                        ? "Super Administrateur"
                        : "Administrateur"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Changer le mot de passe
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Changer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}