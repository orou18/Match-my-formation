"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Users, Star, ArrowRight } from "lucide-react";
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
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      aria-label="Section principale"
    >
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-[60] bg-secondary/20 backdrop-blur-[2px] pointer-events-none"
        />
      )}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero-bg.png')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-primary/80 to-secondary/90" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
        >
          Devenez un guide touristique certifié.
          <span className="block text-accent mt-4">
            Formez-vous. Explorez. Progressez.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-3xl mx-auto text-lg md:text-xl text-mutedText"
        >
          Des formations premium pour maîtriser le guidage touristique,
          l&apos;histoire, la géographie, les langues et la communication
          professionnelle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-6"
        >
          <Link
            href={`/${locale}/courses`}
            onClick={() => setIsNavigating(true)}
            className="inline-flex items-center justify-center gap-2 bg-accent text-secondary px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Play size={18} fill="currentColor" />
            Commencer la formation
          </Link>

          <Link
            href={`/${locale}/pricing`}
            onClick={() => setIsNavigating(true)}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white text-white hover:bg-white hover:text-secondary transition-all"
          >
            Voir les tarifs
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 flex flex-wrap justify-center gap-8 text-sm md:text-base"
        >
          <div className="flex items-center gap-2">
            <Users size={18} className="text-accent" />
            +10 000 apprenants formés
          </div>

          <div className="flex items-center gap-2">
            <Star size={18} className="text-accent" />
            98% de satisfaction
          </div>
        </motion.div>
      </div>
    </section>
  );
}
