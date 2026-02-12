"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, Rocket, Crown } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const features = [
  { 
    title: "Excellence Hôtelière Certifiante", 
    tag: "Sponsorisé", 
    icon: <Sparkles size={14} />,
    color: "from-[#002B24] via-[#004D40] to-[#002B24]", 
    btn: "Découvrir",
    promo: "-20% cette semaine" 
  },
  { 
    title: "Marketing Digital Tourisme", 
    tag: "Nouveau", 
    icon: <Rocket size={14} />,
    color: "from-orange-500 via-orange-600 to-orange-700", 
    btn: "Découvrir",
    promo: "Places limitées"
  },
  { 
    title: "Abonnement Premium Illimité", 
    tag: "Premium", 
    icon: <Crown size={14} />,
    color: "from-emerald-700 via-emerald-800 to-emerald-950", 
    btn: "Passer au premium",
    promo: "Accès à vie"
  }
];

export default function AutoFeaturedSlider() {
  // On triple les items pour permettre un défilement infini fluide
  const duplicatedFeatures = [...features, ...features, ...features];
  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  return (
    <div className="relative w-full -mt-24 z-30 overflow-hidden py-10">
      {/* Overlay dégradé pour l'immersion (bords estompés) */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F8FAFB] to-transparent z-10 hidden md:block" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F8FAFB] to-transparent z-10 hidden md:block" />

      <motion.div 
        className="flex gap-6 w-max"
        animate={{
          x: ["0%", "-33.33%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
        // Pause le défilement au survol
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedFeatures.map((item, i) => (
          <div 
            key={i}
            className={`shrink-0 w-[300px] md:w-[380px] min-h-[190px] p-6 rounded-[2rem] bg-gradient-to-br ${item.color} shadow-[0_15px_40px_rgba(0,0,0,0.15)] text-white flex flex-col justify-between relative overflow-hidden group border border-white/5`}
          >
            {/* Effet Visuel Glow */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                  {item.icon}
                  {item.tag}
                </span>
                <span className="text-[8px] font-bold text-white/60 uppercase tracking-tighter">
                  {item.promo}
                </span>
              </div>
              
              <h3 className="text-lg font-black mt-4 leading-tight group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-4">
              <button className="bg-white text-gray-900 px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-90 shadow-lg">
                {item.btn}
              </button>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Rocket size={12} className="rotate-45" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}