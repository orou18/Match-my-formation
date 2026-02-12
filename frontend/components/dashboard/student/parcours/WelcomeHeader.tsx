"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WelcomeHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 p-1">
            <Image 
              src="/avatar-marie.jpg" // Assure-toi que le chemin est correct
              alt="Marie Kouassi"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          </div>
          {/* CORRECTION ICI : delay déplacé dans transition */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white" 
          />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-[#002B24] tracking-tight">
            Bienvenue, Marie Kouassi
          </h1>
          <p className="text-gray-500 font-medium">Apprenant — Programme Guide Touristique Certifié</p>
          <span className="inline-block mt-2 px-4 py-1 bg-primary/10 text-primary text-[11px] font-black rounded-full uppercase tracking-wider">
            Niveau : Intermédiaire
          </span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-[12px] font-bold text-gray-400 uppercase mb-3 tracking-widest">
          <span>Progression générale</span>
          <span className="text-primary">68%</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "68%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full shadow-[0_0_15px_rgba(0,128,128,0.3)]"
          />
        </div>
      </div>
    </motion.div>
  );
}