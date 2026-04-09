"use client";
import ProfileSidebar from "@/components/dashboard/student/profile/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,1fr)_minmax(0,3fr)] lg:items-start lg:gap-8">
      {/* Sidebar de navigation du profil */}
      <aside className="w-full min-w-0">
        <div className="lg:sticky lg:top-6">
          <ProfileSidebar />
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="w-full min-w-0">
        <div className="w-full min-w-0">{children}</div>
      </main>
    </div>
  );
}
