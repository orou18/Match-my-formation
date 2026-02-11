"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  CreditCard,
  Lock,
  X,
  Globe,
  MapPin,
  Check,
} from "lucide-react";

export default function CheckoutModal({ isOpen, onClose, onComplete }: any) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay sombre et flou */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#00251a]/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl bg-[#F8FAFB] rounded-[40px] shadow-3xl overflow-hidden flex flex-col lg:flex-row max-h-[95vh]"
        >
          {/* Fermer */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Colonne Gauche : Formulaire (Fidèle à image_1c1cfc.png) */}
          <div className="flex-[1.5] bg-white p-8 lg:p-12 overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-10 bg-[#E0F2F1] rounded-full flex items-center justify-center text-[#00796B]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#004D40]">
                  Finaliser votre inscription
                </h2>
                <p className="text-sm text-gray-400">
                  Paiement 100% sécurisé — Accès immédiat
                </p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                  Adresse Email
                </label>
                <input
                  type="email"
                  placeholder="votre.email@example.com"
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#F5B743] focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-gray-400 tracking-wider flex justify-between">
                  Informations de paiement{" "}
                  <div className="flex gap-1">
                    <CreditCard size={14} />
                  </div>
                </label>
                <input
                  type="text"
                  placeholder="Numéro de carte"
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM / AA"
                    className="p-4 rounded-2xl bg-gray-50 border-none"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="p-4 rounded-2xl bg-gray-50 border-none"
                  />
                </div>
              </div>

              {/* Mobile Money Section */}
              <div className="p-6 bg-[#E0F2F1]/30 rounded-[32px] border-2 border-dashed border-[#B2DFDB]">
                <p className="text-xs font-black text-[#00796B] mb-4 flex items-center gap-2 uppercase">
                  <Smartphone size={16} /> Ou Mobile Money
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 p-4 bg-white rounded-2xl border-2 border-transparent hover:border-orange-400 transition-all shadow-sm font-bold text-sm"
                  >
                    <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />{" "}
                    MTN
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 p-4 bg-white rounded-2xl border-2 border-transparent hover:border-blue-400 transition-all shadow-sm font-bold text-sm"
                  >
                    <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />{" "}
                    Moov
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Globe
                    className="absolute left-4 top-4 text-gray-300"
                    size={18}
                  />
                  <select className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border-none appearance-none font-medium text-sm">
                    <option>Bénin</option>
                    <option>France</option>
                  </select>
                </div>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4 text-gray-300"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Ville"
                    className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border-none text-sm"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onComplete}
                className="w-full py-5 bg-[#F5B743] hover:bg-[#E5A733] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-orange-200 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Lock size={20} /> PROCÉDER AU PAIEMENT
              </button>
            </form>
          </div>

          {/* Colonne Droite : Récap (Fidèle à image_1c1cfc.png) */}
          <div className="flex-1 bg-[#F8FAFB] p-8 lg:p-12 border-l border-gray-100 flex flex-col justify-center">
            <h3 className="font-black text-[#004D40] mb-6">Récapitulatif</h3>
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-6">
              <div className="aspect-video bg-[#E0F2F1] rounded-2xl mb-4 overflow-hidden flex items-center justify-center relative">
                <img
                  src="/api/placeholder/400/225"
                  className="object-cover w-full h-full opacity-80"
                />
                <div className="absolute top-2 right-2 bg-[#F5B743] text-[10px] font-black text-white px-3 py-1 rounded-full uppercase">
                  Accès immédiat
                </div>
              </div>
              <p className="font-black text-[#004D40] text-sm leading-tight">
                Formation Complète : Guide Touristique Professionnel
              </p>
              <p className="text-[11px] text-gray-400 mt-1 font-bold">
                12 semaines • 45 modules HD
              </p>
            </div>

            <div className="space-y-4 px-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Sous-total</span>
                <span className="font-bold">297,00€</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 font-bold">
                <span>Réduction Early Bird</span>
                <span>-50,00€</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-6 border-t border-dashed border-gray-200 text-[#004D40]">
                <span>Total TTC</span>
                <span>247€</span>
              </div>
            </div>

            <div className="mt-8 bg-green-50 p-4 rounded-2xl flex items-start gap-3 border border-green-100">
              <Check className="text-green-500 mt-1 shrink-0" size={16} />
              <p className="text-[10px] text-green-700 leading-relaxed font-medium italic">
                Garantie satisfait ou remboursé sous 30 jours sans conditions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
