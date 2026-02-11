"use client";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  Play,
  Mail,
  Star,
  Users,
  Video,
  BookOpen,
} from "lucide-react";

export default function SuccessModal({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto bg-[#004D40]/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-[50px] shadow-4xl p-8 md:p-16 text-center my-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 100,
            delay: 0.2,
          }}
          className="w-24 h-24 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
        >
          <CheckCircle2 size={50} />
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-black text-[#004D40] mb-4">
          Paiement validé avec succès !
        </h1>
        <p className="text-gray-400 font-medium mb-12">
          Votre accès a été débloqué. Bienvenue dans l&apos;aventure.
        </p>

        {/* Grille de badges */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#FFF9F0] border border-[#FFE0B2] rounded-[32px] p-8 relative overflow-hidden group"
          >
            <div className="w-16 h-16 bg-[#F5B743] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-orange-100 transition-transform group-hover:rotate-12">
              <Star size={32} fill="white" />
            </div>
            <h3 className="font-black text-[#E65100]">Badge débloqué !</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-white px-3 py-1 rounded-full mt-2 inline-block">
              Apprenant Premium
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-50 border border-gray-100 rounded-[32px] p-8 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 text-red-400 shadow-sm">
              <Download size={32} />
            </div>
            <h3 className="font-black text-gray-800">Facture disponible</h3>
            <button className="mt-3 text-xs font-black text-gray-400 flex items-center gap-2 hover:text-[#004D40] transition-colors uppercase tracking-wider">
              <Download size={14} /> Télécharger PDF
            </button>
          </motion.div>
        </div>

        <button className="w-full py-6 bg-[#F5B743] text-white rounded-[24px] font-black text-xl flex items-center justify-center gap-4 hover:bg-[#E5A733] transition-all mb-12 shadow-2xl shadow-orange-200">
          <Play fill="white" /> ACCÉDER AU COURS MAINTENANT
        </button>

        {/* Prochaines étapes */}
        <div className="bg-[#004D40] rounded-[40px] p-10 text-white text-left overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <h4 className="text-xl font-black mb-8 text-center uppercase tracking-widest">
            Prochaines étapes
          </h4>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={20} />
              </div>
              <p className="font-bold text-sm">Explorez le contenu</p>
              <p className="text-[10px] text-gray-300 mt-1">
                Découvrez tous les modules disponibles
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video size={20} />
              </div>
              <p className="font-bold text-sm">Sessions live</p>
              <p className="text-[10px] text-gray-300 mt-1">
                Participez aux directs avec les experts
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users size={20} />
              </div>
              <p className="font-bold text-sm">Chat communauté</p>
              <p className="text-[10px] text-gray-300 mt-1">
                Échangez avec les autres apprenants
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
