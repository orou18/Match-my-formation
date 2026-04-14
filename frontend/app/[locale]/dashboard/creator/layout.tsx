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
  const [mounted, setMounted] = useState(false);
  const [branding, setBranding] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { data: session, status } = useSession();

  // Données utilisateur simulées pour la démo
  const user: SessionUser & {
    subscription: string;
    level: number;
    followers: string;
    views: string;
    revenue: string;
  } = {
    name: session?.user?.name || "Jean Formateur",
    email: session?.user?.email || "creator@match.com",
    image: session?.user?.image || null,
    role: (session?.user as SessionUser | undefined)?.role || "creator",
    subscription: "PRO",
    level: 12,
    followers: "3.4K",
    views: "45.6K",
    revenue: "2,850",
  };

  // Charger les données de branding
  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch("/api/branding");
        if (response.ok) {
          const data = await response.json();
          setBranding(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du branding:", error);
      }
    };
    loadBranding();
  }, []);

  useEffect(() => setMounted(true), []);

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
    // {
    //   name: "Analytiques",
    //   icon: BarChart3,
    //   href: `/${locale}/dashboard/creator/stats`,
    //   badge: null,
    //   color: "from-orange-500 to-orange-600",
    // },
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
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    signOut({ redirect: false }).catch(() => {});
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
        className={`fixed top-0 left-0 z-50 w-[min(18rem,calc(100vw-1rem))] lg:w-72 backdrop-blur-md border-r transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static shadow-2xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: branding?.background_color || "#ffffff",
          borderColor: branding?.border_color || "#e5e7eb",
        }}
      >
        {/* Header avec Logo */}
        <div
          className="h-16 border-b flex items-center justify-between px-4 flex-shrink-0"
          style={{
            backgroundColor: branding?.surface_color || "#f8fafc",
            borderColor: branding?.border_color || "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              {branding?.logo_url ? (
                <img
                  src={branding.logo_url}
                  alt={branding.company_name || "Logo"}
                  className="w-10 h-10 rounded-lg object-contain"
                  onError={(e) => {
                    // Fallback si l'image ne charge pas
                    (e.target as HTMLImageElement).style.display = "none";
                    (
                      e.target as HTMLImageElement
                    ).nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${branding?.logo_url ? "hidden" : ""}`}
                style={{
                  backgroundColor: branding?.primary_color || "#1F2937",
                }}
              >
                <span className="text-white font-bold text-lg">
                  {branding?.company_name?.charAt(0) || "M"}
                </span>
              </div>
            </div>
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: branding?.text_color || "#1f2937" }}
              >
                {branding?.company_name || "Match My Formation"}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className="text-xs"
                  style={{ color: branding?.text_secondary || "#6b7280" }}
                >
                  Espace Créateur
                </span>
                <Award
                  className="w-3 h-3"
                  style={{ color: branding?.accent_color || "#D97706" }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: branding?.text_secondary || "#6b7280" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats */}
        <div
          className="px-4 py-4 border-b flex-shrink-0"
          style={{
            backgroundColor: branding?.surface_color || "#f8fafc",
            borderColor: branding?.border_color || "#e5e7eb",
          }}
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${branding?.background_color || "#ffffff"}99`,
              }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp
                  className="w-3 h-3"
                  style={{ color: branding?.primary_color || "#3B82F6" }}
                />
                <p
                  className="text-sm font-bold"
                  style={{ color: branding?.text_color || "#1f2937" }}
                >
                  {user.level}
                </p>
              </div>
              <p
                className="text-xs"
                style={{ color: branding?.text_secondary || "#6b7280" }}
              >
                Niveau
              </p>
            </div>
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${branding?.background_color || "#ffffff"}99`,
              }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users
                  className="w-3 h-3"
                  style={{ color: branding?.secondary_color || "#1D4ED8" }}
                />
                <p
                  className="text-sm font-bold"
                  style={{ color: branding?.text_color || "#1f2937" }}
                >
                  {user.followers}
                </p>
              </div>
              <p
                className="text-xs"
                style={{ color: branding?.text_secondary || "#6b7280" }}
              >
                Abonnés
              </p>
            </div>
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${branding?.background_color || "#ffffff"}99`,
              }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye
                  className="w-3 h-3"
                  style={{ color: branding?.accent_color || "#D97706" }}
                />
                <p
                  className="text-sm font-bold"
                  style={{ color: branding?.text_color || "#1f2937" }}
                >
                  {user.views}
                </p>
              </div>
              <p
                className="text-xs"
                style={{ color: branding?.text_secondary || "#6b7280" }}
              >
                Vues
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 pb-20">
          <div className="space-y-1">
            {navigation.map((item) => {
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                    active ? "text-white shadow-lg" : ""
                  }`}
                  style={{
                    color: active ? "white" : branding?.text_color || "#1f2937",
                  }}
                >
                  {/* Fond coloré (Visible uniquement si ACTIF) */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                      style={{
                        background: active
                          ? `linear-gradient(to right, ${branding?.primary_color || "#3B82F6"}, ${branding?.secondary_color || "#1D4ED8"})`
                          : "none",
                      }}
                    />
                  )}

                  {/* Contenu : On utilise z-20 pour être SUR que le texte est devant le fond */}
                  <div className="relative z-20 flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                      style={{
                        backgroundColor: active
                          ? "rgba(255, 255, 255, 0.2)"
                          : branding?.surface_color || "#f8fafc",
                      }}
                    >
                      <item.icon
                        size={16}
                        className="transition-colors"
                        style={{
                          color: active
                            ? "white"
                            : branding?.text_secondary || "#6b7280",
                        }}
                      />
                    </div>
                    <span
                      className="font-medium truncate transition-colors"
                      style={{
                        color: active
                          ? "white"
                          : branding?.text_color || "#1f2937",
                      }}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className="relative z-20 px-2 py-0.5 text-[10px] font-bold rounded-full transition-all"
                      style={{
                        backgroundColor: active
                          ? "rgba(255, 255, 255, 0.2)"
                          : branding?.surface_color || "#f8fafc",
                        color: active
                          ? "white"
                          : branding?.text_secondary || "#6b7280",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 border-t"
          style={{
            backgroundColor: branding?.surface_color || "#f8fafc",
            borderColor: branding?.border_color || "#e5e7eb",
          }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group"
            style={{ color: branding?.accent_color || "#D97706" }}
          >
            <div
              className="p-1.5 rounded-lg group-hover:bg-red-100/80"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            >
              <LogOut
                size={16}
                style={{ color: branding?.accent_color || "#D97706" }}
              />
            </div>
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
