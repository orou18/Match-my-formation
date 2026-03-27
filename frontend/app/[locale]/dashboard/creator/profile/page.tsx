"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  CreditCard,
  Bell,
  Globe,
  Lock,
  Settings,
} from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  created_at: string;
  settings: {
    email_notifications: boolean;
    push_notifications: boolean;
    public_profile: boolean;
    language: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Générer les initiales du nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");

      // Récupérer les données depuis localStorage en fallback
      const storedName = localStorage.getItem("userName") || "";
      const storedEmail = localStorage.getItem("userEmail") || "";

      try {
        const res = await fetch("http://127.0.0.1:8000/api/creator/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFormData(data);
          setAvatarPreview(data.avatar || "");
        } else {
          // Fallback avec données localStorage
          const fallbackProfile: UserProfile = {
            id: 1,
            name: storedName || "Creator Name",
            email: storedEmail || "creator@match.com",
            phone: "",
            bio: "",
            location: "",
            website: "",
            avatar: "",
            created_at: new Date().toISOString(),
            settings: {
              email_notifications: true,
              push_notifications: true,
              public_profile: true,
              language: "fr",
            },
          };
          setProfile(fallbackProfile);
          setFormData(fallbackProfile);
          setAvatarPreview(fallbackProfile.avatar || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fallback garanti avec données localStorage
        const fallbackProfile: UserProfile = {
          id: 1,
          name: storedName || "Creator Name",
          email: storedEmail || "creator@match.com",
          phone: "",
          bio: "",
          location: "",
          website: "",
          avatar: "",
          created_at: new Date().toISOString(),
          settings: {
            email_notifications: true,
            push_notifications: true,
            public_profile: true,
            language: "fr",
          },
        };
        setProfile(fallbackProfile);
        setFormData(fallbackProfile);
        setAvatarPreview(fallbackProfile.avatar || "");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Gestion de l'upload d'avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const preview = event.target?.result as string;
      setAvatarPreview(preview);

      // Simulation d'upload
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, avatar: preview }));
        setUploadingAvatar(false);
      }, 1000);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/creator/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setAvatarPreview(updatedProfile.avatar || "");

        // Mettre à jour localStorage
        localStorage.setItem("userName", updatedProfile.name);
        localStorage.setItem("userEmail", updatedProfile.email);

        setEditing(false);
      } else {
        // Fallback local
        const updatedProfile: UserProfile = {
          ...profile!,
          ...formData,
          avatar: avatarPreview,
          id: profile?.id || 1,
          created_at: profile?.created_at || new Date().toISOString(),
          settings: {
            email_notifications: formData.settings?.email_notifications ?? true,
            push_notifications: formData.settings?.push_notifications ?? true,
            public_profile: formData.settings?.public_profile ?? true,
            language: formData.settings?.language ?? "fr",
          },
        };
        setProfile(updatedProfile);
        setFormData(updatedProfile);

        // Mettre à jour localStorage
        localStorage.setItem("userName", updatedProfile.name);
        localStorage.setItem("userEmail", updatedProfile.email);

        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Fallback garanti
      const updatedProfile: UserProfile = {
        ...profile!,
        ...formData,
        avatar: avatarPreview,
        id: profile?.id || 1,
        created_at: profile?.created_at || new Date().toISOString(),
        settings: formData.settings ||
          profile?.settings || {
            email_notifications: true,
            push_notifications: true,
            public_profile: true,
            language: "fr",
          },
      };
      setProfile(updatedProfile);
      setFormData(updatedProfile);

      // Mettre à jour localStorage
      localStorage.setItem("userName", updatedProfile.name);
      localStorage.setItem("userEmail", updatedProfile.email);

      setEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-8 animate-pulse">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon profil</h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={profile?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {getInitials(profile?.name || "User")}
                    </span>
                  </div>
                )}
              </div>
              {editing && (
                <>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-gray-600" />
                    )}
                  </label>
                </>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {profile?.name}
              </h2>
              <p className="text-white/80 mb-2">
                {profile?.bio || "Aucune biographie"}
              </p>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Membre depuis{" "}
                  {new Date(profile?.created_at || "").toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile?.phone || "Non renseigné"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile?.location || "Non renseigné"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biographie
            </label>
            {editing ? (
              <textarea
                value={formData.bio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Parlez-nous de vous..."
              />
            ) : (
              <p className="text-gray-900">
                {profile?.bio || "Aucune biographie renseignée"}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site web
            </label>
            {editing ? (
              <input
                type="url"
                value={formData.website || ""}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="https://votresite.com"
              />
            ) : (
              <p className="text-gray-900">
                {profile?.website ? (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profile.website}
                  </a>
                ) : (
                  "Non renseigné"
                )}
              </p>
            )}
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Préférences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Notifications email
                  </p>
                  <p className="text-sm text-gray-500">
                    Recevoir des notifications par email
                  </p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.settings?.email_notifications
                      ? "bg-primary"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (editing) {
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          push_notifications:
                            formData.settings?.push_notifications ?? true,
                          public_profile:
                            formData.settings?.public_profile ?? true,
                          language: formData.settings?.language ?? "fr",
                          email_notifications:
                            !formData.settings?.email_notifications,
                        },
                      });
                    }
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.settings?.email_notifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Profil public</p>
                  <p className="text-sm text-gray-500">
                    Rendre votre profil visible publiquement
                  </p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.settings?.public_profile
                      ? "bg-primary"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (editing) {
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          push_notifications:
                            formData.settings?.push_notifications ?? true,
                          public_profile: !formData.settings?.public_profile,
                          language: formData.settings?.language ?? "fr",
                          email_notifications:
                            formData.settings?.email_notifications ?? true,
                        },
                      });
                    }
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.settings?.public_profile
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
