"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
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
  EyeOff
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

export default function AdminProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editProfile, setEditProfile] = useState<Partial<AdminProfile>>({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
          setEditProfile(data.profile);
        } else {
          console.error('Erreur lors du chargement du profil');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProfile),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setEditProfile(updatedProfile);
        setIsEditing(false);
        alert('Profil mis à jour avec succès!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      const response = await fetch('/api/admin/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Mot de passe modifié avec succès!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du changement de mot de passe');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/admin/profile/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => prev ? { ...prev, avatar: data.avatar } : null);
        setEditProfile(prev => ({ ...prev, avatar: data.avatar }));
        alert('Avatar mis à jour avec succès!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const canEdit = profile?.role === 'super_admin' || 
    (profile?.permissions?.includes('profile_edit') || false);

  const getPermissionBadge = (permission: string) => {
    const category = permission.split('_')[0];
    switch (category) {
      case 'users':
        return 'bg-blue-100 text-blue-700';
      case 'creators':
        return 'bg-green-100 text-green-700';
      case 'content':
        return 'bg-purple-100 text-purple-700';
      case 'ads':
        return 'bg-orange-100 text-orange-700';
      case 'webinars':
        return 'bg-red-100 text-red-700';
      case 'analytics':
        return 'bg-indigo-100 text-indigo-700';
      case 'settings':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Impossible de charger le profil</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Profil Administrateur</h1>
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
                      setEditProfile(profile);
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
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
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
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
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
                      value={editProfile.name || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      className="text-center border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    profile.name
                  )}
                </h2>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    profile.role === 'super_admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {profile.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    profile.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {profile.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editProfile.email || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      profile.email
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editProfile.phone || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      profile.phone || 'Non renseigné'
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editProfile.location || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      profile.location || 'Non renseigné'
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={16} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editProfile.department || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, department: e.target.value })}
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      profile.department || 'Non renseigné'
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
                      onClick={() => setEditProfile({ ...editProfile, emailNotifications: !editProfile.emailNotifications })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        editProfile.emailNotifications ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                        editProfile.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  ) : (
                    <span className={`w-12 h-6 rounded-full ${
                      profile.emailNotifications ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform ${
                        profile.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
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
                      value={editProfile.language || 'fr'}
                      onChange={(e) => setEditProfile({ ...editProfile, language: e.target.value })}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  ) : (
                    <span className="text-gray-600">{profile.language === 'fr' ? 'Français' : 'English'}</span>
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
                  value={editProfile.bio || ''}
                  onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Parlez-nous de vous..."
                />
              ) : (
                <p className="text-gray-600">
                  {profile.bio || 'Aucune biographie renseignée'}
                </p>
              )}
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.permissions.map((permission, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${getPermissionBadge(permission)}`}
                  >
                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                ))}
              </div>
              {profile.permissions.length === 0 && (
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
                      {new Date(profile.joinDate).toLocaleDateString('fr-FR')}
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
                      {new Date(profile.lastLogin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Authentification 2FA</p>
                    <p className="font-semibold text-gray-900">
                      {profile.twoFactorEnabled ? 'Activée' : 'Désactivée'}
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
                      {profile.role === 'super_admin' ? 'Super Administrateur' : 'Administrateur'}
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Changer le mot de passe</h3>
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
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
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
