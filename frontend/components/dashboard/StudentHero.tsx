"use client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function StudentHero() {
  return (
    <section className="relative w-full py-20 px-6 overflow-hidden bg-gradient-to-br from-[#007A7A] via-[#004D40] to-[#FFB800]/20">
      <div className="container mx-auto text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
        >
          Découvrez les formations <br /> qui feront évoluer votre carrière touristique
        </motion.h1>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Vidéos professionnelles, guides certifiés, contenus exclusifs
        </p>

        {/* Barre de Recherche Style Figma */}
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center bg-white rounded-2xl p-2 shadow-2xl backdrop-blur-md">
            <Search className="ml-4 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Rechercher une formation (ex : histoire, géographie...)" 
              className="w-full px-4 py-3 text-gray-800 focus:outline-none bg-transparent"
            />
            <button className="bg-[#009688] hover:bg-[#00796B] text-white px-8 py-3 rounded-xl font-bold transition-all">
              Rechercher
            </button>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-10">
          <button className="bg-[#FFB800] text-[#004D40] px-8 py-3 rounded-full font-black text-sm uppercase">Explorer maintenant</button>
          <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full font-black text-sm uppercase">Voir les nouveautés</button>
        </div>
      </div>
    </section>
  );
}