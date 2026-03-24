"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield, Bell, Settings, CreditCard, Star, GraduationCap, Camera, Edit2, X, Check, AlertCircle } from "lucide-react";

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
  const currentUser: UserProfile = {
    id: '1',
    name: session?.user?.name || "Étudiant",
    email: session?.user?.email || "etudiant@example.com",
    avatar: session?.user?.image || "/temoignage.png",
    role: (session?.user as any)?.role || "student",
    subscription: "FREE",
    level: 1,
    notifications: 0
  };

  const navLinks = [
    { name: "Profil", href: `/${locale}/dashboard/student/profile`, icon: User },
    { name: "Sécurité", href: `/${locale}/dashboard/student/profile/security`, icon: Shield },
    { name: "Notifications", href: `/${locale}/dashboard/student/profile/notifications`, icon: Bell, badge: notificationCount },
    { name: "Préférences", href: `/${locale}/dashboard/student/profile/preferences`, icon: Settings },
    { name: "Facturation", href: `/${locale}/dashboard/student/profile/billing`, icon: CreditCard },
  ];

  // Charger les données depuis l'API en arrière-plan
  useEffect(() => {
    if (session?.user) {
      loadUserData();
    }
  }, [session]);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  // Charger les notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/user/notifications/unread-count', {
          headers: {
            'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data.count || 0);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
        setNotificationCount(0);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUser(prev => prev ? { ...prev, avatar: data.avatarUrl } : null);
        setIsEditingAvatar(false);
        console.log('Avatar uploadé avec succès:', data.avatarUrl);
      } else {
        throw new Error('Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      alert('Erreur lors du téléchargement de la photo');
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
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col items-center w-full min-h-[600px]">
      {/* Avatar avec possibilité de modification */}
      <div className="relative w-24 h-24 mb-6 group">
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
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#002B24] mb-1">{displayUser.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{displayUser.email}</p>
        
        <div className="flex flex-col gap-2">
          <div className="bg-[#EEF2FF] text-[#4F46E5] px-4 py-1.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold">
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
                  ? "bg-[#004D40] text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-[#004D40]"
              }`}
            >
              <link.icon size={20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
              <span className="text-sm font-bold">{link.name}</span>
              
              {/* Badge pour les notifications non lues */}
              {link.badge && link.badge > 0 && (
                <span className="absolute right-4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {link.badge > 9 ? '9+' : link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bouton Devenir créateur */}
      <button className="w-full mt-8 bg-[#FFF9EB] text-[#D97706] p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-xs hover:bg-[#FEF3C7] transition-colors">
        <Star size={18} fill="currentColor" />
        Devenir créateur
      </button>
    </div>
  );
}