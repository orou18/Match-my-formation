"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Compte",
    description: "Inscrivez-vous gratuitement en quelques secondes.",
    icon: UserPlus,
    color: "from-orange-400 to-amber-500",
  },
  {
    number: "02",
    title: "Formation",
    description: "Sélectionnez le parcours idéal pour vos objectifs.",
    icon: BookOpen,
    color: "from-primary to-emerald-500",
  },
  {
    number: "03",
    title: "Diplôme",
    description: "Validez vos acquis et obtenez votre certification.",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-600",
  },
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const pathLength = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative py-16 overflow-hidden bg-secondary"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
            En <span className="text-primary italic">3 étapes</span> seulement
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          <svg className="hidden md:block absolute top-16 left-0 w-full h-0.5 z-0 px-10">
            <motion.line
              x1="10%"
              y1="50%"
              x2="90%"
              y2="50%"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <motion.line
              x1="10%"
              y1="50%"
              x2="90%"
              y2="50%"
              stroke="var(--primary)"
              strokeWidth="2"
              style={{ pathLength }}
            />
          </svg>

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="relative mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-20 h-20 bg-secondary border border-white/10 rounded-full flex items-center justify-center shadow-xl z-10"
                >
                  <div
                    className={`absolute inset-1 rounded-full bg-gradient-to-tr ${step.color} opacity-10 group-hover:opacity-100 transition-all duration-500`}
                  />
                  <span className="absolute -top-1 -right-1 bg-white text-secondary w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] shadow-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    {step.number}
                  </span>
                  <step.icon className="relative z-10 text-white" size={28} />
                </motion.div>
              </div>

              <div className="px-2">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed max-w-[200px] mx-auto group-hover:text-white/80 transition-colors">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/login"
            className="group relative px-8 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_0_20px_rgba(0,122,122,0.3)] flex items-center gap-3"
          >
            <span className="relative z-10 font-bold">
              Prêt à commencer l&apos;aventure ?
            </span>
            <ArrowRight
              size={14}
              className="relative z-10 group-hover:translate-x-1 transition-transform"
            />

            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-full transition-opacity" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
