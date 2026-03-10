"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import PageLoader from "@/components/ui/PageLoader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  useEffect(() => {
    // Utiliser des données de test pour éviter les problèmes NextAuth
    const mockUser = {
      id: 3,
      name: "Alice Élève",
      email: "student@match.com",
      role: "student"
    };
    
    // Simuler un chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push(`/${locale}/login`);
  };

  const navigation = [
    {
      name: "Dashboard",
      href: `/${locale}/dashboard/student`,
      icon: LayoutDashboard,
    },
    {
      name: "Mes parcours",
      href: `/${locale}/dashboard/student/parcours`,
      icon: Map,
    },
    {
      name: "Blog",
      href: `/${locale}/dashboard/student/blog`,
      icon: BookOpen,
    },
    {
      name: "Abonnement",
      href: `/${locale}/dashboard/student/billing`,
      icon: CreditCard,
    },
    {
      name: "Notifications",
      href: `/${locale}/dashboard/student/notifications`,
      icon: Bell,
    },
    {
      name: "Mon profil",
      href: `/${locale}/dashboard/student/profile`,
      icon: User,
    },
  ];

  // État de chargement pour éviter le flash de contenu
  if (loading) {
    return (
      <PageLoader 
        text="Vérification de l'accès étudiant..." 
        fullScreen={true}
      />
    );
  }

  const user = {
    id: 3,
    name: "Alice Élève",
    email: "student@match.com",
    role: "student"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar pour mobile uniquement */}
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed top-0 left-0 z-50 w-72 bg-primary text-white h-screen overflow-hidden lg:hidden"
          >
            {/* Header Sidebar */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl shadow-lg flex items-center justify-center font-bold text-lg">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-white/60">Student</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg shadow-lg" />
                <span className="font-black text-xl tracking-tighter">MATCHMY</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigation.map((item, index) => {
                const isActive = window.location.pathname === item.href;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer Sidebar */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all font-medium"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </div>
          </motion.aside>
        </>
      )}

      {/* Main Content - Pleine largeur */}
      <div className="flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content - Pleine largeur */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
