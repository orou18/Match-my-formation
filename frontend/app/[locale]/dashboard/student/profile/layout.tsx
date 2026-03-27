"use client";
import ProfileSidebar from "@/components/dashboard/student/profile/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar de navigation du profil - visible sur tous les appareils */}
      <aside className="w-full lg:w-80 shrink-0">
        <ProfileSidebar />
      </aside>

      {/* Contenu principal */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
