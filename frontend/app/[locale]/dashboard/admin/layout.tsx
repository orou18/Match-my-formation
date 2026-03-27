"use client";
import { motion } from "framer-motion";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import UserIdManager from "@/lib/user-id-manager";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (!UserIdManager.isAuthenticated()) {
      router.push(`/${locale}/login`);
      return;
    }

    // Vérifier que l'utilisateur a le rôle admin
    const userData = UserIdManager.getStoredUserData();
    if (userData && userData.role !== "admin") {
      router.push(`/${locale}/dashboard/${userData.role}`);
      return;
    }
  }, [router, locale]);

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
