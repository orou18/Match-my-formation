"use client";
import { useState } from "react";
import ProfileSidebar from "@/components/dashboard/student/profile/ProfileSidebar";
import { Menu, X } from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* Bouton hamburger pour mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar : Menu hamburger sur mobile, fixe sur desktop */}
      {sidebarOpen && (
        <aside className="lg:hidden fixed top-0 left-0 z-50 h-full w-80 max-w-[80vw] transform transition-transform duration-300 ease-in-out translate-x-0">
          <div className="h-full overflow-y-auto">
            <ProfileSidebar />
          </div>
        </aside>
      )}

      {/* Layout desktop - flex avec sidebar fixe */}
      <div className="hidden lg:flex w-full gap-8">
        {/* Sidebar desktop - toujours visible */}
        <aside className="w-[280px] flex-shrink-0">
          <div className="sticky top-6">
            <ProfileSidebar />
          </div>
        </aside>

        {/* Contenu principal desktop */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Contenu principal mobile - pleine largeur */}
      <main className="lg:hidden w-full">{children}</main>
    </div>
  );
}
