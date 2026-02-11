"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Guide certifiée",
    content:
      "Une formation complète qui m'a permis d'obtenir ma certification rapidement.",
    avatar: "https://i.pravatar.cc/150?u=marie",
    stars: 5,
    color: "from-primary/20 to-transparent",
  },
  {
    name: "Pierre Martin",
    role: "Étudiant en tourisme",
    content:
      "Interface intuitive et contenus passionnants. Apprentissage à mon propre rythme.",
    avatar: "https://i.pravatar.cc/150?u=pierre",
    stars: 5,
    color: "from-accent/20 to-transparent",
  },
  {
    name: "Sophie Laurent",
    role: "Guide freelance",
    content:
      "Excellente plateforme ! Les vidéos sont de qualité cinéma et les quiz m'ont aidée.",
    avatar: "https://i.pravatar.cc/150?u=sophie",
    stars: 5,
    color: "from-blue-500/20 to-transparent",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-16 bg-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-white tracking-tighter"
          >
            Ils ont réussi avec{" "}
            <span className="italic text-primary">MatchMyFormation</span>
          </motion.h2>
        </div>

        <div className="relative flex overflow-hidden py-4">
          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -1200] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map(
              (item, index) => (
                <div
                  key={index}
                  className="w-[300px] md:w-[380px] shrink-0 group"
                >
                  <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-[2rem] transition-all duration-500 group-hover:bg-white/10 group-hover:-translate-y-2">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-12 h-12 rounded-full border-2 border-primary/50 object-cover"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {item.name}
                        </h4>
                        <p className="text-primary text-[10px] font-bold uppercase tracking-widest">
                          {item.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(item.stars)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed italic">
                      &quot;{item.content}&quot;
                    </p>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4 opacity-60">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/100?u=${i + 10}`}
                className="w-8 h-8 rounded-full border-2 border-secondary"
              />
            ))}
          </div>
          <p className="text-white text-xs font-medium">
            +2,000 guides déjà certifiés
          </p>
        </div>
      </div>
    </section>
  );
}
