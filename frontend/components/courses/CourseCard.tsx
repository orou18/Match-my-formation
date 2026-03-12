"use client";
import Image from "next/image";
import Link from "next/link"; 
import { motion } from "framer-motion";
import { Star, Clock, ArrowUpRight, Play, Eye, BarChart } from "lucide-react";
import { useParams } from "next/navigation";

export default function CourseCard({ course, index }: { course: any, index: number }) {
  const params = useParams();
  const locale = params?.locale || "fr";
  const courseUrl = `/${locale}/courses/${course.id}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="group relative bg-[#002B24]/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col h-full transition-all duration-500 hover:border-[#002B24]/50 hover:shadow-[0_0_40px_rgba(0,43,36,0.2)]"
    >
      {/* Container Image avec Overlay Vidéo */}
      <Link href={courseUrl} className="relative h-56 w-full overflow-hidden block">
        <Image 
          src={course.image || "/guide1.jpg"} 
          alt={course.title} 
          fill 
          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
          unoptimized 
        />
        
        {/* Filtre de couleur futuriste sur l'image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002B24] via-transparent to-transparent opacity-80" />
        
        {/* Bouton Play au survol (Effet YouTube Premium) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-16 h-16 bg-[#002B24]/90 rounded-full flex items-center justify-center backdrop-blur-md scale-50 group-hover:scale-100 transition-transform">
            <Play className="text-white fill-white ml-1" size={28} />
          </div>
        </div>

        {/* Badge Flottant "Certifiant" ou Status */}
        <div className="absolute top-5 left-5 flex gap-2">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-2xl backdrop-blur-md 
            ${index % 2 === 0 ? 'bg-orange-500/90 text-white' : 'bg-[#002B24]/90 text-white'}`}>
            {index % 2 === 0 ? 'Nouveau' : 'Populaire'}
          </span>
        </div>

        {/* Duration Time Overlay */}
        <span className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] font-bold px-3 py-1 rounded-lg backdrop-blur-md">
          {course.duration || "24:35"}
        </span>
      </Link>
      
      {/* Contenu de la carte */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta info: Vues et Niveau */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1 text-[11px] font-medium text-white/60">
              <Eye size={14} className="text-primary" /> {course.views || "1.2k"} vues
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-white/60">
              <BarChart size={14} className="text-primary" /> Débutant
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[11px] font-bold text-white">{course.rating || "4.8"}</span>
          </div>
        </div>

        <Link href={courseUrl}>
          <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-sm text-white/40 leading-relaxed mb-6 flex-grow line-clamp-2">
          {course.description || "Maîtrisez les codes du secteur et devenez un acteur clé de l'industrie touristique."}
        </p>

        {/* Profil du formateur (Style Maquette) */}
        <div className="flex items-center gap-3 mb-6 p-2 bg-white/5 rounded-2xl">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
            <Image src="/temoignage.png" fill alt="Instructor" className="object-cover" />
          </div>
          <span className="text-xs font-semibold text-white/80">Marie Laurent</span>
        </div>

        {/* Bouton d'action avec flèche montante */}
        <Link href={courseUrl} className="mt-auto">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-white/5 border border-white/10 hover:bg-primary hover:border-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
          >
            Explorer le cours <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}