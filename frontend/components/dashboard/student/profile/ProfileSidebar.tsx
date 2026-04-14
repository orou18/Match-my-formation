"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import {
  User,
  Shield,
  Bell,
  Settings,
  CreditCard,
  Star,
  GraduationCap,
  Camera,
  X,
} from "lucide-react";
import { studentProfileApi } from "@/lib/services/student-profile-api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  subscription: string;
  level: number;
  notifications: number;
}

export default function ProfileSidebar() {
  const pathname = usePathname();
  const { locale } = useParams();
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Données utilisateur garanties - TOUJOURS DISPONIBLES
  const currentUser = useMemo<UserProfile>(
    () => ({
      id: "1",
      name: session?.user?.name || "Étudiant",
      email: session?.user?.email || "etudiant@example.com",
      avatar: session?.user?.image || "/temoignage.png",
      role: (session?.user as { role?: string } | undefined)?.role || "student",
      subscription: "FREE",
      level: 1,
      notifications: 0,
    }),
    [session]
  );

  const navLinks = [
    {
      name: "Profil",
      href: `/${locale}/dashboard/student/profile`,
      icon: User,
    },
    {
      name: "Sécurité",
      href: `/${locale}/dashboard/student/profile/security`,
      icon: Shield,
    },
    {
      name: "Notifications",
      href: `/${locale}/dashboard/student/profile/notifications`,
      icon: Bell,
      badge: notificationCount,
    },
    {
      name: "Préférences",
      href: `/${locale}/dashboard/student/profile/preferences`,
      icon: Settings,
    },
    {
      name: "Facturation",
      href: `/${locale}/dashboard/student/profile/billing`,
      icon: CreditCard,
    },
  ];

  // Charger les données depuis l'API en arrière-plan
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await studentProfileApi.getProfile();
        setUser({
          ...currentUser,
          ...userData,
          id: String(userData.id || currentUser.id),
          role: userData.role || currentUser.role,
          subscription: userData.subscription || currentUser.subscription,
          level: Number(userData.level || currentUser.level),
        });
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };

    loadUserData();
  }, [session, currentUser]);

  // Charger les notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await studentProfileApi.getUnreadCount();
        setNotificationCount(data.count || 0);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
        setNotificationCount(0);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const data = await studentProfileApi.uploadAvatar(formData);
      setUser((prev) => (prev ? { ...prev, avatar: data.avatarUrl } : null));
      setIsEditingAvatar(false);
    } catch (error) {
      console.error("Erreur upload avatar:", error);
      alert("Erreur lors du téléchargement de la photo");
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  // Utiliser les données utilisateur (API ou session)
  const displayUser = user || currentUser;

  return (
    <div className="flex flex-col h-full lg:flex-col lg:items-stretch lg:rounded-[2.5rem] lg:border lg:border-gray-50 lg:bg-white lg:p-8 lg:shadow-sm lg:w-full lg:max-w-[280px] bg-gradient-to-b from-[#004D40] to-[#002B24] text-white">
      {/* Header mobile */}
      <div className="lg:hidden p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Menu Profil</h2>
          <div className="w-8 h-8 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-0 lg:pt-0">
        {/* Avatar avec possibilité de modification */}
        <div className="relative mb-6 h-24 w-24 self-center group">
          <Image
            src={displayUser.avatar || "/temoignage.png"}
            alt="Profile"
            fill
            sizes="96px"
            className="rounded-full object-cover border-4 border-gray-50"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/temoignage.png";
            }}
          />

          {/* Bouton pour modifier l'avatar */}
          <button
            onClick={() => setIsEditingAvatar(true)}
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>

          {/* Input pour l'upload d'avatar */}
          {isEditingAvatar && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-100"
              >
                Choisir
              </label>
              <button
                onClick={() => setIsEditingAvatar(false)}
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Informations utilisateur */}
        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold text-white mb-1 lg:text-[#002B24]">
            {displayUser.name}
          </h3>
          <p className="text-sm text-white/80 mb-3 lg:text-gray-500">
            {displayUser.email}
          </p>

          <div className="flex flex-col gap-2">
            <div className="bg-white/20 text-white px-4 py-1.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold lg:bg-[#EEF2FF] lg:text-[#4F46E5]">
              <GraduationCap size={14} />
              {displayUser.role === "creator" ? "Créateur" : "Apprenant"}
            </div>

            {displayUser.subscription && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold">
                <Star size={14} />
                {displayUser.subscription}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="w-full space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-white/20 text-white shadow-lg shadow-white/10 lg:bg-[#004D40] lg:text-white lg:shadow-lg lg:shadow-primary/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white lg:text-gray-400 lg:hover:bg-gray-50 lg:hover:text-[#004D40]"
                }`}
              >
                <link.icon
                  size={20}
                  className={
                    isActive
                      ? "text-white"
                      : "text-white/70 group-hover:text-white lg:text-gray-400 lg:group-hover:scale-110 lg:group-hover:text-[#004D40] lg:transition-transform"
                  }
                />
                <span className="text-sm font-bold">{link.name}</span>

                {/* Badge pour les notifications non lues */}
                {link.badge && link.badge > 0 && (
                  <span className="absolute right-4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {link.badge > 9 ? "9+" : link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bouton Devenir créateur */}
        <button
          onClick={() =>
            window.location.assign(
              `/${String(locale || "fr")}/dashboard/creator/become`
            )
          }
          className="w-full mt-8 bg-[#FFF9EB] text-[#D97706] p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-xs hover:bg-[#FEF3C7] transition-colors"
        >
          <Star size={18} fill="currentColor" />
          Devenir créateur
        </button>
      </div>
    </div>
  );
}
