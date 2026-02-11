"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface CTASectionProps {
  onViewCourses: () => void;
}

export default function CTASection({ onViewCourses }: CTASectionProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Sécurité pour l'hydratation : on n'active les éléments aléatoires qu'une fois sur le client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative py-16 px-8 overflow-hidden bg-[#004D40] rounded-[3rem] mx-6 my-16 shadow-2xl border border-white/10 group">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orbes de fond fixes (pas de Math.random ici, donc pas de conflit) */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 -top-20 w-96 h-96 bg-[#FFB74D] rounded-full blur-[120px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[130px]"
        />

        {/* Particules : On ne les génère que si le composant est monté sur le client */}
        {isMounted &&
          [...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -120],
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: "-10%",
                filter: "blur(1px)",
              }}
            />
          ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#FFB74D] text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            <Sparkles size={12} /> Rejoignez l&apos;aventure
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
            Prêt à commencer votre <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#FFB74D] via-orange-300 to-[#FFB74D] italic">
                transformation ?
              </span>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-2 left-0 h-[6px] bg-[#FFB74D]/20 -rotate-1 rounded-full"
              />
            </span>
          </h2>

          <p className="text-lg text-emerald-50/70 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
            Accédez à des cursus exclusifs et propulsez votre carrière dans le
            tourisme avec les meilleurs experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/login")}
              className="relative group/btn bg-[#FFB74D] text-[#004D40] px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_15px_40px_rgba(255,183,77,0.3)] overflow-hidden"
            >
              <span className="relative z-10">Créer un compte</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            </motion.button>

            <motion.button
              onClick={onViewCourses}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
              whileTap={{ scale: 0.98 }}
              className="border border-white/20 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest backdrop-blur-md transition-all"
            >
              Voir les formations
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
