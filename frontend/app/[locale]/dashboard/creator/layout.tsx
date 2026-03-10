"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  BarChart3,
  Users,
  DollarSign,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Calendar,
  Clock,
  Bell,
  Settings,
  Palette,
  User,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
  Mail,
  Folder,
  Image,
  Music,
  Download,
} from "lucide-react";

interface CreatorLayoutProps {
  children: React.ReactNode;
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const user = {
    name: "Jean Formateur",
    email: "creator@match.com",
    role: "creator",
    subscription: "PRO",
    level: 12,
    followers: "3.4K",
    views: "45.6K",
    revenue: "€2,850"
  };

  const navigation = [
    {
      name: "Tableau de bord",
      icon: LayoutDashboard,
      href: `/${locale}/dashboard/creator`,
      badge: null
    },
    {
      name: "Contenu",
      icon: Video,
      href: `/${locale}/dashboard/creator/videos`,
      badge: "12"
    },
    {
      name: "Créer une vidéo",
      icon: Video,
      href: `/${locale}/dashboard/creator/videos/create`,
      badge: null
    },
    {
      name: "Analytiques",
      icon: BarChart3,
      href: `/${locale}/dashboard/creator/stats`,
      badge: null
    },
    {
      name: "Audience",
      icon: Users,
      href: `/${locale}/dashboard/creator/audience`,
      badge: "3.4K"
    },
    {
      name: "Revenus",
      icon: DollarSign,
      href: `/${locale}/dashboard/creator/revenue`,
      badge: "+18%"
    },
    {
      name: "Engagement",
      icon: Heart,
      href: `/${locale}/dashboard/creator/engagement`,
      badge: "89"
    },
    {
      name: "Commentaires",
      icon: MessageSquare,
      href: `/${locale}/dashboard/creator/comments`,
      badge: null
    },
    {
      name: "Partages",
      icon: Share2,
      href: `/${locale}/dashboard/creator/shares`,
      badge: "234"
    },
    {
      name: "Bibliothèque",
      icon: Folder,
      href: `/${locale}/dashboard/creator/library`,
      badge: null
    },
    {
      name: "Médias",
      icon: Image,
      href: `/${locale}/dashboard/creator/media`,
      badge: null
    },
    {
      name: "Planning",
      icon: Calendar,
      href: `/${locale}/dashboard/creator/schedule`,
      badge: null
    },
    {
      name: "Historique",
      icon: Clock,
      href: `/${locale}/dashboard/creator/history`,
      badge: null
    },
    {
      name: "Notifications",
      icon: Bell,
      href: `/${locale}/dashboard/creator/notifications`,
      badge: "5"
    },
    {
      name: "Marque blanche",
      icon: Palette,
      href: `/${locale}/dashboard/creator/branding`,
      badge: "PRO"
    },
    {
      name: "Paramètres",
      icon: Settings,
      href: `/${locale}/dashboard/creator/settings`,
      badge: null
    },
    {
      name: "Mon profil",
      icon: User,
      href: `/${locale}/dashboard/creator/profile`,
      badge: null
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push(`/${locale}/login`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-72 h-screen bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.subscription}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-sm font-bold text-gray-900">{user.level}</p>
              <p className="text-xs text-gray-600">Niveau</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{user.followers}</p>
              <p className="text-xs text-gray-600">Abonnés</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{user.views}</p>
              <p className="text-xs text-gray-600">Vues</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} className="text-gray-500" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    item.badge === "PRO" 
                      ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-9 pr-3 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="relative p-2 text-gray-500">
              <Mail size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.subscription}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
