"use client";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

// Ajout de l'interface pour corriger l'erreur TypeScript
interface StudentHeroProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  } | null;
}

export default function StudentHero({ user }: StudentHeroProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const handleProfileClick = () => {
    router.push(`/${locale}/dashboard/student/profile`);
  };

  return (
    <section className="relative w-full py-20 px-6 overflow-hidden bg-gradient-to-br from-[#007A7A] via-[#004D40] to-[#FFB800]/20">
      {/* Effet décoratif en arrière-plan */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-0 pointer-events-none" />

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 inline-block"
        >
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full">
            Espace Apprenant{" "}
            {user?.name ? `• Ravie de vous revoir, ${user.name}` : ""}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
        >
          Découvrez les formations <br /> qui feront évoluer votre carrière
          touristique
        </motion.h1>

        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Vidéos professionnelles, guides certifiés, contenus exclusifs.
          Apprenez auprès des meilleurs experts panafricains.
        </p>

        {/* Barre de Recherche Style Figma */}
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center bg-white rounded-2xl p-2 shadow-2xl backdrop-blur-md border border-white/50">
            <Search className="ml-4 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Rechercher une formation (ex : histoire, géographie...)"
              className="w-full px-4 py-3 text-gray-800 focus:outline-none bg-transparent font-medium"
            />
            <button className="bg-[#009688] hover:bg-[#00796B] text-white px-8 py-3 rounded-xl font-black uppercase text-[11px] tracking-wider transition-all shadow-lg active:scale-95">
              Rechercher
            </button>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-10">
          <button className="bg-[#FFB800] hover:bg-[#E5A600] text-[#004D40] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:shadow-xl active:scale-95">
            Explorer maintenant
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95">
            Voir les nouveautés
          </button>
        </div>

        {/* Bouton Profil dans le Hero */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleProfileClick}
          className="fixed top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all z-50"
        >
          <User size={24} />
        </motion.button>
      </div>
    </section>
  );
}
