"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import UserIdManager from "@/lib/user-id-manager";
import { AppProviders } from "@/components/providers/AppProviders";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "@/components/providers/TranslationProvider";
import type { Student } from "@/types";

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Student | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (status === "loading") {
          return;
        }

        const response = await fetch("/api/me", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const profile = await response.json();

          if (profile?.role !== "student") {
            router.push(`/${locale}/dashboard/${profile?.role || "student"}`);
            return;
          }

          setUser({
            id: profile.id,
            name: profile.name || "Student",
            email: profile.email || "",
            role: "student",
            avatar: profile.avatar || "",
            created_at: profile.created_at || new Date().toISOString(),
            updated_at: profile.updated_at || new Date().toISOString(),
            enrolled_courses: profile.enrolled_courses || 0,
            completed_courses: profile.completed_courses || 0,
            certificates: profile.certificates || [],
            progress: profile.progress || [],
          });

          return;
        }

        const storedUserData = UserIdManager.getStoredUserData();
        if (!storedUserData) {
          router.push(`/${locale}/login`);
          return;
        }

        if (storedUserData.role === "student") {
          const studentData: Student = {
            id: storedUserData.id,
            name: storedUserData.name || "Student",
            email: storedUserData.email || "",
            role: "student",
            avatar: storedUserData.avatar || "",
            created_at: session?.user?.id
              ? new Date().toISOString()
              : new Date().toISOString(),
            updated_at: new Date().toISOString(),
            enrolled_courses: 0,
            completed_courses: 0,
            certificates: [],
            progress: [],
          };

          setUser(studentData);
        } else {
          router.push(`/${locale}/dashboard/${storedUserData.role}`);
          return;
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
        router.push(`/${locale}/login`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, locale, session?.user?.id, status]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">
            {t("error.profile", "Impossible de charger votre profil")}
          </p>
          <button
            onClick={() => router.push(`/${locale}/login`)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  const navigationItems = [
    {
      name: t("nav.dashboard", "Tableau de bord"),
      href: `/${locale}/dashboard/student`,
      icon: LayoutDashboard,
      current: false,
    },
    {
      name: t("nav.parcours", "Mes parcours"),
      href: `/${locale}/dashboard/student/parcours`,
      icon: Map,
      current: false,
    },
    {
      name: t("nav.courses", "Cours"),
      href: `/${locale}/dashboard/student/courses`,
      icon: BookOpen,
      current: false,
    },
    {
      name: t("nav.certificates", "Certificats"),
      href: `/${locale}/dashboard/student/certificates`,
      icon: CreditCard,
      current: false,
    },
  ];

  const profileItems = [
    {
      name: t("nav.profile", "Mon profil"),
      href: `/${locale}/dashboard/student/profile`,
      icon: User,
      current: false,
    },
    {
      name: t("nav.preferences", "Préférences"),
      href: `/${locale}/dashboard/student/profile/preferences`,
      icon: Bell,
      current: false,
    },
  ];

  return (
    <div className="dashboard-layout overflow-x-hidden">
      {/* DashboardNavbar intégrée */}
      <DashboardNavbar />

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
            className="fixed top-0 left-0 z-50 w-72 bg-gradient-to-b from-[#002B24] to-[#004D40] text-white h-screen overflow-hidden lg:hidden"
          >
            {/* Header Sidebar */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl shadow-lg flex items-center justify-center font-bold text-lg">
                    {user?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {user?.name || "Student"}
                    </p>
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
                <span className="font-black text-xl tracking-tighter">
                  MATCHMY
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/10 my-4" />

              <div className="space-y-1">
                {profileItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer Sidebar */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  UserIdManager.logout();
                  fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
                  router.push(`/${locale}/login`);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">
                  {t("nav.logout", "Déconnexion")}
                </span>
              </button>
            </div>
          </motion.aside>
        </>
      )}

      {/* Contenu principal */}
      <main className="min-h-screen pt-20 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full min-w-0"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer existant */}
      <Footer />
    </div>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </AppProviders>
  );
}
