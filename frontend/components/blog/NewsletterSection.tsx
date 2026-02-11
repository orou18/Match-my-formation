"use client";
import { motion } from "framer-motion";
import { Send, Utensils, Hotel, Map, Camera, Plane } from "lucide-react";

export default function NewsletterSection() {
  // Coordonnées ajustées pour une hauteur réduite
  const categories = [
    {
      icon: <Utensils size={18} />,
      label: "Resto",
      x: "8%",
      y: "15%",
      delay: 0,
    },
    { icon: <Hotel size={18} />, label: "Hôtel", x: "88%", y: "20%", delay: 2 },
    { icon: <Map size={18} />, label: "Explo", x: "82%", y: "65%", delay: 4 },
    { icon: <Camera size={18} />, label: "Arts", x: "12%", y: "70%", delay: 1 },
    { icon: <Plane size={18} />, label: "Vols", x: "50%", y: "10%", delay: 3 },
  ];

  return (
    <section className="relative min-h-[450px] w-full flex items-center justify-center overflow-hidden bg-[#001A16] py-16 px-6">
      {/* --- ANIMATION D'ARRIÈRE-PLAN --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* SVG avec chemin plus fluide et moins haut */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <motion.path
            d="M -10,150 C 200,50 400,250 600,150 C 800,50 1000,250 1300,150"
            fill="none"
            stroke="#F5B743"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path
            d="M -10,150 C 200,50 400,250 600,150 C 800,50 1000,250 1300,150"
            fill="none"
            stroke="#F5B743"
            strokeWidth="2"
            strokeDasharray="20 40"
            animate={{ strokeDashoffset: -1000 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Orbes de couleurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[#004D40] rounded-full blur-[120px] opacity-30" />

        {/* Bulles flottantes repositionnées */}
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:flex flex-col items-center gap-1"
            style={{ left: cat.x, top: cat.y }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, delay: cat.delay, repeat: Infinity }}
          >
            <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-[#F5B743]">
              {cat.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
              {cat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* --- CONTENU --- */}
      <div className="relative z-10 max-w-3xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            L&apos;essentiel du <span className="text-[#F5B743]">Tourisme</span>{" "}
            <br />
            dans votre boîte mail.
          </h2>

          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-10">
            Rejoignez le cercle privé de MatchMyFormation pour recevoir des
            insights exclusifs.
          </p>

          <form className="relative max-w-lg mx-auto group">
            <div className="relative flex flex-col sm:flex-row items-center gap-3 p-1.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl group-hover:border-[#F5B743]/30 transition-all">
              <input
                type="email"
                placeholder="Votre adresse email..."
                className="w-full bg-transparent px-6 py-4 text-white text-sm outline-none font-medium"
                required
              />
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#F5B743] text-[#001A16] font-black text-xs rounded-xl hover:bg-white transition-all whitespace-nowrap">
                S&apos;INSCRIRE <Send size={14} />
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
            <div className="h-[1px] w-12 bg-white" />
            <span className="text-[9px] text-white font-bold uppercase tracking-[0.3em]">
              No spam • 100% Value
            </span>
            <div className="h-[1px] w-12 bg-white" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
