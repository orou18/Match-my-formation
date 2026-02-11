"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/${params.locale}/login`);
      return;
    }

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Données utilisateur reçues :", data); // Utile pour le débug
        setUser(data);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        router.push(`/${params.locale}/login`);
      });
  }, [params.locale, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push(`/${params.locale}/login`);
  };

  // Si l'utilisateur n'est pas encore chargé
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-secondary font-bold">
        Chargement de votre aventure...
      </div>
    );

  // Sécurisation du nom pour l'affichage
  const firstName = user?.name ? user.name.split(" ")[0] : "Aventurier";
  const initial = user?.name ? user.name.charAt(0) : "U";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* --- SIDEBAR MINIMALISTE --- */}
      <aside className="w-64 bg-secondary text-white hidden lg:flex flex-col p-6">
        <div className="mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg" />
          <span className="font-black text-xl tracking-tighter">MATCHMY</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white transition-all">
            <BookOpen size={20} /> Mes Cours
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white transition-all">
            <Award size={20} /> Certifications
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-all mt-auto"
        >
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tight">
              Ravi de vous revoir,{" "}
              <span className="text-primary">{firstName}</span> ! 👋
            </h1>
            <p className="text-gray-400 text-sm">
              Prêt à continuer votre formation aujourd&apos;hui ?
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
              {initial}
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-secondary">
                {user?.name || "Utilisateur"}
              </p>
              <p className="text-[10px] text-gray-400">{user?.email || ""}</p>
            </div>
          </div>
        </header>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Cours suivis",
              value: "04",
              icon: BookOpen,
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              label: "Heures d'apprentissage",
              value: "12h",
              icon: Clock,
              color: "text-orange-500",
              bg: "bg-orange-50",
            },
            {
              label: "Certificats obtenus",
              value: "01",
              icon: Award,
              color: "text-emerald-500",
              bg: "bg-emerald-50",
            },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5"
            >
              <div
                className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}
              >
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-secondary">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- SECTION CONTINUER --- */}
        <div className="bg-secondary rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              En cours
            </span>
            <h2 className="text-2xl font-bold mt-4 mb-2">
              Management Hôtelier de Luxe
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Vous avez complété 65% de ce module. Continuez sur votre lancée !
            </p>
            <div className="w-full bg-white/10 h-2 rounded-full mb-6">
              <div className="bg-primary h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
            </div>
            <button className="bg-white text-secondary px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all">
              Reprendre le cours
            </button>
          </div>
          <TrendingUp className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64 rotate-[-15deg]" />
        </div>
      </main>
    </div>
  );
}
