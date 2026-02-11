"use client";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Award, RefreshCcw, Star } from "lucide-react";

const trustItems = [
  {
    icon: <ShieldCheck size={24} />,
    title: "Sécurité Totale",
    sub: "SSL 256-bit",
  },
  {
    icon: <CreditCard size={24} />,
    title: "Paiement Local",
    sub: "Mobile Money & CB",
  },
  {
    icon: <Award size={24} />,
    title: "Certification",
    sub: "Reconnu par l'État",
  },
  {
    icon: <RefreshCcw size={24} />,
    title: "Garantie Flex",
    sub: "7 jours d'essai",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-[#001A16] relative overflow-hidden">
      {/* EFFETS DE LUMIÈRE RÉDUITS */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#004D40] rounded-full blur-[100px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#F5B743] rounded-full blur-[80px] opacity-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* TITRE PLUS COMPACT */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-black text-white mb-3"
          >
            Confiance & <span className="text-[#F5B743]">Excellence</span>
          </motion.h2>
          <div className="h-1 w-16 bg-[#F5B743] mx-auto rounded-full" />
        </div>

        {/* GRILLE DE RÉASSURANCE PLUS FINE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] flex flex-col items-center text-center group transition-all duration-500 hover:border-[#F5B743]/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#004D40] to-[#002B24] rounded-xl flex items-center justify-center mb-4 text-[#F5B743] shadow-xl group-hover:scale-110 transition-all">
                {item.icon}
              </div>
              <h3 className="text-white font-black text-[11px] uppercase tracking-widest mb-1">
                {item.title}
              </h3>
              <p className="text-gray-400 text-[9px] font-medium uppercase tracking-tight">
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* TÉMOIGNAGES PLUS COMPACTS */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              name: "Aminata Diallo",
              role: "Guide, Bénin",
              img: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c",
              text: "Une crédibilité immédiate auprès de mes clients. Le module sur l'histoire du Dahomey est d'une richesse incroyable.",
            },
            {
              name: "Marc Dubois",
              role: "Travel Designer",
              img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
              text: "L'interface est fluide et les cours pensés pour le terrain. Je recommande à 100% pour passer pro.",
            },
          ].map((user, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative p-7 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl rounded-[2.5rem] border border-white/5 group transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12">
                  <img
                    src={user.img}
                    className="w-full h-full rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    alt={user.name}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#F5B743] p-1 rounded-md">
                    <Star size={10} fill="#001A16" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-black text-md leading-none">
                    {user.name}
                  </p>
                  <p className="text-[#F5B743] text-[9px] font-bold uppercase tracking-widest mt-1">
                    {user.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed italic font-medium">
                &quot;{user.text}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
