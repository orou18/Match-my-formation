"use client";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";

interface RecentModuleProps {
  title: string;
  course: string;
  date: string;
}

export default function RecentModuleItem({ title, course, date }: RecentModuleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(249, 250, 251, 1)" }}
      className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 transition-all duration-300 mb-3"
    >
      <div className="flex items-center gap-4">
        {/* Icône de lecture animée */}
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Play size={20} fill="currentColor" className="ml-1" />
          <motion.div
            layoutId="ring"
            className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-100 transition-all"
          />
        </div>

        {/* Détails du module */}
        <div>
          <h4 className="font-bold text-[#002B24] text-sm md:text-base group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1">
            <span className="text-xs font-medium text-gray-400">{course}</span>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <Clock size={12} />
              <span>Dernière consultation : {date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton d'action minimaliste */}
      <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#008080] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
      >
        Continuer
      </motion.button>
    </motion.div>
  );
}