"use client";
import { motion } from "framer-motion";
import { Calendar, User, ArrowUpRight } from "lucide-react";

export default function BlogCard({ article }: any) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      viewport={{ once: true }}
      className="relative group h-[520px] rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-2xl"
    >
      {/* BACKGROUND IMAGE IMMERSIVE */}
      <div className="absolute inset-0 z-0">
        <img
          src={article.image}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          alt={article.title}
        />
        {/* GRADIENT OVERLAY : On passe du transparent au très sombre */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002B24] via-[#002B24]/80 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8">
        {/* TAGS & META */}
        <div className="flex justify-between items-start mb-4">
          <span className="px-4 py-1.5 bg-[#F5B743] text-[#002B24] rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {article.category}
          </span>

          <div className="flex gap-3">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white group-hover:bg-[#F5B743] group-hover:text-[#002B24] transition-all duration-500">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>

        {/* INFO BOX : Glassmorphism épuré */}
        <div className="space-y-3">
          <div className="flex gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest opacity-80">
            <span className="flex items-center gap-1.5">
              <User size={12} className="text-[#F5B743]" /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} /> {article.date}
            </span>
          </div>

          <h3 className="text-2xl font-black text-white leading-tight group-hover:text-[#F5B743] transition-colors duration-300">
            {article.title}
          </h3>

          <p className="text-gray-300/90 text-sm line-clamp-2 font-medium leading-relaxed overflow-hidden group-hover:h-auto transition-all">
            {article.excerpt}
          </p>

          {/* LINE DECORATION */}
          <div className="pt-4">
            <div className="h-[1px] w-full bg-gradient-to-r from-[#F5B743] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>

          {/* CALL TO ACTION DISCRET MAIS EFFICACE */}
          <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              Lire le dossier complet
            </span>
          </div>
        </div>
      </div>

      {/* GLOW EFFECT AU SURVOL */}
      <div className="absolute inset-0 border-[1.5px] border-white/0 group-hover:border-[#F5B743]/30 rounded-[2.5rem] transition-all duration-500 pointer-events-none" />
    </motion.article>
  );
}
