"use client";
import { motion } from "framer-motion";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const { status } = useSession();

  useEffect(() => {
    const checkAuth = async () => {
      if (status === "loading") {
        return;
      }

      try {
        const response = await fetch("/api/me", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const profile = await response.json();

          if (profile?.role !== "admin") {
            router.push(`/${locale}/dashboard/${profile?.role || "student"}`);
          }

          return;
        }
      } catch (error) {
        console.error("Erreur de validation admin:", error);
      }

      const userData = UserIdManager.getStoredUserData();
      if (!userData) {
        router.push(`/${locale}/login`);
        return;
      }

      if (userData.role !== "admin") {
        router.push(`/${locale}/dashboard/${userData.role}`);
      }
    };

    checkAuth();
  }, [router, locale, status]);

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
