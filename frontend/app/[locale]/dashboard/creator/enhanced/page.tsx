"use client";

import { useEffect, useState } from "react";
import PathwaysManagement from "@/components/dashboard/creator/enhanced/PathwaysManagement";
import EmployeeManagement from "@/components/dashboard/creator/enhanced/EmployeeManagement";
import LiveTrainingSystem from "@/components/dashboard/creator/enhanced/LiveTrainingSystem";
import CreatorAnalytics from "@/components/dashboard/creator/enhanced/CreatorAnalytics";
import DashboardOverview from "@/components/dashboard/creator/main/DashboardOverview";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Play,
  Target,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function EnhancedCreatorPage() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("dashboard");
  const router = useRouter();
  const params = useParams();

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "pathways", label: "Parcours", icon: BookOpen },
    { id: "employees", label: "Employés", icon: Users },
    { id: "videos", label: "Vidéos", icon: Video },
    { id: "live", label: "Live", icon: Play },
    { id: "calendar", label: "Calendrier", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${params.locale}/login`);
      return;
    }

    if (status === "authenticated" && session) {
      if ((session.user as any).role !== "creator") {
        router.push(`/${params.locale}/dashboard/student`);
        return;
      }
    }
  }, [status, session, params.locale, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    signOut({ callbackUrl: `/${params.locale}/login` });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "pathways":
        return <PathwaysManagement />;
      case "employees":
        return <EmployeeManagement />;
      case "videos":
        return <DashboardOverview />;
      case "live":
        return <LiveTrainingSystem />;
      case "calendar":
        return <LiveTrainingSystem />;
      case "analytics":
        return <CreatorAnalytics />;
      case "settings":
        return <DashboardOverview />;
      default:
        return <DashboardOverview />;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const initial = session?.user?.name ? session.user.name.charAt(0) : "C";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Creator</h2>
              <p className="text-sm text-gray-600">Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {initial}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-600">Créateur</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find((item) => item.id === activeSection)?.label}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Gérez votre contenu et vos formations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-primary font-medium">En ligne</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
}
