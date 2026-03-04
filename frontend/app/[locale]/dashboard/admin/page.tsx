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
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session, status } = useSession(); 
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${params.locale}/login`);
      return;
    }

    if (status === "authenticated" && session) {
      // Vérification du rôle admin
      if ((session.user as any).role !== "admin") {
        router.push(`/${params.locale}/dashboard/student`);
        return;
      }

      const fetchAdminData = async () => {
        try {
          // Récupération du token stocké lors du login
          const token = localStorage.getItem("token");

          if (!token) {
            setError("Session invalide. Veuillez vous reconnecter.");
            setLoadingStats(false);
            return;
          }

          const statsRes = await fetch(`${API_BASE}/api/admin/stats`, {
            method: "GET",
            headers: { 
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
            },
          });

          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          } else if (statsRes.status === 401) {
            setError("Votre session a expiré (401).");
          } else if (statsRes.status === 500) {
            setError("Le serveur Laravel a rencontré une erreur interne (500).");
          } else {
            setError("Impossible de joindre la console d'administration.");
          }
        } catch (err) {
          setError("L'API Laravel est injoignable. Vérifiez que 'php artisan serve' tourne.");
        } finally {
          setLoadingStats(false);
        }
      };

      fetchAdminData();
    }
  }, [status, session, params.locale, router, API_BASE]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    signOut({ callbackUrl: `/${params.locale}/login` });
  };

  if (status === "loading" || (status === "authenticated" && loadingStats)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="text-[#8B5CF6]" size={48} />
        </motion.div>
        <p className="mt-6 text-[#002B24] font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">
          Synchronisation des données...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-[#002B24] mb-2 tracking-tighter">Oups !</h2>
        <p className="text-gray-500 mb-8 max-w-sm font-medium leading-relaxed">{error}</p>
        <button 
          onClick={handleLogout}
          className="px-12 py-4 bg-[#002B24] text-[#E3FF04] rounded-2xl font-bold shadow-xl shadow-[#002B24]/20 hover:scale-105 transition-all"
        >
          Réinitialiser et se reconnecter
        </button>
      </div>
    );
  }

  const initial = session?.user?.name ? session.user.name.charAt(0) : "A";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-[#E3FF04] selection:text-[#002B24]">
      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-[#002B24] text-white hidden lg:flex flex-col p-10 border-r border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E3FF04] to-transparent opacity-30" />
        
        <div className="mb-16 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#E3FF04] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(227,255,4,0.2)]">
            <ShieldCheck size={28} className="text-[#002B24]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter uppercase italic leading-none">Match</span>
            <span className="text-[10px] font-bold text-[#E3FF04] uppercase tracking-[0.3em]">Console Admin</span>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <MenuLink icon={LayoutDashboard} label="Vue d'ensemble" active />
          <MenuLink icon={Users} label="Étudiants & Coachs" />
          <MenuLink icon={Video} label="Bibliothèque" />
          <MenuLink icon={BookOpen} label="Parcours" />
        </nav>

        <button 
          onClick={handleLogout} 
          className="group flex items-center gap-4 px-6 py-5 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-[2rem] font-black transition-all mt-auto border border-red-500/10"
        >
          <LogOut size={20} /> 
          Quitter la console
        </button>
      </aside>

      {/* --- CONTENU --- */}
      <main className="flex-1 p-8 md:p-12 lg:p-20 overflow-y-auto">
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black text-[#002B24] tracking-tight leading-none mb-4">
              Tableau de <span className="text-[#8B5CF6] italic">Bord</span>
            </h1>
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-widest">Live System</span>
                <p className="text-gray-400 font-medium tracking-tight italic">Bienvenue, {session?.user?.name}</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-5 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 text-gray-400 hover:text-[#8B5CF6] transition-all hover:shadow-md group">
               <Bell size={24} className="group-hover:rotate-12 transition-transform" />
               <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="flex items-center gap-5 bg-white p-2.5 pr-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white/20">
                {initial}
              </div>
              <div>
                <p className="text-sm font-black text-[#002B24] leading-none mb-1.5 truncate max-w-[120px]">{session?.user?.name}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.15em]">Propriétaire</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <StatCard label="Total Étudiants" value={stats?.total_users || 0} icon={Users} color="text-blue-600" bg="bg-blue-50" delay={0.1} />
          <StatCard label="Bibliothèque Vidéo" value={stats?.total_videos || 0} icon={Video} color="text-emerald-600" bg="bg-emerald-50" delay={0.2} />
          <StatCard label="Parcours Actifs" value={stats?.total_courses || 0} icon={BookOpen} color="text-purple-600" bg="bg-purple-50" delay={0.3} />
        </div>

        {/* --- ACTIVITÉ RÉCENTE --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }} 
          className="bg-white rounded-[3.5rem] p-12 shadow-[0_30px_80px_rgba(0,0,0,0.03)] border border-gray-100"
        >
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black text-[#002B24] flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl"><TrendingUp size={28} className="text-primary" /></div>
                Flux d'activité
              </h3>
              <button className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8B5CF6] hover:text-[#002B24] transition-colors underline decoration-2 underline-offset-8">Historique complet</button>
           </div>
           
           <div className="grid gap-6">
              {stats?.recent_activity?.length > 0 ? stats.recent_activity.map((act: any) => (
                <motion.div 
                  whileHover={{ x: 10 }}
                  key={act.id} 
                  className="flex items-center justify-between p-8 hover:bg-[#F8FAFC] rounded-[2.5rem] transition-all border border-transparent hover:border-gray-100 group"
                >
                   <div className="flex items-center gap-6">
                      <div className="w-4 h-4 rounded-full bg-[#E3FF04] border-4 border-[#002B24]/10 group-hover:scale-150 transition-all duration-300" />
                      <div>
                        <p className="text-base font-black text-[#002B24] mb-1">{act.user}</p>
                        <p className="text-sm text-gray-400 font-medium">{act.action}</p>
                      </div>
                   </div>
                   <div className="text-right">
                        <span className="text-[11px] font-black text-gray-300 uppercase block tracking-widest mb-2">{act.date}</span>
                        <div className="flex items-center justify-end gap-2 text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-all">
                             <span className="text-[10px] font-black uppercase tracking-tighter">Audit complet</span>
                        </div>
                   </div>
                </motion.div>
              )) : (
                <div className="text-center py-20">
                    <p className="text-gray-300 font-black text-xl uppercase tracking-widest italic opacity-50">Aucune activité</p>
                </div>
              )}
           </div>
        </motion.div>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function MenuLink({ icon: Icon, label, active = false }: any) {
    return (
        <button className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] font-black transition-all duration-300 ${
            active 
            ? "bg-[#E3FF04] text-[#002B24] shadow-[0_10px_25px_rgba(227,255,4,0.15)]" 
            : "text-white/30 hover:text-white hover:bg-white/5"
        }`}>
            <Icon size={22} className={active ? "animate-pulse" : ""} /> 
            <span className="tracking-tight">{label}</span>
        </button>
    );
}

function StatCard({ label, value, icon: Icon, color, bg, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex items-center gap-8 group hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-500 relative overflow-hidden"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className={`w-20 h-20 ${bg} ${color} rounded-[2rem] flex items-center justify-center group-hover:rotate-[10deg] transition-all duration-500 relative z-10 shadow-inner`}>
        <Icon size={38} />
      </div>
      <div className="relative z-10">
        <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.25em] mb-2">{label}</p>
        <p className="text-5xl font-black text-[#002B24] leading-none tracking-tighter italic">
          {value}
        </p>
      </div>
    </motion.div>
  );
}