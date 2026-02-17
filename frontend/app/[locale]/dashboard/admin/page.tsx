"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Video,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  Bell,
  AlertCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push(`/${params.locale}/login`);
      return;
    }

    // 1. Récupérer et vérifier l'utilisateur
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        Accept: "application/json" 
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expirée");
        return res.json();
      })
      .then((data) => {
        // PROTECTION DE ROUTE : Vérification du rôle admin
        if (data.role !== "admin") {
          router.push(`/${params.locale}/dashboard/student`);
          return;
        }
        setUser(data);
        
        // 2. Récupérer les statistiques (seulement si l'user est confirmé admin)
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
          headers: { 
            Authorization: `Bearer ${token}`, 
            Accept: "application/json" 
          },
        });
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
        setError("Impossible de charger les données. Vérifiez votre connexion.");
      });
  }, [params.locale, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push(`/${params.locale}/login`);
  };

  // État de chargement
  if (!user || (!stats && !error)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-secondary font-black uppercase text-xs tracking-widest">
          Vérification des accès...
        </p>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-black text-secondary mb-2">Erreur de synchronisation</h2>
        <p className="text-gray-500 mb-6 max-w-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-secondary text-white rounded-2xl font-bold hover:bg-primary transition-all"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const initial = user?.name ? user.name.charAt(0) : "A";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#002B24] text-white hidden lg:flex flex-col p-8 border-r border-white/5">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E3FF04] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(227,255,4,0.2)]">
            <div className="w-5 h-5 bg-[#002B24] rounded-sm rotate-45" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">Match Admin</span>
        </div>

        <nav className="flex-1 space-y-3">
          <MenuLink icon={LayoutDashboard} label="Vue d'ensemble" active />
          <MenuLink icon={Users} label="Utilisateurs" />
          <MenuLink icon={Video} label="Contenus & Vidéos" />
        </nav>

        <button 
          onClick={handleLogout} 
          className="group flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition-all mt-auto border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Déconnexion
        </button>
      </aside>

      {/* --- CONTENU --- */}
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-black text-[#002B24] tracking-tight leading-none mb-3">
              Console <span className="text-[#8B5CF6] italic">Panafricaine</span>
            </h1>
            <p className="text-gray-400 font-medium">Contrôle global de Match-My-Formation.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 transition-all">
               <Bell size={22} />
               <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20">
                {initial}
              </div>
              <div>
                <p className="text-sm font-black text-[#002B24] leading-none mb-1">{user.name}</p>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Master Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard 
            label="Total Étudiants" 
            value={stats?.total_users || 0} 
            icon={Users} 
            color="text-blue-600" 
            bg="bg-blue-100/50" 
            delay={0.1}
          />
          <StatCard 
            label="Bibliothèque Vidéo" 
            value={stats?.total_videos || 0} 
            icon={Video} 
            color="text-emerald-600" 
            bg="bg-emerald-100/50" 
            delay={0.2}
          />
          <StatCard 
            label="Parcours Actifs" 
            value={stats?.total_courses || 0} 
            icon={BookOpen} 
            color="text-purple-600" 
            bg="bg-purple-100/50" 
            delay={0.3}
          />
        </div>

        {/* --- ACTIVITÉ RÉCENTE --- */}
        <div className="bg-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-[#002B24] flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp size={24} className="text-primary" /></div>
                Flux d'activité
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Voir tout le log</button>
           </div>
           
           <div className="space-y-6">
              {stats?.recent_activity?.length > 0 ? stats.recent_activity.map((act: any) => (
                <div key={act.id} className="flex items-center justify-between p-6 hover:bg-[#F8FAFC] rounded-[2rem] transition-all border border-transparent hover:border-gray-100 group">
                   <div className="flex items-center gap-5">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(227,255,4,1)] group-hover:scale-125 transition-transform" />
                      <div>
                        <p className="text-sm font-black text-secondary mb-0.5">{act.user}</p>
                        <p className="text-xs text-gray-400 font-medium">{act.action}</p>
                      </div>
                   </div>
                   <div className="text-right">
                        <span className="text-[10px] font-black text-gray-300 uppercase block">{act.date}</span>
                        <span className="text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">Détails</span>
                   </div>
                </div>
              )) : (
                <p className="text-center py-10 text-gray-400 font-medium italic">Aucune activité récente enregistrée.</p>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}

// Sous-composant pour les liens du menu
function MenuLink({ icon: Icon, label, active = false }: any) {
    return (
        <button className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
            active 
            ? "bg-white/10 text-[#E3FF04] shadow-inner" 
            : "text-white/40 hover:text-white hover:bg-white/5"
        }`}>
            <Icon size={22} /> {label}
        </button>
    );
}

function StatCard({ label, value, icon: Icon, color, bg, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500"
    >
      <div className={`w-16 h-16 ${bg} ${color} rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black text-secondary leading-none">{value}</p>
      </div>
    </motion.div>
  );
}