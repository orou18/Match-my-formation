"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const mockCourses = [
  {
    id: 1,
    title: "Guidage Touristique",
    topic: "Communication & Leadership",
    description:
      "Apprenez à captiver votre audience et à gérer des groupes internationaux avec aisance.",
    image: "/guide1.jpg",
    icon: "🎙️",
  },
  {
    id: 2,
    title: "Histoire & Patrimoine",
    topic: "Culture & Civilisations",
    description:
      "Un voyage immersif à travers les siècles pour raconter les secrets des monuments.",
    image: "/guide2.jpg",
    icon: "🏛️",
  },
  {
    id: 3,
    title: "Géographie & Territoires",
    topic: "Analyse du Paysage",
    description:
      "Comprenez l'interaction entre l'homme et la nature pour enrichir vos parcours.",
    image: "/guide3.png",
    icon: "🌍",
  },
];

export default function FeaturedCourses() {
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
            transformer votre passion en carrière.
          </p>
        </motion.div>

        {/* Grille des Cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {mockCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -15 }}
              className="group relative h-[480px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer border border-white/10"
            >
              {/* Image de fond avec Zoom & Rotation subtile */}
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:rotate-1"
              />

              {/* Badge Topic (Glassmorphism) */}
              <div className="absolute top-6 left-6 z-20">
                <div className="backdrop-blur-xl bg-white/15 border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.15em]">
                    {course.topic}
                  </span>
                </div>
              </div>

              {/* Overlay Dégradé Immersif */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Contenu de la Carte */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl md:text-5xl filter drop-shadow-2xl">
                    {course.icon}
                  </span>
                  <div className="h-[3px] w-0 bg-primary rounded-full group-hover:w-16 transition-all duration-700 ease-in-out" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                  {course.title}
                </h3>

                <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center">
                  <Link
                    href={`/courses/${course.id}`}
                    className="group/btn relative overflow-hidden bg-white text-secondary px-7 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:bg-primary hover:text-white active:scale-95 shadow-xl"
                  >
                    <BookOpen size={20} />
                    <span className="text-sm md:text-base">
                      Explorer le cours
                    </span>
                    <ArrowRight
                      size={18}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bouton "Magnetic" de Catalogue Final */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 flex justify-center"
        >
          <Link href="/courses" className="group relative">
            {/* Effet d'aura lumineuse */}
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

              {/* Ligne d'accentuation animée */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-1 bg-primary/30 w-12 rounded-full group-hover:w-32 group-hover:bg-primary transition-all duration-500"></div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
