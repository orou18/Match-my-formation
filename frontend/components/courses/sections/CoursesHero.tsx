"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CoursesHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-[#004D40] overflow-hidden px-6 py-20">
      {/* Cercles animés en arrière-plan */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-[#FFB74D] rounded-full blur-[100px] z-0"
      />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20 text-[#FFB74D] text-xs font-black uppercase tracking-widest"
          >
            L&apos;excellence à votre portée
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
            Formations & <span className="text-[#FFB74D]">Parcours</span>
          </h1>
          <p className="text-lg text-emerald-50/80 mb-10 max-w-lg leading-relaxed font-medium">
            Développez vos compétences avec des experts. Des formations
            certifiantes conçues pour propulser votre carrière dans le tourisme.
          </p>
          <div className="flex flex-wrap gap-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FFB74D] text-[#004D40] px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-orange-900/20"
            >
              Voir les formations
            </motion.button>
            <button className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-white/10 transition-all">
              Notre méthode
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-[#FFB74D] rounded-[3rem] rotate-6 scale-95 opacity-20 blur-2xl group-hover:rotate-12 transition-transform duration-700" />
          <div className="relative h-[450px] w-full rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl">
            <Image
              src="/hero-bg.png"
              alt="Tourisme"
              fill
              className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}