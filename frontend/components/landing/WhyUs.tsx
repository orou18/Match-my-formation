"use client";

import { motion } from "framer-motion";
import {
  Award,
  PlayCircle,
  Infinity as InfinityIcon,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Certifications Reconnues",
    description:
      "Obtenez des certifications officielles reconnues par les professionnels du tourisme.",
    icon: Award,
    bgImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800", // Diplôme/Étudiants
    color: "from-amber-500/20 to-orange-600/20",
    accent: "bg-amber-500",
    delay: 0.1,
  },
  {
    title: "Vidéos HD & Supports",
    description:
      "Accédez à des contenus premium en haute définition et ressources téléchargeables.",
    icon: PlayCircle,
    bgImage:
      "https://images.unsplash.com/photo-1492691523567-6170f0275df1?q=80&w=800", // Caméra/Paysage
    color: "from-primary/20 to-blue-600/20",
    accent: "bg-primary",
    delay: 0.2,
  },
  {
    title: "Accès Illimité 24/7",
    description:
      "Apprenez à votre rythme, où que vous soyez, sur tous vos appareils.",
    icon: InfinityIcon,
    bgImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800", // Laptop/Nuit
    color: "from-secondary/20 to-slate-900/20",
    accent: "bg-secondary",
    delay: 0.3,
  },
  {
    title: "Quiz & Examens",
    description:
      "Validez vos connaissances avec des quiz interactifs et examens certifiants.",
    icon: FileCheck,
    bgImage:
      "https://images.unsplash.com/photo-1454165833767-0274b06b6746?q=80&w=800", // Tablette/Checklist
    color: "from-teal-500/20 to-emerald-600/20",
    accent: "bg-teal-500",
    delay: 0.4,
  },
  {
    title: "Formateurs Experts",
    description:
      "Apprenez auprès de guides professionnels et experts du secteur touristique.",
    icon: GraduationCap,
    bgImage:
      "https://images.unsplash.com/photo-1544717297-fa154daaf762?q=80&w=800", // Guide/Communication
    color: "from-accent/20 to-yellow-600/20",
    accent: "bg-accent",
    delay: 0.5,
  },
  {
    title: "Tableau de Bord",
    description:
      "Suivez votre progression avec un dashboard personnalisé et intuitif.",
    icon: LayoutDashboard,
    bgImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800", // Data/Dashboard
    color: "from-emerald-600/20 to-green-800/20",
    accent: "bg-emerald-600",
    delay: 0.6,
  },
];

export default function WhyUs() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 
              ${i === 0 ? "bg-primary top-0 left-0" : i === 1 ? "bg-accent bottom-0 right-0" : "bg-secondary top-1/2 left-1/3"}`}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black text-secondary tracking-tighter"
          >
            Pourquoi Choisir{" "}
            <span className="text-primary">MatchMyFormation ?</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay }}
              whileHover={{ y: -10 }}
              className="group relative h-[400px] rounded-[3rem] overflow-hidden border border-white/50 shadow-xl"
            >
              <Image
                src={item.bgImage}
                alt={item.title}
                fill
                className="object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} backdrop-blur-md group-hover:backdrop-blur-none transition-all duration-500`}
              />

              <div className="relative z-10 p-10 h-full flex flex-col">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                  className={`w-16 h-16 ${item.accent} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/10`}
                >
                  <item.icon className="text-white" size={32} />
                </motion.div>

                <h3 className="text-2xl font-black text-secondary mb-4 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-secondary/70 font-medium leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-auto flex justify-end">
                  <div
                    className={`p-3 rounded-full bg-white/50 backdrop-blur-sm border border-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0`}
                  >
                    <Sparkles
                      className="text-primary animate-spin-slow"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
