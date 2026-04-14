"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Users,
  Shield,
  DollarSign,
  Video,
  FileText,
  Settings,
  Bell,
  LogOut,
  Crown,
  Plus,
  Edit,
  LayoutDashboard,
  BarChart3,
  UserCheck,
  Palette,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { locale } = useParams();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Principal",
    "Gestion",
    "Contenu",
    "Système",
  ]);

  const currentLocale = locale || "fr";

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Éviter l'hydratation en attendant que la session soit chargée
  if (status === "loading") {
    return (
      <aside className="fixed lg:static inset-y-0 left-0 z-40 h-screen w-80 bg-white border-r border-gray-200">
        <div className="flex h-full min-h-0 flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 p-2">
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const navSections = [
    {
      title: "Principal",
      items: [
        {
          name: "Tableau de bord",
          href: `/${currentLocale}/dashboard/admin`,
          icon: LayoutDashboard,
          badge: null,
        },
        {
          name: "Analytics",
          href: `/${currentLocale}/dashboard/admin/analytics`,
          icon: BarChart3,
          badge: null,
        },
      ],
    },
    {
      title: "Gestion",
      items: [
        {
          name: "Utilisateurs",
          href: `/${currentLocale}/dashboard/admin/users`,
          icon: Users,
          badge: "2,847",
        },
        {
          name: "Créateurs",
          href: `/${currentLocale}/dashboard/admin/creators`,
          icon: UserCheck,
          badge: "156",
        },
        {
          name: "Administrateurs",
          href: `/${currentLocale}/dashboard/admin/admins`,
          icon: Shield,
          badge: "5",
        },
      ],
    },
    {
      title: "Contenu",
      items: [
        {
          name: "Créer une vidéo",
          href: `/${currentLocale}/dashboard/admin/videos/create`,
          icon: Plus,
          badge: "NOUVEAU",
          color: "from-green-500 to-green-600",
        },
        {
          name: "Mes vidéos",
          href: `/${currentLocale}/dashboard/admin/videos`,
          icon: Video,
          badge: null,
          color: "from-blue-500 to-blue-600",
        },
        {
          name: "Publicités",
          href: `/${currentLocale}/dashboard/admin/ads`,
          icon: DollarSign,
          badge: null,
        },
        {
          name: "Webinaires",
          href: `/${currentLocale}/dashboard/admin/webinars`,
          icon: Video,
          badge: "12",
        },
        {
          name: "Blog",
          href: `/${currentLocale}/dashboard/admin/blog`,
          icon: FileText,
          badge: null,
        },
      ],
    },
    {
      title: "Système",
      items: [
        {
          name: "Paramètres",
          href: `/${currentLocale}/dashboard/admin/settings`,
          icon: Settings,
          badge: null,
        },
        {
          name: "Marque Blanche",
          href: `/${currentLocale}/dashboard/admin/branding`,
          icon: Palette,
          badge: null,
        },
        {
          name: "Notifications",
          href: `/${currentLocale}/dashboard/admin/notifications`,
          icon: Bell,
          badge: "3",
        },
      ],
    },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-200 active:scale-95"
        aria-expanded={isMobileMenuOpen}
        aria-label={
          isMobileMenuOpen
            ? "Fermer le menu d'administration"
            : "Ouvrir le menu d'administration"
        }
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40 h-screen w-[min(20rem,calc(100vw-1.25rem))] lg:w-80 bg-white border-r border-gray-200 shadow-2xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <Link
              href={`/${currentLocale}/dashboard/admin/profile`}
              className="block"
            >
              <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="relative">
                  <Image
                    src={session?.user?.image || "/temoignage.png"}
                    alt="Admin"
                    width={48}
                    height={48}
                    className="rounded-xl object-cover"
                    unoptimized
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">
                    {session?.user?.name || "Admin"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Crown size={14} className="text-yellow-500" />
                    <span className="text-gray-600">Super Admin</span>
                  </div>
                </div>
                <Edit size={16} className="text-gray-400" />
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-gray-200">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
              <h4 className="font-bold mb-2">Actions Rapides</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-white/20 backdrop-blur rounded-lg p-2 text-xs hover:bg-white/30 transition-colors">
                  <Plus size={16} className="mx-auto mb-1" />
                  Utilisateur
                </button>
                <button className="bg-white/20 backdrop-blur rounded-lg p-2 text-xs hover:bg-white/30 transition-colors">
                  <Plus size={16} className="mx-auto mb-1" />
                  Créateur
                </button>
                <Link
                  href={`/${currentLocale}/dashboard/admin/videos/create`}
                  className="bg-white/20 backdrop-blur rounded-lg p-2 text-xs hover:bg-white/30 transition-colors col-span-2 text-center"
                >
                  <Video size={16} className="mx-auto mb-1" />
                  Créer une vidéo
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="min-h-0 flex-1 overflow-y-auto p-4 pb-8 space-y-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedSections.includes(section.title)
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {expandedSections.includes(section.title) && (
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-w-0
                          ${
                            isActive(item.href)
                              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }
                          ${
                            section.title === "Contenu" &&
                            (item.name === "Créer une vidéo" ||
                              item.name === "Mes vidéos")
                              ? "ring-1 ring-blue-100"
                              : ""
                          }
                        `}
                      >
                        <item.icon size={18} />
                        <span className="flex-1 text-sm font-medium text-safe">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <Link
              href={`/${currentLocale}`}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Déconnexion</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
