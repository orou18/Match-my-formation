"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import UserIdManager from "@/lib/user-id-manager";
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
  Mail,
  Folder,
  Image,
  TrendingUp,
  Award,
  Target,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

interface CreatorLayoutProps {
  children: React.ReactNode;
}

type SessionUser = {
  role?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const { data: session, status } = useSession();
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!mounted || status !== "unauthenticated") {
      return;
    }

    router.replace(`/${locale}/login`);
  }, [locale, mounted, router, status]);

  const user = {
    name: session?.user?.name || "Jean Formateur",
    email: session?.user?.email || "creator@match.com",
    role: (session?.user as SessionUser | undefined)?.role || "creator",
    subscription: "PRO",
    level: 12,
    followers: "3.4K",
    views: "45.6K",
    revenue: "€2,850",
    avatar: session?.user?.image || null,
  };

  const navigation = [
    {
      name: "Tableau de bord",
      icon: LayoutDashboard,
      href: `/${locale}/dashboard/creator`,
      badge: null,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Contenu",
      icon: Video,
      href: `/${locale}/dashboard/creator/videos`,
      badge: "12",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Créer une vidéo",
      icon: Video,
      href: `/${locale}/dashboard/creator/videos/create`,
      badge: null,
      color: "from-green-500 to-green-600",
    },
    {
      name: "Employés",
      icon: Users,
      href: `/${locale}/dashboard/creator/employees`,
      badge: null,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      name: "Progression",
      icon: BarChart3,
      href: `/${locale}/dashboard/creator/progress`,
      badge: null,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      name: "Analytics Employés",
      icon: Activity,
      href: `/${locale}/dashboard/creator/analytics`,
      badge: null,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Parcours",
      icon: Target,
      href: `/${locale}/dashboard/creator/pathways`,
      badge: null,
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Analytiques",
      icon: BarChart3,
      href: `/${locale}/dashboard/creator/stats`,
      badge: null,
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Audience",
      icon: Users,
      href: `/${locale}/dashboard/creator/audience`,
      badge: "3.4K",
      color: "from-pink-500 to-pink-600",
    },
    {
      name: "Revenus",
      icon: DollarSign,
      href: `/${locale}/dashboard/creator/revenue`,
      badge: "+18%",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Engagement",
      icon: Heart,
      href: `/${locale}/dashboard/creator/engagement`,
      badge: "89%",
      color: "from-rose-500 to-rose-600",
    },
    {
      name: "Commentaires",
      icon: MessageSquare,
      href: `/${locale}/dashboard/creator/comments`,
      badge: "5",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      name: "Partages",
      icon: Share2,
      href: `/${locale}/dashboard/creator/shares`,
      badge: "234",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      name: "Bibliothèque",
      icon: Folder,
      href: `/${locale}/dashboard/creator/library`,
      badge: null,
      color: "from-amber-500 to-amber-600",
    },
    {
      name: "Médias",
      icon: Image,
      href: `/${locale}/dashboard/creator/media`,
      badge: null,
      color: "from-teal-500 to-teal-600",
    },
    {
      name: "Planning",
      icon: Calendar,
      href: `/${locale}/dashboard/creator/schedule`,
      badge: null,
      color: "from-violet-500 to-violet-600",
    },
    {
      name: "Historique",
      icon: Clock,
      href: `/${locale}/dashboard/creator/history`,
      badge: null,
      color: "from-gray-500 to-gray-600",
    },
    {
      name: "Notifications",
      icon: Bell,
      href: `/${locale}/dashboard/creator/notifications`,
      badge: "5",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      name: "Marque blanche",
      icon: Palette,
      href: `/${locale}/dashboard/creator/branding`,
      badge: "PRO",
      color: "from-gradient-to-r from-yellow-400 to-orange-400",
    },
    {
      name: "Paramètres",
      icon: Settings,
      href: `/${locale}/dashboard/creator/settings`,
      badge: null,
      color: "from-slate-500 to-slate-600",
    },
    {
      name: "Mon profil",
      icon: User,
      href: `/${locale}/dashboard/creator/profile`,
      badge: null,
      color: "from-zinc-500 to-zinc-600",
    },
  ];

  const handleLogout = () => {
    console.log("Déconnexion depuis le dashboard creator...");
    fetch("/api/auth/logout", { method: "POST" }).catch(() => { });
    signOut({ redirect: false }).catch(() => { });
    UserIdManager.logout();
    window.location.href = `/${locale}`;
  };

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (!mounted || status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white/90 px-8 py-10 shadow-xl backdrop-blur">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <div className="text-center">
            <p className="text-base font-semibold text-gray-900">
              Chargement de votre espace createur
            </p>
            <p className="text-sm text-gray-600">
              Nous verifions votre session avant d&apos;afficher le dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-x-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-[min(18rem,calc(100vw-1rem))] lg:w-72 bg-white/95 backdrop-blur-md border-r border-gray-200/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static shadow-2xl lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200/50 flex items-center justify-between px-4 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {user.name?.charAt(0) || "J"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{user.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">
                  {user.subscription}
                </span>
                <Award className="w-3 h-3 text-yellow-500" />
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50 flex-shrink-0">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <p className="text-sm font-bold text-gray-900">{user.level}</p>
              </div>
              <p className="text-xs text-gray-600">Niveau</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-3 h-3 text-purple-500" />
                <p className="text-sm font-bold text-gray-900">
                  {user.followers}
                </p>
              </div>
              <p className="text-xs text-gray-600">Abonnés</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-3 h-3 text-green-500" />
                <p className="text-sm font-bold text-gray-900">{user.views}</p>
              </div>
              <p className="text-xs text-gray-600">Vues</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 panel-scroll p-3 pb-20">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center justify-between overflow-hidden rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${isActiveRoute(item.href)
                    ? "bg-gradient-to-r " +
                    item.color +
                    " text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-700 hover:bg-gray-100/80 hover:shadow-md hover:-translate-y-0.5"
                  }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`flex-shrink-0 p-1.5 rounded-lg ${isActiveRoute(item.href)
                        ? "bg-white/20"
                        : "bg-gray-100/80 group-hover:bg-gray-200/80"
                      }`}
                  >
                    <item.icon
                      size={16}
                      className={
                        isActiveRoute(item.href)
                          ? "text-white"
                          : "text-gray-600"
                      }
                    />
                  </div>
                  <span
                    className={`font-medium truncate ${isActiveRoute(item.href)
                        ? "text-white"
                        : "text-gray-700 group-hover:text-gray-900"
                      }`}
                  >
                    {item.name}
                  </span>
                </div>
                {item.badge && (
                  <span
                    className={`relative z-10 px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${item.badge === "PRO"
                        ? isActiveRoute(item.href)
                          ? "bg-white/20 text-white"
                          : "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm"
                        : isActiveRoute(item.href)
                          ? "bg-white/20 text-white"
                          : "bg-gray-100/80 text-gray-700 group-hover:bg-gray-200/80"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActiveRoute(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="pointer-events-none absolute inset-0 z-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 group"
          >
            <div className="p-1.5 bg-red-100/80 rounded-lg group-hover:bg-red-200/80">
              <LogOut size={16} className="text-red-600" />
            </div>
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Navbar */}
        <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
              aria-label="Ouvrir le menu createur"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 w-64 lg:w-80 border border-gray-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/50 backdrop-blur-sm transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              <Mail size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-gray-200/50">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.subscription}</p>
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user.name?.charAt(0) || "J"}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
