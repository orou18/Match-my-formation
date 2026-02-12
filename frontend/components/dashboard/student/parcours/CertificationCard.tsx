"use client";
import { Download, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function CertificationCard({ title, date, status, progress }: any) {
  const isObtained = status === "Obtenu";

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-[1.5rem] border ${isObtained ? 'border-primary/30 bg-primary/[0.02]' : 'border-gray-100 bg-white'} relative overflow-hidden`}
    >
      <div className="flex gap-4 items-start relative z-10">
        <div className={`p-3 rounded-xl ${isObtained ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 text-gray-400'}`}>
          <Award size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#002B24] leading-tight mb-1">{title}</h4>
          <p className="text-[11px] text-gray-400 font-medium mb-3">
            {isObtained ? `Délivré le ${date}` : `Progression : ${progress}%`}
          </p>
          
          {isObtained ? (
            <button className="flex items-center gap-2 bg-[#F3A638] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-orange-200 hover:bg-[#e2962d] transition-all active:scale-95 w-full justify-center">
              <Download size={14} />
              Télécharger le certificat (PDF)
            </button>
          ) : (
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary/40 w-[45%] rounded-full" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}