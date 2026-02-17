"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Loader2, Film } from "lucide-react";
import VideoCard from "@/components/video/VideoCard";

export default function FeaturedCourses() {
  const [publicVideos, setPublicVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des vidéos publiques depuis Laravel
  useEffect(() => {
    const fetchPublicVideos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/videos`);
        if (response.ok) {
          const data = await response.json();
          // On ne prend que les 3 premières pour la landing page comme dans ton mock
          setPublicVideos(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Erreur landing videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicVideos();
  }, []);

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-black text-secondary mb-6 tracking-tight">
            Nos Formations <span className="text-primary italic">Phares</span>
          </h2>
          <p className="text-bodyText max-w-2xl mx-auto text-lg md:text-xl leading-relaxed opacity-80">
            Une immersion totale dans l&apos;expertise du guidage pour
            transformer votre passion en carrière à travers nos contenus exclusifs.
          </p>
        </motion.div>

        {/* Grille des Cartes (Données Réelles) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Préparation des cours...</p>
          </div>
        ) : publicVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {publicVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <Film className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-medium">Nos prochaines formations arrivent bientôt.</p>
          </div>
        )}

        {/* Bouton "Magnetic" (Design original préservé) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 flex justify-center"
        >
          <Link href="/courses" className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2rem] blur-xl opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-6 bg-secondary text-white px-10 md:px-16 py-6 md:py-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2">
                  Curieux d&apos;en voir plus ?
                </span>
                <span className="text-xl md:text-3xl font-black tracking-tight">
                  Parcourir le catalogue
                </span>
              </div>

              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary rounded-2xl group-hover:bg-white transition-all duration-500 group-hover:rotate-[315deg]">
                <ArrowRight
                  className="text-white group-hover:text-primary transition-colors duration-300"
                  size={32}
                />
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-1 bg-primary/30 w-12 rounded-full group-hover:w-32 group-hover:bg-primary transition-all duration-500"></div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}