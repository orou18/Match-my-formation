"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Users, Star, ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || "fr";
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      aria-label="Section principale"
    >
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm pointer-events-none"
        />
      )}

      {/* Background optimisé */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/hero-bg.png')",
        }}
      />
      
      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          // Générer des positions fixes basées sur l'index pour éviter l'hydratation
          const left = (i * 5.3) % 100;
          const top = (i * 7.1) % 100;
          const delay = i * 0.2;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        {/* Badge supérieur */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 rounded-full text-sm font-medium text-accent mb-6"
        >
          <Sparkles className="w-4 h-4" />
          Nouvelle plateforme de formation 2024
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-6"
        >
          Maîtrisez les nouveaux codes de l'industrie
          <span className="block text-accent mt-3">
            Expertise, management, innovation.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-4xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed"
        >
          Des formations premium pour maîtriser l'expertise, le management et l'innovation dans l'industrie touristique.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
        >
          <Link
            href={`/${locale}/courses`}
            onClick={() => setIsNavigating(true)}
            className="group inline-flex items-center justify-center gap-3 bg-accent text-secondary px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-accent/25 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Commencer la formation
          </Link>

          <Link
            href={`/${locale}/pricing`}
            onClick={() => setIsNavigating(true)}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/30 text-white hover:bg-white hover:text-secondary hover:border-white transition-all duration-300"
          >
            Voir les tarifs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Stats améliorées */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center gap-3 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-accent" />
              <span className="text-3xl font-bold text-white">10 000+</span>
            </div>
            <span className="text-gray-300 font-medium">Apprenants formés</span>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+25% ce mois</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-accent" />
              <span className="text-3xl font-bold text-white">98%</span>
            </div>
            <span className="text-gray-300 font-medium">Satisfaction</span>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <Award className="w-4 h-4" />
              <span>Excellence</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <Play className="w-6 h-6 text-accent" />
              <span className="text-3xl font-bold text-white">500+</span>
            </div>
            <span className="text-gray-300 font-medium">Formations</span>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Premium</span>
            </div>
          </div>
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
