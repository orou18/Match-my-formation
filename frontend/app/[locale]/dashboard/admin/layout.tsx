"use client";
import { motion } from "framer-motion";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  // Safe params handling - éviter crash sur undefined
  const locale = typeof params?.locale === "string" ? params.locale : "fr";
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Si NextAuth charge encore, on attend
    if (status === "loading") {
      return;
    }

    const checkAuth = async () => {
      // Cas 1: Pas de session NextAuth → redirect login
      if (!session) {
        router.push(`/${locale}/login`);
        return;
      }

      // Cas 2: Session valide, vérifier le rôle
      const userRole = session.user?.role;

      // Si le rôle n'est pas admin → redirect vers le dashboard approprié
      if (userRole && userRole !== "admin") {
        // Mapping des rôles vers leurs dashboards
        const dashboardMap: Record<string, string> = {
          creator: "creator",
          student: "student",
          employee: "employee/student",
        };
        const targetDashboard = dashboardMap[userRole] || "student";
        router.push(`/${locale}/dashboard/${targetDashboard}`);
        return;
      }

      // Cas 3: Rôle admin confirmé → on peut afficher le layout
      setIsChecking(false);
    };

    checkAuth();
  }, [session, status, router, locale]);

  // Loading state pendant la vérification auth
  // Évite l'écran blanc et les flashs de contenu non autorisé
  if (status === "loading" || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas de session, on n'affiche rien (redirection en cours)
  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full min-w-0"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
