"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import UserIdManager from "@/lib/user-id-manager";
import {
  User,
  BookOpen,
  Sparkles,
  Crown,
  Edit2,
  Save,
  X,
  Camera,
  Check,
  AlertCircle,
} from "lucide-react";
import { studentProfileApi } from "@/lib/services/student-profile-api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  role: string;
  subscription: string;
  level: number;
  joinDate: string;
  coursesCompleted: number;
  certificates: number;
  averageRating: number;
  completionRate: number;
  learningTime: number;
}

type SessionUser = {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string;
  role?: string;
};

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<UserProfile>>({});

  const { locale } = useParams();
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUser | undefined;

  const defaultUser = useMemo<UserProfile>(
    () => {
      const storedUserData = UserIdManager.getStoredUserData();

      return {
        id: String(
          sessionUser?.id || storedUserData?.id || UserIdManager.getCurrentUserId() || 3
        ),
        name: sessionUser?.name || storedUserData?.name || "Étudiant",
        email:
          sessionUser?.email || storedUserData?.email || "etudiant@example.com",
        phone: "+229 00 00 00 00",
        bio: "Passionné par l'apprentissage et le développement personnel",
        location: "Cotonou, Bénin",
        website: "https://monportfolio.com",
        avatar: sessionUser?.image || "/temoignage.png",
        role: "student",
        subscription: "FREE",
        level: 5,
        joinDate: "15 janvier 2024",
        coursesCompleted: 12,
        certificates: 8,
        averageRating: 4.7,
        completionRate: 85,
        learningTime: 156,
      };
    },
    [sessionUser?.email, sessionUser?.id, sessionUser?.image, sessionUser?.name]
  );

  // Charger les données utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setUser(defaultUser);
        try {
          const profile = await studentProfileApi.getProfile();
          setUser({
            ...defaultUser,
            ...profile,
            id: String(profile.id || defaultUser.id),
            role: profile.role || defaultUser.role,
            subscription: profile.subscription || defaultUser.subscription,
            level: Number(profile.level || defaultUser.level),
            coursesCompleted: Number(
              profile.coursesCompleted || defaultUser.coursesCompleted
            ),
            certificates: Number(
              profile.certificates || defaultUser.certificates
            ),
            averageRating: Number(
              profile.averageRating || defaultUser.averageRating
            ),
            completionRate: Number(
              profile.completionRate || defaultUser.completionRate
            ), 
            learningTime: Number(
              profile.learningTime || defaultUser.learningTime
            ),
          });
        } catch {
          const storedUserData = UserIdManager.getStoredUserData();

          if (storedUserData && storedUserData.role === "student") {
            setUser((prev) => ({
              ...(prev || defaultUser),
              id: storedUserData.id.toString(),
              name: storedUserData.name,
              email: storedUserData.email,
              avatar: storedUserData.avatar || "/temoignage.png",
            }));
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        setUser(defaultUser);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [defaultUser]);

  const handleEdit = () => {
    setEditedUser({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
    });
    setIsEditing(true);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    try {
      // Mettre à jour les données stockées localement
      const storedUserData = UserIdManager.getStoredUserData();

      if (storedUserData) {
        const updatedUserData = {
          ...storedUserData,
          name: editedUser.name || storedUserData.name,
          email: editedUser.email || storedUserData.email,
        };

        UserIdManager.storeAuthData({
          token: localStorage.getItem("token") || "",
          user: updatedUserData,
        });
      }

      // Mettre à jour l'état local immédiatement
      const updatedUser = {
        ...currentUser,
        ...editedUser,
      };
      setUser(updatedUser);
      setIsEditing(false);
      setSaveMessage({
        type: "success",
        message: "Profil mis à jour avec succès !",
      });

      try {
        const apiUpdatedUser =
          await studentProfileApi.updateProfile(editedUser);
        setUser((prev) => ({
          ...(prev || defaultUser),
          ...apiUpdatedUser,
          id: String(apiUpdatedUser.id || (prev || defaultUser).id),
        }));
      } catch {
        console.log("Sauvegarde API échouée, données locales conservées");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setSaveMessage({
        type: "error",
        message: "Erreur lors de la sauvegarde",
      });
    }

    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({});
    setSaveMessage(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const payload = await studentProfileApi.uploadAvatar(formData);
      setUser((prev) =>
        prev ? { ...prev, avatar: payload.avatarUrl || prev.avatar } : prev
      );
      setSaveMessage({
        type: "success",
        message: "Photo de profil mise à jour",
      });
    } catch {
      setSaveMessage({
        type: "error",
        message: "Erreur lors de l'envoi de l'image",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004D40]"></div>
      </div>
    );
  }

  const currentUser = user || defaultUser;

  return (
    <div className="w-full min-w-0 max-w-none space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="block w-full min-w-0 max-w-none space-y-6"
      >
        {/* Header avec bouton d'édition */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-xl font-bold text-[#002B24]">Mon Profil</h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-[#004D40] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#00695C] transition-colors"
            >
              <Edit2 size={18} />
              Modifier
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300 transition-colors"
              >
                <X size={18} />
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="bg-[#004D40] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#00695C] transition-colors"
              >
                <Save size={18} />
                Sauvegarder
              </button>
            </div>
          )}
        </div>

        {/* Message de sauvegarde */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              saveMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {saveMessage.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {saveMessage.message}
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          {/* Colonne principale - Informations du profil */}
          <div className="space-y-6 min-w-0">
            {/* Informations personnelles */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#002B24] mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-[#004D40]" />
                Informations Personnelles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name || currentUser.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email || currentUser.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone || currentUser.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.location || currentUser.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.location}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedUser.bio || currentUser.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.bio}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editedUser.website || currentUser.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.website}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Statistiques d'apprentissage */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#002B24] mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#004D40]" />
                Statistiques d&apos;Apprentissage
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#004D40]">
                    {currentUser.coursesCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Cours terminés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#004D40]">
                    {currentUser.certificates}
                  </div>
                  <div className="text-sm text-gray-600">Certificats</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#004D40]">
                    {currentUser.averageRating}
                  </div>
                  <div className="text-sm text-gray-600">Note moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#004D40]">
                    {currentUser.completionRate}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Taux de complétion
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale - Avatar et progression */}
          <div className="space-y-6 min-w-0">
            {/* Avatar */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#002B24] mb-6">
                Photo de profil
              </h2>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={currentUser.avatar || "/temoignage.png"}
                  alt="Profile"
                  fill
                  sizes="128px"
                  className="rounded-full object-cover border-4 border-gray-50"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Camera size={18} />
                Changer la photo
              </button>
            </div>

            {/* Niveau et progression */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#002B24] mb-6">Niveau</h2>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-[#004D40] mb-2">
                  Niveau {currentUser.level}
                </div>
                <div className="text-sm text-gray-600">Apprenant dédié</div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span>{currentUser.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#004D40] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentUser.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Temps d&apos;apprentissage</span>
                    <span>{currentUser.learningTime}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#FF6B35] h-2 rounded-full"
                      style={{
                        width: `${Math.min((currentUser.learningTime / 200) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Abonnement */}
            <div className="bg-gradient-to-r from-[#004D40] to-[#00695C] rounded-2xl shadow-sm p-8 text-white w-full">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-6 h-6" />
                <h2 className="text-lg font-bold">Abonnement</h2>
              </div>
              <div className="text-center mb-6">
                <div className="text-2xl font-bold mb-2">
                  {currentUser.subscription}
                </div>
                <div className="text-sm opacity-90">
                  Membre depuis {currentUser.joinDate}
                </div>
              </div>
              <button
                onClick={() =>
                  window.location.assign(`/${locale}/dashboard/creator/become`)
                }
                className="w-full bg-white/20 backdrop-blur text-white px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/30 transition-colors border border-white/30 font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Demander un accès créateur
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
