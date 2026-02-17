"use client";

import { Play, Eye, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

interface VideoProps {
  video: {
    id: number;
    title: string;
    url: string;
    category: string;
    views: number;
    description: string;
  };
}

export default function VideoCard({ video }: VideoProps) {
  const params = useParams();
  // Utilisation de la variable d'environnement pour l'URL API
  const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/${video.url}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] group cursor-pointer relative"
    >
      {/* Container Vidéo / Preview */}
      <div className="relative aspect-video bg-secondary overflow-hidden">
        {/* Vidéo en sourdine au survol pour un effet vivant */}
        <video
          src={videoUrl}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
          muted
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors duration-500" />

        {/* Play Button Central (Stance Premium) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
            <Play fill="currentColor" size={24} className="ml-1" />
          </div>
        </div>

        {/* Badge Catégorie (Glassmorphism) */}
        <div className="absolute top-4 left-4">
          <span className="backdrop-blur-xl bg-white/20 border border-white/30 text-white text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-lg">
            {video.category}
          </span>
        </div>
      </div>

      {/* Contenu Texte */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-black text-secondary text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {video.title}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 font-medium">
            {video.description || "Découvrez les secrets et techniques de cette formation exclusive Match-My-Formation."}
          </p>
        </div>

        {/* Footer de la carte */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Eye size={14} className="text-primary" />
              <span className="text-[10px] font-black">{video.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock size={14} />
              <span className="text-[10px] font-black">Cours</span>
            </div>
          </div>

          <Link 
            href={`/${params.locale}/video/${video.id}`}
            className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest group/link"
          >
            Regarder 
            <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Ligne d'accentuation animée en bas */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}